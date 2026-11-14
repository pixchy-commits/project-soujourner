import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const file = path.join(root, "src/game/narrative/art/manifest.json");
const manifest = JSON.parse(readFileSync(file, "utf8"));
let count = 0;
for (const [id, asset] of Object.entries(manifest)) {
 const expected = path.join(root, "public", asset.expectedPath.replace(/^\//, ""));
 const variants = [expected, expected.replace(/\.webp$/, ".png"), expected.replace(/\.webp$/, ".jpg"), expected.replace(/\.webp$/, ".jpeg")];
 const found = variants.find((candidate) => existsSync(candidate));
 if (!found) continue;
 const src = "/" + path.relative(path.join(root, "public"), found).split(path.sep).join("/");
 if (asset.src === src) continue;
 asset.src = src;
 count++;
 console.log(`${id} -> ${src}`);
}
if (count) writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n");
console.log(count ? `Registered ${count} artwork file(s). Artwork approval flags were preserved.` : "No new artwork files found. Existing mappings were preserved.");
