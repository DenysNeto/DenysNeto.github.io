import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { I, type StringKey } from "./src/i18n/strings";
import { fill, LANGS, type Lang } from "./src/i18n";
import { S } from "./src/brief/fields";
import { CONFIG } from "./src/config";

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Where the site lives: the language pages link to each other with full addresses (hreflang, canonical) */
const SITE = "https://denysneto.github.io";
/** The two pages; each is built once per language: /ru/, /uk/brief.html… */
const PAGES = ["index.html", "brief.html"];
/** The address part after the language: the landing is the folder itself */
const tail = (page: string): string => page === "index.html" ? "" : page;

const LINKS: Record<string, string> = {
  tg: `https://t.me/${CONFIG.telegram}`,
  wa: `https://wa.me/${CONFIG.whatsapp}`,
  mail: `mailto:${CONFIG.email}`
};

/** One page in one language: its texts baked in (so the first paint already has them and search engines see them),
    its own <html lang>, title and description, the language switch and inner links pointing at this language */
function localize(html: string, page: string, l: Lang): string {
  const at = (x: Lang): string => `/${x}/${tail(page)}`;
  const alt = LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${SITE}${at(x)}">`).join("\n")
    + `\n<link rel="alternate" hreflang="x-default" href="${SITE}/${tail(page)}">\n<link rel="canonical" href="${SITE}${at(l)}">`;
  let out = html
    .replace(/<html lang="[a-z]+">/, `<html lang="${l}">`)
    .replace("</head>", `${alt}\n</head>`)
    .replace(/<a data-lang="([a-z]+)"/g, (_m, x: Lang) => `<a href="${at(x)}"${x === l ? ' aria-current="page"' : ""} data-lang="${x}"`)
    .replace(/href="\/brief\.html"/g, `href="/${l}/brief.html"`)
    .replace(/<a class="brand" href="\/"/g, `<a class="brand" href="/${l}/"`);
  if (page === "brief.html") return out
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(`${S.title[l]} — ${CONFIG.name}`)}</title>`)
    .replace(/(<([a-z0-9]+)\b[^>]*\bdata-s="([a-zA-Z0-9_]+)"[^>]*>)(<\/\2>)/g,
      (m, open: string, _tag: string, key: string, close: string) => key in S ? open + esc(S[key as keyof typeof S][l]) + close : m);
  return out
    .replace(/(<([a-z0-9]+)\b[^>]*\bdata-i="([a-z0-9_]+)"[^>]*>)(<\/\2>)/g,
      (m, open: string, _tag: string, key: string, close: string) => key in I ? open + esc(fill(I[key as StringKey][l])) + close : m)
    .replace(/(<([a-z0-9]+)\b[^>]*\bdata-name\b[^>]*>)(<\/\2>)/g, (_m, open: string, _tag: string, close: string) => open + esc(CONFIG.name) + close)
    .replace(/<a ([^>]*\bdata-link="(tg|wa|mail)")/g, (_m, attrs: string, kind: string) => `<a href="${LINKS[kind]}" ${attrs}`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(fill(I.title[l]))}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(I.meta_desc[l])}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(I.og_title[l])}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(I.og_desc[l])}`);
}

/** The bare address (/ or /brief.html) sends the visitor to their language: the one they picked before,
    else the browser's, else Russian. Without scripts it shows the three links */
const pick = (page: string): string => `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(CONFIG.name)}</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${LANGS.map(x => `<link rel="alternate" hreflang="${x}" href="${SITE}/${x}/${tail(page)}">`).join("\n")}
<script>
var l; try { l = localStorage.getItem("pf-lang"); } catch (e) {}
var b = (navigator.language || "").slice(0, 2);
if (${JSON.stringify(LANGS)}.indexOf(l) < 0) l = b === "uk" ? "uk" : b === "pl" ? "pl" : "ru";
location.replace("/" + l + "/${tail(page)}" + location.search + location.hash);
</script>
</head>
<body style="background:#1A1430;color:#F1ECFA;font-family:system-ui,sans-serif;text-align:center;padding:40px">
<a href="/ru/${tail(page)}" style="color:#ACE6D1">Русский</a> · <a href="/uk/${tail(page)}" style="color:#ACE6D1">Українська</a> · <a href="/pl/${tail(page)}" style="color:#ACE6D1">Polski</a>
</body>
</html>
`;

function languagePages(): Plugin {
  let outDir = "dist";
  return {
    name: "language-pages",
    configResolved: c => { outDir = c.build.outDir; },
    // dev: /ru/ and /uk/brief.html are the source pages in that language; the bare addresses pick one
    configureServer: server => {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? "/").split("?")[0];
        const page = path === "/" ? "index.html" : path.slice(1);
        if (PAGES.includes(page)) { res.setHeader("Content-Type", "text/html"); res.end(pick(page)); return; }
        const m = path.match(/^\/(ru|uk|pl)\/(brief\.html)?$/);
        if (m) req.url = `/${m[2] ?? "index.html"}`;
        next();
      });
    },
    transformIndexHtml: (html, ctx) => {
      const m = ctx.originalUrl?.match(/^\/(ru|uk|pl)\//);
      return m ? localize(html, ctx.filename.endsWith("brief.html") ? "brief.html" : "index.html", m[1] as Lang) : html;
    },
    // build: every page once per language, the bare addresses become the language pickers
    writeBundle: () => {
      for (const page of PAGES) {
        const built = readFileSync(resolve(outDir, page), "utf8");
        for (const l of LANGS) {
          mkdirSync(resolve(outDir, l), { recursive: true });
          writeFileSync(resolve(outDir, l, page), localize(built, page, l));
        }
        writeFileSync(resolve(outDir, page), pick(page));
      }
    }
  };
}

export default defineConfig({
  plugins: [languagePages()],
  build: { rollupOptions: { input: { main: resolve(__dirname, "index.html"), brief: resolve(__dirname, "brief.html") } } }
});
