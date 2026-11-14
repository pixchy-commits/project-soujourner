"use client";

import Link from "next/link";
import { useState } from "react";
import type { CSSProperties } from "react";
import styles from "./fonts.module.css";

const samples = [
  "Inside, little Sojourner peeks out at the rusty red world below—heart beeping fast, ready to finally begin its job.",
  "Their radios have been quiet for decades... but what stories did they leave behind? Let's rewind the clock to 1997 and find out.",
  "Across the rusty plains of Mars rest silent machines built by human hands. They have no way to come home, and some of their radios went quiet decades ago.",
];

export default function FontComparison({ science, chewy, bubblegum }: { science: string; chewy: string; bubblegum: string }) {
  const [text, setText] = useState(samples[0]);
  const [size, setSize] = useState(24);
  const [leading, setLeading] = useState(1.7);
  const [title, setTitle] = useState("SOJOURNER");
  const [titleSize, setTitleSize] = useState(64);
  const bodyFonts = [
    { name: "Gloria Hallelujah", note: "Previous narrative font", className: styles.currentBody },
    { name: "Chewy", note: "Candidate 01", className: chewy },
    { name: "Bubblegum Sans", note: "Current narrative font", className: bubblegum },
  ];
  const variables = { "--sample-size": `${size}px`, "--sample-leading": leading, "--title-size": `${titleSize}px` } as CSSProperties;

  return <main className={styles.page} style={variables}>
    <div className={styles.container}>
      <div className={styles.topline}><Link href="/">← Back to game</Link><span>Temporary · font lab</span></div>
      <h1 className={styles.heading}>Same story. Different voice.</h1>
      <p className={styles.intro}>Compare the proposed fonts against the current ones. Changes here are preview only.</p>

      <section className={styles.section} aria-labelledby="title-heading">
        <div className={styles.sectionHeading}><h2 id="title-heading">01 / Title</h2><label>Size <output>{titleSize}px</output><input aria-label="Title font size" type="range" min="28" max="100" value={titleSize} onChange={event => setTitleSize(Number(event.target.value))} /></label></div>
        <label className={styles.editor}>Title text<input value={title} onChange={event => setTitle(event.target.value)} /></label>
        <div className={styles.titleGrid}>
          {[{name: "Thunderstrike", note: "Current title font", className: styles.currentTitle}, {name: "Science Gothic", note: "Candidate · weight 800", className: science}].map(font => <article className={styles.titleCard} key={font.name}>
            <div className={styles.caption}><h3>{font.name}</h3><span>{font.note}</span></div>
            <div className={styles.titleStage}><p className={`${styles.titleSample} ${font.className}`}>{title || "SOJOURNER"}</p><span className={styles.subtitle}>The Little Rover That Never Came Home</span></div>
          </article>)}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="narrative-heading">
        <div className={styles.sectionHeading}><h2 id="narrative-heading">02 / Narrative</h2><div className={styles.controls}>
          <label>Size <output>{size}px</output><input aria-label="Narrative font size" type="range" min="16" max="36" value={size} onChange={event => setSize(Number(event.target.value))} /></label>
          <label>Line height <output>{leading.toFixed(1)}</output><input aria-label="Narrative line height" type="range" min="1.2" max="2.2" step="0.1" value={leading} onChange={event => setLeading(Number(event.target.value))} /></label>
        </div></div>
        <div className={styles.presets} aria-label="Sample dialogue">{["Inside the lander", "Rewind", "Mission archive"].map((label, index) => <button key={label} aria-pressed={text === samples[index]} onClick={() => setText(samples[index])}>{label}</button>)}</div>
        <label className={styles.editor}>Edit the shared dialogue<textarea rows={3} value={text} onChange={event => setText(event.target.value)} /></label>
        <div className={styles.bodyGrid}>{bodyFonts.map(font => <article className={styles.bodyCard} key={font.name}>
          <div className={styles.caption}><h3>{font.name}</h3><span>{font.note}</span></div>
          <div className={styles.scene}><div className={styles.dialogue}><span className={styles.speaker}>MISSION ARCHIVE</span><p className={`${styles.bodySample} ${font.className}`}>{text || "Type a dialogue sample above."}</p><span className={styles.continue}>CONTINUE ◆</span></div></div>
          <p className={`${styles.glyphs} ${font.className}`}>Aa Bb Mm Ww · 0123456789<br />“Hello, Mars!” — What’s out there…?</p>
        </article>)}</div>
        <p className={styles.footnote}>All three use the same text, size, line height and dialogue width. Scroll inside a sample if needed.</p>
      </section>
    </div>
  </main>;
}
