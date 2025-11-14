const express = require ("express");
const router = express.Router();
const quizController = require ('../controllers/quizController');
const verifyToken = require('../middleware/authJWTMiddleware');     //To check if the user is logged in
const checkQuizOwner = require('../middleware/checkQuizOwner');     //To check if the logged in user has the ownership of quiz

router.post('/create', verifyToken, quizController.create);
router.get('/', verifyToken, quizController.viewQuizzes);
router.get('/:quizID', verifyToken, quizController.viewQuiz);
router.put('/:quizID', verifyToken, checkQuizOwner, quizController.updateQuiz);
router.delete('/:quizID', verifyToken, checkQuizOwner, quizController.DeleteQuiz);
module.exports = router;