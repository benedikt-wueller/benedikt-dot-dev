import TimelineItem, { type TimelineItemProps } from "./TimelineItem.tsx";

export type TimelineProps = {
    items: TimelineItemProps[]
};

export default function Timeline(props: TimelineProps) {
    return (
        <div>
            {props.items.map((item, index) => (
                <TimelineItem {...item} key={'timeline-item-' + index} />
            ))}
        </div>
    );
}