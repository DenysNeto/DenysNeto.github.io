import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { I, type StringKey } from "./src/i18n/strings";
import { fill } from "./src/i18n";
import { CONFIG } from "./src/config";

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const LINKS: Record<string, string> = {
  tg: `https://t.me/${CONFIG.telegram}`,
  wa: `https://wa.me/${CONFIG.whatsapp}`,
  mail: `mailto:${CONFIG.email}`
};

/** Bakes the Russian texts, name and contact links into index.html, so the first paint already has them
    (on a slow phone the page used to paint with empty headings that jumped when the script filled them).
    main.ts still switches to the visitor's language on load. */
function prerenderTexts(): Plugin {
  return {
    name: "prerender-texts",
    // only the landing: /brief fills its own texts
    transformIndexHtml: (html, ctx) => !ctx.filename.endsWith("index.html") ? html : html
      .replace(/(<([a-z0-9]+)\b[^>]*\bdata-i="([a-z0-9_]+)"[^>]*>)(<\/\2>)/g,
        (m, open: string, _tag: string, key: string, close: string) =>
          key in I ? open + esc(fill(I[key as StringKey].ru)) + close : m)
      .replace(/(<([a-z0-9]+)\b[^>]*\bdata-name\b[^>]*>)(<\/\2>)/g, (_m, open: string, _tag: string, close: string) => open + esc(CONFIG.name) + close)
      .replace(/<a ([^>]*\bdata-link="(tg|wa|mail)")/g, (_m, attrs: string, kind: string) => `<a href="${LINKS[kind]}" ${attrs}`)
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(fill(I.title.ru))}</title>`)
  };
}

export default defineConfig({
  plugins: [prerenderTexts()],
  build: { rollupOptions: { input: { main: resolve(__dirname, "index.html"), brief: resolve(__dirname, "brief.html") } } }
});
