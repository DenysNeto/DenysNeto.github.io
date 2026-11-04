import { t, money, type L10n } from "../i18n";
import { I } from "../i18n/strings";
import { waLink } from "./leads";
import { PRICES, type Price } from "../content/prices";
import { PACKAGES } from "../content/packages";

// "How much will your site cost": every number comes from the price list (content/prices.ts), nothing else.
// The message to WhatsApp carries the whole choice.

/** One of: landing, company site, site with booking or calculator */
const BASES = PRICES.filter(p => p.kind === "site");
/** One-off extras added to the sum */
const ADDS = PRICES.filter(p => p.kind === "add");
/** Paid every month; those sharing a group replace each other */
const MONTHS = PRICES.filter(p => p.kind === "month");

/** The recommended site is picked to start with */
let base = Math.max(0, BASES.findIndex(p => p.rec));
const adds = new Set<number>();
const months = new Set<number>();
/** The calculation as a message; Telegram can't prefill it, so it is copied */
let lastMsg = "";
/** Explanations the visitor opened, kept open across re-renders */
const hints = new Set<string>();

const out = (id: string): HTMLElement => document.getElementById(id)!;
/** The explanation behind a "?": one short line, then the points (also used by the price list) */
export const hint = (id: string, q: L10n[], open = false): string =>
  `<div class="cost-hint" id="${id}"${open ? "" : " hidden"}><p>${t(q[0])}</p><ul>${q.slice(1).map(x => `<li>${t(x)}</li>`).join("")}</ul></div>`;

/** An option tile; a "?" next to it opens a plain explanation under it */
const opt = (kind: string, i: number, on: boolean, p: Price, price: string): string => {
  const tile = `<button type="button" class="preset cost-opt" data-${kind}="${i}" aria-pressed="${on}"><span>${t(p.n)}${kind === "add" && p.rec ? ` <em class="rec-note">${t(I.rec_note)}</em>` : ""}</span><b>${price}</b></button>`;
  if (!p.q) return `<div class="cost-row">${tile}<span class="cost-q-gap"></span></div>`; // keeps the tiles aligned
  const id = `q-${kind}-${i}`, open = hints.has(id);
  return `<div class="cost-row">${tile}<button type="button" class="cost-q" data-hint="${id}" aria-expanded="${open}" aria-controls="${id}"
    aria-label="${t(I.cost_what)} ${t(p.n)}">?</button></div>${hint(id, p.q, open)}`;
};
/** What an option costs with the site picked now: some extras are cheaper with the site with booking */
const cost = (p: Price): number => p.pWith && BASES[base].rec ? p.pWith : p.p;
const from = (p: Price): string => `${t(I.from)} ${money(cost(p))}`;
const perMonth = (p: Price | number): string => `${money(typeof p === "number" ? p : p.p)}${t(I.per_month)}`;
const sorted = (s: Set<number>): number[] => [...s].sort((a, b) => a - b);

export function renderCalc(): void {
  out("cost-base").innerHTML = BASES.map((p, i) => opt("base", i, i === base, p, from(p))).join("");
  out("cost-add").innerHTML = ADDS.map((p, i) => opt("add", i, adds.has(i), p,
    `${cost(p) < p.p ? `<s>${money(p.p)}</s> ` : ""}+ ${from(p)}`)).join("");
  out("cost-months").innerHTML = MONTHS.map((p, i) => opt("month", i, months.has(i), p, perMonth(p))).join("");

  const picked = [BASES[base], ...sorted(adds).map(i => ADDS[i])];
  const monthly = sorted(months).map(i => MONTHS[i]);
  // a ready-made package inside the choice keeps its discount (the biggest one, if several fit); extras add to it
  const saving = (k: typeof PACKAGES[number]): number => k.items.reduce((s, p) => s + p.p, 0) - k.p;
  const pack = PACKAGES.filter(k => k.items.every(p => picked.includes(p))).sort((a, b) => saving(b) - saving(a))[0];
  const save = pack ? saving(pack) : 0;
  const sum = picked.reduce((s, p) => s + cost(p), 0) - save;
  const perM = monthly.reduce((s, p) => s + p.p, 0);
  out("cost-sum").textContent = money(sum);
  out("cost-month").textContent = perM ? `+ ${perMonth(perM)}` : "";
  // what is picked, by group, each with its price
  const group = (k: L10n, ps: Price[], price: (p: Price) => string): string => ps.length ? `
    <p class="cp-k">${t(k)}</p><ul>${ps.map(p => `<li><span>${t(p.n)}</span><b>${price(p)}</b></li>`).join("")}</ul>` : "";
  out("cost-list").innerHTML = group(I.cost_sel_site, [BASES[base]], from)
    + group(I.cost_sel_add, picked.slice(1), p => `+ ${from(p)}`)
    + group(I.cost_months, monthly, perMonth)
    + (pack ? `<p class="cp-pack">${t(I.packs_one)} «${t(pack.n)}»: ${t(I.packs_saves)} ${money(save)}</p>` : "");

  // the owner arrives in WhatsApp with their choice already written
  const lines = [t(I.cost_msg_head), ...picked.map(p => `— ${t(p.n)} (${from(p)})`),
    ...monthly.map(p => `— ${t(p.n)} (${perMonth(p)})`)];
  if (pack) lines.push(`${t(I.packs_one)} «${t(pack.n)}»: ${t(I.packs_saves)} ${money(save)}`);
  lines.push(`${t(I.cost_total)}: ${t(I.from)} ${money(sum)}${perM ? ` + ${perMonth(perM)}` : ""}`);
  lines.push(t(I.cost_msg_tail));
  lastMsg = lines.join("\n");
  (out("c-wa") as HTMLAnchorElement).href = waLink(lastMsg);
}

const toggle = (s: Set<number>, i: number): void => { if (s.has(i)) s.delete(i); else s.add(i); };

/** Picks a ready-made set (content/packages.ts): its site and extras, nothing monthly */
export function pickInCalc(items: Price[]): void {
  base = Math.max(0, BASES.findIndex(p => items.includes(p)));
  adds.clear(); months.clear();
  ADDS.forEach((p, i) => { if (items.includes(p)) adds.add(i); });
  renderCalc();
}

export function initCalc(): void {
  out("cost-calc").addEventListener("click", e => {
    const q = (e.target as HTMLElement).closest<HTMLElement>("[data-hint]");
    if (q) {
      const id = q.dataset.hint!, open = !hints.has(id);
      if (open) hints.add(id); else hints.delete(id);
      q.setAttribute("aria-expanded", `${open}`);
      out(id).hidden = !open;
      return;
    }
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-base], [data-add], [data-month]");
    if (!b) return;
    const { base: bi, add, month } = b.dataset;
    if (bi) base = +bi;
    else if (add) toggle(adds, +add);
    else if (month) {
      const g = MONTHS[+month].group;
      if (g) MONTHS.forEach((p, i) => { if (i !== +month && p.group === g) months.delete(i); });
      toggle(months, +month);
    }
    renderCalc();
  });
  out("c-copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(lastMsg); out("c-copied").textContent = t(I.cost_copied); }
    catch { out("c-copied").textContent = lastMsg; } // no clipboard access: show the text to copy by hand
  });
}
