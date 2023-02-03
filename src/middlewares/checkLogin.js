export const checkLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.json({ message: "Por favor inicia sesion" });
  }
};
