import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, '..', 'db', 'users.json');

const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { users: [] });
await db.read();
db.data ||= { users: [] };

const router = Router();

router.get('/', (req, res) => {
  const tab = (req.query.tab === 'register') ? 'register' : 'login';
  const next = req.query.next || '/protected';
  const msg = req.query.msg || null;
  const error = req.query.error || null;
  const registered = req.query.registered || null;
  res.render('auth', { title: 'Увійти / Зареєструватися', tab, next, msg, error, registered });
});

router.get('/login', (req, res) => {
  const next = req.query.next || '/protected';
  res.redirect(`/auth?tab=login&next=${encodeURIComponent(next)}${req.query.error ? '&error=1' : ''}`);
});
router.get('/register', (req, res) => {
  const next = req.query.next || '/protected';
  res.redirect(`/auth?tab=register&next=${encodeURIComponent(next)}`);
});

router.post('/register', async (req, res) => {
  const { email, password, next: nextUrl } = req.body;
  if (!email || !password) {
    return res.redirect(`/auth?tab=register&error=1&next=${encodeURIComponent(nextUrl || '/protected')}`);
  }
  await db.read();
  const exists = db.data.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (exists) {
    return res.redirect(`/auth?tab=register&error=1&msg=${encodeURIComponent('Користувач вже існує')}&next=${encodeURIComponent(nextUrl || '/protected')}`);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  db.data.users.push({ id: nanoid(), email, passwordHash });
  await db.write();
  return res.redirect(`/auth?tab=login&registered=1&next=${encodeURIComponent(nextUrl || '/protected')}`);
});

router.post('/login',
  (req, res, next) => { req.body.email = (req.body.email || '').trim(); next(); },
  passport.authenticate('local', { failureRedirect: '/auth?tab=login&error=1' }),
  (req, res) => { const nextUrl = req.body.next || req.query.next || '/protected'; res.redirect(nextUrl); }
);

router.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    req.session.destroy(() => { res.clearCookie('dz63.sid'); res.redirect('/'); });
  });
});

export default router;
