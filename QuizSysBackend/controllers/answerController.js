const db = require ('../config/db');

//create
exports.submit = (req, res) => {
    const attemptID = req.params.attemptID;
    const questionID = req.params.questionID;
    const {selectedOptionID} = req.body || {};

    if(!selectedOptionID)
    {
        return res.status(400).json({message: "Must select OptionID"});
    }

    db.query(
        'INSERT INTO Answer(AttemptID, QuestionID, SelectedOptionID) VALUES (?, ?, ?)',
        [attemptID, questionID, selectedOptionID], (err) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            res.status(200).json({message: "Answer Submitted"});
        }
    );
};

exports.viewAnswers = (req, res) => {
    const attemptID = req.params.attemptID;

    db.query(
        `SELECT a.AnswerID, a.SelectedOptionID, q.QuestionText, q.QuestionType,
        JSON_ARRAYAGG(
            JSON_OBJECT('OptionID', o.OptionID, 'OptionText', o.OptionText, 'IsCorrect', o.IsCorrect)
        ) AS Options FROM Answer a
        JOIN Question q ON a.QuestionID = q.QuestionID
        JOIN Options o ON q.QuestionID = o.QuestionID
        WHERE a.AttemptID = ? GROUP BY a.AnswerID, a.SelectedOptionID, q.QuestionID, q.QuestionText, q.QuestionType ORDER BY q.QuestionID`,
        [attemptID], (err, result) => {
            if (err)
            {
                console.log(err);
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No Submitted Answers for this attempt Exist"});
            }
            res.status(200).json(result);
        }
    );
};

exports.viewAnswer = (req, res) => {
    const attemptID = req.params.attemptID;
    const questionID = req.params.questionID;

    db.query(
        'SELECT * FROM Answer WHERE (AttemptID = ? AND QuestionID = ?)',
        [attemptID, questionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No Submitted Answers for this Question Exist in this attempt."});
            }
            res.status(200).json(result);
        }
    );
};

exports.updateAnswer = (req, res) => {
    const attemptID = req.params.attemptID;
    const questionID = req.params.questionID;
    const {optionID} = req.body || {};

    if (!optionID)
    {
        return res.status(200).json({message: "No changes made, kept the previous option"});
    }
    db.query(
        'SELECT * FROM Answer WHERE (AttemptID = ? AND QuestionID = ?)',
        [attemptID, questionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No Submitted Answers for this attempt Exist"});
            }
            db.query(
                'UPDATE Answer SET SelectedOptionID = ? WHERE (AttemptID = ? AND QuestionID = ?)',
                [optionID, attemptID, questionID], (err2) => {
                     if (err2)
                    {
                        return res.status(500).json({message: "Database Error!"});
                    }
                    res.status(200).json({message: "Answer Updated Successfully!"});
                }
            );      
        }
    );
};

