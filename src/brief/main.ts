import "../styles/base.css";
// clay.css and phone.css come in through brief.css (@import): imported here they would become a chunk shared with the landing,
// loaded before the landing's own files, and the landing needs them last
import "../styles/brief.css";
import { LANGS, t, tl, getLang, setCurrentLang, type Lang, type L10n } from "../i18n";
import { CONFIG } from "../config";
import { FONT_KINDS, FONTS, MAX_REFS, MOODS, PALETTES, S, SECTIONS, type Field, type Section } from "./fields";
import { botReady, sendBrief } from "./send";

// /brief: the client describes the site, the answers come to my Telegram. Only name and contact are required;
// every other section is optional and folded, so the brief takes 5 minutes or 30, as the client likes.

/** A reference: link and what about it */
interface Ref { u: string; n: string }
type Vals = Record<string, string | number | number[] | string[] | Ref[]>;
const DRAFT = "pf-brief";
/** Palette and font picks besides a list index */
const CUSTOM = -2, UNSURE = -3;
const MAX_FILES = 10, MAX_SIZE = 20 * 1024 * 1024;

const form = document.getElementById("brief") as HTMLFormElement;
const map = document.getElementById("b-map")!;
const bar = document.getElementById("b-progress")!;
const status = document.getElementById("b-status")!;

/** Own colours: background, accent, text */
let vals: Vals = { custom: ["#F6F1EA", "#2F7DD1", "#1B1B1B"] };
try { vals = { ...vals, ...JSON.parse(localStorage.getItem(DRAFT) ?? "{}") }; } catch { /* no draft */ }
if (vals.palette === UNSURE) delete vals.palette; // the palette no longer has "suggest yourself"
const files: File[] = [];
/** The first section starts open; the rest wait for the client */
const open = new Set<string>(["you"]);
const thumbs = new Map<File, string>();

const save = (): void => { try { localStorage.setItem(DRAFT, JSON.stringify(vals)); } catch { /* storage unavailable */ } };
const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const str = (k: string): string => String(vals[k] ?? "").trim();
const picks = (k: string): number[] => Array.isArray(vals[k]) ? vals[k] as number[] : [];
const pick = (k: string): number => typeof vals[k] === "number" ? vals[k] as number : -1;
const customColors = (): string[] => vals.custom as string[];
const refs = (): Ref[] => {
  if (!Array.isArray(vals.refs) || !vals.refs.length) vals.refs = [{ u: "", n: "" }];
  return vals.refs as Ref[];
};
const usedRefs = (): Ref[] => refs().filter(r => r.u.trim() || r.n.trim());

const required = SECTIONS.flatMap(s => s.fields).filter(f => "req" in f && f.req);
function filled(f: Field): boolean {
  switch (f.type) {
    case "chips": return picks(f.k).length > 0 || str(`${f.k}_other`) !== "";
    case "moods": case "palette": case "fonts": return pick(f.k) !== -1;
    case "files": return files.length > 0;
    case "refs": return usedRefs().length > 0;
    default: return str(f.k) !== "";
  }
}
const secFilled = (s: Section): boolean => s.fields.some(filled);
const secRequired = (s: Section): boolean => s.fields.some(f => "req" in f && f.req);

function label(f: Field): string {
  const req = "req" in f && f.req ? ` <em>${t(S.req)}</em>` : "";
  return `<span class="f-l">${t(f.label)}${req}</span>${f.hint ? `<span class="f-h">${t(f.hint)}</span>` : ""}`;
}

function refRow(r: Ref, i: number): string {
  return `<li class="ref">
    <input type="url" data-ref="${i}" data-rf="u" value="${esc(r.u)}" placeholder="https://…" aria-label="${esc(t(S.refLink))} ${i + 1}">
    <input type="text" data-ref="${i}" data-rf="n" value="${esc(r.n)}" placeholder="${esc(t(S.refNote))}">
    ${refs().length > 1 ? `<button type="button" class="ref-x" data-ref-rm="${i}" aria-label="${t(S.remove)}">×</button>` : ""}
  </li>`;
}

/** What the folded multiple choice shows: the picks, or a prompt */
const mselText = (k: string, options: L10n[], multi: boolean): string => picks(k).length
  ? `<span class="msel-v">${esc(picks(k).map(i => t(options[i])).join(", "))}</span>`
  : `<span class="msel-v msel-ph">${t(multi ? S.pick : S.pickOne)}</span>`;

