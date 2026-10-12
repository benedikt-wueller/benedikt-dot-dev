import React from "react";
import styles from "./Section.module.css";

export default function Section({ children, title, muted }: {
    children: React.ReactNode;
    title: string | React.ReactNode,
    muted?: boolean
}) {
    return (
        <div className={`${styles.section} ${muted ? styles.muted : ""}`}>
            <div className={styles.header}>
                <div className={styles.title}>{title}</div>
            </div>

            {children}
        </div>
    );
}