/** Phones and tablets: the burger opens the nav under the header; a link, Escape or a tap outside closes it */
export function initMenu(): void {
  const top = document.querySelector<HTMLElement>(".top");
  const burger = top?.querySelector<HTMLButtonElement>(".burger");
  const nav = document.getElementById("menu");
  if (!top || !burger || !nav) return;
  const set = (open: boolean): void => {
    top.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => set(!top.classList.contains("open")));
  nav.addEventListener("click", e => { if ((e.target as HTMLElement).closest("a")) set(false); });
  document.addEventListener("click", e => { if (!top.contains(e.target as Node)) set(false); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && top.classList.contains("open")) { set(false); burger.focus(); }
  });
}

/** Highlights the menu link of the section being read */
export function initScrollSpy(): void {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('#menu a[href^="#"]')];
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => { if (a.getAttribute("href") === `#${e.target.id}`) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  }), { rootMargin: "-45% 0px -54% 0px" });
  // every section counts, so the highlight also goes away over sections that have no link
  document.querySelectorAll("main section[id], main > section").forEach(s => io.observe(s));
}