function field(f: Field): string {
  switch (f.type) {
    case "text": case "url":
      return `<label class="f" data-f="${f.k}">${label(f)}<input name="${f.k}" type="${f.type === "url" ? "url" : "text"}" value="${esc(str(f.k))}"
        ${f.ph ? `placeholder="${esc(t(f.ph))}"` : ""} ${f.k === "name" ? 'autocomplete="name"' : ""}></label>`;
    case "textarea":
      return `<label class="f" data-f="${f.k}">${label(f)}<textarea name="${f.k}" rows="3" ${f.ph ? `placeholder="${esc(t(f.ph))}"` : ""}>${esc(str(f.k))}</textarea></label>`;
    case "chips": {
      const chips = `<div class="chips">${f.options.map((o, i) =>
        `<button type="button" class="chip" data-chip="${f.k}" data-n="${i}" data-multi="${f.multi}" aria-pressed="${picks(f.k).includes(i)}">${t(o)}</button>`).join("")}</div>`;
      // on phones the choice folds into a select-like button; the chips stay the same underneath
      return `<fieldset class="f" data-f="${f.k}"><legend>${label(f)}</legend><div class="msel${f.multi ? "" : " msel-one"}">
        <button type="button" class="msel-btn" aria-expanded="false">${mselText(f.k, f.options, f.multi)}</button>${chips}</div>${f.other
        ? `<input class="chips-other" name="${f.k}_other" type="text" value="${esc(str(`${f.k}_other`))}" placeholder="${esc(t(f.other))}" aria-label="${esc(t(f.other))}">` : ""}</fieldset>`;
    }
    case "moods": {
      const p = pick("mood");
      return `<fieldset class="f" data-f="mood"><legend>${label(f)}</legend><div class="moods">${MOODS.map((m, i) => {
        const c = PALETTES[m.pal].c;
        return `<button type="button" class="mood" data-mood="${i}" aria-pressed="${p === i}">
          <span class="mood-sw" style="background:${c[0]};color:${c[3]}"><b style="font-family:'${FONTS[m.font].f}',serif">Aa</b>
            <i style="background:${c[1]};border-radius:${m.r}px"></i></span>
          <span class="mood-n">${t(m.n)}</span><span class="mood-d">${t(m.d)}</span>
          <span class="mood-for">${m.for.map(x => `<i>${t(x)}</i>`).join("")}</span></button>`;
      }).join("")}</div><p class="look-auto">${t(S.lookAuto)}</p></fieldset>`;
    }
    case "palette": {
      const p = pick("palette");
      return `<fieldset class="f" data-f="palette"><legend>${label(f)}</legend><div class="pals">${PALETTES.map((x, i) =>
        `<button type="button" class="pal" data-pal="${i}" aria-pressed="${p === i}"><span class="sw">${x.c.map(c => `<i style="background:${c}"></i>`).join("")}</span>${t(x.n)}</button>`).join("")}
        <div class="pal pal-custom" data-pal="${CUSTOM}" aria-pressed="${p === CUSTOM}" role="button" tabindex="0"><span class="sw">${customColors().map((c, i) =>
          `<input type="color" value="${c}" data-color="${i}" aria-label="${t(S.custom)}: ${t([S.cBg, S.cAcc, S.cInk][i])}">`).join("")}</span>${t(S.custom)}</div></div></fieldset>`;
    }
    case "fonts": {
      const p = pick("fonts");
      // one list, grouped by kind: the sample in the font itself, then its name and character
      return `<fieldset class="f" data-f="fonts"><legend>${label(f)}</legend><div class="fonts">
        <button type="button" class="font font-unsure" data-font="${UNSURE}" aria-pressed="${p === UNSURE}">${t(S.unsure)}</button>
        ${FONT_KINDS.map((g, gi) => `<p class="fonts-g">${t(g)}</p>${FONTS.map((x, i) => x.g !== gi ? "" :
          `<button type="button" class="font" data-font="${i}" aria-pressed="${p === i}"><b style="font-family:'${x.f}',serif">${t(S.sample)}</b>
            <span class="font-n">${x.f}</span><span class="font-d">${t(x.n)}</span></button>`).join("")}`).join("")}</div></fieldset>`;
    }
    case "refs":
      return `<div class="f" data-f="refs">${label(f)}<ul class="refs" id="refs">${refs().map(refRow).join("")}</ul>
        <button type="button" class="btn btn-soft ref-add" id="ref-add" ${refs().length >= MAX_REFS ? "hidden" : ""}>+ ${t(S.refAdd)}</button></div>`;
    case "files":
      return `<div class="f">${label(f)}<label class="drop" id="drop"><input type="file" id="b-files" multiple accept="image/*,.pdf">
        <span>${t(S.drop)}</span></label><p class="f-err" id="files-err" hidden>${t(S.tooBig)}</p><ul class="thumbs" id="thumbs"></ul></div>`;
  }
}

