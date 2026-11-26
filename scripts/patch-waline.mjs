/**
 * Temporary security mitigation for CVE-2026-64670 / GHSA-crj3-q72p-ggqm:
 * Sanitizes @waline/client's `parseMarkdown` output with DOMPurify so comment
 * edit previews cannot execute stored XSS from raw `orig` payloads.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "node_modules", "@waline", "client", "dist");

const TARGET_FILES = ["slim.js", "component.js", "waline.js"];
const IMPORT_STMT = 'import __wlPurify from "dompurify";\n';
const PARSE_RE = /return ([A-Za-z0-9_$]+)\.parse\(([A-Za-z0-9_$]+)\(e,t\)\)/;

if (!fs.existsSync(distDir)) {
  console.log("[patch-waline] @waline/client not installed yet, skipping.");
  process.exit(0);
}

let patchedCount = 0;
for (const file of TARGET_FILES) {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes("__wlPurify.sanitize(")) {
    patchedCount++;
    continue;
  }
  const match = PARSE_RE.exec(content);
  if (!match) {
    throw new Error(`[patch-waline] Could not find parseMarkdown return in ${file}`);
  }
  const [, markedVar, emojiFn] = match;
  content =
    IMPORT_STMT +
    content.replace(
      PARSE_RE,
      `return __wlPurify.sanitize(${markedVar}.parse(${emojiFn}(e,t)),{FORBID_TAGS:["form","input","style"],FORBID_ATTR:["autoplay","style"]})`,
    );
  fs.writeFileSync(filePath, content, "utf8");
  patchedCount++;
  console.log(`[patch-waline] Patched ${file} (CVE-2026-64670 mitigation)`);
}

if (patchedCount === 0) {
  throw new Error("[patch-waline] No target files patched");
}
