import { T } from "../i18n";

/** Sample of the free review shown next to the final call: what the owner gets. lvl = how serious (bad / warn). */
export const REVIEW = {
  tag: T("Пример", "Приклад", "Przykład"),
  title: T("Разбор: Fade Barber, Wrocław", "Розбір: Fade Barber, Wrocław", "Analiza: Fade Barber, Wrocław"),
  fixLabel: T("Что сделать:", "Що зробити:", "Co zrobić:"),
  items: [
    { lvl: "bad",
      h: T("Нет онлайн-записи", "Немає онлайн-запису", "Brak rezerwacji online"),
      why: T("Клиенты пишут вечером и ждут ответа до утра.", "Клієнти пишуть увечері й чекають відповіді до ранку.", "Klienci piszą wieczorem i czekają na odpowiedź do rana."),
      fix: T("Запись на сайте 24/7", "Запис на сайті 24/7", "Rezerwacja na stronie 24/7") },
    { lvl: "warn",
      h: T("Цен нет на виду", "Цін не видно", "Cen nie widać"),
      why: T("Вопросы «сколько стоит?» отнимают время в директе.", "Питання «скільки коштує?» забирають час у директі.", "Pytania „ile to kosztuje?” zabierają czas w wiadomościach."),
      fix: T("Цены на первом экране", "Ціни на першому екрані", "Cennik na pierwszym ekranie") },
    { lvl: "bad",
      h: T("Профиль в Google без сайта", "Профіль у Google без сайту", "Profil w Google bez strony"),
      why: T("Поляки находят вас, но не могут записаться.", "Поляки знаходять вас, але не можуть записатися.", "Polscy klienci Cię znajdują, ale nie mogą się zapisać."),
      fix: T("Связать профиль с сайтом", "Пов’язати профіль із сайтом", "Połączyć profil ze stroną") }
  ],
  note: T("Ваш разбор будет про ваш бизнес и придёт в Telegram или WhatsApp.", "Ваш розбір буде про ваш бізнес і прийде в Telegram чи WhatsApp.", "Twoja analiza będzie dotyczyć Twojej firmy i przyjdzie na Telegram lub WhatsApp.")
};
