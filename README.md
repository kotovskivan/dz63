# DZ63: Express + Passport Local — UI з вкладками (Увійти/Зареєструватися)
...
## Деплой на Vercel
1) Установіть Vercel CLI: `npm i -g vercel`
2) Вхід: `vercel login`
3) Перше розгортання: `vercel`
4) Прод: `vercel --prod`

Файли для Vercel: `api/index.js`, `vercel.json`. На Vercel `server.js` НЕ слухає порт — він експортує `app`.