/** The style section's phone: a rough one-page site the client can scroll, recoloured by look() on every pick.
 *  Headings take the picked font, body text stays neutral, as on most sites */
const preview = (): string => {
  const sec = (h: L10n, body: string, cls = ""): string => `<div class="pv-sec ${cls}"><h4 class="pv-sh">${t(h)}</h4>${body}</div>`;
  return `<aside class="pv">
  <div class="pv-phone" aria-hidden="true"><div class="pv-screen" id="pv">
    <div class="pv-top"><b class="pv-logo"></b><span class="pv-brand">${t(S.sample)}</span><span class="pv-burger"><i></i><i></i></span></div>
    <div class="pv-hero"><i class="pv-blob"></i><span class="pv-kick">${t(S.pvKicker)}</span><h3 class="pv-h">${t(S.sample)}</h3><p class="pv-p">${t(S.pvLead)}</p>
      <div class="pv-ctas"><span class="pv-btn">${t(S.pvBtn)}</span><span class="pv-btn pv-btn2">${t(S.pvBtn2)}</span></div></div>
    <i class="pv-img pv-cover"></i>
    <div class="pv-trust"><span class="pv-stars">★★★★★</span><span>${t(S.pvTrust)}</span></div>
    ${sec(S.pvSvcH, `<ul class="pv-list">${[100, 150, 200].map((p, i) =>
      `<li><span>${t(S.pvSvc)} ${i + 1}</span><b>${t(S.pvFrom)} ${p} zł</b></li>`).join("")}</ul>`)}
    ${sec(S.pvWorks, `<div class="pv-gal">${[1, 2, 3, 4].map(() => `<i class="pv-img"></i>`).join("")}</div>`)}
    <figure class="pv-rev"><blockquote>${t(S.pvRev)}</blockquote><figcaption>${t(S.pvRevBy)}</figcaption></figure>
    ${sec(S.pvForm, `<span class="pv-in">${t(S.pvName)}</span><span class="pv-in">${t(S.pvPhone)}</span><span class="pv-btn pv-wide">${t(S.pvBtn)}</span>`, "pv-form")}
    ${sec(S.pvMap, `<i class="pv-map"><b></b></i><p class="pv-p">${t(S.pvAddr)}</p>`)}
    <div class="pv-foot">© ${t(S.sample)}</div>
  </div></div>
  <button type="button" class="btn btn-soft pv-zoom" aria-pressed="false"><span aria-hidden="true">⤢</span> ${t(S.pvOpen)}</button>
  <p class="pv-note">${t(S.pvScroll)}. ${t(S.pvNote)}</p>
</aside>`;
};

/** The phone opened over the whole window, to look at it closely. It moves to <body> while open:
 *  any transformed section around it would otherwise trap a fixed element */
let pvSpot: Comment | null = null;
function fitFull(): void {
  const pv = document.querySelector<HTMLElement>(".pv-full");
  if (!pv) return;
  const phone = pv.querySelector<HTMLElement>(".pv-phone")!, screen = phone.querySelector<HTMLElement>(".pv-screen")!;
  const base = 230, ratio = 0.54; // the screen as drawn in the page, and its width / height
  const pad = 2 * parseFloat(getComputedStyle(phone).paddingLeft);
  const btn = pv.querySelector<HTMLElement>(".pv-zoom")!.offsetHeight;
  const h = Math.min(innerHeight - 32 - btn - 14 - pad, (innerWidth - 24 - pad) / ratio);
  const z = h * ratio / base;
  screen.style.cssText += `;width:${base}px;height:${h / z}px;zoom:${z}`;
  phone.style.width = `${h * ratio + pad}px`;
}
function pvFull(on: boolean): void {
  const pv = document.querySelector<HTMLElement>(".pv");
  if (!pv || on === pv.classList.contains("pv-full")) return;
  const btn = pv.querySelector<HTMLElement>(".pv-zoom")!;
  if (on) {
    pvSpot = document.createComment("pv");
    pv.replaceWith(pvSpot);
    document.body.append(pv);
  } else {
    pvSpot?.replaceWith(pv);
    const screen = pv.querySelector<HTMLElement>(".pv-screen")!;
    screen.style.width = screen.style.height = screen.style.zoom = "";
    pv.querySelector<HTMLElement>(".pv-phone")!.style.width = "";
  }
  pv.classList.toggle("pv-full", on);
  document.documentElement.classList.toggle("pv-lock", on);
  btn.setAttribute("aria-pressed", String(on));
  btn.innerHTML = `<span aria-hidden="true">${on ? "×" : "⤢"}</span> ${t(on ? S.pvClose : S.pvOpen)}`;
  fitFull();
  if (!on) btn.focus();
}
document.addEventListener("click", e => {
  const el = e.target as HTMLElement;
  if (el.closest(".pv-zoom")) pvFull(!el.closest(".pv-full"));
  else if (el.classList.contains("pv-full")) pvFull(false); // a click on the dimmed backdrop
});
document.addEventListener("keydown", e => { if (e.key === "Escape") pvFull(false); });
addEventListener("resize", fitFull);

