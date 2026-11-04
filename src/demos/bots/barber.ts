import { T, t, money } from "../../i18n";
import { makeChat, makeScreens, type ChatButton } from "../../core/engines";
import { appTop, row, BACK, HOME } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES, ageL, seatsL,
} from "../../content/shared";
import { getLang } from "../../i18n";

/* Barber mini app */
export default makeScreens("app", {
  top: () => appTop("Fade Barbershop"),
  start() { this.s = {}; this.go("services"); },
  act(a: string, v = "") {
    if (a === "svc") { this.s.svc = v; this.go("master"); }
    if (a === "m") { this.s.m = v; this.go("time"); }
    if (a === "slot") { this.s.slot = v; this.go("confirm"); }
  },
  view() {
    const s = this.s, back = (scr: string) => ({ label: BACK, onClick: () => this.go(scr) });
    const svc = SERVICES.find(x => x.id === s.svc)!, m = MASTERS.find(x => x.id === s.m)!;
    switch (this.scr) {
      case "services": return { html: `<p class="app-h">${t(T("Выберите услугу", "Оберіть послугу", "Wybierz usługę"))}</p><div class="app-list">${SERVICES.map(x => row("svc", x.id, t(x.n), t(x.d), money(x.p))).join("")}</div>` };
      case "master": return {
        html: `<p class="app-h">${t(T("Выберите мастера", "Оберіть майстра", "Wybierz specjalistę"))}</p><p class="app-sub">${t(svc.n)}</p><div class="app-list">${MASTERS.map(x => row("m", x.id, t(x.n), t(x.d))).join("")}</div>`,
        actions: [back("services")] };
      case "time": return {
        html: `<p class="app-h">${t(T("Выберите время", "Оберіть час", "Wybierz godzinę"))}</p><p class="app-sub">${t(TOMORROW)}, ${t(m.n)}</p><div class="slots">${SLOTS.map(x => `<button type="button" class="slot" data-act="slot" data-val="${x}"${TAKEN.includes(x) ? " disabled" : ""}>${x}</button>`).join("")}</div>`,
        actions: [back("master")] };
      case "confirm": return {
        html: `<p class="app-h">${t(T("Проверьте запись", "Перевірте запис", "Sprawdź rezerwację"))}</p><div class="summary" style="margin-top:12px">
          <div><span>${t(T("Услуга", "Послуга", "Usługa"))}</span><b>${t(svc.n)}</b></div>
          <div><span>${t(T("Мастер", "Майстер", "Specjalista"))}</span><b>${t(m.n)}</b></div>
          <div><span>${t(T("Когда", "Коли", "Termin"))}</span><b>${t(TOMORROW)}, ${s.slot}</b></div>
          <div><span>${t(T("Стоимость", "Вартість", "Cena"))}</span><b>${money(svc.p)}</b></div></div>`,
        actions: [{ label: T("Записаться", "Записатися", "Zarezerwuj"), primary: true, onClick: () => this.go("done") }, back("time")] };
      default: return {
        html: `<div class="done"><div class="mark">✓</div><b>${t(T("Вы записаны", "Вас записано", "Rezerwacja potwierdzona"))}</b><p>${t(TOMORROW)}, ${s.slot}, ${t(m.n)}</p><p>${t(T("Напомним за день и за 2 часа до визита.", "Нагадаємо за день і за 2 години до візиту.", "Przypomnimy dzień i 2 godziny przed wizytą."))}</p></div>`,
        actions: [{ label: T("Записаться ещё раз", "Записатися ще раз", "Zarezerwuj ponownie"), onClick: () => this.start() }] };
    }
  }
});
