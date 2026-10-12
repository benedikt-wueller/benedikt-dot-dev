import styles from './TimelineItem.module.css';
import Tag from "../tag/Tag.tsx";
import React from "react";
import Colored from "../Colored.tsx";

export type TimelineItemProps = {
    from: string,
    to: string,
    title: string,
    subtitle?: string,
    description: string | React.ReactNode,
    tags: string[],
    muted?: boolean
};

export default function TimelineItem(props: TimelineItemProps) {
    const fromFormatted = `from ${props.from.replace(/(\d+)\|(\d+)/, '20$2-$1')}`;
    const toFormatted = props.to === 'today' ? '' : ` to ${props.to.replace(/(\d+)\|(\d+)/, '20$2-$1')}`;

    const dates = (
        <div className={styles.dateWrapper} title={`${fromFormatted}${toFormatted}`}>
            <div className={styles.date}>{props.to}</div>
            <div className={styles.date}>{props.from}</div>
        </div>
    );

    return (
        <div className={`${styles.timelineItem} ${props.muted ? styles.muted : ''}`}>
            {props.muted ? dates : <Colored>{dates}</Colored>}

            <div>
                <p className={styles.title}>{props.title}</p>

                {props.subtitle && (<p className={styles.subtitle}>{props.subtitle}</p>)}

                <p className={styles.description}>
                    {props.description}
                </p>

                {props.tags.length > 0 && (
                    <p>
                        {props.tags.map((tag, index) => (
                            <><Tag value={tag} key={index} />{' '}</>
                        ))}
                    </p>
                )}
            </div>
        </div>
    );
}