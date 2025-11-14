const db = require ('../config/db');

exports.create = (req, res) => {
    const quizID = req.params.quizID;
    const userID = req.user.id;

    db.query(
        'INSERT INTO Attempt (UserID, QuizID) VALUES (?, ?)',
        [userID, quizID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            const attemptID = result.insertId;
            res.status(200).json({message: "Attempt Created successfully", attemptID});
        }
    );
};

exports.submit = (req, res) => {
    const userID = req.user.id;
    const quizID = req.params.quizID
    const attemptID = req.params.attemptID;

    db.query (
        'SELECT * FROM Attempt WHERE (UserID = ? AND QuizID = ? AND AttemptID = ?)',
        [userID, quizID, attemptID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No such attempts of this Quiz by the Student Submit"});
            }
            db.query(
                'UPDATE Attempt SET Score = (SELECT COUNT (*) FROM Answer a JOIN Options o ON a.SelectedOptionID = o.OptionID WHERE (a.AttemptID = ? AND o.IsCorrect = true)), Status = "Submitted" WHERE AttemptID = ?',
                [attemptID, attemptID], (err2, updateResult) => {
                    if (err2)
                    {
                        return res.status(500).json({message: "Database Error!"});
                    }
                    
                    res.status(200).json({message: "Quiz Submitted Successfully"});
                }
            )
        }
    );
};

exports.viewAttempts = (req, res) => {
    const userID = req.user.id;
    const role = req.user.role;
    const quizID = req.params.quizID;
    let sql = ``;
    let params = [];

    if (role == "Teacher")
    {
        sql = `SELECT a.AttemptID, a.Score, a.UserID,
        (SELECT Max(Score) FROM Attempt WHERE QuizID = ?) AS BestScore 
        FROM Attempt a
        WHERE a.QuizID = ?`;
        params = [quizID, quizID];
    }
    else if (role == "Student")
    {
        sql = `SELECT a.AttemptID, a.QuizID, a.Score,
        (SELECT MAX(Score) FROM Attempt WHERE UserID = ? AND QuizID = ?) AS BestScore
        FROM Attempt a
        WHERE a.UserID = ? AND a.QuizID = ?`;
        params = [userID, quizID, userID, quizID];
    }
    db.query (
        sql, params, (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No attempts of this Quiz by Student"});
            }
            res.status(200).json(result);
        }
    );
};

exports.viewAttempt = (req, res) => {
    const userID = req.user.id;
    const quizID = req.params.quizID;
    const attemptID = req.params.attemptID;

    db.query (
        'SELECT * FROM Attempt WHERE (UserID = ? AND QuizID = ? AND AttemptID = ?)',
        [userID, quizID, attemptID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No such attempts of this Quiz by the Student any"});
            }
            res.status(200).json(result);
        }
    );
};