/** On phones the style section is one screen: the phone on top, then mood, colours and font as tabs under it */
let lookTab = "mood";
const lookTabs = (): string => `<div class="look-tabs" role="tablist">${([["mood", S.tabMood], ["palette", SECTIONS.flatMap(s => s.fields).find(f => f.k === "palette")!.label], ["fonts", S.tabFont]] as const)
  .map(([k, n]) => `<button type="button" class="look-tab" role="tab" data-lt="${k}" aria-selected="${k === lookTab}">${t(n)}</button>`).join("")}</div>`;

function render(): void {
  form.innerHTML = SECTIONS.map((s, i) => {
    const fields = s.fields.map(field).join("");
    return `
    <details class="b-sec" id="sec-${s.id}" data-sec="${s.id}" ${open.has(s.id) ? "open" : ""}>
      <summary><span class="b-n">${i + 1}</span><span class="b-h"><span class="b-title"><h2>${t(s.h)}</h2>${s.desc ? `
          <button type="button" class="b-info" aria-label="${t(S.info)}" aria-expanded="false" aria-describedby="tip-${s.id}">i</button>
          <span class="b-tip" id="tip-${s.id}" role="tooltip">${t(s.desc)}</span>` : ""}</span>
        ${secRequired(s) ? `<span class="b-sub"><b>${t(S.reqSec)}</b></span>` : ""}</span></summary>
      <div class="b-body">
        ${s.preview ? `<div class="look-grid" data-tab="${lookTab}"><div class="look-fields">${lookTabs()}${fields}</div>${preview()}</div>` : fields}</div>
    </details>`;
  }).join("");
  renderThumbs();
  look();
  progress();
}

/** Text on a colour: dark ink on light colours, white on dark ones */
const onColor = (hex: string): string => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? "#151515" : "#FFFFFF";
};

/** What the phone shows: the picked colours and font, or the mood's own until the client picks them */
function look(): void {
  const pv = document.getElementById("pv");
  if (!pv) return;
  const m = pick("mood"), mood = m >= 0 ? MOODS[m] : undefined;
  const p = pick("palette"), f = pick("fonts");
  const cc = customColors();
  const c = p === CUSTOM ? [cc[0], cc[1], cc[1], cc[2]] : PALETTES[p >= 0 ? p : mood?.pal ?? 2].c;
  const font = FONTS[f >= 0 ? f : mood?.font ?? 0].f;
  pv.dataset.mood = String(m);
  pv.style.cssText = `--pv-bg:${c[0]};--pv-acc:${c[1]};--pv-sec:${c[2]};--pv-ink:${c[3]};--pv-on:${onColor(c[1])};`
    + `--pv-r:${mood?.r ?? 12}px;--pv-font:'${font}',serif`;
}

/** The section map: every section, ticked once something in it is filled */
function renderMap(): void {
  map.innerHTML = SECTIONS.map(s => `<button type="button" class="b-go" data-go="${s.id}" data-done="${secFilled(s)}">
    <span class="b-go-h">${t(s.h)}</span></button>`).join("");
  chain();
}

