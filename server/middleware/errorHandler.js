module.exports = function (err, req, res, next) {
  console.error(err && err.message ? err.message : err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'An unexpected error occurred' });
};
