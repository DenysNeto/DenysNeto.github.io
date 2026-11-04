import { T, t, money } from "../../i18n";
import { makeChat, makeScreens, type ChatButton } from "../../core/engines";
import { appTop, row, BACK, HOME } from "../../core/ui";
import {
  SERVICES, MASTERS, SLOTS, TAKEN, TOMORROW, CITIES, WEIGHTS, WPRICE, TIMES, DAYS, CLASSES, ageL, seatsL,
} from "../../content/shared";
import { getLang } from "../../i18n";

/* Legalization bot */
export const BOOK = T("📅 Записаться на консультацию", "📅 Записатися на консультацію", "📅 Umów konsultację");
export const OTHER = T("Другой вопрос", "Інше питання", "Inny temat");
export const followUp = (): ChatButton[] => [{ label: BOOK, next: "book", primary: true }, { label: OTHER, next: "start" }];
export default makeChat({
  name: T("Biuro Legalizacji Pobytu", "Biuro Legalizacji Pobytu", "Biuro Legalizacji Pobytu"),
  nodes: {
    start: {
      bot: () => [T("Здравствуйте! Выберите вопрос: отвечу сразу, а сложные случаи передам консультанту.",
                    "Вітаю! Оберіть питання: відповім одразу, а складні випадки передам консультанту.",
                    "Dzień dobry! Wybierz temat: odpowiem od razu, a trudniejsze sprawy przekażę konsultantowi.")],
      buttons: () => [
        { label: T("Карта побыту", "Карта побиту", "Karta pobytu"), next: "karta" },
        { label: T("Номер PESEL", "Номер PESEL", "Numer PESEL"), next: "pesel" },
        { label: T("Открыть JDG", "Відкрити JDG", "Założenie JDG"), next: "jdg" },
        { label: BOOK, next: "book" }
      ]
    },
    karta: { bot: () => [T("На каком основании подаётесь?", "На якій підставі подаєтеся?", "Na jakiej podstawie składasz wniosek?")],
             buttons: () => [T("Работа", "Робота", "Praca"), T("Учёба", "Навчання", "Studia"), T("Семья", "Сім’я", "Rodzina")].map(l => ({ label: l, next: "kartaDocs" })) },
    kartaDocs: { bot: () => [T("Подготовлю чек-лист документов под ваше основание, а консультант проверит его вместе с вами. Записать вас?",
                               "Підготую чек-лист документів під вашу підставу, а консультант перевірить його разом із вами. Записати вас?",
                               "Przygotuję listę dokumentów dla Twojej podstawy, a konsultant sprawdzi ją razem z Tobą. Umówić Cię?")], buttons: followUp },
    pesel: { bot: () => [T("Заявление на PESEL подают в ужонд гмины. Подготовим заявление и подскажем, куда обратиться в вашем городе.",
                           "Заяву на PESEL подають до ужонду гміни. Підготуємо заяву й підкажемо, куди звернутися у вашому місті.",
                           "Wniosek o PESEL składa się w urzędzie gminy. Przygotujemy go i podpowiemy, gdzie się zgłosić w Twoim mieście.")], buttons: followUp },
    jdg: { bot: () => [T("Поможем зарегистрировать JDG в CEIDG, выбрать форму налогообложения и подобрать бухгалтера.",
                         "Допоможемо зареєструвати JDG у CEIDG, обрати форму оподаткування та підібрати бухгалтера.",
                         "Pomożemy zarejestrować JDG w CEIDG, wybrać formę opodatkowania i znaleźć księgową.")], buttons: followUp },
    book: { bot: () => [T("Выберите удобное время:", "Оберіть зручний час:", "Wybierz dogodny termin:")], buttons: () => TIMES.map((x, i) => ({ label: x, next: "booked", set: { time: i } })) },
    booked: {
      bot: s => [T(`Вы записаны: ${TIMES[s.time].ru}.\nМожно онлайн или в офисе: ссылку и адрес пришлю за час до встречи.`,
                   `Вас записано: ${TIMES[s.time].uk}.\nМожна онлайн або в офісі: посилання й адресу надішлю за годину до зустрічі.`,
                   `Termin zarezerwowany: ${TIMES[s.time].pl}.\nKonsultacja online lub w biurze: link i adres wyślę godzinę przed spotkaniem.`)],
      buttons: () => [{ label: HOME, next: "start" }]
    }
  }
});
