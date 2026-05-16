const express = require("express");
const { createSession, getSessionById, getMySessions, deleteSession } = require("../controllers/sessionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions); 

// put dynamic routes after specific routes otherwise dynamic routes catches the requests first
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

module.exports = router;