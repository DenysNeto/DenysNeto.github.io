import { T, type L10n } from "../i18n";

// The brief a client fills in before I build their site. Answers are sent to me in Russian (tl(…, "ru")),
// whatever language the client filled it in. Options are kept as indexes, so a draft survives a language switch.
// Only how to reach the client is required: the rest is for those who have 5 more minutes, or 30.

export type Field =
  | { k: string; type: "text" | "textarea" | "url"; label: L10n; hint?: L10n; ph?: L10n; req?: true }
  | { k: string; type: "chips"; multi: boolean; label: L10n; hint?: L10n; options: L10n[]; other?: L10n }
  | { k: string; type: "moods" | "palette" | "fonts" | "files" | "refs"; label: L10n; hint?: L10n };

export interface Section {
  id: string;
  h: L10n;
  /** How long it takes, shown in the section map and the section head */
  /** A short explanation at the top of the open section */
  desc?: L10n;
  /** The style section: a phone beside the fields shows the picks as a rough site */
  preview?: true;
  fields: Field[];
}

/** Colour sets by role, so the phone preview knows what is background, accent and text: c = [background, accent, second, text] */
export const PALETTES: { n: L10n; c: string[] }[] = [
  { n: T("Пастель", "Пастель", "Pastele"), c: ["#FBF3F8", "#B9A3F2", "#F5B3CE", "#2B2540"] },
  { n: T("Тёплый беж", "Теплий беж", "Ciepły beż"), c: ["#F4EDE4", "#C8A27A", "#6B4F3A", "#1F1A17"] },
  { n: T("Свежий зелёный", "Свіжий зелений", "Świeża zieleń"), c: ["#EEF7F1", "#3FA66B", "#1E5B3A", "#14211A"] },
  { n: T("Морской", "Морський", "Morski"), c: ["#EEF4FB", "#2F7DD1", "#0F3B66", "#0B1B2B"] },
  { n: T("Чёрный и золото", "Чорний і золото", "Czerń i złoto"), c: ["#121212", "#C9A45C", "#2A2723", "#F2EDE4"] },
  { n: T("Яркий", "Яскравий", "Jaskrawy"), c: ["#FFF8E7", "#FF5A5F", "#3EC1D3", "#1B1B3A"] },
  { n: T("Чёрно-белый", "Чорно-білий", "Czerń i biel"), c: ["#F6F6F3", "#111111", "#D9D9D4", "#111111"] }
];

/** Popular Google Fonts that have Cyrillic and Polish letters, by kind (g). w = the heading weight the family has
 *  (one combined request fails if any weight is missing). Loaded only when the style section is opened, and only the letters of the samples */
