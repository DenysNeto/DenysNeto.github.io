import { T, t, money, type Text } from "../../i18n";
import { I } from "../../i18n/strings";
import { makeSite } from "../../core/engines";
import { BACK } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES,
  ageL, seatsL, ANNA, PHONE, TO_HOME, ownerCard, formFields,
} from "../../content/shared";

/* 5. Kids school site: schedule and trial lesson */
export default makeSite({
  url: "akademia-junior-demo.pl", logo: "Akademia Junior", brand: "#BE185D", soft: "#FCEEF4",
  initial: { day: "mon", cls: "r1" },
  foot: T("Вроцлав, ул. Пшикладова 8. Занятия для детей 5–12 лет", "Вроцлав, вул. Пшикладова 8. Заняття для дітей 5–12 років", "Wrocław, ul. Przykładowa 8. Zajęcia dla dzieci 5–12 lat"),
  act(a: string, v = "") {
    if (a === "day") { this.s.day = v; this.go("home"); }
    if (a === "cls") { this.s.cls = v; this.go("trial"); }
    if (a === "trial") this.go("trial");
    if (a === "send") this.go("done");
  },
  view() {
    const S = (o: Text) => this.S(o), L = this.sl, s = this.s;
    const c = CLASSES.find(x => x.id === s.cls)!, d = DAYS.find(x => x.id === c.day)!;
    if (this.scr === "home") return { html: this.shell(`
      <div class="ws-hero"><h4>${S(T("Занятия для детей во Вроцлаве", "Заняття для дітей у Вроцлаві", "Zajęcia dla dzieci we Wrocławiu"))}</h4>
        <p>${S(T("Робототехника, рисование, шахматы и языки. Первое занятие бесплатно.", "Робототехніка, малювання, шахи та мови. Перше заняття безкоштовне.", "Robotyka, rysunek, szachy i języki. Pierwsze zajęcia za darmo."))}</p>
        <button type="button" class="ws-btn" data-act="trial">${S(T("Записаться на пробное", "Записатися на пробне", "Zapisz na lekcję próbną"))}</button></div>
      <div class="ws-sec"><h5>${S(T("Расписание", "Розклад", "Grafik zajęć"))}</h5>
        <div class="chips" style="margin-bottom:6px">${DAYS.map(x => `<button type="button" class="chip" data-act="day" data-val="${x.id}" aria-pressed="${x.id === s.day}">${S(x.s)}</button>`).join("")}</div>
        ${CLASSES.filter(x => x.day === s.day).map(x => `<button type="button" class="ws-row" data-act="cls" data-val="${x.id}"${x.seats ? "" : " disabled"}><span>${x.time}, ${S(x.n)}<small>${ageL(x.age, L)}, ${seatsL(x.seats, L)}</small></span><b>›</b></button>`).join("")}</div>
      <div class="ws-sec"><h5>${S(T("Стоимость", "Вартість", "Ceny"))}</h5><div class="ws-card">${S(T("Пробное занятие — бесплатно", "Пробне заняття — безкоштовно", "Lekcja próbna — bezpłatnie"))}<br>${S(T("Абонемент: 320 zł за 8 занятий", "Абонемент: 320 zł за 8 занять", "Karnet: 320 zł za 8 zajęć"))}</div></div>`) };
    if (this.scr === "trial") return { html: this.shell(`
      <div class="ws-sec" style="border-top:0"><h5>${S(T("Запись на пробное занятие", "Запис на пробне заняття", "Zapis na lekcję próbną"))}</h5>
        <div class="ws-card"><b>${S(c.n)}</b><br>${S(d.f)}, ${c.time}, ${ageL(c.age, L)}</div>
        <label>${S(T("Имя ребёнка", "Ім’я дитини", "Imię dziecka"))}</label><input value="${S(T("София", "Софія", "Zofia"))}" readonly>
        <label>${S(PHONE)}</label><input value="+48 600 000 000" readonly>
        <button type="button" class="ws-btn solid" data-act="send">${S(T("Записать", "Записати", "Zapisz"))}</button>
        <button type="button" class="ws-link" data-act="home">${S(BACK)}</button></div>`) };
    return { html: this.shell(`<div class="ws-ok"><div class="mark">✓</div><h4>${S(T("Ждём вас на занятии!", "Чекаємо на вас на занятті!", "Do zobaczenia na zajęciach!"))}</h4>
      <p>${S(c.n)}, ${S(d.f).toLowerCase()} ${c.time}</p><p>${S(T("Напомним накануне вечером.", "Нагадаємо напередодні ввечері.", "Przypomnimy dzień wcześniej wieczorem."))}</p>
      <button type="button" class="ws-btn solid" data-act="home">${S(TO_HOME)}</button></div>`) };
  }
});
