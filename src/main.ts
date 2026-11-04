import "./styles/base.css";
import "./styles/showcase.css";
import "./styles/telegram.css";
import "./styles/website.css";
import "./styles/stage.css";
import "./styles/process.css";
import "./styles/flow.css";
import "./styles/clay.css";
import "./styles/phone.css";

import { CONFIG } from "./config";
import { LANGS, fill, money, setCurrentLang, t, getLang, type Lang } from "./i18n";
import { I, type StringKey } from "./i18n/strings";
import { PRICES, type Price } from "./content/prices";
import { PACKAGES } from "./content/packages";
import { PAINS } from "./content/pains";
import { FAQ } from "./content/faq";
import { REVIEW } from "./content/review";
import { COMPARE_COLS, COMPARE_ROWS } from "./content/compare";
import { EXAMPLES } from "./content/cases";
import { Showcase } from "./core/showcase";
import { initStage } from "./core/stage";
import { renderProcess } from "./core/process";
import { initMood, initMobileBar, initToTop } from "./core/flow";
import { initCalc, renderCalc, hint, pickInCalc } from "./core/calc";
import { initThread } from "./core/thread";
import { initMenu, initScrollSpy } from "./core/menu";
import { initFaq } from "./core/faq";
import { initTilt } from "./core/tilt";
import { waLink } from "./core/leads";

const examples = new Showcase("examples", EXAMPLES);

