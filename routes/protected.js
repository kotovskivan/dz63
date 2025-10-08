import { Router } from 'express';
import { ensureAuth } from '../middleware/auth.js';
const router = Router();
router.get('/protected', ensureAuth, (req, res) => { res.render('protected', { title: 'Захищена сторінка' }); });
router.get('/protected_passport', ensureAuth, (req, res) => { res.json({ ok: true, email: req.user.email }); });
export default router;