/** Small arrows from each section to the next; the rows snake (every other one runs right to left) so each arrow is short */
function chain(): void {
  const tiles = [...map.querySelectorAll<HTMLElement>(".b-go")];
  tiles.forEach(el => { el.style.gridRow = el.style.gridColumn = ""; }); // a placed tile would keep an extra column alive
  const cols = getComputedStyle(map).gridTemplateColumns.split(" ").length;
  tiles.forEach((el, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    el.style.gridRow = String(r + 1);
    el.style.gridColumn = String(r % 2 ? cols - c : c + 1);
  });
  const box = map.getBoundingClientRect();
  const at = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, done: el.dataset.done === "true" };
  };
  const arrows = tiles.slice(1).map((el, i) => {
    const a = at(tiles[i]), b = at(el);
    let d: string;
    if (Math.abs(a.t - b.t) < 4) { // same row: across the gap, a head at the far end
      const y = (a.t + a.b) / 2, s = b.l > a.l ? 1 : -1, x1 = s > 0 ? a.r + 7 : a.l - 7, x2 = s > 0 ? b.l - 7 : b.r + 7;
      d = `M${x1} ${y}H${x2}M${x2 - 6 * s} ${y - 5}L${x2} ${y}L${x2 - 6 * s} ${y + 5}`;
    } else { // next row: straight down under the tile
      const x = (a.l + a.r) / 2, y1 = a.b + 9, y2 = b.t - 6;
      d = `M${x} ${y1}V${y2}M${x - 5} ${y2 - 6}L${x} ${y2}L${x + 5} ${y2 - 6}`;
    }
    return `<path d="${d}"${a.done && b.done ? ' class="on"' : ""}/>`;
  });
  map.querySelector(".b-chain")?.remove();
  map.insertAdjacentHTML("afterbegin", `<svg class="b-chain" aria-hidden="true" width="${box.width}" height="${box.height}">${arrows.join("")}</svg>`);
}
new ResizeObserver(chain).observe(map);

function renderRefs(): void {
  document.getElementById("refs")!.innerHTML = refs().map(refRow).join("");
  document.getElementById("ref-add")!.hidden = refs().length >= MAX_REFS;
}

function renderThumbs(): void {
  const ul = document.getElementById("thumbs");
  if (!ul) return;
  ul.innerHTML = files.map((f, i) => {
    if (!thumbs.has(f) && f.type.startsWith("image/")) thumbs.set(f, URL.createObjectURL(f));
    const img = thumbs.get(f);
    return `<li>${img ? `<img src="${img}" alt="">` : `<span class="doc">PDF</span>`}<span class="t-name">${esc(f.name)}</span>
      <button type="button" class="t-x" data-rm="${i}" aria-label="${t(S.remove)}">×</button></li>`;
  }).join("");
}

function progress(): void {
  bar.textContent = t(S.progress).replace("{n}", String(SECTIONS.filter(secFilled).length)).replace("{m}", String(SECTIONS.length));
  const done = (id: string): string => String(secFilled(SECTIONS.find(s => s.id === id)!));
  map.querySelectorAll<HTMLElement>("[data-go]").forEach(b => { b.dataset.done = done(b.dataset.go!); });
  form.querySelectorAll<HTMLElement>("[data-sec]").forEach(d => { d.dataset.done = done(d.dataset.sec!); });
  chain();
}

function addFiles(list: FileList | null): void {
  let skipped = false;
  for (const f of list ?? []) {
    if (f.size > MAX_SIZE || files.length >= MAX_FILES) { skipped = true; continue; }
    files.push(f);
  }
  document.getElementById("files-err")!.hidden = !skipped;
  renderThumbs();
  progress();
}

/** Fonts for the samples: fetched only when the style section is opened, and only the letters the samples use
 *  (in every language, so a language switch needs nothing new). Geologica is the page's own font, already loaded */
let fontsLoaded = false;
function loadFonts(): void {
  if (fontsLoaded) return;
  fontsLoaded = true;
  const fam = FONTS.filter(f => f.f !== "Geologica").map(f => `family=${f.f.replace(/ /g, "+")}:wght@${f.w}`).join("&");
  // capitals too: some moods set section titles in uppercase
  const sample = LANGS.flatMap(l => [S.sample, S.pvSvc, S.pvSvcH, S.pvWorks, S.pvForm, S.pvMap, S.pvRev].map(x => x[l])).join("") + "Aa123";
  const letters = [...new Set(sample + sample.toUpperCase())].join("");
  document.head.insertAdjacentHTML("beforeend",
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fam}&text=${encodeURIComponent(letters)}&display=swap">`);
}

map.addEventListener("click", e => {
  const b = (e.target as HTMLElement).closest<HTMLElement>("[data-go]");
  if (!b) return;
  const d = document.getElementById(`sec-${b.dataset.go}`) as HTMLDetailsElement;
  d.open = true;
  d.scrollIntoView({ behavior: "smooth", block: "start" });
});

