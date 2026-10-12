import React from "react";
import Colored from "./Colored.tsx";

export default function ColoredLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Colored inline>
            <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        </Colored>
    );
}