function renderLists(): void {
  document.getElementById("painList")!.innerHTML = PAINS.map(p => `
    <li><button type="button" class="pain" aria-pressed="false">
      <span class="pain-face pain-front">
        <span class="pain-top"><span class="pain-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${p.ico}</svg></span>
        <span class="pain-h">${t(p.h)}<span class="sr-only">.</span></span></span> <span class="pain-p">${t(p.p)}</span>
        <span class="pain-hint">${t(I.pain_hint)} <span aria-hidden="true">→</span></span>
      </span>
      <span class="pain-face pain-back">
        <span class="pain-fix">${t(p.fix)}<span class="sr-only">.</span></span>
        <span class="pain-tag">${t(I.pain_do)}<span class="sr-only">:</span></span>
        <span class="pain-do">${p.do.map(d => `<span>${t(d)}<span class="sr-only">;</span></span>`).join(" ")}</span>
      </span>
    </button></li>`).join("");
  const price = (p: Price): string => `${money(p.p)}${p.kind === "month" ? t(I.per_month) : ""}`;
  document.getElementById("plans")!.innerHTML = PRICES.filter(p => p.main).map(p => `
    <article class="plan${p.rec ? " rec" : ""}">
      ${p.rec ? `<span class="plan-badge">${t(I.plan_rec)}</span>` : ""}
      <h3>${t(p.n)}</h3>
      <p class="plan-price"><small>${t(I.from)}</small> ${price(p)}</p>
      <p class="plan-result">${t(p.r)}</p>
      <ul class="plan-inc">${p.d.map(x => `<li>${t(x)}</li>`).join("")}</ul>
      <a class="btn ${p.rec ? "btn-primary" : "btn-soft"}" href="https://t.me/${CONFIG.telegram}" target="_blank" rel="noopener">${t(p.cta!)}</a>
    </article>`).join("");
  // ready-made packages: the price one by one is struck out, the WhatsApp message carries the set
  document.getElementById("packs")!.innerHTML = PACKAGES.map((k, i) => {
    const full = k.items.reduce((sum, p) => sum + p.p, 0);
    const msg = [`${t(I.packs_msg)} «${t(k.n)}» (${t(I.from)} ${money(k.p)}):`, ...k.items.map(p => `— ${t(p.n)}`), t(I.cost_msg_tail)].join("\n");
    return `
    <article class="plan pack${k.rec ? " rec" : ""}">
      ${k.rec ? `<span class="plan-badge">${t(I.plan_rec)}</span>` : ""}
      <h3>${t(k.n)}</h3>
      <p class="plan-result">${t(k.r)}</p>
      <p class="plan-price"><small>${t(I.from)}</small> ${money(k.p)} <s class="pack-full">${t(I.packs_instead)} ${money(full)}</s></p>
      <ul class="plan-inc">${k.items.map(p => `<li>${t(p.n)}</li>`).join("")}</ul>
      <a class="btn ${k.rec ? "btn-primary" : "btn-soft"}" href="${waLink(msg)}" target="_blank" rel="noopener">${t(I.packs_wa)}</a>
      <button type="button" class="linkbtn pack-edit" data-pack="${i}">${t(I.packs_edit)}</button>
    </article>`;
  }).join("");
  const line = (p: Price, i: number): string => `
    <li><div class="pl-line"><span class="pl-name">${t(p.n)}${p.rec ? ` <em class="rec-note">${t(I.rec_note)}</em>` : ""}${p.qList && p.q ? ` <button type="button" class="cost-q pl-q" data-hint="pl-${i}"
      aria-expanded="false" aria-controls="pl-${i}" aria-label="${t(I.cost_what)} ${t(p.n)}">?</button>` : ""}</span><span class="pl-dots" aria-hidden="true"></span><span class="pl-price">${t(I.from)} ${price(p)}</span></div>
    ${p.qList && p.q ? hint(`pl-${i}`, p.q) : ""}
    <p class="pl-result">${t(p.r)}</p>
    <p class="pl-inc">${p.d.map(x => `<span>${t(x)}</span>`).join("")}</p></li>`;
  document.getElementById("priceList")!.innerHTML = PRICES.filter(p => !p.main && p.kind !== "month").map(p => line(p, PRICES.indexOf(p))).join("");
  document.getElementById("priceMonth")!.innerHTML = PRICES.filter(p => !p.main && p.kind === "month").map(p => line(p, PRICES.indexOf(p))).join("");
  const from = money(Math.min(...PRICES.filter(p => p.kind === "site").map(p => p.p)));
  const me = COMPARE_COLS.length - 1;
  document.getElementById("compare-table")!.innerHTML = `
    <thead><tr><td></td>${COMPARE_COLS.map((c, i) => `<th scope="col"${i === me ? ' class="me"' : ""}>${t(c)}</th>`).join("")}</tr></thead>
    <tbody>${COMPARE_ROWS.map(r => `<tr><th scope="row">${t(r.h)}</th>${r.cells.map((c, i) =>
      `<td data-label="${t(COMPARE_COLS[i])}"${i === me ? ' class="me"' : ""}>${t(c).replace("{from}", from)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  const support = money(PRICES.find(p => p.kind === "month")!.p);
  const faq = FAQ.map(([q, a]) => [t(q), t(a).replace("{support}", support)]);
  document.getElementById("faq-list")!.innerHTML = faq.map(([q, a]) => `
    <details><summary>${q}</summary><p>${a}</p></details>`).join("");
  // the same questions as structured data, so Google can show them in search results
  document.getElementById("faq-ld")!.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  document.getElementById("review")!.innerHTML = `
    <div class="review-top"><span class="review-tag">${t(REVIEW.tag)}</span><b>${t(REVIEW.title)}</b></div>
    <ol>${REVIEW.items.map(r => `
      <li class="${r.lvl}"><b>${t(r.h)}</b><span>${t(r.why)}</span><span class="review-fix">${t(REVIEW.fixLabel)} ${t(r.fix)}</span></li>`).join("")}
    </ol>
    <p>${t(REVIEW.note)}</p>`;
  renderProcess();
  renderCalc();
}

function applyStatic(): void {
  document.querySelectorAll<HTMLElement>("[data-i]").forEach(el => {
    el.textContent = fill(t(I[el.dataset.i as StringKey]));
  });
  document.querySelectorAll<HTMLElement>("[data-name]").forEach(el => { el.textContent = CONFIG.name; });
  document.querySelectorAll<HTMLAnchorElement>('[data-link="tg"]').forEach(a => { a.href = `https://t.me/${CONFIG.telegram}`; });
  document.querySelectorAll<HTMLAnchorElement>('[data-link="wa"]').forEach(a => {
    a.href = a.dataset.wa ? waLink(t(I[a.dataset.wa as StringKey])) : `https://wa.me/${CONFIG.whatsapp}`;
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-link="mail"]').forEach(a => { a.href = `mailto:${CONFIG.email}`; });
  document.title = fill(t(I.title));
  document.documentElement.lang = getLang();
  // a package opens in the cost calculator with its items picked, to change from there
document.getElementById("packs")!.addEventListener("click", e => {
  const b = (e.target as HTMLElement).closest<HTMLElement>("[data-pack]");
  if (!b) return;
  pickInCalc(PACKAGES[+b.dataset.pack!].items);
  document.getElementById("cost")!.scrollIntoView();
});

// "?" in the price list opens a plain explanation under the name (same texts as the cost calculator)
document.getElementById("prices")!.addEventListener("click", e => {
  const q = (e.target as HTMLElement).closest<HTMLElement>("[data-hint]");
  if (!q) return;
  const open = q.getAttribute("aria-expanded") !== "true";
  q.setAttribute("aria-expanded", String(open));
  document.getElementById(q.dataset.hint!)!.hidden = !open;
});

}

function setLang(l: Lang): void {
  setCurrentLang(l);
  try { localStorage.setItem("pf-lang", l); } catch { /* storage unavailable */ }
  applyStatic();
  renderLists();
  examples.render();
}

// pain cards swap to their solution on click or tap and back on the next one (clay.css)
document.getElementById("painList")!.addEventListener("click", e => {
  const card = (e.target as HTMLElement).closest(".pain");
  card?.setAttribute("aria-pressed", String(card.getAttribute("aria-pressed") !== "true"));
});

// Each language has its own address (/ru/, /uk/, /pl/: vite.config.ts); the page says which one it is.
// The language links in the header go to the other addresses, keeping the section the visitor is on
const pageLang = document.documentElement.lang;
setLang((LANGS as string[]).includes(pageLang) ? (pageLang as Lang) : "ru");
document.querySelectorAll<HTMLAnchorElement>("[data-lang]").forEach(a =>
  a.addEventListener("click", () => { a.hash = location.hash; }));
initStage();
initMood();
initThread();
initCalc();
initMobileBar();
initToTop();
initMenu();
initScrollSpy();
initFaq();
initTilt();


