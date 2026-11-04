import { T, type L10n } from "../i18n";
import { PRICES, type Price } from "./prices";

/** Ready-made sets for owners who don't know where to start: items from the price list, a little cheaper together.
 *  Package prices are placeholders (03.11.2026), to be adjusted by the owner. */
export interface Package {
  n: L10n;
  /** What the owner gets */
  r: L10n;
  /** One site and the extras, all from the price list */
  items: Price[];
  /** Package price "from", zł; the price of the items one by one is counted from the price list */
  p: number;
  rec?: boolean;
}

const item = (ru: string): Price => PRICES.find(p => p.n.ru === ru)!;

export const PACKAGES: Package[] = [
  { n: T("Старт", "Старт", "Start"), r: T("Быстро появиться в интернете", "Швидко з’явитися в інтернеті", "Szybko pojawić się w internecie"),
    items: ["Лендинг для заявок", "Тексты для сайта", "Профиль в Google Картах", "Юридические страницы и cookies"].map(item), p: 2500 },
  { n: T("Клиенты из Google", "Клієнти з Google", "Klienci z Google"), r: T("Чтобы вас находили и писали", "Щоб вас знаходили й писали", "Żeby klienci Cię znajdowali i pisali"),
    items: ["Сайт компании", "SEO-оптимизация", "Профиль в Google Картах", "Настройка рекламы в Google Ads", "Юридические страницы и cookies"].map(item), p: 4400, rec: true },
  { n: T("Запись и оплата", "Запис і оплата", "Rezerwacje i płatności"), r: T("Клиенты записываются и платят сами", "Клієнти записуються й платять самі", "Klienci sami się zapisują i płacą"),
    items: ["Сайт с записью или калькулятором", "Оплата с записью или заказом", "Напоминания о записи", "Профиль в Google Картах", "Юридические страницы и cookies"].map(item), p: 5600 }
];
