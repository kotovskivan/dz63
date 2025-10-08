
DZ63 — Fix for sessions on Vercel (express-session → cookie-session)
===================================================================

Що всередині ZIP
----------------
1) patches/app.js.diff
   • Уніфікований diff, щоб швидко внести правку в твій існуючий app.js.
2) examples/app.cookie-session.example.js
   • Повний приклад app.js з cookie-session, Passport Local, login/register роутами.
   • Може слугувати як орієнтир, але краще вносити правку у твій app.js через diff.
3) patches/views_articles.ejs.diff
   • Маленька правка тексту кнопки на сторінці статей.
4) examples/views/articles.cookie-session.example.ejs
   • Орієнтовна версія articles.ejs з оновленим текстом.
5) public/js/auth-example.js
   • Приклад JS для форм логіну/реєстрації з credentials: "same-origin".
6) env/.env.example
   • Приклад змінних середовища для Vercel (SESSION_SECRET, USE_COOKIE_SESSION).

Коротка інструкція
------------------
1) Встанови залежність:
   npm i cookie-session

2) У твоєму app.js:
   • Додай: const cookieSession = require('cookie-session');
   • Після favicon middleware: app.set('trust proxy', 1);
   • Заміні блок express-session на cookie-session якщо Vercel/USE_COOKIE_SESSION ввімкнено.
   • Переконайся, що після сесій йде: passport.initialize() та passport.session().
   • Логін/Реєстрація: використай кастомний колбек (див. diff).

3) У фронтових запитах (fetch) додай:
   credentials: "same-origin"

4) На Vercel додай змінні середовища:
   vercel env add SESSION_SECRET production
   vercel env add SESSION_SECRET preview
   vercel env add USE_COOKIE_SESSION production
   vercel env add USE_COOKIE_SESSION preview

   Значення для USE_COOKIE_SESSION: 1

5) Задеплой:
   vercel --prod

Чому так працює
---------------
• express-session з MemoryStore не зберігає сесію між інвокаціями на Vercel.
• cookie-session кладе дані сесії у зашифровану cookie → стійко працює на Vercel.
