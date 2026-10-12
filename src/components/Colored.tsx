import React from "react";
import { useRandomColor } from "../hooks/useRandomColor.tsx";

export default function Colored({ children, inline }: { children: React.ReactNode, inline?: boolean }) {
    return (
        <div style={{ color: useRandomColor(), display: inline ? 'inline' : 'block' }}>
            {children}
        </div>
    );
}