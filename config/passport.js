import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, '..', 'db', 'users.json');

const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { users: [] });
await db.read();
db.data ||= { users: [] };

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
  try {
    await db.read();
    const user = db.data.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
    if (!user) return done(null, false, { message: 'Користувача не знайдено' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return done(null, false, { message: 'Невірний пароль' });
    return done(null, { id: user.id, email: user.email });
  } catch (e) { return done(e); }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try { await db.read(); const user = db.data.users.find(u => u.id === id); if (!user) return done(null, false); done(null, { id: user.id, email: user.email }); }
  catch (e) { done(e); }
});
export default passport;
