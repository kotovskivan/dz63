import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';
import dotenv from 'dotenv';
import ejsMate from 'ejs-mate';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// EJS + layouts
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parsers + static
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions
const isProd = process.env.NODE_ENV === 'production';
app.set('trust proxy', 1);
app.use(session({
  name: 'dz63.sid',
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProd,        // на Vercel prod — true
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Locals
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.path = req.path;
  next();
});

// Routes
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import usersRoutes from './routes/users.js';
app.use('/auth', authRoutes);
app.use('/', protectedRoutes);
app.use('/', usersRoutes);

// Home
app.get('/', (req, res) => {
  res.render('index', { title: 'Головна' });
});

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// Local dev listen; на Vercel не слушаем порт, экспортируем app
const port = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`DZ63 + Passport running on http://localhost:${port}`);
  });
}

export default app;
