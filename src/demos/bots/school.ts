import { T, t, money } from "../../i18n";
import { makeChat, makeScreens, type ChatButton } from "../../core/engines";
import { appTop, row, BACK, HOME } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES, ageL, seatsL,
} from "../../content/shared";
import { getLang } from "../../i18n";

/* School mini app */
export default makeScreens("app", {
  top: () => appTop("Akademia Junior"),
  start() { this.s = { day: "mon" }; this.go("list"); },
  act(a: string, v = "") {
    if (a === "day") { this.s.day = v; this.go("list"); }
    if (a === "cls") { this.s.cls = v; this.go("detail"); }
    if (a === "pay") this.go("paid");
  },
  view() {
    const s = this.s, c = CLASSES.find(x => x.id === s.cls)!, d = DAYS.find(x => x.id === c?.day)!;
    const toList = { label: T("К расписанию", "До розкладу", "Wróć do grafiku"), onClick: () => this.go("list") };
    switch (this.scr) {
      case "list": return {
        html: `<p class="app-h">${t(T("Расписание занятий", "Розклад занять", "Grafik zajęć"))}</p><div class="chips" style="margin:10px 0 4px">${DAYS.map(x => `<button type="button" class="chip" data-act="day" data-val="${x.id}" aria-pressed="${x.id === s.day}">${t(x.s)}</button>`).join("")}</div>
        <div class="app-list">${CLASSES.filter(x => x.day === s.day).map(x => row("cls", x.id, `${x.time}, ${t(x.n)}`, `${ageL(x.age, getLang())}, ${seatsL(x.seats, getLang())}`, "", x.seats === 0)).join("")}</div>` };
      case "detail": return {
        html: `<p class="app-h">${t(c.n)}</p><p class="app-sub">${t(d.f)}, ${c.time}, ${ageL(c.age, getLang())}</p>
        <div class="info"><p>${t(T("Пробное занятие — бесплатно", "Пробне заняття — безкоштовно", "Lekcja próbna — bezpłatnie"))}</p><p>${t(T("Абонемент: 320 zł за 8 занятий", "Абонемент: 320 zł за 8 занять", "Karnet: 320 zł za 8 zajęć"))}</p></div>`,
        actions: [
          { label: T("Записать на пробное", "Записати на пробне", "Zapisz na lekcję próbną"), primary: true, onClick: () => this.go("trial") },
          { label: T("Купить абонемент", "Купити абонемент", "Kup karnet"), onClick: () => this.go("pay") },
          { label: BACK, onClick: () => this.go("list") }
        ] };
      case "pay": return {
        html: `<p class="app-h">${t(T("Оплата абонемента", "Оплата абонемента", "Płatność za karnet"))}</p><p class="app-sub">${t(c.n)}, 8 × 40 zł</p>
        <div class="summary"><div><span>${t(T("К оплате", "До сплати", "Do zapłaty"))}</span><b>${money(320)}</b></div></div>
        <div class="app-list">${row("pay", "blik", "BLIK", t(T("Код из банковского приложения", "Код із банківського застосунку", "Kod z aplikacji bankowej")))}${row("pay", "card", t(T("Карта", "Картка", "Karta")), "Visa, Mastercard")}</div>`,
        actions: [{ label: BACK, onClick: () => this.go("detail") }] };
      case "paid": return {
        html: `<div class="done"><div class="mark">✓</div><b>${t(T("Оплачено", "Оплачено", "Opłacono"))}</b><p>${t(T("Абонемент на 8 занятий активен. Чек отправили на почту.", "Абонемент на 8 занять активний. Чек надіслали на пошту.", "Karnet na 8 zajęć jest aktywny. Potwierdzenie wysłaliśmy e-mailem."))}</p></div>`,
        actions: [toList] };
      default: return {
        html: `<div class="done"><div class="mark">✓</div><b>${t(T("Записали на пробное занятие", "Записали на пробне заняття", "Zapisano na lekcję próbną"))}</b><p>${t(c.n)}, ${t(d.f).toLowerCase()} ${c.time}</p><p>${t(T("Напомним накануне вечером.", "Нагадаємо напередодні ввечері.", "Przypomnimy dzień wcześniej wieczorem."))}</p></div>`,
        actions: [toList] };
    }
  }
});
