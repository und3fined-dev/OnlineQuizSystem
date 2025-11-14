const db = require ('../config/db');

exports.create = (req, res) => {
    const {QuestionText, QuestionType} = req.body || {};
    const quizID = req.params.quizID;
    //Creating
    if (!QuestionText)
    {
        return res.status(400).json({message: "Must Enter QuestionText"});
    }
    const type = QuestionType ?? 'MCQ';
    db.query(
        'INSERT INTO Question(QuizID, QuestionText, QuestionType) VALUES (?, ?, ?)',
        [quizID, QuestionText, type], (err, result) => {
            if(err)
            {
                console.error(err);
                return res.status(500).json({message: "Database Error"});
            }
            const questionID = result.insertId;
            res.json({message: "Question Created Successfully", questionID});
        }
    );
};

exports.viewQuestions = (req, res) => {
    const quizID = req.params.quizID;
    db.query(
        `SELECT q.QuestionID, q.QuestionText, q.QuestionType,
        COALESCE(
            JSON_ARRAYAGG(
                CASE 
                    WHEN o.OptionID IS NOT NULL 
                    THEN JSON_OBJECT('OptionID', o.OptionID, 'OptionText', o.OptionText, 'IsCorrect', o.IsCorrect)
                END
            ),
            JSON_ARRAY()
        ) AS Options
        FROM Question q LEFT JOIN Options o ON q.QuestionID = o.QuestionID
        WHERE q.QuizID = ? GROUP BY q.QuestionID, q.QuestionText, q.QuestionType ORDER BY q.QuestionID`,
        [quizID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No questions exist for this Quiz"});
            }
            res.status(200).json(result);
        }
    );
};

exports.viewQuestion = (req, res) => {
    const quizID = req.params.quizID;
    const questionID = req.params.questionID;
    db.query(
        'SELECT * FROM Question WHERE QuizID = ? AND QuestionID = ?', 
        [questionID, quizID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No such questions exist"});
            }
            res.status(200).json(result);
        }
    );
};

exports.updateQuestion = (req, res) => {
    const quizID = req.params.quizID;
    const questionID = req.params.questionID;
    const {QuestionText, QuestionType} = req.body || {};
    db.query(
        'SELECT * FROM Question WHERE (QuizID = ? AND QuestionID = ?)',
        [quizID, questionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No Such Question Exists for this Quiz"});
            }
            const newQuestionText = QuestionText ?? result[0].QuestionText;
            const newQuestionType = QuestionType ?? result[0].QuestionType;
            db.query(
                'UPDATE Question SET QuestionText = ?, QuestionType = ? WHERE (QuizID = ? AND QuestionID = ?)' , 
                [newQuestionText, newQuestionType, quizID, questionID], (err3, updatedResult) => {
                    if (err3)
                    {
                        return res.status(500).json({message: "Database Error"});
                    }
                    res.status(200).json({message: "Question updated Successfully!"});
                }
            );
        }
    );
};

exports.deleteQuestion = (req, res) =>{
    const quizID = req.params.quizID;
    const questionID = req.params.questionID;
    
    db.query(
        'SELECT * FROM Question WHERE QuizID = ? AND QuestionID = ?',
        [quizID, questionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No Such Question Exists for this Quiz"});
            }
            db.query(
                'DELETE FROM Question WHERE QuestionID = ? AND QuizID = ?', 
                [questionID, quizID], (err3) => {
                    if (err3)
                    {
                        return res.status(500).json({message: "Database Error"});
                    }
                    res.status(200).json({message: "Question deleted Successfully!"});
                }
            );
        }
    );
};