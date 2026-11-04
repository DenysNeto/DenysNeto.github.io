import { T, t, tl, money, type Lang, type Text } from "../i18n";

/* Data shared by the website demos and the Telegram demos */

export const SERVICES = [
  { id: "cut", n: T("Мужская стрижка", "Чоловіча стрижка", "Strzyżenie męskie"), d: T("45 мин", "45 хв", "45 min"), p: 90 },
  { id: "beard", n: T("Стрижка и борода", "Стрижка та борода", "Strzyżenie i broda"), d: T("1 ч 15 мин", "1 год 15 хв", "1 godz. 15 min"), p: 140 },
  { id: "kid", n: T("Детская стрижка", "Дитяча стрижка", "Strzyżenie dziecięce"), d: T("30 мин", "30 хв", "30 min"), p: 70 }
];
export const MASTERS = [
  { id: "max", n: T("Максим", "Максим", "Maksym"), d: T("Фейды, классика", "Фейди, класика", "Fade, klasyka") },
  { id: "art", n: T("Артём", "Артем", "Artem"), d: T("Бороды, укладки", "Бороди, укладки", "Broda, stylizacja") },
  { id: "any", n: T("Любой свободный", "Будь-хто вільний", "Dowolny wolny"), d: T("Больше свободного времени", "Більше вільного часу", "Więcej wolnych terminów") }
];
export const SLOTS = ["10:00", "11:00", "12:30", "14:00", "15:30", "17:00", "18:15", "19:00"], TAKEN = ["12:30", "17:00"];
export const TOMORROW = T("Завтра", "Завтра", "Jutro");
export const CITIES = [T("Варшава", "Варшава", "Warszawa"), T("Краков", "Краків", "Kraków"), T("Вроцлав", "Вроцлав", "Wrocław")];
export const WEIGHTS = [T("до 5 кг", "до 5 кг", "do 5 kg"), T("5–15 кг", "5–15 кг", "5–15 kg"), T("15–30 кг", "15–30 кг", "15–30 kg")];
export const WPRICE = [60, 110, 170];
export const TIMES = [T("пн, 10:00", "пн, 10:00", "pon., 10:00"), T("вт, 14:30", "вт, 14:30", "wt., 14:30"), T("ср, 17:00", "ср, 17:00", "śr., 17:00")];
export const DAYS = [
  { id: "mon", s: T("Пн", "Пн", "Pon."), f: T("Понедельник", "Понеділок", "Poniedziałek") },
  { id: "wed", s: T("Ср", "Ср", "Śr."), f: T("Среда", "Середа", "Środa") },
  { id: "fri", s: T("Пт", "Пт", "Pt."), f: T("Пятница", "П’ятниця", "Piątek") }
];
export const ROBO = T("Робототехника", "Робототехніка", "Robotyka");
export const CLASSES = [
  { id: "r1", day: "mon", time: "16:00", n: ROBO, age: "7–10", seats: 3 },
  { id: "e1", day: "mon", time: "17:30", n: T("Английский", "Англійська", "Angielski"), age: "5–7", seats: 0 },
  { id: "a1", day: "wed", time: "15:30", n: T("Рисование", "Малювання", "Rysunek"), age: "5–8", seats: 5 },
  { id: "c1", day: "wed", time: "17:00", n: T("Шахматы", "Шахи", "Szachy"), age: "6–12", seats: 2 },
  { id: "r2", day: "fri", time: "16:00", n: ROBO, age: "7–10", seats: 1 },
  { id: "p1", day: "fri", time: "18:00", n: T("Польский для детей", "Польська для дітей", "Polski dla dzieci"), age: "8–12", seats: 4 }
];
export const ageL = (a: string, L: Lang) => tl(T(`${a} лет`, `${a} років`, `${a} lat`), L);
export const seatsL = (n: number, L: Lang) => n ? tl(T(`Мест: ${n}`, `Місць: ${n}`, `Wolne miejsca: ${n}`), L) : tl(T("Мест нет", "Місць немає", "Brak miejsc"), L);
export const OWNER_CAP = T("Так заявка выглядит у владельца в Telegram:", "Так заявка виглядає у власника в Telegram:", "Tak zgłoszenie widzi właściciel w Telegramie:");
export const NEW_LEAD = T("Новая заявка с сайта", "Нова заявка з сайту", "Nowe zgłoszenie ze strony");
export const ANNA = T("Анна", "Анна", "Anna");
export const NAME = T("Имя", "Ім’я", "Imię"), PHONE = T("Телефон", "Телефон", "Telefon");
export const TO_HOME = T("На главную", "На головну", "Strona główna");
export const ownerCard = (lines: string) => `<div class="owner"><small>${t(OWNER_CAP)}</small><div class="bub">🔔 ${t(NEW_LEAD)}\n${lines}</div></div>`;
export const formFields = (S: (o: Text) => string, name: string) => `<label>${S(NAME)}</label><input value="${name}" readonly><label>${S(PHONE)}</label><input value="+48 600 000 000" readonly>`;
