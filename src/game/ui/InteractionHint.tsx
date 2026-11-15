import styles from "./InteractionHint.module.css";

export function InteractionHint({ intent = "continue" }: { intent?: "continue" | "reveal" }) {
 const action = intent === "reveal" ? "skip" : "continue";
 return <span className={styles.hint}>
  <span className={styles.click}>Click to {action}</span>
  <span className={styles.tap}>Tap to {action}</span>
  <span className={styles.keyboard}>Enter / Space to {action}</span>
  <svg className={styles.arrow} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 4 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
 </span>;
}
