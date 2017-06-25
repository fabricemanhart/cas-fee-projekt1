var express = require("express");
var router = express.Router();
const notes = require("../controllers/notesController.js");

router.get("/", notes.getAll);
router.get("/:id", notes.getById);
router.post("/", notes.save);
router.put("/:id", notes.update);

module.exports = router;