form.addEventListener("input", e => {
  const el = e.target as HTMLInputElement;
  if (el.dataset.color) {
    customColors()[+el.dataset.color] = el.value;
    vals.palette = CUSTOM;
    el.closest(".pals")!.querySelectorAll<HTMLElement>("[data-pal]").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.pal! === CUSTOM)));
    look();
  } else if (el.dataset.ref) {
    refs()[+el.dataset.ref][el.dataset.rf as "u" | "n"] = el.value;
  } else if (el.name) {
    vals[el.name] = el.value;
    el.closest(".f")?.classList.remove("bad");
  }
  if (el.tagName === "TEXTAREA") { el.style.height = "auto"; el.style.height = `${el.scrollHeight + 2}px`; }
  save();
  progress();
});

/** Closes every open section hint except the one given */
const closeTips = (keep?: Element): void =>
  form.querySelectorAll(".b-info[aria-expanded=\"true\"]").forEach(b => { if (b !== keep) b.setAttribute("aria-expanded", "false"); });
document.addEventListener("click", e => { if (!(e.target as HTMLElement).closest(".b-info")) closeTips(); });

form.addEventListener("click", e => {
  const el = e.target as HTMLElement;
  const info = el.closest<HTMLElement>(".b-info");
  if (info) { // the hint sits in the section title: open it without opening or closing the section
    e.preventDefault();
    closeTips(info);
    info.setAttribute("aria-expanded", String(info.getAttribute("aria-expanded") !== "true"));
    return;
  }
  if (el.closest(".b-tip")) { e.preventDefault(); return; } // reading the hint mustn't fold the section
  const chip = el.closest<HTMLElement>("[data-chip]");
  if (chip) {
    const k = chip.dataset.chip!, n = +chip.dataset.n!;
    const now = picks(k);
    vals[k] = chip.dataset.multi === "true" ? (now.includes(n) ? now.filter(x => x !== n) : [...now, n]) : (now.includes(n) ? [] : [n]);
    chip.parentElement!.querySelectorAll<HTMLElement>("[data-chip]").forEach(b => b.setAttribute("aria-pressed", String(picks(k).includes(+b.dataset.n!))));
    const btn = chip.closest(".msel")?.querySelector(".msel-btn");
    const f = SECTIONS.flatMap(s => s.fields).find(x => x.k === k);
    if (btn && f?.type === "chips") btn.innerHTML = mselText(k, f.options, f.multi);
    // one answer: picking it closes the list, like a select
    if (btn && f?.type === "chips" && !f.multi) { btn.parentElement!.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  }
  const lt = el.closest<HTMLElement>("[data-lt]");
  if (lt) {
    lookTab = lt.dataset.lt!;
    lt.closest<HTMLElement>(".look-grid")!.dataset.tab = lookTab;
    lt.parentElement!.querySelectorAll("[data-lt]").forEach(b => b.setAttribute("aria-selected", String(b === lt)));
  }
  const ms = el.closest<HTMLElement>(".msel-btn");
  if (ms) ms.setAttribute("aria-expanded", String(ms.parentElement!.classList.toggle("open")));
  const one = el.closest<HTMLElement>("[data-pal], [data-font], [data-mood]");
  if (one && !(el instanceof HTMLInputElement) && one.closest("#brief .f")) {
    const [k, attr] = one.dataset.pal !== undefined ? ["palette", "pal"] : one.dataset.font !== undefined ? ["fonts", "font"] : ["mood", "mood"];
    const n = +one.dataset[attr]!;
    vals[k] = pick(k) === n ? -1 : n;
    one.parentElement!.querySelectorAll<HTMLElement>(`[data-${attr}]`).forEach(b => b.setAttribute("aria-pressed", String(+b.dataset[attr]! === pick(k))));
  }
  if (el.closest("#ref-add") && refs().length < MAX_REFS) {
    refs().push({ u: "", n: "" });
    renderRefs();
    document.querySelector<HTMLInputElement>(`[data-ref="${refs().length - 1}"][data-rf="u"]`)?.focus();
  }
  const refRm = el.closest<HTMLElement>("[data-ref-rm]");
  if (refRm) { refs().splice(+refRm.dataset.refRm!, 1); renderRefs(); }
  const rm = el.closest<HTMLElement>("[data-rm]");
  if (rm) { files.splice(+rm.dataset.rm!, 1); renderThumbs(); }
  save();
  look();
  progress();
});
form.addEventListener("keydown", e => {
  const el = e.target as HTMLElement;
  if (el.classList.contains("pal-custom") && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); el.click(); }
});
form.addEventListener("change", e => { if ((e.target as HTMLElement).id === "b-files") addFiles((e.target as HTMLInputElement).files); });
form.addEventListener("toggle", e => {
  const d = e.target as HTMLDetailsElement;
  if (d.open) open.add(d.dataset.sec!); else open.delete(d.dataset.sec!);
  if (d.dataset.sec === "look" && d.open) loadFonts();
}, true);
form.addEventListener("dragover", e => { if ((e.target as HTMLElement).closest("#drop")) { e.preventDefault(); document.getElementById("drop")!.classList.add("over"); } });
form.addEventListener("dragleave", () => document.getElementById("drop")?.classList.remove("over"));
form.addEventListener("drop", e => {
  if (!(e.target as HTMLElement).closest("#drop")) return;
  e.preventDefault();
  document.getElementById("drop")!.classList.remove("over");
  addFiles(e.dataTransfer?.files ?? null);
});

