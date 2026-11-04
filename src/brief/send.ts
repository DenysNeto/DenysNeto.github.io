import { CONFIG } from "../config";

// Straight to the Telegram Bot API from the browser. Every call is multipart FormData: that is a "simple" request,
// so the browser sends no CORS preflight (Telegram answers preflights with 501, which would block a JSON request).
// To hide the token later, point API at a tiny proxy (e.g. a Cloudflare Worker) that adds it: nothing else changes.

const API = `https://api.telegram.org/bot${CONFIG.briefBot.token}`;
/** Telegram's message limit is 4096; a little room for safety */
const MAX = 3900;

export const botReady = (): boolean => Boolean(CONFIG.briefBot.token && CONFIG.briefBot.chatId);

async function call(method: string, form: FormData): Promise<void> {
  form.append("chat_id", CONFIG.briefBot.chatId);
  const res = await fetch(`${API}/${method}`, { method: "POST", body: form });
  const data = await res.json().catch(() => ({ ok: false }));
  if (!data.ok) throw new Error(data.description ?? `Telegram ${res.status}`);
}

/** Splits on line breaks so a long brief arrives as several messages, never cut mid-line */
function chunks(html: string): string[] {
  const out: string[] = [];
  let cur = "";
  for (const line of html.split("\n")) {
    if (cur && cur.length + line.length + 1 > MAX) { out.push(cur); cur = ""; }
    cur += (cur ? "\n" : "") + line.slice(0, MAX);
  }
  if (cur) out.push(cur);
  return out;
}

export async function sendBrief(html: string, files: File[], who: string, onFile: (n: number) => void): Promise<void> {
  for (const text of chunks(html)) {
    const f = new FormData();
    f.append("text", text);
    f.append("parse_mode", "HTML");
    f.append("disable_web_page_preview", "true");
    await call("sendMessage", f);
  }
  // as documents, not photos: Telegram keeps the original quality and any file type
  for (const [i, file] of files.entries()) {
    onFile(i + 1);
    const f = new FormData();
    f.append("document", file, file.name);
    f.append("caption", `${who} · ${i + 1}/${files.length}`);
    await call("sendDocument", f);
  }
}
