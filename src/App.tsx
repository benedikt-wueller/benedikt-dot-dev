import styles from './App.module.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import { MultiLayerScrollingBackground } from "./components/MultiLayerScrollingBackground.tsx";

import { Avatar, Style } from "@dicebear/core";
import constellations from "@dicebear/styles/constellation.json";
import { useViewportCenterCursor } from "./hooks/useViewportCenterCursor.tsx";
import { ACCENT_COLORS } from "./hooks/useRandomColor.tsx";
import ColoredLink from "./components/ColoredLink.tsx";

function App() {
    const constellationsStyle = new Style(constellations);

    const generateStars = (seed: string, size: number) => {
        return new Avatar(constellationsStyle, {
            seed,
            backgroundColor: [],
            starProbability: Math.ceil(25 + Math.random() * 75),
            constellationProbability: 0,
            cometProbability: 0,
            borderRadius: 25 + Math.ceil(Math.random() * 25),
            size,
        }).toDataUri()
    }

    const generateConstellation = (seed: string, size: number, enableStars: boolean) => {
        return new Avatar(constellationsStyle, {
            seed,
            backgroundColor: '#00000000',
            starProbability: enableStars ? Math.ceil(Math.random() * 100) : 0,
            cometProbability: 0,
            constellationColor: ACCENT_COLORS,
            borderRadius: 25 + Math.ceil(Math.random() * 25),
            constellationVariant: {
                "andromeda": 1,
                "aquila": 1,
                "auriga": 1,
                "bear": 1,
                "bigDipper": 1,
                "bootes": 1,
                "camelopardalis": 1,
                "cassiopeia": 1,
                "cepheus": 1,
                "coronaBorealis": 1,
                "corvus": 1,
                "delphinus": 1,
                "grus": 1,
                "lacerta": 1,
                "lynx": 1,
                "lyra": 1,
                "orion": 1,
                "ursaMinor": 1
            },
            size,
        }).toDataUri()
    }

    const furthestImageGenerator = (seed: string) => {
        if (Math.random() < 0.95) {
            return generateStars(seed, 200 + Math.ceil(Math.random() * 50));
        }

        return generateConstellation(seed, 150 + Math.ceil(Math.random() * 100), true);
    };

    const middleImageGenerator = (seed: string) => {
        if (Math.random() < 0.95) {
            return generateStars(seed, 250 + Math.ceil(Math.random() * 100));
        }

        return generateConstellation(seed, 200 + Math.ceil(Math.random() * 150), true);
    }

    const closestImageGenerator = (seed: string) => {
        return generateStars(seed, 250 + Math.ceil(Math.random() * 200));
    }

    const cursorDirection = useViewportCenterCursor({ x: 1, y: -0.25 });
    const speed = 0.4;

    return (
        <>
            <div className={styles.background}>
                <MultiLayerScrollingBackground
                    getVelocity={cursorDirection}
                    velocityScale={speed}
                    layers={[
                        { speedMultiplier: 0.25, getImageSource: furthestImageGenerator, density: 50 },
                        { speedMultiplier: 0.5, getImageSource: middleImageGenerator, density: 25 },
                        { speedMultiplier: 1, getImageSource: closestImageGenerator, density: 10 },
                    ]}
                />
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                        </Routes>
                    </BrowserRouter>

                    <footer>
                        <p>© {new Date().getFullYear()} Benedikt Wüller</p>
                        <p style={{ marginBottom: 0 }}>
                            <small>
                                Check out my friends:{' '}
                                <ColoredLink href="https://fkr.fi/">Fabian</ColoredLink>,{' '}
                                <ColoredLink href="https://github.com/Superioz">Tobias</ColoredLink>,{' '}
                                <ColoredLink href="https://github.com/Piartig">Pia</ColoredLink>
                            </small>
                        </p>

                        <p>
                            <small>
                                Attributions:{' '}
                                <ColoredLink href="https://github.com/dicebear/dicebear">DiceBear</ColoredLink>,{' '}
                                <ColoredLink href="https://fonts.google.com/specimen/Inter">Inter</ColoredLink>,{' '}
                                <ColoredLink href="https://www.jetbrains.com/de-de/lp/mono/">JetBrains Mono</ColoredLink>,{' '}
                                <ColoredLink href="https://tabler.io/icons">Tabler Icons</ColoredLink>
                            </small>
                        </p>
                    </footer>

                    <p className={styles.dftba}>DON'T FORGET TO BE AWESOME</p>
                </div>
            </div>
        </>
    )
}

export default App
