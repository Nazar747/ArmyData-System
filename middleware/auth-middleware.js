const auth_middleware = (req, res, next) => {
  if (!req.session.user_id) {
    return res.status(401).json({ message: "Необхідна авторизація" });
  }

  next();
};

module.exports = auth_middleware;
