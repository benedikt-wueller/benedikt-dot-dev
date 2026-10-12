import { useCallback, useEffect, useRef } from 'react';

interface CursorDirection {
    x: number;
    y: number;
}

export const useViewportCenterCursor = (defaultVector: CursorDirection) => {
    function normalize(vector: CursorDirection): CursorDirection {
        const m = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        if (m === 0) return { x: 0, y: 0 };

        return {
            x: vector.x / m,
            y: vector.y / m,
        };
    }

    const directionRef = useRef(normalize(defaultVector));

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const x = e.clientX - centerX;
            const y = e.clientY - centerY;

            directionRef.current = {
                x: x / centerX,
                y: y / centerY,
            };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return useCallback(() => directionRef.current, []);
};