export const FONT_KINDS: L10n[] = [T("Без засечек", "Без засічок", "Bezszeryfowe"), T("С засечками", "Із засічками", "Szeryfowe"), T("Яркие", "Яскраві", "Wyraziste")];
export const FONTS: { f: string; n: L10n; g: number; w: number }[] = [
  { f: "Geologica", g: 0, w: 600, n: T("Современный, мягкий", "Сучасний, м’який", "Nowoczesny, miękki") },
  { f: "Inter", g: 0, w: 600, n: T("Нейтральный, универсальный", "Нейтральний, універсальний", "Neutralny, uniwersalny") },
  { f: "Roboto", g: 0, w: 600, n: T("Привычный, как в Android", "Звичний, як в Android", "Znajomy, jak w Androidzie") },
  { f: "Open Sans", g: 0, w: 600, n: T("Дружелюбный, легко читается", "Дружній, легко читається", "Przyjazny, łatwy w czytaniu") },
  { f: "Montserrat", g: 0, w: 600, n: T("Уверенный, геометричный", "Впевнений, геометричний", "Pewny, geometryczny") },
  { f: "Manrope", g: 0, w: 600, n: T("Строгий, деловой", "Строгий, діловий", "Rzeczowy, biznesowy") },
  { f: "Rubik", g: 0, w: 600, n: T("Мягкий, слегка скруглённый", "М’який, трохи заокруглений", "Miękki, lekko zaokrąglony") },
  { f: "Nunito", g: 0, w: 700, n: T("Круглый, приветливый", "Круглий, привітний", "Okrągły, przyjazny") },
  { f: "Raleway", g: 0, w: 600, n: T("Лёгкий, элегантный", "Легкий, елегантний", "Lekki, elegancki") },
  { f: "Onest", g: 0, w: 600, n: T("Чистый, современный", "Чистий, сучасний", "Czysty, nowoczesny") },
  { f: "Golos Text", g: 0, w: 600, n: T("Спокойный, хорошо читается", "Спокійний, добре читається", "Spokojny, czytelny") },
  { f: "Playfair Display", g: 1, w: 600, n: T("Элегантный, контрастный", "Елегантний, контрастний", "Elegancki, kontrastowy") },
  { f: "Lora", g: 1, w: 600, n: T("Тёплый, книжный", "Теплий, книжковий", "Ciepły, książkowy") },
  { f: "Merriweather", g: 1, w: 700, n: T("Надёжный, газетный", "Надійний, газетний", "Solidny, gazetowy") },
  { f: "PT Serif", g: 1, w: 700, n: T("Классический, деловой", "Класичний, діловий", "Klasyczny, biznesowy") },
  { f: "Cormorant Garamond", g: 1, w: 600, n: T("Изысканный, тонкий", "Вишуканий, тонкий", "Wyrafinowany, smukły") },
  { f: "EB Garamond", g: 1, w: 600, n: T("Старинный, благородный", "Старовинний, шляхетний", "Klasyczny, szlachetny") },
  { f: "Unbounded", g: 2, w: 600, n: T("Широкий, заметный", "Широкий, помітний", "Szeroki, wyrazisty") },
  { f: "Oswald", g: 2, w: 600, n: T("Узкий, плакатный", "Вузький, плакатний", "Wąski, plakatowy") },
  { f: "Comfortaa", g: 2, w: 700, n: T("Округлый, игривый", "Округлий, грайливий", "Zaokrąglony, zabawny") }
];
/** A font by family name, for the moods below */
const font = (f: string): number => FONTS.findIndex(x => x.f === f);

/** How the site should feel, shown as small samples. pal and font are what the phone preview uses until the client picks colours
 *  or a font; r = corner radius, the rest is drawn by brief.css per mood (data-mood) */
