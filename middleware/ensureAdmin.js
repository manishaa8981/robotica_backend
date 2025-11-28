const ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "You are not authorized to perform this action",
  });
};

module.exports = ensureAdmin;
