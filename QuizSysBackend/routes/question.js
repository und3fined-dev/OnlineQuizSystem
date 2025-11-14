const express = require ("express");
const router = express.Router();
const questionController = require('../controllers/questionController');
const verifyToken = require('../middleware/authJWTMiddleware');          //To check if the user is logged in
const checkQuizOwner = require('../middleware/checkQuizOwner');          //To check if the logged in user has the ownership of quiz

router.post('/quiz/:quizID/question/create', verifyToken, checkQuizOwner, questionController.create);
router.get('/quiz/:quizID/question', verifyToken, questionController.viewQuestions);
router.get('/quiz/:quizID/question/:questionID', verifyToken, questionController.viewQuestion);
router.put('/quiz/:quizID/question/:questionID', verifyToken, checkQuizOwner, questionController.updateQuestion);
router.delete('/quiz/:quizID/question/:questionID', verifyToken, checkQuizOwner, questionController.deleteQuestion);
module.exports = router;