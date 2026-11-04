import { T, t, money, type Text } from "../../i18n";
import { I } from "../../i18n/strings";
import { makeSite } from "../../core/engines";
import { BACK } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES,
  ageL, seatsL, ANNA, PHONE, TO_HOME, ownerCard, formFields,
} from "../../content/shared";

/* 1. Barber site with booking */
export default makeSite({
  url: "fade-barber-demo.pl", logo: "FADE", brand: "#A16207", soft: "#FBF5E9", hero: "#1C1917",
  foot: T("ул. Пшикладова 12, Вроцлав. Пн–Сб 10:00–20:00", "вул. Пшикладова 12, Вроцлав. Пн–Сб 10:00–20:00", "ul. Przykładowa 12, Wrocław. Pon.–sob. 10:00–20:00"),
  act(a: string, v = "") {
    if (a === "book") this.go("book");
    if (a === "svc") { this.s.svc = v; this.go("book"); }
    if (a === "slot") { this.s.slot = v; this.go("book"); }
    if (a === "confirm") this.go("done");
    if (a === "again") { this.s = {}; this.go("home"); }
  },
  view() {
    const S = (o: Text) => this.S(o), s = this.s;
    const svc = SERVICES.find(x => x.id === s.svc);
    if (this.scr === "home") return { html: this.shell(`
      <div class="ws-hero"><h4>${S(T("Барбершоп во Вроцлаве", "Барбершоп у Вроцлаві", "Barbershop we Wrocławiu"))}</h4>
        <p>${S(T("Мужские стрижки, фейды и борода. Без ожидания, с онлайн-записью.", "Чоловічі стрижки, фейди та борода. Без очікування, з онлайн-записом.", "Strzyżenia męskie, fade i broda. Bez czekania, z rezerwacją online."))}</p>
        <button type="button" class="ws-btn" data-act="book">${S(T("Записаться онлайн", "Записатися онлайн", "Umów wizytę online"))}</button></div>
      <div class="ws-sec"><h5>${S(T("Цены", "Ціни", "Cennik"))}</h5>${SERVICES.map(x => `<div class="ws-row"><span>${S(x.n)}<small>${S(x.d)}</small></span><b>${money(x.p)}</b></div>`).join("")}</div>
      <div class="ws-sec"><h5>${S(T("Наши барберы", "Наші барбери", "Nasi barberzy"))}</h5><div class="ws-cards">${MASTERS.slice(0, 2).map(m => `<div class="ws-card"><b>${S(m.n)}</b><small>${S(m.d)}</small></div>`).join("")}</div></div>
      <div class="ws-sec"><h5>${S(T("Как нас найти", "Як нас знайти", "Jak do nas trafić"))}</h5><p>${S(T("5 минут пешком от Рынка. Парковка во дворе.", "5 хвилин пішки від Ринку. Паркування у дворі.", "5 minut pieszo od Rynku. Parking na podwórku."))}</p></div>
      <div class="ws-sticky"><button type="button" class="ws-btn" data-act="book">${S(T("Записаться", "Записатися", "Zarezerwuj"))}</button></div>`) };
    if (this.scr === "book") return { html: this.shell(`
      <div class="ws-sec" style="border-top:0"><h5>${S(T("Онлайн-запись", "Онлайн-запис", "Rezerwacja online"))}</h5>
        <p class="ws-label">${S(T("Услуга", "Послуга", "Usługa"))}</p>
        <div class="chips">${SERVICES.map(x => `<button type="button" class="chip" data-act="svc" data-val="${x.id}" aria-pressed="${x.id === s.svc}">${S(x.n)}</button>`).join("")}</div>
        <p class="ws-label">${S(TOMORROW)}</p>
        <div class="slots">${SLOTS.map(x => `<button type="button" class="slot" data-act="slot" data-val="${x}" aria-pressed="${x === s.slot}"${TAKEN.includes(x) ? " disabled" : ""}>${x}</button>`).join("")}</div>
        ${svc && s.slot ? `<div class="ws-price"><span>${S(svc.n)}, ${s.slot}</span><strong>${money(svc.p)}</strong></div>` : ""}
        <button type="button" class="ws-btn solid" data-act="confirm"${svc && s.slot ? "" : " disabled"}>${S(T("Подтвердить запись", "Підтвердити запис", "Potwierdź rezerwację"))}</button>
        <button type="button" class="ws-link" data-act="home">${S(BACK)}</button></div>`) };
    return { html: this.shell(`<div class="ws-ok"><div class="mark">✓</div><h4>${S(T("До встречи!", "До зустрічі!", "Do zobaczenia!"))}</h4>
      <p>${S(svc!.n)}, ${S(TOMORROW).toLowerCase()} ${s.slot}</p><p>${S(T("Подтверждение отправили по SMS.", "Підтвердження надіслали SMS.", "Potwierdzenie wysłaliśmy SMS-em."))}</p>
      <button type="button" class="ws-btn solid" data-act="again">${S(TO_HOME)}</button></div>`) };
  }
});
