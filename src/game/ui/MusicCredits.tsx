import { licensedMusic } from "../audio/music-library";
import styles from "./MusicCredits.module.css";

export function MusicCredits() {
 return <details className={styles.credits}>
  <summary>Music credits</summary>
  <p>Music by <a href="https://www.scottbuckley.com.au/" target="_blank" rel="noreferrer">Scott Buckley</a>, released under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</p>
  <ul>{Object.values(licensedMusic).map(track => <li key={track.src}><a href={track.source} target="_blank" rel="noreferrer">{track.title}</a></li>)}</ul>
  <p>Original MP3 recordings with in-game volume changes and fades. Original interface effects and temporary ambience created for Sojourner.</p>
 </details>;
}
