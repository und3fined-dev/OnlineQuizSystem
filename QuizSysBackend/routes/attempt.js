const express = require ("express");
const router = express.Router();
const attemptController = require ('../controllers/attemptController');
const verifyToken = require('../middleware/authJWTMiddleware');     //To check if the user is logged in

router.post('/quiz/:quizID/attempt/create', verifyToken, attemptController.create);
router.get('/quiz/:quizID/attempt', verifyToken, attemptController.viewAttempts);
router.get('/quiz/:quizID/attempt/:attemptID', verifyToken, attemptController.viewAttempt);
router.patch('/quiz/:quizID/attempt/:attemptID/submit', verifyToken, attemptController.submit);

module.exports = router;