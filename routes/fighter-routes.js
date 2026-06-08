const { Router } = require("express");
const router = Router();
const {
  get_fighters,
  get_fighter,
  add_fighter,
  update_fighter,
  delete_fighter,
} = require("../controllers/fighter-controller");
const auth_middleware = require("../middleware/auth-middleware");
const admin_middleware = require("../middleware/admin-middleware");

router.get("/", auth_middleware, get_fighters);
router.get("/:id", auth_middleware, get_fighter);
router.post("/", auth_middleware, admin_middleware, add_fighter);
router.put("/:id", auth_middleware, admin_middleware, update_fighter);
router.delete("/:id", auth_middleware, admin_middleware, delete_fighter);

module.exports = router;
