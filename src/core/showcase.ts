import { t, money, type L10n } from "../i18n";
import { I } from "../i18n/strings";
import { Phone } from "./phone";
import type { Demo } from "./types";

export interface Case {
  demo: Demo;
  /** Price "from", zł */
  price: number;
  name: L10n;
  product: L10n;
  /** How it was before ("Было") */
  problem: L10n;
  /** What changes for the owner ("Стало") */
  features: L10n[];
  time: L10n;
  /** The notification the owner gets in Telegram */
  owner: L10n;
}

export type Kind = "site" | "bot";

/** One business: a tab, with a site and/or a bot to switch between */
export interface Example {
  name: L10n;
  site?: Case;
  bot?: Case;
}

const KINDS: Kind[] = ["site", "bot"];

/** Business tabs + Site/Bot switch + case description + phone,
    bound to elements with ids tabs-{prefix}, kinds-{prefix}, case-{prefix}, phone-{prefix}, note-{prefix}, restart-{prefix} */
export class Showcase {
  private active: Example;
  private kind: Kind = "site";
  private tabs: HTMLElement;
  private kinds: HTMLElement;
  private caseEl: HTMLElement;
  private note: HTMLElement;
  private phone: Phone;
  private phoneEl: HTMLElement;

  constructor(prefix: string, private examples: Example[]) {
    this.active = examples[0];
    this.tabs = document.getElementById(`tabs-${prefix}`)!;
    this.kinds = document.getElementById(`kinds-${prefix}`)!;
    this.caseEl = document.getElementById(`case-${prefix}`)!;
    this.note = document.getElementById(`note-${prefix}`)!;
    this.phoneEl = document.getElementById(`phone-${prefix}`)!;
    this.phone = new Phone(this.phoneEl);
    document.getElementById(`restart-${prefix}`)!.addEventListener("click", () => this.start());
  }

  /** The case on screen: the chosen kind, or whatever this business has */
  private get current(): Case {
    return this.active[this.kind] ?? (this.active.site ?? this.active.bot)!;
  }

  render(): void {
    this.renderTabs();
    this.renderKinds();
    this.renderCase();
    this.note.textContent = t(this.current === this.active.bot ? I.note_bot : I.note_site);
    this.start();
  }

  start(): void { this.phone.start(this.current.demo); }

  /** The owner picked another business or kind: the screen slides in from that side, like opening an app, and the case text follows */
  private switchTo(dir: 1 | -1): void {
    this.render();
    for (const el of [this.phoneEl, this.caseEl]) {
      el.style.setProperty("--dir", String(dir));
      el.classList.remove("swap");
      void el.offsetWidth; // restart the animation
      el.classList.add("swap");
    }
  }

  private renderTabs(): void {
    this.tabs.innerHTML = "";
    for (const ex of this.examples) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tab";
      b.setAttribute("aria-pressed", String(ex === this.active));
      b.textContent = t(ex.name);
      b.addEventListener("click", () => {
        if (ex === this.active) return;
        const dir = this.examples.indexOf(ex) > this.examples.indexOf(this.active) ? 1 : -1;
        this.active = ex;
        this.switchTo(dir);
      });
      this.tabs.appendChild(b);
    }
  }

  /** Site / Bot switch; a kind this business doesn't have is left out */
  private renderKinds(): void {
    const shown = this.current === this.active.bot ? "bot" : "site";
    this.kinds.innerHTML = KINDS.filter(k => this.active[k]).map(k =>
      `<button type="button" data-kind="${k}" aria-pressed="${k === shown}">${t(k === "site" ? I.kind_site : I.kind_bot)}</button>`).join("");
    this.kinds.dataset.on = shown;
    this.kinds.querySelectorAll<HTMLElement>("[data-kind]").forEach(b =>
      b.addEventListener("click", () => {
        if (b.getAttribute("aria-pressed") === "true") return;
        this.kind = b.dataset.kind as Kind;
        this.switchTo(this.kind === "bot" ? 1 : -1);
      }));
  }

  private renderCase(): void {
    const c = this.current;
    this.caseEl.innerHTML = `
      <p class="case-product">${t(c.product)}</p>
      <h3>${t(c.name)}</h3>
      <div class="ba">
        <div class="ba-before"><span class="ba-tag">${t(I.lbl_before)}</span><p>${t(c.problem)}</p></div>
        <div class="ba-after"><span class="ba-tag">${t(I.lbl_after)}</span><ul>${c.features.map(f => `<li>${t(f)}</li>`).join("")}</ul></div>
      </div>
      <div class="owner-note"><span>${t(I.owner_h)}</span><p><span class="hg-ico" aria-hidden="true">✓</span>${t(c.owner)}</p></div>
      <dl class="meta">
        <div><dt>${t(I.lbl_time)}</dt><dd>${t(c.time)}</dd></div>
        <div><dt>${t(I.lbl_price)}</dt><dd>${t(I.from)} ${money(c.price)}</dd></div>
      </dl>`;
  }
}
