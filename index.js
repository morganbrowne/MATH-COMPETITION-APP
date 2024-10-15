const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;
const { generateQuestion, checkAnswer } = require('./utils/mathUtilities');
const leaderboards = require('./data/leaderboards');
require('dotenv').config(); // Load environment variables from .env

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure the views directory is set correctly

// Middleware
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static('public')); // To serve static files (e.g., CSS)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Home Page
app.get('/', (req, res) => {
    const lastStreak = req.session.streak || 0;
    res.render('index', { lastStreak });
});

// Start Quiz
app.post('/start', (req, res) => {
    req.session.streak = 0;
    req.session.currentQuestion = generateQuestion();
    res.redirect('/quiz');
});

// Quiz Page
app.get('/quiz', (req, res) => {
    const question = req.session.currentQuestion;
    if (!question) {
        return res.redirect('/');
    }
    res.render('quiz', { question: question.question });
});

// Handle Quiz Submission
app.post('/quiz', (req, res) => {
    const userAnswer = req.body.answer;
    const currentQuestion = req.session.currentQuestion;

    if (!currentQuestion) {
        return res.redirect('/');
    }

    const isCorrect = checkAnswer(currentQuestion, userAnswer);

    if (isCorrect) {
        req.session.streak += 1;
    } else {
        // Update leaderboards if necessary
        leaderboards.updateLeaderboards(req.session.streak);
        req.session.streak = 0;
    }

    // Prepare next question or redirect to completion
    if (isCorrect) {
        req.session.currentQuestion = generateQuestion();
        res.redirect('/quiz');
    } else {
        req.session.currentQuestion = null; // Clear current question
        res.redirect('/completion');
    }
});

// Completion Page
app.get('/completion', (req, res) => {
    const streak = req.session.streak;
    res.render('completion', { streak });
});

// Leaderboards Page
app.get('/leaderboards', (req, res) => {
    const topStreaks = leaderboards.getTopStreaks();
    res.render('leaderboards', { topStreaks });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