/** Each mood with the kinds of sites it suits, shown as small badges */
export const MOODS: { n: L10n; d: L10n; for: L10n[]; pal: number; font: number; r: number }[] = [
  { n: T("Строгий", "Строгий", "Poważny"), d: T("Чёткие линии и спокойные цвета", "Чіткі лінії та спокійні кольори", "Wyraźne linie i spokojne kolory"),
    for: [T("Юристы", "Юристи", "Prawnicy"), T("Бухгалтерия", "Бухгалтерія", "Księgowość"), T("Клиники", "Клініки", "Kliniki")], pal: 3, font: font("Manrope"), r: 6 },
  { n: T("Тёплый", "Теплий", "Ciepły"), d: T("Мягкие формы и уютные оттенки", "М’які форми й затишні відтінки", "Miękkie kształty i przytulne barwy"),
    for: [T("Кафе", "Кафе", "Kawiarnie"), T("Салоны", "Салони", "Salony"), T("Пекарни", "Пекарні", "Piekarnie")], pal: 1, font: font("Lora"), r: 18 },
  { n: T("Яркий", "Яскравий", "Jaskrawy"), d: T("Смелые цвета и крупные заголовки, чтобы запомниться", "Сміливі кольори й великі заголовки, щоб запам’ятатися", "Odważne kolory i duże nagłówki, żeby zapaść w pamięć"),
    for: [T("Фитнес", "Фітнес", "Fitness"), T("Ивенты", "Івенти", "Eventy"), T("Магазины", "Магазини", "Sklepy")], pal: 5, font: font("Unbounded"), r: 14 },
  { n: T("Минималистичный", "Мінімалістичний", "Minimalistyczny"), d: T("Много воздуха, мало цвета, ничего лишнего", "Багато повітря, мало кольору, нічого зайвого", "Dużo przestrzeni, mało koloru, nic zbędnego"),
    for: [T("Архитекторы", "Архітектори", "Architekci"), T("Фотографы", "Фотографи", "Fotografowie"), T("IT", "IT", "IT")], pal: 6, font: font("Inter"), r: 0 },
  { n: T("Премиальный", "Преміальний", "Premium"), d: T("Тёмный фон, золото и засечки, как у дорогих брендов", "Темне тло, золото й засічки, як у дорогих брендів", "Ciemne tło, złoto i szeryfy, jak u drogich marek"),
    for: [T("Рестораны", "Ресторани", "Restauracje"), T("Ювелирка", "Ювелірка", "Biżuteria"), T("Недвижимость", "Нерухомість", "Nieruchomości")], pal: 4, font: font("Cormorant Garamond"), r: 2 },
  { n: T("Игривый", "Грайливий", "Na luzie"), d: T("Круглые формы и пастель, легко и дружелюбно", "Круглі форми й пастель, легко й дружньо", "Okrągłe kształty i pastele, lekko i przyjaźnie"),
    for: [T("Для детей", "Для дітей", "Dla dzieci"), T("Кондитерские", "Кондитерські", "Cukiernie"), T("Груминг", "Грумінг", "Groomerzy")], pal: 0, font: font("Comfortaa"), r: 26 }
];

export const MAX_REFS = 10;

