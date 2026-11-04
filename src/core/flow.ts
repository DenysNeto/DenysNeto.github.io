import { onScrollFrame } from "./scroll";

/** Background blobs take the colours of the section crossing the middle of the screen */
export function initMood(): void {
  const field = document.querySelector<HTMLElement>(".field");
  if (!field) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) field.dataset.mood = (e.target as HTMLElement).dataset.mood;
  }), { rootMargin: "-48% 0px -51% 0px" });
  document.querySelectorAll("[data-mood]").forEach(s => io.observe(s));
}

/** Phones: Telegram/WhatsApp bar at the bottom once the hero is gone, hidden again at the contact section */
export function initMobileBar(): void {
  const bar = document.getElementById("mbar");
  const hero = document.querySelector<HTMLElement>(".hero"), contact = document.getElementById("contact");
  if (!bar || !hero || !contact) return;
  // "gone" is measured by scroll; the hero's height is cached, reading it on every scroll event would force a layout
  let heroH = hero.offsetHeight;
  new ResizeObserver(() => { heroH = hero.offsetHeight; }).observe(hero);
  let atContact = false;
  const underBar = new Set<Element>();
  let shown: boolean | null = null, lastY = scrollY;
  const update = (y = lastY): void => {
    lastY = y;
    const on = y > heroH * .7 && !atContact && underBar.size === 0;
    if (on === shown) return;
    shown = on;
    bar.classList.toggle("on", on);
    bar.inert = !on;
  };
  new IntersectionObserver(([e]) => { atContact = e.isIntersecting; update(); }).observe(contact);
  // step aside while a demo phone or a section's own call to action passes under the bar,
  // so their buttons stay tappable and the bar doesn't repeat them. Containers, not buttons: the buttons are re-rendered on a language switch
  const under = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? underBar.add(e.target) : underBar.delete(e.target));
    update();
  }, { rootMargin: "-86% 0px 0px 0px" });
  document.querySelectorAll(".phone-col, .cta-row, #painList, #plans, #packs, #c-wa, .calc-alt").forEach(p => under.observe(p));
  onScrollFrame(update);
  update();
}

/** A round "up" button once the first screen is scrolled away; on phones it sits above the Telegram/WhatsApp bar */
export function initToTop(): void {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  btn.addEventListener("click", () => scrollTo({ top: 0 }));
  let shown: boolean | null = null;
  onScrollFrame(y => {
    const on = y > innerHeight;
    if (on === shown) return;
    shown = on;
    btn.hidden = !on;
  });
}
