import { T, t, money } from "../../i18n";
import { makeChat, makeScreens, type ChatButton } from "../../core/engines";
import { appTop, row, BACK, HOME } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES, ageL, seatsL,
} from "../../content/shared";
import { getLang } from "../../i18n";

/* Parcels bot */
export const SEND = T("📦 Отправить посылку", "📦 Відправити посилку", "📦 Nadaj paczkę");
export default makeChat({
  name: T("Посылки Варшава–Киев", "Посилки Варшава–Київ", "Paczki Warszawa–Kijów"),
  nodes: {
    start: {
      bot: () => [T("Здравствуйте! Помогу отправить посылку или узнать, где она сейчас.", "Вітаю! Допоможу відправити посилку або дізнатися, де вона зараз.", "Dzień dobry! Pomogę nadać paczkę albo sprawdzić, gdzie teraz jest.")],
      buttons: () => [
        { label: SEND, next: "city" },
        { label: T("🔎 Где моя посылка?", "🔎 Де моя посилка?", "🔎 Gdzie jest moja paczka?"), next: "track" },
        { label: T("🗓 Расписание рейсов", "🗓 Розклад рейсів", "🗓 Rozkład kursów"), next: "schedule" }
      ]
    },
    city: { bot: () => [T("Откуда забрать посылку?", "Звідки забрати посилку?", "Skąd odebrać paczkę?")], buttons: () => CITIES.map((c, i) => ({ label: c, next: "weight", set: { city: i } })) },
    weight: { bot: () => [T("Примерный вес?", "Приблизна вага?", "Przybliżona waga?")], buttons: () => WEIGHTS.map((w, i) => ({ label: w, next: "quote", set: { w: i } })) },
    quote: {
      bot: s => [T(
        `Город: ${CITIES[s.city].ru}\nВес: ${WEIGHTS[s.w].ru}\nСтоимость: ${money(WPRICE[s.w])}\n\nБлижайший рейс — в пятницу. Водитель заберёт посылку по вашему адресу.`,
        `Місто: ${CITIES[s.city].uk}\nВага: ${WEIGHTS[s.w].uk}\nВартість: ${money(WPRICE[s.w])}\n\nНайближчий рейс — у п’ятницю. Водій забере посилку за вашою адресою.`,
        `Miasto: ${CITIES[s.city].pl}\nWaga: ${WEIGHTS[s.w].pl}\nCena: ${money(WPRICE[s.w])}\n\nNajbliższy kurs — w piątek. Kierowca odbierze paczkę spod Twojego adresu.`)],
      buttons: () => [{ label: T("✅ Оформить", "✅ Оформити", "✅ Zamów"), next: "done", primary: true }, { label: HOME, next: "start" }]
    },
    done: {
      bot: () => [T("Готово! Номер отправления: UA-48213.\nПришлю уведомление, когда посылка пересечёт границу и когда её доставят.",
                    "Готово! Номер відправлення: UA-48213.\nНадішлю сповіщення, коли посилка перетне кордон і коли її доставлять.",
                    "Gotowe! Numer przesyłki: UA-48213.\nWyślę powiadomienie, gdy paczka przekroczy granicę i gdy zostanie doręczona.")],
      buttons: () => [{ label: T("🔎 Отследить", "🔎 Відстежити", "🔎 Śledź"), next: "status" }, { label: HOME, next: "start" }]
    },
    track: { bot: () => [T("Выберите отправление:", "Оберіть відправлення:", "Wybierz przesyłkę:")], buttons: () => [{ label: "UA-48213", next: "status" }, { label: HOME, next: "start" }] },
    status: {
      bot: () => [T("UA-48213\n✅ Забрана в Варшаве — пн, 10:40\n✅ Пересекла границу — вт, 06:15\n🚚 Едет в Киев\n\nОжидаемая доставка: среда, до 18:00",
                    "UA-48213\n✅ Забрана у Варшаві — пн, 10:40\n✅ Перетнула кордон — вт, 06:15\n🚚 Їде до Києва\n\nОчікувана доставка: середа, до 18:00",
                    "UA-48213\n✅ Odebrana w Warszawie — pon., 10:40\n✅ Przekroczyła granicę — wt., 06:15\n🚚 W drodze do Kijowa\n\nPrzewidywane doręczenie: środa, do 18:00")],
      buttons: () => [{ label: HOME, next: "start" }]
    },
    schedule: {
      bot: () => [T("Рейсы на этой неделе:\nВторник — Варшава → Киев\nПятница — Варшава → Львов → Киев\nВоскресенье — Киев → Варшава",
                    "Рейси цього тижня:\nВівторок — Варшава → Київ\nП’ятниця — Варшава → Львів → Київ\nНеділя — Київ → Варшава",
                    "Kursy w tym tygodniu:\nWtorek — Warszawa → Kijów\nPiątek — Warszawa → Lwów → Kijów\nNiedziela — Kijów → Warszawa")],
      buttons: () => [{ label: SEND, next: "city" }, { label: HOME, next: "start" }]
    }
  }
});
