const express = require ("express");
const router = express.Router();
const answerController = require ('../controllers/answerController');
const verifyToken = require('../middleware/authJWTMiddleware');                  //To check if the user is logged in
const checkQuizAttempt = require('../middleware/checkQuizAttempt');              //To check if the logged in user has made the attempt
const checkAttemptingStatus = require('../middleware/checkAttemptingStatus');    //To check if the attempt is ongoing or completed

router.post('/quiz/:quizID/attempt/:attemptID/question/:questionID/answer/submit', verifyToken, checkQuizAttempt, checkAttemptingStatus, answerController.submit);
router.get('/quiz/:quizID/attempt/:attemptID/answer', verifyToken, checkQuizAttempt, answerController.viewAnswers);
router.get('/quiz/:quizID/attempt/:attemptID/question/:questionID', verifyToken, checkQuizAttempt, answerController.viewAnswer);
router.patch('/quiz/:quizID/attempt/:attemptID/question/:questionID', verifyToken, checkQuizAttempt, checkAttemptingStatus, answerController.updateAnswer);

module.exports = router;

//Maybe we can send the questionID from req.body in the front-end