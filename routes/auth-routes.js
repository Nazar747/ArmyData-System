const { Router } = require("express");
const router = Router();
const {
  register,
  login,
  logout,
  get_profile,
  update_profile,
} = require("../controllers/auth-controller");
const auth_middleware = require("../middleware/auth-middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", auth_middleware, get_profile);
router.put("/profile", auth_middleware, update_profile);

module.exports = router;
