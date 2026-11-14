"use client";
import Image from "next/image";
import { useState } from "react";
import manifest from "../art/manifest.json";
import type { ArtId } from "../types";
import styles from "./SceneStage.module.css";

export type ArtOverrides = Partial<Record<ArtId, string>>;
export function Artwork({ id, overrides, className = "" }: { id: ArtId; overrides?: ArtOverrides; className?: string }) {
 const asset = manifest[id];
 const primary: string | null = overrides?.[id] ?? asset.src;
 const [failed, setFailed] = useState<string[]>([]);
 const source = [primary, asset.fallbackSrc].find((path) => path && !failed.includes(path));
 return <div className={`${styles.artwork} ${className}`}>
  {source ? <Image src={source} alt={asset.alt} fill sizes="100vw" unoptimized loading="eager"
    style={{ objectFit: asset.fit === "contain" ? "contain" : "cover", objectPosition: asset.objectPosition }}
    onError={() => setFailed((previous) => [...previous, source])} />
   : <div className={styles.placeholder} role="img" aria-label={asset.alt}><div className={styles.horizon} /><div className={styles.sun} /></div>}
 </div>;
}
