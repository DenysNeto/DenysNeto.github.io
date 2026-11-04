// Clay depth (clay.css): ?depth=flat shows the thinner "Обычный" volume, remembered in this browser.
// On desktop the price cards and the review lean towards the pointer ("Глубже" only, the CSS ignores it in flat mode).
// The cost calculator stays still: it is long and is used by clicking.
export function initTilt(): void {
  const root = document.documentElement;
  let depth = new URLSearchParams(location.search).get("depth");
  try {
    if (depth) localStorage.setItem("pf-depth", depth);
    else depth = localStorage.getItem("pf-depth");
  } catch { /* storage unavailable */ }
  if (depth === "flat") root.dataset.depth = "flat";

  if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  // delegated: price cards are re-rendered on a language switch
  let card: HTMLElement | null = null;
  document.addEventListener("pointermove", e => {
    const c = (e.target as HTMLElement).closest<HTMLElement>(".plan, .review");
    if (c !== card) { card?.classList.remove("tilting"); card = c; }
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width) - .5) * 7}deg`);
    c.style.setProperty("--rx", `${(.5 - ((e.clientY - r.top) / r.height)) * 7}deg`);
    c.classList.add("tilting");
  }, { passive: true });
}
