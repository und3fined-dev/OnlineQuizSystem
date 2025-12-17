const express = require("express");
const app = express();
const cors = require ("cors");

app.use(express.json());                        //so taht it can read req body

app.use(cors({
  origin: "http://localhost:5173", 
  method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//const db = require('./config/db');             //import connection

app.get("/", (req, res) => {
    res.send("Welcome to the Online Quiz System");
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const quizRoutes = require ('./routes/quiz');
app.use('/quiz', quizRoutes);

const questionRoutes = require ('./routes/question');
app.use('/', questionRoutes);

const optionRoutes = require ('./routes/option');
app.use('/', optionRoutes);

const attemptRoutes = require ('./routes/attempt');
app.use('/', attemptRoutes);

const answerRoutes = require ('./routes/answer');
app.use('/', answerRoutes);

const PORT = process.env.DB_PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


