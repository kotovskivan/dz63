import { Router } from 'express';
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

const router = Router();
router.get('/users', async (req, res) => { await db.read(); res.render('users', { title: 'Користувачі (demo)', users: db.data.users }); });
export default router;
