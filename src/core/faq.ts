/** Answers slide open and closed: a bare <details> jumps. The list is re-rendered on a language switch, so the click is delegated */
export function initFaq(): void {
  const list = document.getElementById("faq-list");
  if (!list) return;
  /** Where each answer is heading, so a second click mid-way reverses it */
  const going = new WeakMap<HTMLDetailsElement, { anim: Animation; open: boolean }>();
  list.addEventListener("click", e => {
    const sum = (e.target as HTMLElement).closest("summary");
    if (!sum || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    e.preventDefault();
    const d = sum.parentElement as HTMLDetailsElement;
    const run = going.get(d);
    const open = run ? !run.open : !d.open;
    const from = d.offsetHeight; // mid-animation this is the height on screen
    run?.anim.cancel();
    d.open = true;
    const border = d.offsetHeight - d.clientHeight;
    const to = open ? d.offsetHeight : sum.offsetHeight + border;
    d.style.overflow = "hidden";
    const anim = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    if (open) d.querySelector("p")?.animate({ opacity: [0, 1], transform: ["translateY(-6px)", "none"] }, { duration: 380, easing: "ease-out" });
    going.set(d, { anim, open });
    anim.onfinish = () => {
      d.open = open;
      d.style.overflow = "";
      going.delete(d);
    };
  });
}
