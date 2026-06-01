const { Router } = require("express");
const router = Router();
const {
  get_fighters,
  get_fighter,
  add_fighter,
  update_fighter,
  delete_fighter,
} = require("../controllers/fighter-controller");

router.get("/", get_fighters);

router.get("/:id", get_fighter);

router.post("/", add_fighter);

router.put("/:id", update_fighter);

router.delete("/:id", delete_fighter);

module.exports = router;
