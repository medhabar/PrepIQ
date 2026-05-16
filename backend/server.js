require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { connect } = require("http2");
const connectDB = require("./configs/db");
const { protect } = require("./middlewares/authMiddleware");

const authRoute = require("./routes/authRoute");
const sessionRoute = require("./routes/sessionRoute");
const questionRoute = require("./routes/questionRoute");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/sessions", sessionRoute);
app.use("/api/questions", questionRoute);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);

// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("API KEY:", process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("API is running...");
});