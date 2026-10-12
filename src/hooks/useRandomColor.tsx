import { useState } from "react";

export const ACCENT_COLORS = [
    "#CC99C9",
    "#9EC1CF",
    "#9EE09E",
    "#FDFD97",
    "#FEB144",
    "#FF6663"
]

export const useRandomColor = () => {
    const [color] = useState(() => ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]);
    return color;
}