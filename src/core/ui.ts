import { T, t } from "../i18n";

export const BACK = T("Назад", "Назад", "Wstecz");
export const HOME = T("В начало", "На початок", "Na początek");

const initials = (s: string) => s.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

/** Telegram chat header */
export const chatTop = (name: string) =>
  `<div class="tg-top"><span class="tg-back" aria-hidden="true">‹</span><span class="tg-ava">${initials(name)}</span><span class="tg-name"><b>${name}</b><small>${t(T("бот", "бот", "bot"))}</small></span></div>`;

/** Telegram mini app header */
export const appTop = (name: string) =>
  `<div class="tg-top app"><span class="tg-close">${t(T("Закрыть", "Закрити", "Zamknij"))}</span><b class="tg-title">${name}</b><span class="tg-more" aria-hidden="true">⋯</span></div>`;

/** Mobile browser address bar */
export const browserTop = (url: string) => `<div class="br-top"><span class="url">🔒 ${url}</span></div>`;

/** Tappable list row in mini apps */
export const row = (act: string, val: string, title: string, sub: string, right = "", disabled = false) =>
  `<button type="button" class="app-row" data-act="${act}" data-val="${val}"${disabled ? " disabled" : ""}><span><b>${title}</b><small>${sub}</small></span><span class="app-right">${right}</span></button>`;
