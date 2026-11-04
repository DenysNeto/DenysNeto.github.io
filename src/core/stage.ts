// Hero 3D stage: starts the story when it comes into view, and on desktop shifts objects by their depth as the pointer moves (respects reduced motion)
export function initStage(): void {
  const stage = document.getElementById("stage");
  if (!stage) return;
  const hero = stage.closest("section") ?? stage;
  // the hero story starts when the stage is on screen: on phones it is below the first screen.
  // .play goes on the whole hero: the bullets next to the stage light up in step with the story
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return;
    hero.classList.add("play");
    io.disconnect();
  }, { threshold: .35 }).observe(stage);
  if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;

  hero.addEventListener("pointermove", e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    stage.style.setProperty("--px", (x * 2).toFixed(3));
    stage.style.setProperty("--py", (y * 2).toFixed(3));
  });
  hero.addEventListener("pointerleave", () => {
    stage.style.removeProperty("--px");
    stage.style.removeProperty("--py");
  });
}
