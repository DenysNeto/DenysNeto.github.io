import { t } from "../i18n";
import { I } from "../i18n/strings";
import { STEPS } from "../content/prices";
import { SCENES } from "../content/scenes";

let io: IntersectionObserver | null = null;
let ro: ResizeObserver | null = null;

/** Renders "How I work": the step reaching the middle of the screen switches the pinned scene. */
export function renderProcess(): void {
  const list = document.getElementById("steps")!;
  const stage = document.getElementById("scenes")!;
  list.innerHTML = STEPS.map((s, i) =>
    `<li data-step="${i}" tabindex="0"><span class="n">${i + 1}</span><div><h3>${t(s.h)}</h3><p>${t(s.p)}</p>
      <dl class="step-meta"><div><dt>${t(I.step_you)}</dt><dd>${t(s.you)}</dd></div><div><dt>${t(I.step_when)}</dt><dd>${t(s.when)}</dd></div></dl></div></li>`).join("");
  stage.innerHTML = SCENES.map(s => `<div class="scene">${s()}</div>`).join("");

  const steps = [...list.querySelectorAll<HTMLElement>("[data-step]")];
  const scenes = [...stage.querySelectorAll<HTMLElement>(".scene")];
  // the progress rail runs through the step numbers and fills up to the active one (process.css draws it from these vars)
  let cur = 0, ys: number[] = [];
  const rail = (): void => {
    if (!ys.length) return;
    const span = ys[ys.length - 1] - ys[0];
    list.style.setProperty("--rail-top", `${ys[0]}px`);
    list.style.setProperty("--rail-h", `${span}px`);
    list.style.setProperty("--k", span > 0 ? ((ys[cur] - ys[0]) / span).toFixed(4) : "0");
  };
  const measure = (): void => {
    ys = steps.map(s => { const n = s.querySelector<HTMLElement>(".n")!; return n.offsetTop + n.offsetHeight / 2; });
    rail();
  };
  const set = (i: number): void => {
    cur = i;
    steps.forEach((s, k) => {
      s.classList.toggle("on", k === i);
      s.classList.toggle("passed", k < i);
      if (k === i) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
    });
    scenes.forEach((s, k) => s.classList.toggle("on", k === i));
    rail();
  };
  set(0);
  ro?.disconnect();
  ro = new ResizeObserver(measure);
  ro.observe(list);

  io?.disconnect();
  const narrow = matchMedia("(max-width:980px)").matches;
  io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(+(e.target as HTMLElement).dataset.step!); }),
    { rootMargin: narrow ? "-64% 0px -26% 0px" : "-45% 0px -45% 0px" });
  steps.forEach(s => {
    io!.observe(s);
    s.addEventListener("click", () => set(+s.dataset.step!));
    s.addEventListener("focus", () => set(+s.dataset.step!)); // keyboard: Tab through the steps switches the scene too
  });
}