export const SECTIONS: Section[] = [
  { id: "you", h: T("Контакты", "Контакти", "Kontakt"), fields: [
    { k: "name", type: "text", req: true, label: T("Как вас зовут", "Як вас звати", "Imię") },
    { k: "contact", type: "text", req: true, label: T("Telegram, WhatsApp или телефон", "Telegram, WhatsApp або телефон", "Telegram, WhatsApp lub telefon"), ph: T("@username или +48…", "@username або +48…", "@username lub +48…") },
    { k: "channel", type: "chips", multi: false, label: T("Где удобнее общаться", "Де зручніше спілкуватися", "Gdzie wygodniej rozmawiać"), options: [
      T("Telegram", "Telegram", "Telegram"), T("WhatsApp", "WhatsApp", "WhatsApp"), T("Звонок", "Дзвінок", "Telefon"), T("E-mail", "E-mail", "E-mail")] }
  ] },
  { id: "biz", h: T("О бизнесе", "Про бізнес", "O firmie"), fields: [
    { k: "business", type: "textarea", label: T("Чем вы занимаетесь", "Чим ви займаєтеся", "Czym się zajmujesz"),
      ph: T("Например: барбершоп во Вроцлаве, 3 мастера", "Наприклад: барбершоп у Вроцлаві, 3 майстри", "Np. barber we Wrocławiu, 3 fryzjerów") },
    { k: "ig", type: "text", label: T("Instagram", "Instagram", "Instagram"), ph: T("@ваш_профиль", "@ваш_профіль", "@twoj_profil") },
    { k: "site", type: "url", label: T("Сайт", "Сайт", "Strona"), ph: T("https://", "https://", "https://") },
    { k: "gmap", type: "url", label: T("Профиль в Google Картах", "Профіль у Google Картах", "Profil w Mapach Google"), ph: T("Ссылка на профиль", "Посилання на профіль", "Link do profilu") },
    { k: "edge", type: "textarea", label: T("Почему клиенты выбирают вас", "Чому клієнти обирають вас", "Dlaczego klienci wybierają Ciebie"),
      ph: T("Цены, скорость, опыт, говорите на их языке…", "Ціни, швидкість, досвід, говорите їхньою мовою…", "Ceny, szybkość, doświadczenie, mówisz w ich języku…") }
  ] },
  { id: "need", h: T("Ваш проект", "Ваш проєкт", "Twój projekt"), fields: [
    { k: "kind", type: "chips", multi: false, label: T("Что делаем", "Що робимо", "Co robimy"), options: [
      T("Лендинг", "Лендинг", "Landing page"), T("Сайт компании", "Сайт компанії", "Strona firmowa"),
      T("Сайт с записью или калькулятором", "Сайт із записом чи калькулятором", "Strona z rezerwacją lub kalkulatorem"),
      T("Telegram-бот", "Telegram-бот", "Bot w Telegramie"), T("Мини-приложение в Telegram", "Міні-застосунок у Telegram", "Mini aplikacja w Telegramie"),
      T("Помогите выбрать", "Допоможіть обрати", "Pomóż mi wybrać")] },
    { k: "goals", type: "chips", multi: true, label: T("Что сайт будет уметь", "Що сайт вмітиме", "Co strona będzie umieć"), options: [
      T("Принимать записи", "Приймати записи", "Przyjmować rezerwacje"), T("Собирать заявки", "Збирати заявки", "Zbierać zgłoszenia"),
      T("Показывать цены", "Показувати ціни", "Pokazywać ceny"), T("Считать стоимость", "Рахувати вартість", "Wyliczać koszt"),
      T("Показывать работы", "Показувати роботи", "Pokazywać realizacje"), T("Отзывы", "Відгуки", "Opinie"),
      T("Карта и контакты", "Карта й контакти", "Mapa i kontakt"), T("Приём оплаты", "Прийом оплати", "Płatności online")],
      other: T("Что-то ещё? Напишите своими словами", "Щось ще? Напишіть своїми словами", "Coś jeszcze? Napisz własnymi słowami") },
    { k: "pages", type: "chips", multi: true, label: T("Какие разделы нужны", "Які розділи потрібні", "Jakie sekcje są potrzebne"), hint: T("Если не уверены, пропустите: предложу сам", "Якщо не впевнені, пропустіть: запропоную сам", "Jeśli nie wiesz, pomiń: zaproponuję"), options: [
      T("Услуги", "Послуги", "Usługi"), T("Цены", "Ціни", "Cennik"), T("Работы", "Роботи", "Realizacje"), T("О нас", "Про нас", "O nas"),
      T("Команда", "Команда", "Zespół"), T("Отзывы", "Відгуки", "Opinie"), T("Частые вопросы", "Часті питання", "FAQ"), T("Блог", "Блог", "Blog"), T("Контакты", "Контакти", "Kontakt")],
      other: T("Другой раздел? Напишите какой", "Інший розділ? Напишіть який", "Inna sekcja? Napisz jaka") },
    { k: "langs", type: "chips", multi: true, label: T("Языки сайта", "Мови сайту", "Języki strony"), options: [
      T("Польский", "Польська", "Polski"), T("Украинский", "Українська", "Ukraiński"), T("Русский", "Російська", "Rosyjski"), T("Английский", "Англійська", "Angielski")],
      other: T("Другой язык? Напишите какой", "Інша мова? Напишіть яка", "Inny język? Napisz jaki") }
  ] },
  { id: "look", h: T("Стиль", "Стиль", "Styl"), preview: true,
    desc: T("Выберите настроение: телефон покажет, как примерно может выглядеть сайт. Цвета и шрифт можно поменять отдельно.",
      "Оберіть настрій: телефон покаже, як приблизно може виглядати сайт. Кольори й шрифт можна змінити окремо.",
      "Wybierz nastrój: telefon pokaże, jak mniej więcej może wyglądać strona. Kolory i czcionkę możesz zmienić osobno."), fields: [
    { k: "mood", type: "moods", label: T("Какое настроение ближе", "Який настрій ближчий", "Jaki nastrój jest bliższy") },
    { k: "palette", type: "palette", label: T("Цвета", "Кольори", "Kolory") },
    { k: "fonts", type: "fonts", label: T("Шрифт заголовков", "Шрифт заголовків", "Czcionka nagłówków") },
    { k: "styleNote", type: "textarea", label: T("Что ещё важно в стиле", "Що ще важливо в стилі", "Co jeszcze jest ważne w stylu"),
      ph: T("Фирменный цвет, логотип, «только не розовый»…", "Фірмовий колір, логотип, «тільки не рожевий»…", "Kolor firmowy, logo, „tylko nie różowy”…") }
  ] },
  { id: "refs", h: T("Референсы", "Референси", "Inspiracje"),
    desc: T("Референсы — примеры, которые показывают ваш вкус. Подойдёт что угодно: сайты, страницы в Instagram, скриншоты, фото интерьера или упаковки, и не обязательно из вашей сферы. Чем точнее подпишете, что нравится, тем меньше правок потом.",
      "Референси — приклади, які показують ваш смак. Підійде будь-що: сайти, сторінки в Instagram, скриншоти, фото інтер’єру чи упаковки, і не обов’язково з вашої сфери. Що точніше підпишете, що подобається, то менше правок потім.",
      "Inspiracje to przykłady, które pokazują Twój gust. Pasuje wszystko: strony, profile na Instagramie, zrzuty ekranu, zdjęcia wnętrz czy opakowań, niekoniecznie z Twojej branży. Im dokładniej opiszesz, co Ci się podoba, tym mniej poprawek później."), fields: [
    { k: "refs", type: "refs", label: T("Сайты, которые нравятся, не нравятся, или сайты конкурентов", "Сайти, які подобаються, не подобаються, або сайти конкурентів", "Strony, które Ci się podobają, nie podobają lub strony konkurencji"),
      hint: T("Ссылка и пара слов, что именно: цвета, меню, фото, как устроена запись", "Посилання й пара слів, що саме: кольори, меню, фото, як влаштований запис", "Link i kilka słów, co dokładnie: kolory, menu, zdjęcia, sposób rezerwacji") },
    { k: "refsNote", type: "textarea", label: T("Опишите словами, что нравится", "Опишіть словами, що подобається", "Opisz słowami, co Ci się podoba"),
      hint: T("Если ссылок нет или хочется пояснить", "Якщо посилань немає або хочеться пояснити", "Jeśli nie masz linków albo chcesz coś wyjaśnić"),
      ph: T("Много фото и мало текста, крупные цены, спокойные цвета…", "Багато фото й мало тексту, великі ціни, спокійні кольори…", "Dużo zdjęć i mało tekstu, duże ceny, spokojne kolory…") },
    { k: "files", type: "files", label: T("Картинки и скриншоты", "Картинки й скриншоти", "Obrazy i zrzuty ekranu"), hint: T("Логотип, фото работ, скриншоты из Instagram или Pinterest. До 10 файлов, каждый до 20 МБ", "Логотип, фото робіт, скриншоти з Instagram чи Pinterest. До 10 файлів, кожен до 20 МБ", "Logo, zdjęcia realizacji, zrzuty z Instagrama lub Pinteresta. Do 10 plików, każdy do 20 MB") }
  ] },
  { id: "more", h: T("Детали", "Деталі", "Szczegóły"), fields: [
    { k: "assets", type: "chips", multi: true, label: T("Что у вас уже есть", "Що у вас уже є", "Co już masz"), options: [
      T("Логотип", "Логотип", "Logo"), T("Фото", "Фото", "Zdjęcia"), T("Тексты", "Тексти", "Teksty"), T("Домен", "Домен", "Domena"), T("Ничего, нужна помощь", "Нічого, потрібна допомога", "Nic, potrzebuję pomocy")] },
    { k: "wow", type: "textarea", label: T("Что интересного хотите на сайте", "Що цікавого хочете на сайті", "Co ciekawego chcesz mieć na stronie"), ph: T("Анимация, тест «какая услуга вам подходит», галерея до/после…", "Анімація, тест «яка послуга вам підходить», галерея до/після…", "Animacja, quiz „która usługa jest dla Ciebie”, galeria przed/po…") },
    { k: "no", type: "textarea", label: T("Чего точно не нужно", "Чого точно не треба", "Czego na pewno nie chcesz") },
    { k: "when", type: "chips", multi: false, label: T("Когда нужен сайт", "Коли потрібен сайт", "Na kiedy"), options: [
      T("Как можно скорее", "Якомога швидше", "Jak najszybciej"), T("В течение месяца", "Протягом місяця", "W ciągu miesiąca"), T("Не спешу", "Не поспішаю", "Bez pośpiechu")] },
    { k: "else", type: "textarea", label: T("Что-то ещё", "Щось іще", "Coś jeszcze") }
  ] }
];

