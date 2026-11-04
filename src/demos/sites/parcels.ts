import { T, t, money, type Text } from "../../i18n";
import { I } from "../../i18n/strings";
import { makeSite } from "../../core/engines";
import { BACK } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES,
  ageL, seatsL, ANNA, PHONE, TO_HOME, ownerCard, formFields,
} from "../../content/shared";

/* 3. Parcels site: calculator, schedule, tracking */
export default makeSite({
  url: "paczki-pl-ua-demo.pl", logo: "PL⇄UA Express", brand: "#0F766E", soft: "#E7F5F3",
  initial: { city: 0, w: 0 },
  foot: T("Забор посылок по всей Польше. Тел. +48 600 000 000", "Забір посилок по всій Польщі. Тел. +48 600 000 000", "Odbiór paczek w całej Polsce. Tel. +48 600 000 000"),
  act(a: string, v = "") {
    if (a === "city") { this.s.city = +v; this.go("home"); }
    if (a === "w") { this.s.w = +v; this.go("home"); }
    if (a === "order") this.go("order");
    if (a === "send") this.go("done");
    if (a === "track") this.go("track");
  },
  view() {
    const S = (o: Text) => this.S(o), s = this.s, city = CITIES[s.city], w = WEIGHTS[s.w], p = WPRICE[s.w];
    if (this.scr === "home") return { html: this.shell(`
      <div class="ws-hero"><h4>${S(T("Посылки Польша — Украина", "Посилки Польща — Україна", "Paczki Polska — Ukraina"))}</h4>
        <p>${S(T("Забираем от двери. Рейсы три раза в неделю.", "Забираємо від дверей. Рейси тричі на тиждень.", "Odbiór spod drzwi. Kursy trzy razy w tygodniu."))}</p></div>
      <div class="ws-sec"><h5>${S(T("Где моя посылка?", "Де моя посилка?", "Gdzie jest moja paczka?"))}</h5>
        <div class="ws-track"><input value="UA-48213" readonly aria-label="UA-48213"><button type="button" class="ws-btn" data-act="track">${S(T("Найти", "Знайти", "Szukaj"))}</button></div></div>
      <div class="ws-sec"><h5>${S(T("Сколько стоит", "Скільки коштує", "Ile to kosztuje"))}</h5>
        <p class="ws-label">${S(T("Откуда забрать", "Звідки забрати", "Skąd odebrać"))}</p>
        <div class="chips">${CITIES.map((c, i) => `<button type="button" class="chip" data-act="city" data-val="${i}" aria-pressed="${i === s.city}">${S(c)}</button>`).join("")}</div>
        <p class="ws-label">${S(T("Вес", "Вага", "Waga"))}</p>
        <div class="chips">${WEIGHTS.map((x, i) => `<button type="button" class="chip" data-act="w" data-val="${i}" aria-pressed="${i === s.w}">${S(x)}</button>`).join("")}</div>
        <div class="ws-price"><span>${S(T("Стоимость", "Вартість", "Cena"))}</span><strong>${money(p)}</strong></div>
        <button type="button" class="ws-btn solid" data-act="order">${S(T("Заказать забор", "Замовити забір", "Zamów odbiór"))}</button></div>
      <div class="ws-sec"><h5>${S(T("Расписание рейсов", "Розклад рейсів", "Rozkład kursów"))}</h5>
        <div class="ws-row"><span>${S(T("Вторник", "Вівторок", "Wtorek"))}</span><b>${S(T("Варшава → Киев", "Варшава → Київ", "Warszawa → Kijów"))}</b></div>
        <div class="ws-row"><span>${S(T("Пятница", "П’ятниця", "Piątek"))}</span><b>${S(T("Варшава → Львов", "Варшава → Львів", "Warszawa → Lwów"))}</b></div>
        <div class="ws-row"><span>${S(T("Воскресенье", "Неділя", "Niedziela"))}</span><b>${S(T("Киев → Варшава", "Київ → Варшава", "Kijów → Warszawa"))}</b></div></div>`) };
    if (this.scr === "track") return { html: this.shell(`
      <div class="ws-sec" style="border-top:0"><h5>UA-48213</h5><ul class="ws-timeline">
        <li>${S(T("Забрана в Варшаве", "Забрана у Варшаві", "Odebrana w Warszawie"))}<small>${S(T("пн, 10:40", "пн, 10:40", "pon., 10:40"))}</small></li>
        <li>${S(T("Пересекла границу", "Перетнула кордон", "Przekroczyła granicę"))}<small>${S(T("вт, 06:15", "вт, 06:15", "wt., 06:15"))}</small></li>
        <li class="next">${S(T("Доставка в Киеве", "Доставка у Києві", "Doręczenie w Kijowie"))}<small>${S(T("ожидается в среду до 18:00", "очікується в середу до 18:00", "planowane w środę do 18:00"))}</small></li></ul>
        <button type="button" class="ws-link" data-act="home">${S(BACK)}</button></div>`) };
    if (this.scr === "order") return { html: this.shell(`
      <div class="ws-sec" style="border-top:0"><h5>${S(T("Заявка на забор посылки", "Заявка на забір посилки", "Zamówienie odbioru paczki"))}</h5>
        <div class="ws-card">${S(city)}, ${S(w)}, ${money(p)}</div>
        ${formFields(S, S(T("Олег", "Олег", "Oleh")))}
        <button type="button" class="ws-btn solid" data-act="send">${S(T("Отправить заявку", "Надіслати заявку", "Wyślij zgłoszenie"))}</button>
        <button type="button" class="ws-link" data-act="home">${S(BACK)}</button></div>`) };
    return { html: this.shell(`<div class="ws-ok"><div class="mark">✓</div><h4>${S(T("Заявка принята", "Заявку прийнято", "Zgłoszenie przyjęte"))}</h4>
      <p>${S(T("Водитель позвонит накануне рейса.", "Водій зателефонує напередодні рейсу.", "Kierowca zadzwoni dzień przed kursem."))}</p>
      ${ownerCard(`${t(T("Олег", "Олег", "Oleh"))}, +48 600 000 000\n${t(city)}, ${t(w)}, ${money(p)}`)}
      <button type="button" class="ws-btn solid" data-act="home">${S(TO_HOME)}</button></div>`) };
  }
});
