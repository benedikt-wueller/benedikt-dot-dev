import React, { useEffect, useRef } from 'react';
import useMediaQuery from "../hooks/useMediaQuery.tsx";

interface Vector2D {
    x: number;
    y: number;
}

export interface LayerConfig {
    getImageSource: (seed: string) => string;
    density: number;
    speedMultiplier: number; // e.g. 0.2 for distant background, 1.5 for fast foreground
    scaleRange?: [number, number]; // [minScale, maxScale] relative to image native size
    opacity?: number;
}

interface MultiLayerBackgroundProps {
    getVelocity: () => Vector2D;
    velocityScale: number;
    layers: LayerConfig[];
}

interface FloatingImage {
    x: number;
    y: number;
    width: number;
    height: number;
    img: HTMLImageElement;
    loaded: boolean;
}

export const MultiLayerScrollingBackground: React.FC<MultiLayerBackgroundProps> = (
    { getVelocity, velocityScale, layers }
) => {
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    // Define a fixed standard reference screen size (Full HD)
    const REFERENCE_AREA = 1920 * 1080;

    const calculateTargetCount = (
        baseDensity: number,
        width: number,
        height: number
    ): number => {
        const currentArea = width * height;
        const areaRatio = currentArea / REFERENCE_AREA;

        // Linear scaling relative to a standard 1080p screen
        const scaledCount = Math.round(baseDensity * areaRatio);

        // Clamp to prevent total emptiness on tiny screens or lag on 4K/Ultrawides
        const minItems = Math.max(2, Math.round(baseDensity * 0.15));
        const maxItems = Math.round(baseDensity * 2.5);

        return Math.min(maxItems, Math.max(minItems, scaledCount));
    };

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Outer index = layer, inner array = floating images in that layer
    const itemsPerLayerRef = useRef<FloatingImage[][]>([]);

    const layersRef = useRef(layers);
    layersRef.current = layers;

    // Spawns an item specifically configured for layer `layerIdx`
    const createItem = (
        layerIdx: number,
        canvasWidth: number,
        canvasHeight: number,
        spawnOffscreen = false
    ): FloatingImage => {
        const seed = new Date().getMilliseconds().toString() + Math.random().toString();
        const layer = layersRef.current[layerIdx];
        const [minScale, maxScale] = layer.scaleRange || [0.5, 1.0];
        const scale = minScale + Math.random() * (maxScale - minScale);

        // Fallback dimensions if canvas/image hasn't computed yet
        const safeWidth = canvasWidth || window.innerWidth || 1000;
        const safeHeight = canvasHeight || window.innerHeight || 1000;

        // 1. Randomize coordinates UPFRONT (never default to 0,0)
        const item: FloatingImage = {
            x: Math.random() * safeWidth,
            y: Math.random() * safeHeight,
            width: 100 * scale, // Default estimated box until load
            height: 100 * scale,
            img: new Image(),
            loaded: false,
        };

        // 2. Define load handler
        const handleLoad = () => {
            if (item.loaded) return; // Prevent duplicate execution

            item.width = item.img.width * scale;
            item.height = item.img.height * scale;
            item.loaded = true;

            const buffer = 50;

            if (spawnOffscreen) {
                const vel = reduceMotion ? { x: 0, y: 0 } : getVelocity();
                const effVelX = vel.x * layer.speedMultiplier;
                const effVelY = vel.y * layer.speedMultiplier;

                const absX = Math.abs(effVelX);
                const absY = Math.abs(effVelY);
                const fluxX = absX * (safeHeight + item.height);
                const fluxY = absY * (safeWidth + item.width);
                const totalFlux = fluxX + fluxY;

                const spawnOnXEdge = totalFlux > 0 ? Math.random() < fluxX / totalFlux : true;

                if (spawnOnXEdge) {
                    item.x = effVelX > 0 ? -item.width - buffer : safeWidth + buffer;
                    item.y = -item.height + Math.random() * (safeHeight + item.height);
                } else {
                    item.y = effVelY > 0 ? -item.height - buffer : safeHeight + buffer;
                    item.x = -item.width + Math.random() * (safeWidth + item.width);
                }
            } else {
                // Span across visible area + edge overlap
                item.x = -item.width + Math.random() * (safeWidth + item.width);
                item.y = -item.height + Math.random() * (safeHeight + item.height);
            }
        };

        // 3. Attach listener BEFORE assigning src
        item.img.onload = handleLoad;
        item.img.src = layer.getImageSource(seed);

        // 4. Handle synchronous cache hits in production builds
        if (item.img.complete) {
            handleLoad();
        }

        return item;
    };

    // Helper to create an item bounded to a specific region (e.g. newly exposed screen strips)
    const createItemInRegion = (
        layerIdx: number,
        minX: number,
        maxX: number,
        minY: number,
        maxY: number
    ): FloatingImage => {
        const layer = layersRef.current[layerIdx];
        const img = new Image();
        const seed = new Date().getMilliseconds().toString() + Math.random().toString();
        img.src = layer.getImageSource(seed);

        const [minScale, maxScale] = layer.scaleRange || [0.5, 1.0];
        const scale = minScale + Math.random() * (maxScale - minScale);

        const item: FloatingImage = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            img,
            loaded: false,
        };

        img.onload = () => {
            item.width = img.width * scale;
            item.height = img.height * scale;
            item.loaded = true;

            // Position within the newly expanded slice (allowing edge overlap)
            item.x = minX - item.width + Math.random() * (maxX - minX + item.width);
            item.y = minY - item.height + Math.random() * (maxY - minY + item.height);
        };

        return item;
    };

    // Re-initialize items array if layer count or densities change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const w = canvas.width || window.innerWidth;
        const h = canvas.height || window.innerHeight;

        itemsPerLayerRef.current = layers.map((layer, idx) => {
            const items: FloatingImage[] = [];
            for (let i = 0; i < layer.density; i++) {
                items.push(createItem(idx, w, h, false));
            }
            return items;
        });
    }, [layers.length, ...layers.map((l) => l.density)]);

    const prevSizeRef = useRef({ width: window.innerWidth, height: window.innerHeight });
    const baseAreaRef = useRef<number>(1);

    // Inside useEffect / initialization:
    useEffect(() => {
        baseAreaRef.current = window.innerWidth * window.innerHeight;
    }, []);

    // Render loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. MUST resize canvas FIRST before populating items
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.style.opacity = '1';
        ctx.scale(dpr, dpr);

        // 2. NOW populate initial items using full screen width & height
        itemsPerLayerRef.current = layersRef.current.map((layer, idx) => {
            const targetCount = calculateTargetCount(layer.density, width, height);
            const items: FloatingImage[] = [];
            for (let i = 0; i < targetCount; i++) {
                items.push(createItem(idx, width, height, false));
            }
            return items;
        });

        prevSizeRef.current = { width, height };

        let animationFrameId: number;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            const prevWidth = prevSizeRef.current.width;
            const prevHeight = prevSizeRef.current.height;

            canvas.width = newWidth * dpr;
            canvas.height = newHeight * dpr;
            canvas.style.width = `${newWidth}px`;
            canvas.style.height = `${newHeight}px`;

            const ctx = canvas.getContext('2d');
            if (ctx) ctx.scale(dpr, dpr);

            const deltaW = newWidth - prevWidth;
            const deltaH = newHeight - prevHeight;

            layersRef.current.forEach((layer, layerIdx) => {
                const layerItems = itemsPerLayerRef.current[layerIdx];
                if (!layerItems) return;

                // Calculate target count based on fixed 1080p reference area
                const targetCount = calculateTargetCount(layer.density, newWidth, newHeight);
                const needed = targetCount - layerItems.length;

                if (needed > 0) {
                    for (let i = 0; i < needed; i++) {
                        let minX = 0, maxX = newWidth;
                        let minY = 0, maxY = newHeight;

                        if (deltaW > 0 && deltaH > 0) {
                            const rightArea = deltaW * newHeight;
                            const bottomArea = deltaH * prevWidth;
                            if (Math.random() < rightArea / (rightArea + bottomArea)) {
                                minX = prevWidth;
                            } else {
                                minY = prevHeight;
                                maxX = prevWidth;
                            }
                        } else if (deltaW > 0) {
                            minX = prevWidth;
                        } else if (deltaH > 0) {
                            minY = prevHeight;
                        }

                        layerItems.push(createItemInRegion(layerIdx, minX, maxX, minY, maxY));
                    }
                }
            });

            prevSizeRef.current = { width: newWidth, height: newHeight };
        };

        resize();

        window.addEventListener('resize', resize);

        const render = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Clear using logical coordinates
            ctx.clearRect(0, 0, width, height);

            const buffer = 100;
            const baseVel = reduceMotion ? { x: 0, y: 0 } : getVelocity();
            const layersConfig = layersRef.current;
            const allLayerItems = itemsPerLayerRef.current;

            // Draw back-to-front
            for (let l = 0; l < allLayerItems.length; l++) {
                const layerConfig = layersConfig[l];
                if (!layerConfig) continue;

                const items = allLayerItems[l];
                const effVelX = baseVel.x * velocityScale * layerConfig.speedMultiplier;
                const effVelY = baseVel.y * velocityScale * layerConfig.speedMultiplier;

                ctx.save();
                if (layerConfig.opacity !== undefined) {
                    ctx.globalAlpha = layerConfig.opacity;
                }

                for (let i = items.length - 1; i >= 0; i--) {
                    const item = items[i];

                    // Apply layer effective velocity
                    item.x += effVelX;
                    item.y += effVelY;

                    if (item.loaded) {
                        const isOffscreen =
                            item.x < -item.width - buffer ||
                            item.x > width + buffer ||
                            item.y < -item.height - buffer ||
                            item.y > height + buffer;

                        if (isOffscreen) {
                            const targetCount = calculateTargetCount(layerConfig.density, width, height);

                            if (items.length > targetCount) {
                                // Excess items despawn quietly off-screen without popping out in view
                                items.splice(i, 1);
                            } else {
                                // Under or at target count: replace off-screen item with a new one at the incoming edge
                                items[i] = createItem(l, width, height, true);
                            }
                            continue;
                        }

                        ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
                    }
                }

                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.5s ease-in-out',
            }}
        />
    );
};