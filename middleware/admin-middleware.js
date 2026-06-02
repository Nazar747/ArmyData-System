const admin_middleware = (req, res, next) => {
  if (req.session.role !== "admin") {
    return res.status(403).json({ message: "Доступ заборонено" });
  }

  next();
};

module.exports = admin_middleware;
