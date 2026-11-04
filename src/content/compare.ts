import { T } from "../i18n";

// "Why not an agency, a freelancer or Wix?": honest differences, no made-up figures about others.
// cells = [agency, freelancer, Wix, me]; {from} = the lowest one-off price in the price list.

export const COMPARE_COLS = [
  T("Агентство", "Агенція", "Agencja"),
  T("Фрилансер с биржи", "Фрилансер з біржі", "Freelancer z giełdy"),
  T("Wix или конструктор", "Wix чи конструктор", "Wix lub kreator"),
  T("Со мной", "Зі мною", "Ze mną")
];

export const COMPARE_ROWS = [
  { h: T("Цена", "Ціна", "Cena"), cells: [
    T("Высокая", "Висока", "Wysoka"),
    T("Низкая, но качество — лотерея", "Низька, але якість — лотерея", "Niska, ale jakość to loteria"),
    T("Дёшево на старте, но время — ваше", "Дешево на старті, але час — ваш", "Tanio na start, ale to Twój czas"),
    T("От {from}, цену фиксирую заранее", "Від {from}, ціну фіксую заздалегідь", "Od {from}, cena ustalona z góry")] },
  { h: T("Сроки", "Терміни", "Czas"), cells: [
    T("Недели или месяцы", "Тижні або місяці", "Tygodnie lub miesiące"),
    T("Как повезёт", "Як пощастить", "Różnie"),
    T("Сами, по вечерам", "Самі, вечорами", "Samodzielnie, po godzinach"),
    T("Первая версия за 3–7 дней", "Перша версія за 3–7 днів", "Pierwsza wersja w 3–7 dni")] },
  { h: T("Язык общения", "Мова спілкування", "Język rozmowy"), cells: [
    T("Польский или английский", "Польська чи англійська", "Polski lub angielski"),
    T("Какой попадётся", "Яка трапиться", "Zależy od osoby"),
    T("Разбираетесь сами", "Розбираєтеся самі", "Radzisz sobie samodzielnie"),
    T("Русский или украинский, без технических слов", "Українська чи російська, без технічних слів", "Ukraiński, rosyjski lub angielski, bez żargonu")] },
  { h: T("Запись, калькулятор, бот", "Запис, калькулятор, бот", "Rezerwacje, kalkulator, bot"), cells: [
    T("Да, за доплату", "Так, за доплату", "Tak, za dopłatą"),
    T("Зависит от исполнителя", "Залежить від виконавця", "Zależy od wykonawcy"),
    T("Шаблоны с ограничениями", "Шаблони з обмеженнями", "Szablony z ograniczeniami"),
    T("Под ваш бизнес, на сайте и в Telegram", "Під ваш бізнес, на сайті й у Telegram", "Pod Twoją firmę, na stronie i w Telegramie")] },
  { h: T("Кому принадлежит сайт", "Кому належить сайт", "Do kogo należy strona"), cells: [
    T("Как записано в договоре", "Як записано в договорі", "Jak zapisano w umowie"),
    T("Как договоритесь", "Як домовитеся", "Jak się umówicie"),
    T("Живёт только на платформе", "Живе лише на платформі", "Działa tylko na platformie"),
    T("Вам: домен на ваше имя, доступы ваши", "Вам: домен на ваше ім’я, доступи ваші", "Tobie: domena na Ciebie, dostępy Twoje")] },
  { h: T("Если что-то сломалось", "Якщо щось зламалося", "Gdy coś się zepsuje"), cells: [
    T("Заявка в поддержку", "Заявка в підтримку", "Zgłoszenie do supportu"),
    T("Может уже не ответить", "Може вже не відповісти", "Może już nie odpisać"),
    T("Чините сами", "Лагодите самі", "Naprawiasz samodzielnie"),
    T("Пишете мне в Telegram", "Пишете мені в Telegram", "Piszesz do mnie na Telegramie")] }
];