/** The brief as Telegram HTML, always in Russian for me; empty answers are left out */
function message(): string {
  const lines = [`<b>🆕 Новый бриф</b> · язык клиента: ${document.documentElement.lang.toUpperCase()}`];
  for (const s of SECTIONS) {
    const rows: string[] = [];
    for (const f of s.fields) {
      let v = "";
      if (f.type === "chips") v = [...picks(f.k).map(i => tl(f.options[i], "ru")), str(`${f.k}_other`)].filter(Boolean).join(", ");
      else if (f.type === "moods") v = pick("mood") >= 0 ? tl(MOODS[pick("mood")].n, "ru") : "";
      else if (f.type === "palette") {
        const p = pick("palette");
        v = p === CUSTOM ? `свои: фон ${customColors()[0]}, акцент ${customColors()[1]}, текст ${customColors()[2]}` : p >= 0 ? `${tl(PALETTES[p].n, "ru")}: ${PALETTES[p].c.join(" ")}` : "";
      } else if (f.type === "fonts") {
        const p = pick("fonts");
        v = p === UNSURE ? "предложите сами" : p >= 0 ? FONTS[p].f : "";
      } else if (f.type === "files") v = files.length ? `${files.length} шт., придут следом` : "";
      else if (f.type === "refs") {
        const list = usedRefs();
        if (list.length) rows.push(`• <b>${esc(tl(f.label, "ru"))}:</b>`,
          ...list.map(r => `   ${esc(r.u.trim() || "—")}${r.n.trim() ? ` — ${esc(r.n.trim())}` : ""}`));
        continue;
      }
      else v = str(f.k);
      if (v) rows.push(`• <b>${esc(tl(f.label, "ru"))}:</b> ${esc(v)}`);
    }
    if (rows.length) lines.push("", `<b>${esc(tl(s.h, "ru"))}</b>`, ...rows);
  }
  return lines.join("\n");
}

/** ok: everything arrived; "files": the text arrived but the pictures didn't; false: nothing arrived */
function result(ok: boolean | "files", text = ""): void {
  const box = document.getElementById("b-result")!;
  box.hidden = false;
  box.innerHTML = ok === "files"
    ? `<h2>${t(S.doneH)}</h2><p>${t(S.filesP)}</p><div class="b-acts"><a class="btn btn-primary" href="https://t.me/${CONFIG.telegram}" target="_blank" rel="noopener">Telegram</a>
       <a class="btn btn-soft" href="/${getLang()}/">${t(S.back)}</a></div>`
    : ok
    ? `<h2>${t(S.doneH)}</h2><p>${t(S.doneP)}</p><a class="btn btn-soft" href="/${getLang()}/">${t(S.back)}</a>`
    : `<h2>${t(S.failH)}</h2><p>${t(S.failP)}</p><div class="b-acts"><button type="button" class="btn btn-primary" id="b-copy">${t(S.copy)}</button>
       <a class="btn btn-soft" href="https://t.me/${CONFIG.telegram}" target="_blank" rel="noopener">Telegram</a></div>`;
  document.getElementById("b-copy")?.addEventListener("click", async e => {
    try { await navigator.clipboard.writeText(text); (e.target as HTMLElement).textContent = t(S.copied); } catch { /* the text stays below */ }
  });
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const missing = required.filter(f => !filled(f));
  form.querySelectorAll(".bad").forEach(x => x.classList.remove("bad"));
  if (missing.length) {
    missing.forEach(f => form.querySelector(`[data-f="${f.k}"]`)?.classList.add("bad"));
    status.textContent = t(S.missing);
    (document.getElementById("sec-you") as HTMLDetailsElement).open = true;
    const first = form.querySelector<HTMLElement>(`[data-f="${missing[0].k}"]`);
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    first?.querySelector<HTMLElement>("input, textarea, button")?.focus({ preventScroll: true });
    return;
  }
  const html = message();
  const plain = html.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  if (!botReady()) { status.textContent = ""; result(false, plain); return; }
  const btn = document.getElementById("b-send") as HTMLButtonElement;
  btn.disabled = true;
  status.textContent = t(S.sending);
  let textSent = false; // the files go after the whole text, so the first file means the text is in
  const done = (): void => {
    try { localStorage.removeItem(DRAFT); } catch { /* storage unavailable */ }
    form.hidden = map.hidden = true;
    document.querySelectorAll(".b-bar, .b-draft").forEach(el => el.setAttribute("hidden", ""));
  };
  try {
    await sendBrief(html, files, str("name"), n => { textSent = true; status.textContent = t(S.sendingFiles).replace("{n}", String(n)).replace("{m}", String(files.length)); });
    done();
    result(true);
  } catch {
    if (textSent) { done(); result("files"); } // don't make them resend a brief that already arrived
    else result(false, plain);
  } finally {
    btn.disabled = false;
    status.textContent = "";
  }
});

