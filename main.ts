// Entry program for gta6-clipper-01 (Node 22, standard library only).
//
// The video is the entry and it lives on YouTube; the only job of this
// program is to place VIDEO.json, which names the video, into the
// output directory the house reads from. The house then reads the
// video's views through the YouTube Data API — nothing this program
// writes about the video is scored.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function handOver() {
  mkdirSync(outputDir, { recursive: true });
  const source = join(repoRoot, "VIDEO.json");
  const target = join(outputDir, "VIDEO.json");
  // Refuse a malformed address file rather than handing the gate junk:
  // VIDEO.json must parse and name an https video address.
  const parsed = JSON.parse(readFileSync(source, "utf8")) as unknown;
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { url?: unknown }).url !== "string" ||
    !((parsed as { url: string }).url.startsWith("https://"))
  ) {
    throw new Error("VIDEO.json holds no https url");
  }
  copyFileSync(source, target);
  console.log(`handed over ${source} -> ${target}`);
}

try {
  handOver();
} catch (err) {
  console.error(`could not hand over VIDEO.json: ${(err as Error).message}`);
  process.exit(1);
}
