const { Router } = require("express");
const router = Router();
const { register, login, logout } = require("../controllers/auth-controller");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
