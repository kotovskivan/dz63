export function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(401).json({ message: 'Потрібно увійти через Passport' });
  }
  const nextUrl = encodeURIComponent(req.originalUrl || '/protected');
  return res.redirect('/auth?tab=login&next=' + nextUrl);
}
