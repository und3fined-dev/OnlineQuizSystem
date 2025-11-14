const express = require ("express");
const router = express.Router();
const optionController = require('../controllers/optionController');  
const verifyToken = require('../middleware/authJWTMiddleware');                 //To check if the user is logged in
const checkQuizOwner = require('../middleware/checkQuizOwner');                 //To check if the logged in user has the ownership of quiz
const checkQuestionExists = require ('../middleware/checkQuestionExists')       //To check if the question exists in the quiz

router.post ('/quiz/:quizID/question/:questionID/option/create', verifyToken, checkQuizOwner, checkQuestionExists, optionController.create);
router.get ('/quiz/:quizID/question/:questionID/option', verifyToken, checkQuestionExists, optionController.viewOptions);
//router.get ('/quiz/:quizID/question/:questionID/option/:optionID', verifyToken, checkQuestionExists, optionController.viewOption);
router.put ('/quiz/:quizID/question/:questionID/option/:optionID', verifyToken, checkQuizOwner, checkQuestionExists, optionController.updateOption);
router.delete ('/quiz/:quizID/question/:questionID/option/:optionID', verifyToken, checkQuizOwner, checkQuestionExists, optionController.deleteOption);

module.exports = router;