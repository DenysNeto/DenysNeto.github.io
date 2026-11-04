import { t } from "../i18n";
import type { Action, Demo } from "./types";

/** The phone mockup: top bar, scrollable body, bottom action bar. */
export class Phone {
  readonly top: HTMLElement;
  readonly body: HTMLElement;
  readonly actEl: HTMLElement;
  /** Bumped on every restart so delayed chat messages from an old run are dropped */
  token = 0;
  current: Demo | null = null;

  constructor(root: HTMLElement) {
    this.top = root.querySelector<HTMLElement>(".phone-top")!;
    this.body = root.querySelector<HTMLElement>(".phone-body")!;
    this.actEl = root.querySelector<HTMLElement>(".phone-actions")!;
    this.body.addEventListener("click", e => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-act]");
      if (el && this.current?.act) this.current.act(el.dataset.act!, el.dataset.val);
    });
  }

  start(demo: Demo): void {
    this.token++;
    this.current = demo;
    demo.ph = this;
    demo.scr = null;
    this.top.innerHTML = demo.top();
    this.body.className = "phone-body " + demo.kind;
    this.body.innerHTML = "";
    this.setActions([]);
    demo.start();
  }

  setActions(list: Action[]): void {
    this.actEl.innerHTML = "";
    for (const b of list) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "pa-btn" + (b.primary ? " primary" : "");
      el.textContent = t(b.label);
      el.addEventListener("click", b.onClick);
      this.actEl.appendChild(el);
    }
    this.actEl.hidden = list.length === 0;
  }

  bubble(text: string, out: boolean): void {
    const d = document.createElement("div");
    d.className = "bub" + (out ? " out" : "");
    d.textContent = text;
    this.body.appendChild(d);
    this.body.scrollTop = this.body.scrollHeight;
  }

  typing(): HTMLElement {
    const d = document.createElement("div");
    d.className = "bub typing";
    d.innerHTML = "<i></i><i></i><i></i>";
    this.body.appendChild(d);
    this.body.scrollTop = this.body.scrollHeight;
    return d;
  }
}
