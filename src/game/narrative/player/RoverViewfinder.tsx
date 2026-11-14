import styles from "./SceneStage.module.css";

/** Binocular silhouette from the rover-POV storyboard, separate from the art. */
export function RoverViewfinder({ scanMarks = false }: { scanMarks?: boolean }) {
  return <svg className={styles.viewfinder} viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path fill="#101721" fillRule="evenodd" d="M0 0H1600V900H0Z M800 45C650 -30 55 15 35 430C15 860 620 920 800 825C980 920 1585 860 1565 430C1545 15 950 -30 800 45Z" />
    <path fill="none" stroke="#bb9e85" strokeOpacity=".6" strokeWidth="3" d="M800 45C650 -30 55 15 35 430C15 860 620 920 800 825C980 920 1585 860 1565 430C1545 15 950 -30 800 45Z" />
    {scanMarks && <g fill="none" stroke="#fde593" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round">
      <path d="M295 395V375H320M445 375H470V395M295 465V485H320M445 485H470V465" />
      <path d="M1120 495V475H1145M1235 475H1260V495M1120 545V565H1145M1235 565H1260V545" />
    </g>}
  </svg>;
}
