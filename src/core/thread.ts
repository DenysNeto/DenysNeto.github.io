// Rail: a groove that runs down the page gutters and crosses over between sections, with a numbered clay key
// at every section heading. The line in it is drawn up to the point the reader has scrolled to; keys it reaches press in.
// The SVG is painted once; scrolling only slides a clipping box and the bead (transforms: no layout, no repaint).
// Repainting a page-tall SVG on every scroll frame was the main cost on slow phones.

import { onScrollFrame } from "./scroll";

const SAMPLES = 400;

export function initThread(): void {
  const sheet = document.getElementById("sheet");
  const root = sheet?.querySelector<HTMLElement>(".thread");
  if (!sheet || !root) return;
  const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;

  let top = 0, H = 0;
  let xs: number[] = [], ys: number[] = [];   // the path at SAMPLES evenly spaced lengths
  let knots: { el: HTMLElement; y: number }[] = [];
  let clip: HTMLElement, lineSvg: SVGSVGElement, bead: HTMLElement;

  /** x of the path where it reaches height y (the path only goes down) */
  const xAtY = (y: number): number => {
    let lo = 0, hi = SAMPLES;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (ys[mid] < y) lo = mid + 1; else hi = mid; }
    if (lo === 0) return xs[0];
    if (lo > SAMPLES) return xs[SAMPLES];
    const y0 = ys[lo - 1], y1 = ys[lo], f = y1 > y0 ? (y - y0) / (y1 - y0) : 1;
    return xs[lo - 1] + (xs[lo] - xs[lo - 1]) * Math.min(1, Math.max(0, f));
  };

  const build = (): void => {
    const box = sheet.getBoundingClientRect();
    top = box.top + scrollY;
    const W = sheet.clientWidth;
    const sections = [...sheet.querySelectorAll<HTMLElement>(":scope > section")];
    const wrap = sections[0]?.querySelector<HTMLElement>(".wrap");
    if (!wrap) return;
    const gutter = wrap.getBoundingClientRect().left - box.left + parseFloat(getComputedStyle(wrap).paddingLeft);
    const gx = Math.max(9, gutter / 2);
    const amp = Math.min(10, gx - 4);

    const rel = (el: Element): DOMRect => {
      const r = el.getBoundingClientRect();
      return new DOMRect(r.left - box.left, r.top - box.top, r.width, r.height);
    };
    let d = `M ${gx} 0`, lastY = 0;
    const knotPts: [number, number][] = [];
    sections.forEach((sec, i) => {
      const x = i % 2 ? W - gx : gx;
      if (i > 0 && i === sections.length - 1) {
        // the last section (contact card) is where the thread ends: tie it to the top of the card
        const card = rel(sec.querySelector(".wrap") ?? sec);
        const mid = (lastY + card.top) / 2;
        d += ` C ${W - x} ${mid} ${W / 2} ${mid} ${W / 2} ${card.top}`;
        knotPts.push([W / 2, card.top]);
        return;
      }
      const r = rel(sec), cs = getComputedStyle(sec);
      const yTop = r.top + parseFloat(cs.paddingTop) * .4;
      const yEnd = r.bottom - parseFloat(cs.paddingBottom) * .4;
      const h2 = sec.querySelector("h2");
      const yKnot = h2 ? rel(h2).top + rel(h2).height / 2 : yTop;
      if (i === 0) d += ` L ${x} ${yKnot}`;
      else {
        // cross over to this section's side in the gap above it
        const mid = (lastY + yTop) / 2;
        d += ` C ${W - x} ${mid} ${x} ${mid} ${x} ${yTop} L ${x} ${yKnot}`;
      }
      knotPts.push([x, yKnot]);
      // soft wave down the gutter to the end of the section
      const steps = Math.max(1, Math.round((yEnd - yKnot) / 180));
      const seg = (yEnd - yKnot) / steps;
      for (let k = 0; k < steps; k++) {
        const y = yKnot + seg * (k + 1);
        d += k === 0 ? ` Q ${x + amp} ${y - seg / 2} ${x} ${y}` : ` T ${x} ${y}`;
      }
      lastY = yEnd;
    });

    H = sheet.offsetHeight;
    const svg = (cls: string, body: string): string =>
      `<svg class="${cls}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
    root.innerHTML = svg("t-track", `<path class="track" d="${d}"/>`) +
      `<div class="t-clip">${svg("t-line", `<path class="glow" d="${d}"/><path class="line" d="${d}"/>`)}</div>` +
      knotPts.map(([x, y], k) => `<span class="key${x > W * .6 ? " r" : ""}" style="left:${x}px;top:${y}px">${String(k + 1).padStart(2, "0")}</span>`).join("") +
      `<span class="bead"></span>`;
    clip = root.querySelector(".t-clip")!;
    clip.style.height = `${H}px`;
    lineSvg = clip.querySelector("svg")!;
    bead = root.querySelector(".bead")!;
    const line = root.querySelector<SVGPathElement>(".line")!;
    const total = line.getTotalLength();
    const pts = Array.from({ length: SAMPLES + 1 }, (_, k) => line.getPointAtLength((k / SAMPLES) * total));
    xs = pts.map(p => p.x);
    ys = pts.map(p => p.y);
    knots = [...root.querySelectorAll<HTMLElement>(".key")].map((el, k) => ({ el, y: knotPts[k][1] }));
    draw(scrollY);
  };

  const draw = (sy: number): void => {
    if (!clip) return;
    const y = reduced ? H : Math.min(H, Math.max(0, sy + innerHeight * .62 - top));
    // reveal down to y: the clip box slides down to end at y, the line inside slides back by the same amount
    clip.style.transform = `translateY(${y - H}px)`;
    lineSvg.style.transform = `translateY(${H - y}px)`;
    bead.style.transform = `translate(${xAtY(y)}px,${y}px)`;
    bead.style.opacity = y > 0 && y < ys[SAMPLES] ? "1" : "0";
    knots.forEach(k => k.el.classList.toggle("lit", y >= k.y - 1));
  };

  // rebuilt once the size settles: an opening FAQ answer resizes the sheet on every frame for a third of a second
  let pending = 0;
  new ResizeObserver(() => { clearTimeout(pending); pending = window.setTimeout(build, 150); }).observe(sheet);
  onScrollFrame(draw);
  build();
}
