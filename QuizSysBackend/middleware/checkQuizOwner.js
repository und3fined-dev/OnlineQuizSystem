const db = require ('../config/db');

function checkQuizOwner (req, res, next) {
    const userID = req.user.id;
    const quizID = req.params.quizID;

    db.query(
        'SELECT * FROM Quiz WHERE QuizID = ?',
        [quizID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No such Quiz Exists"});
            }
            const quiz = result[0];
            if (userID != quiz.CreatedBy)
            {
                return res.status(403).json({message: "You are not the authorized person to make changes to this quiz"});
            }
            //Authorized
            req.quiz = quiz;
            next();
        }
    );
}

module.exports = checkQuizOwner;