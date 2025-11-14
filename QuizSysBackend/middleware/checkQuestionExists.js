const db = require ('../config/db');

function checkQuestionExists (req, res, next){
    const quizID = req.params.quizID;
    const questionID = req.params.questionID;

    db.query(
        'SELECT * FROM Question WHERE (QuizID = ? AND QuestionID = ?)',
        [quizID, questionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No such Question Exists"});
            }
            const question = result[0];
            req.question = question;
            next();
        }
    );
};
module.exports = checkQuestionExists;