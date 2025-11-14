const db = require ('../config/db');

function checkQuizAttempt (req, res, next)
{
    const userID = req.user.id;
    const role = req.user.role;
    const quizID = req.params.quizID;
    const attemptID = req.params.attemptID;

    let sql = ``;
    let params = [];

    if (role == "Student")
    {
        sql = 'SELECT * FROM Attempt WHERE (UserID = ? AND QuizID = ? AND AttemptID = ?)';
        params = [userID, quizID, attemptID];
    }
    else if (role == "Teacher")
    {
        sql = 'SELECT * FROM Attempt WHERE (QuizID = ? AND AttemptID = ?)';
        params = [quizID, attemptID];
    }

    db.query (
        sql, params, (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No such attempts of this Quiz by the Student"});
            }
            next();
        }
    );
};

module.exports = checkQuizAttempt;