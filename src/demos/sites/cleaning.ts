import { T, t, money, type Text } from "../../i18n";
import { I } from "../../i18n/strings";
import { makeSite } from "../../core/engines";
import { BACK } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES,
  ageL, seatsL, ANNA, PHONE, TO_HOME, ownerCard, formFields,
} from "../../content/shared";

/* 2. Cleaning site with price calculator */
export const CTYPES = [
  { id: "std", rate: 5, n: T("Стандартная", "Стандартне", "Standardowe"), full: T("Стандартная уборка", "Стандартне прибирання", "Sprzątanie standardowe") },
  { id: "gen", rate: 8, n: T("Генеральная", "Генеральне", "Generalne"), full: T("Генеральная уборка", "Генеральне прибирання", "Sprzątanie generalne") },
  { id: "rem", rate: 12, n: T("После ремонта", "Після ремонту", "Po remoncie"), full: T("Уборка после ремонта", "Прибирання після ремонту", "Sprzątanie po remoncie") }
];
export const AREAS = [30, 50, 70, 90];
/** Estimated price: rate per m², minimum 150 zł */
const priceOf = (s: { type: string; area: number }) => Math.max(150, CTYPES.find(x => x.id === s.type)!.rate * s.area);

export default makeSite({
  url: "czystykat-demo.pl", logo: "CzystyKąt", brand: "#1F4E79", soft: "#EAF1F8",
  initial: { type: "std", area: 50 },
  foot: T("Вроцлав и окрестности. Ежедневно 8:00–20:00", "Вроцлав та околиці. Щодня 8:00–20:00", "Wrocław i okolice. Codziennie 8:00–20:00"),
  act(a: string, v = "") {
    if (a === "type") { this.s.type = v; this.go("home"); }
    if (a === "area") { this.s.area = +v; this.go("home"); }
    if (a === "form") this.go("form");
    if (a === "send") this.go("sent");
  },
  view() {
    const S = (o: Text) => this.S(o), s = this.s, ty = CTYPES.find(x => x.id === s.type)!;
    if (this.scr === "home") return { html: this.shell(`
      <div class="ws-hero"><h4>${S(T("Уборка квартир во Вроцлаве", "Прибирання квартир у Вроцлаві", "Sprzątanie mieszkań we Wrocławiu"))}</h4>
        <p>${S(T("Приезжаем со своими средствами. Выставляем фактуры VAT.", "Приїжджаємо зі своїми засобами. Виставляємо фактури VAT.", "Przyjeżdżamy z własnymi środkami czystości. Wystawiamy faktury VAT."))}</p>
        <p>★ 4,9 Google</p></div>
      <div class="ws-sec"><h5>${S(T("Рассчитайте стоимость", "Розрахуйте вартість", "Oblicz cenę"))}</h5>
        <p class="ws-label">${S(T("Вид уборки", "Вид прибирання", "Rodzaj sprzątania"))}</p>
        <div class="chips">${CTYPES.map(x => `<button type="button" class="chip" data-act="type" data-val="${x.id}" aria-pressed="${x.id === s.type}">${S(x.n)}</button>`).join("")}</div>
        <p class="ws-label">${S(T("Площадь", "Площа", "Metraż"))}</p>
        <div class="chips">${AREAS.map(a => `<button type="button" class="chip" data-act="area" data-val="${a}" aria-pressed="${a === s.area}">${a} m²</button>`).join("")}</div>
        <div class="ws-price"><span>${S(T("Примерная цена", "Орієнтовна ціна", "Szacunkowa cena"))}</span><strong>${money(priceOf(s))}</strong></div>
        <button type="button" class="ws-btn solid" data-act="form">${S(T("Заказать уборку", "Замовити прибирання", "Zamów sprzątanie"))}</button></div>
      <div class="ws-sec"><h5>${S(T("Как это работает", "Як це працює", "Jak to działa"))}</h5><ol class="ws-steps">
        <li>${S(T("Оставляете заявку", "Залишаєте заявку", "Zostawiasz zgłoszenie"))}</li>
        <li>${S(T("Перезваниваем за 15 минут", "Передзвонюємо за 15 хвилин", "Oddzwaniamy w 15 minut"))}</li>
        <li>${S(T("Приезжаем в удобное время", "Приїжджаємо у зручний час", "Przyjeżdżamy w dogodnym terminie"))}</li></ol></div>`) };
    if (this.scr === "form") return { html: this.shell(`
      <div class="ws-sec" style="border-top:0"><h5>${S(T("Оставьте номер, перезвоним", "Залиште номер, передзвонимо", "Zostaw numer, oddzwonimy"))}</h5>
        <div class="ws-card">${S(ty.full)}, ${s.area} m², ~${money(priceOf(s))}</div>
        ${formFields(S, S(ANNA))}
        <button type="button" class="ws-btn solid" data-act="send">${S(T("Отправить заявку", "Надіслати заявку", "Wyślij zgłoszenie"))}</button>
        <button type="button" class="ws-link" data-act="home">${S(BACK)}</button></div>`) };
    return { html: this.shell(`<div class="ws-ok"><div class="mark">✓</div><h4>${S(T("Спасибо!", "Дякуємо!", "Dziękujemy!"))}</h4>
      <p>${S(T("Перезвоним в течение 15 минут.", "Передзвонимо протягом 15 хвилин.", "Oddzwonimy w ciągu 15 minut."))}</p>
      ${ownerCard(`${t(ANNA)}, +48 600 000 000\n${t(ty.full)}, ${s.area} m², ~${money(priceOf(s))}`)}
      <button type="button" class="ws-btn solid" data-act="home">${S(TO_HOME)}</button></div>`) };
  }
});
