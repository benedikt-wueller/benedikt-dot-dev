import styles from "./Tag.module.css";

export default function Tag({ value }: { value: string }) {
  return (
    <span className={styles.tag}>
      {value}
    </span>
  );
}