export const S = {
  title: T("Бриф на сайт", "Бриф на сайт", "Brief strony"),
  h1: T("Каким будет ваш сайт?", "Яким буде ваш сайт?", "Jaka ma być Twoja strona?"),
  draft: T("Черновик сохраняется на этом устройстве, можно вернуться позже.", "Чернетка зберігається на цьому пристрої, можна повернутися пізніше.", "Szkic zapisuje się na tym urządzeniu, możesz wrócić później."),
  map: T("Разделы", "Розділи", "Sekcje"),
  req: T("обязательно", "обов’язково", "wymagane"),
  reqSec: T("обязательно", "обов’язково", "wymagane"),
  progress: T("Заполнено разделов: {n} из {m}", "Заповнено розділів: {n} з {m}", "Uzupełnione sekcje: {n} z {m}"),
  send: T("Отправить бриф", "Надіслати бриф", "Wyślij brief"),
  sending: T("Отправляю…", "Надсилаю…", "Wysyłam…"),
  sendingFiles: T("Отправляю файлы {n} из {m}…", "Надсилаю файли {n} з {m}…", "Wysyłam pliki {n} z {m}…"),
  missing: T("Оставьте имя и контакт, чтобы я мог ответить.", "Залиште ім’я та контакт, щоб я міг відповісти.", "Zostaw imię i kontakt, żebym mógł odpowiedzieć."),
  drop: T("Перетащите файлы сюда или нажмите, чтобы выбрать", "Перетягніть файли сюди або натисніть, щоб вибрати", "Przeciągnij pliki tutaj lub kliknij, aby wybrać"),
  tooBig: T("Пропущены файлы больше 20 МБ или сверх 10 штук.", "Пропущено файли понад 20 МБ або понад 10 штук.", "Pominięto pliki powyżej 20 MB lub ponad 10 sztuk."),
  remove: T("Убрать", "Прибрати", "Usuń"),
  info: T("Подсказка", "Підказка", "Podpowiedź"),
  refLink: T("Ссылка", "Посилання", "Link"),
  refNote: T("Что именно: цвета, меню, фото…", "Що саме: кольори, меню, фото…", "Co dokładnie: kolory, menu, zdjęcia…"),
  refAdd: T("Добавить ещё ссылку", "Додати ще посилання", "Dodaj kolejny link"),
  custom: T("Свои цвета", "Свої кольори", "Własne kolory"),
  cBg: T("фон", "тло", "tło"),
  cAcc: T("акцент", "акцент", "akcent"),
  cInk: T("текст", "текст", "tekst"),
  pick: T("Выберите варианты", "Оберіть варіанти", "Wybierz opcje"),
  pickOne: T("Выберите вариант", "Оберіть варіант", "Wybierz opcję"),
  tabMood: T("Настроение", "Настрій", "Nastrój"),
  tabFont: T("Шрифт", "Шрифт", "Czcionka"),
  lookAuto: T("Цвета и шрифт подберутся под настроение. Поменять можно во вкладках выше.", "Кольори й шрифт підберуться під настрій. Змінити можна у вкладках вище.", "Kolory i czcionka dopasują się do nastroju. Zmienisz je w zakładkach wyżej."),
  unsure: T("Предложите сами", "Запропонуйте самі", "Zaproponuj sam"),
  sample: T("Ваш бизнес", "Ваш бізнес", "Twoja firma"),
  pvNote: T("Набросок, чтобы понять направление, а не готовый дизайн", "Начерк, щоб зрозуміти напрям, а не готовий дизайн", "Szkic, żeby złapać kierunek, a nie gotowy projekt"),
  pvLead: T("Коротко: что вы делаете и для кого", "Коротко: що ви робите і для кого", "Krótko: co robisz i dla kogo"),
  pvBtn: T("Записаться", "Записатися", "Umów się"),
  pvSvc: T("Услуга", "Послуга", "Usługa"),
  pvFrom: T("от", "від", "od"),
  pvKicker: T("Ваш город", "Ваше місто", "Twoje miasto"),
  pvBtn2: T("Цены", "Ціни", "Cennik"),
  pvTrust: T("Отзывы клиентов", "Відгуки клієнтів", "Opinie klientów"),
  pvSvcH: T("Услуги и цены", "Послуги й ціни", "Usługi i ceny"),
  pvWorks: T("Наши работы", "Наші роботи", "Nasze realizacje"),
  pvRev: T("«Всё понравилось, приду ещё»", "«Усе сподобалося, прийду ще»", "„Wszystko super, wrócę na pewno”"),
  pvRevBy: T("Анна, клиент", "Анна, клієнтка", "Anna, klientka"),
  pvForm: T("Онлайн-запись", "Онлайн-запис", "Rezerwacja online"),
  pvName: T("Имя", "Ім’я", "Imię"),
  pvPhone: T("Телефон", "Телефон", "Telefon"),
  pvMap: T("Как нас найти", "Як нас знайти", "Jak do nas trafić"),
  pvAddr: T("ул. Примерная, 1 · пн–сб 9–19", "вул. Прикладна, 1 · пн–сб 9–19", "ul. Przykładowa 1 · pn–sb 9–19"),
  pvOpen: T("Развернуть", "Розгорнути", "Powiększ"),
  pvClose: T("Свернуть", "Згорнути", "Zmniejsz"),
  pvScroll: T("Листайте экран телефона", "Гортайте екран телефону", "Przewiń ekran telefonu"),
  doneH: T("Спасибо, бриф у меня!", "Дякую, бриф у мене!", "Dzięki, brief do mnie dotarł!"),
  doneP: T("Напишу вам в течение дня с вопросами или первой идеей.", "Напишу вам протягом дня з питаннями або першою ідеєю.", "Odezwę się w ciągu dnia z pytaniami albo pierwszym pomysłem."),
  filesP: T("Бриф дошёл, а картинки нет. Пришлите их мне в Telegram, пожалуйста.", "Бриф дійшов, а картинки ні. Надішліть їх мені в Telegram, будь ласка.", "Brief dotarł, ale obrazy nie. Wyślij mi je proszę na Telegramie."),
  failH: T("Не получилось отправить", "Не вдалося надіслати", "Nie udało się wysłać"),
  failP: T("Скопируйте бриф и пришлите мне в Telegram, файлы можно приложить там же.", "Скопіюйте бриф і надішліть мені в Telegram, файли можна додати там само.", "Skopiuj brief i wyślij mi na Telegramie, pliki możesz dołączyć tam."),
  copy: T("Скопировать бриф", "Скопіювати бриф", "Skopiuj brief"),
  copied: T("Скопировано", "Скопійовано", "Skopiowano"),
  back: T("На главную", "На головну", "Strona główna")
};
