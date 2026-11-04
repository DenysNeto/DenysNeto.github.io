import { T, t, money, type Text } from "../../i18n";
import { I } from "../../i18n/strings";
import { makeSite } from "../../core/engines";
import { BACK } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES,
  ageL, seatsL, ANNA, PHONE, TO_HOME, ownerCard, formFields,
} from "../../content/shared";

/* 4. Legalization office site: services, FAQ, booking */
export const TOPICS = [
  { id: "karta", n: T("Карта побыту", "Карта побиту", "Karta pobytu"), p: 800 },
  { id: "pesel", n: T("Номер PESEL", "Номер PESEL", "Numer PESEL"), p: 150 },
  { id: "jdg", n: T("Регистрация JDG", "Реєстрація JDG", "Rejestracja JDG"), p: 300 }
];
export const FAQ = [
  [T("Сколько ждать решения по карте побыту?", "Скільки чекати рішення щодо карти побиту?", "Ile czeka się na decyzję w sprawie karty pobytu?"),
   T("Срок зависит от воеводства и загруженности ужонда. На консультации подскажем, как подготовить документы, чтобы его не затягивать.", "Термін залежить від воєводства та завантаженості ужонду. На консультації підкажемо, як підготувати документи, щоб його не затягувати.", "Czas zależy od województwa i obciążenia urzędu. Na konsultacji podpowiemy, jak przygotować dokumenty, żeby go nie wydłużać.")],
  [T("Можно ли работать, пока идёт рассмотрение?", "Чи можна працювати, поки триває розгляд?", "Czy mogę pracować w trakcie rozpatrywania wniosku?"),
   T("Это зависит от вашего основания и документов. Проверим вашу ситуацию на консультации.", "Це залежить від вашої підстави та документів. Перевіримо вашу ситуацію на консультації.", "To zależy od podstawy i dokumentów. Sprawdzimy Twoją sytuację na konsultacji.")],
  [T("Консультация онлайн или в офисе?", "Консультація онлайн чи в офісі?", "Konsultacja online czy w biurze?"),
   T("Как вам удобно: по видеосвязи или в нашем офисе во Вроцлаве.", "Як вам зручно: відеозв’язком або в нашому офісі у Вроцлаві.", "Jak wolisz: przez wideorozmowę lub w naszym biurze we Wrocławiu.")]
];
export default makeSite({
  url: "biuro-legalizacji-demo.pl", logo: "Biuro Legalizacji", brand: "#4338CA", soft: "#EEF0FD",
  initial: { faq: 0 },
  foot: T("Вроцлав, ул. Пшикладова 5. Пн–Пт 9:00–18:00", "Вроцлав, вул. Пшикладова 5. Пн–Пт 9:00–18:00", "Wrocław, ul. Przykładowa 5. Pon.–pt. 9:00–18:00"),
  act(a: string, v = "") {
    if (a === "faq") { this.s.faq = this.s.faq === +v ? -1 : +v; this.go("home"); }
    if (a === "book") this.go("book");
    if (a === "topic") { this.s.topic = v; this.go("book"); }
    if (a === "time") { this.s.time = +v; this.go("book"); }
    if (a === "confirm") this.go("done");
  },
  view() {
    const S = (o: Text) => this.S(o), s = this.s, topic = TOPICS.find(x => x.id === s.topic), ready = topic && s.time != null;
    if (this.scr === "home") return { html: this.shell(`
      <div class="ws-hero"><h4>${S(T("Легализация пребывания и работы в Польше", "Легалізація перебування та роботи в Польщі", "Legalizacja pobytu i pracy w Polsce"))}</h4>
        <p>${S(T("Консультации на польском, украинском и русском.", "Консультації польською, українською та російською.", "Konsultacje po polsku, ukraińsku i rosyjsku."))}</p>
        <button type="button" class="ws-btn" data-act="book">${S(T("Записаться на консультацию", "Записатися на консультацію", "Umów konsultację"))}</button></div>
      <div class="ws-sec"><h5>${S(T("Услуги", "Послуги", "Usługi"))}</h5>${TOPICS.map(x => `<div class="ws-row"><span>${S(x.n)}</span><b>${S(I.from)} ${money(x.p)}</b></div>`).join("")}</div>
      <div class="ws-sec"><h5>${S(T("Частые вопросы", "Часті питання", "Częste pytania"))}</h5>
        ${FAQ.map(([q, a], i) => `<div class="ws-faq"><button type="button" data-act="faq" data-val="${i}" aria-expanded="${s.faq === i}">${S(q)}<span>${s.faq === i ? "−" : "+"}</span></button>${s.faq === i ? `<p>${S(a)}</p>` : ""}</div>`).join("")}</div>
      <div class="ws-sticky"><button type="button" class="ws-btn" data-act="book">${S(T("Записаться", "Записатися", "Umów się"))}</button></div>`) };
    if (this.scr === "book") return { html: this.shell(`
      <div class="ws-sec" style="border-top:0"><h5>${S(T("Запись на консультацию", "Запис на консультацію", "Umów konsultację"))}</h5>
        <p class="ws-label">${S(T("Тема", "Тема", "Temat"))}</p>
        <div class="chips">${TOPICS.map(x => `<button type="button" class="chip" data-act="topic" data-val="${x.id}" aria-pressed="${x.id === s.topic}">${S(x.n)}</button>`).join("")}</div>
        <p class="ws-label">${S(T("Время", "Час", "Termin"))}</p>
        <div class="chips">${TIMES.map((x, i) => `<button type="button" class="chip" data-act="time" data-val="${i}" aria-pressed="${i === s.time}">${S(x)}</button>`).join("")}</div>
        <button type="button" class="ws-btn solid" data-act="confirm"${ready ? "" : " disabled"}>${S(T("Записаться", "Записатися", "Zarezerwuj"))}</button>
        <button type="button" class="ws-link" data-act="home">${S(BACK)}</button></div>`) };
    return { html: this.shell(`<div class="ws-ok"><div class="mark">✓</div><h4>${S(T("Вы записаны", "Вас записано", "Termin zarezerwowany"))}</h4>
      <p>${S(topic!.n)}, ${S(TIMES[s.time])}</p><p>${S(T("Ссылку на видеозвонок пришлём на почту.", "Посилання на відеодзвінок надішлемо на пошту.", "Link do wideorozmowy wyślemy e-mailem."))}</p>
      <button type="button" class="ws-btn solid" data-act="home">${S(TO_HOME)}</button></div>`) };
  }
});
