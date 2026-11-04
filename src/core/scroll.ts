// One scroll listener for every scroll-driven effect: scrollY is read once per frame and handed to each effect,
// which then only writes styles. Reading scrollY after another effect has written would force an extra layout.

type Effect = (y: number) => void;

const effects: Effect[] = [];
let frame = 0;

const tick = (): void => {
  frame = 0;
  const y = scrollY;
  for (const fx of effects) fx(y);
};

export function onScrollFrame(fx: Effect): void {
  if (!effects.length) addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(tick); }, { passive: true });
  effects.push(fx);
}