function setLang(l: Lang): void {
  setCurrentLang(l);
  document.documentElement.lang = l;
  try { localStorage.setItem("pf-lang", l); } catch { /* storage unavailable */ }
  document.title = `${t(S.title)} — ${CONFIG.name}`;
  document.querySelectorAll<HTMLElement>("[data-s]").forEach(el => { el.textContent = t(S[el.dataset.s as keyof typeof S]); });
  document.querySelectorAll<HTMLElement>("[data-name]").forEach(el => { el.textContent = CONFIG.name; });
  pvFull(false);
  renderMap();
  render();
}
/** The conveyor (brief.css): the board is cut at the roller under the header, so the page seems to run into it.
 *  The rows just before the roller tip away from the viewer, as a belt bends over its roller, and the roller's ribs
 *  move with the scroll as if it turned. Only small rows tip: a whole tall card tipping would look like it falls over */
const roller = document.getElementById("b-roller")!, board = document.querySelector<HTMLElement>(".b-main")!, pill = document.querySelector<HTMLElement>(".top .wrap")!;
const ROWS = ".b-main>h1,.b-draft,.b-go,.b-sec>summary,.f-l,.f-h,.f input,.f textarea,.chip,.msel-btn,.mood,.pal,.font,.look-tab,.ref-add,.drop,.pv-phone,.pv-zoom,.pv-note,.look-auto";
/** How far before the roller a row starts to bend, and how far it tips at the roller */
const BEND = 120, TIP = 58;
const tipped = new Set<HTMLElement>();
function belt(): void {
  const p = pill.getBoundingClientRect(), b = board.getBoundingClientRect();
  const line = p.bottom + 12; // the roller, just under the header and its clay edge
  const cut = line + 10 - b.top; // how much of the board has gone into the roller (to its middle)
  roller.classList.toggle("on", cut > 0);
  roller.style.cssText = `left:${b.left}px;width:${b.width}px;top:${line}px;--turn:${(-scrollY * 0.6).toFixed(1)}px`;
  // a negative inset on the sides and bottom keeps the board's own clay shadow
  board.style.clipPath = cut > 0 ? `inset(${cut}px -60px -60px -60px)` : "";
  // read every row first, then write, so the browser lays out once
  const now: [HTMLElement, number][] = [];
  if (cut > 0) for (const el of board.querySelectorAll<HTMLElement>(ROWS)) {
    const r = el.getBoundingClientRect();
    if (r.bottom < line || r.top > line + BEND || r.height > 160) continue;
    const k = Math.min(1, 1 - (r.top - line) / BEND); // 0 far from the roller, 1 at it
    now.push([el, k * k * TIP]);
  }
  const keep = new Set(now.map(([el]) => el));
  for (const el of tipped) if (!keep.has(el)) { el.classList.remove("b-tip-row"); el.style.transform = ""; tipped.delete(el); }
  for (const [el, deg] of now) {
    el.classList.add("b-tip-row");
    el.style.transform = `perspective(600px) rotateX(${deg.toFixed(1)}deg)`;
    tipped.add(el);
  }
}
let beltQueued = false;
const queueBelt = (): void => { if (!beltQueued) { beltQueued = true; requestAnimationFrame(() => { beltQueued = false; belt(); }); } };
addEventListener("scroll", queueBelt, { passive: true });
addEventListener("resize", queueBelt);
belt();

// the page's own language: /ru/brief.html, /uk/brief.html… (vite.config.ts); the draft survives the switch
const pageLang = document.documentElement.lang;
setLang((LANGS as string[]).includes(pageLang) ? pageLang as Lang : "ru");
