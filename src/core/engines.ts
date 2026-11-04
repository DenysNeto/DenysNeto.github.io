import { getLang, t, tl, type Lang, type Text } from "../i18n";
import type { Phone } from "./phone";
import type { Demo, DemoKind, View } from "./types";
import { browserTop, chatTop } from "./ui";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Chat bots ---------- */

export interface ChatButton {
  label: Text;
  next: string;
  primary?: boolean;
  /** Merged into chat state when the button is pressed */
  set?: Record<string, unknown>;
}
export interface ChatNode {
  bot(s: any): Text[];
  buttons(s: any): ChatButton[];
}
export interface ChatDef {
  name: Text;
  /** Must contain a "start" node */
  nodes: Record<string, ChatNode>;
}

export function makeChat(def: ChatDef) {
  const demo = {
    kind: "chat" as DemoKind,
    ph: null as Phone | null,
    scr: null as string | null,
    s: {} as any,
    top: () => chatTop(t(def.name)),
    start() { this.s = {}; this.node("start", true); },
    node(id: string, instant = false) {
      const n = def.nodes[id], ph = this.ph!, run = ph.token;
      ph.setActions([]);
      const show = () => {
        if (run !== ph.token) return; // demo was restarted meanwhile
        n.bot(this.s).forEach(m => ph.bubble(t(m), false));
        ph.setActions(n.buttons(this.s).map(b => ({
          label: b.label,
          primary: b.primary,
          onClick: () => {
            ph.bubble(t(b.label), true);
            if (b.set) Object.assign(this.s, b.set);
            this.node(b.next);
          },
        })));
      };
      if (instant || reduceMotion) return show();
      const ty = ph.typing();
      setTimeout(() => { ty.remove(); show(); }, 600);
    },
  };
  return demo satisfies Demo;
}

/* ---------- Screen-based demos (mini apps, websites) ---------- */

export interface ScreenCtx extends Demo {
  s: any;
  go(scr: string): void;
}
export interface ScreenDef {
  top(): string;
  start(): void;
  view(): View;
  act?(a: string, v?: string): void;
}

/** Renders this.view() into the phone. Re-rendering the same screen keeps the scroll position. */
function go(this: ScreenCtx & ScreenDef, scr: string) {
  const b = this.ph!.body, same = scr === this.scr, y = b.scrollTop;
  this.scr = scr;
  const v = this.view();
  b.innerHTML = v.html;
  b.scrollTop = same ? y : 0;
  this.ph!.setActions(v.actions ?? []);
}

export function makeScreens<D extends ScreenDef>(kind: DemoKind, def: D & ThisType<D & ScreenCtx>): D & ScreenCtx {
  const o = Object.assign({ kind, ph: null, scr: null, s: {} }, def) as D & ScreenCtx;
  o.go = go;
  return o;
}

/* ---------- Websites with an in-site language switcher ---------- */

export interface SiteCtx extends ScreenCtx {
  /** Language of the demo site (independent from the portfolio language) */
  sl: Lang;
  /** Translate into the demo site language */
  S(o: Text): string;
  /** Wraps content into the site's nav, brand colors and footer */
  shell(inner: string): string;
}
export interface SiteDef {
  url: string;
  logo: string;
  brand: string;
  soft: string;
  /** Hero background, defaults to brand */
  hero?: string;
  foot: Text;
  /** Initial state for this.s */
  initial?: Record<string, unknown>;
  view(): View;
  /** Site-specific actions. "slang" and "home" are handled for you. */
  act(a: string, v?: string): void;
}

const SITE_LANGS: [Lang, string][] = [["pl", "PL"], ["uk", "UA"], ["ru", "RU"]];

export function makeSite<D extends SiteDef>(def: D & ThisType<D & SiteCtx>): D & SiteCtx {
  const innerAct = def.act;
  const site = Object.assign({ kind: "site" as DemoKind, ph: null, scr: null, s: {}, sl: getLang() }, def) as unknown as D & SiteCtx;
  site.go = go;
  site.top = () => browserTop(def.url);
  site.start = function () {
    this.sl = getLang();
    this.s = { ...(def.initial ?? {}) };
    this.go("home");
  };
  site.S = function (o) { return tl(o, this.sl); };
  site.shell = function (inner) {
    const vars = `--brand:${def.brand};--soft:${def.soft}${def.hero ? `;--hero:${def.hero}` : ""}`;
    const langs = SITE_LANGS.map(([l, n]) =>
      `<button type="button" data-act="slang" data-val="${l}" aria-pressed="${l === this.sl}">${n}</button>`).join("");
    return `<div class="ws" lang="${this.sl}" style="${vars}">
      <div class="ws-nav"><b class="ws-logo">${def.logo}</b><div class="ws-langs">${langs}</div></div>
      ${inner}
      <div class="ws-foot">${this.S(def.foot)}</div></div>`;
  };
  site.act = function (a, v) {
    if (a === "slang") { this.sl = v as Lang; return this.go(this.scr ?? "home"); }
    if (a === "home") return this.go("home");
    innerAct.call(this, a, v);
  };
  return site;
}
