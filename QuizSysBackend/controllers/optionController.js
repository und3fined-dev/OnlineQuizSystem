const db = require('../config/db');

exports.create = (req, res) => {
    const questionID = req.params.questionID;
    const {OptionText, IsCorrect} = req.body || {};

    if (!OptionText)
    {
        return res.status(400).json({message: "Must Enter OptionText"});
    }   
    //Adding Option
    const newIsCorrect = IsCorrect ?? false;
    db.query(
        'INSERT INTO Options (QuestionID, OptionText, IsCorrect) VALUES (?, ?, ?)',
        [questionID, OptionText, newIsCorrect], (err, createResult) => {
            if (err)
            {
                return res.status(500).json({message: "Databse Error!"});
            }
            res.status(200).json({message: "Option Added Successfully!"});
        }
    );
};

exports.viewOptions = (req, res) => {
    const questionID = req.params.questionID; 

    //Options Exist?
    db.query(
        'SELECT * FROM Options WHERE QuestionID = ?',
        [questionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if(result.length == 0)
            {
                return res.status(404).json({message: "No Options Exist for this Question"});
            }
            res.status(200).json(result);
        }
    );   
};

exports.viewOption = (req, res) => {
    const questionID = req.params.questionID;
    const optionID = req.params.optionID;

    //Option Exists?
    db.query(
        'SELECT * FROM Options WHERE QuestionID = ? AND OptionID = ?',
        [questionID, optionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if(result.length == 0)
            {
                return res.status(404).json({message: "No such Option Exists for this Question"});
            }
            res.status(200).json(result);
        }
    );
};

exports.updateOption = (req, res) => {
    const questionID = req.params.questionID;
    const optionID = req.params.optionID;
    const {OptionText, IsCorrect} = req.body || {};

    //Option Exists?
    db.query(
        'SELECT * FROM Options WHERE QuestionID = ? AND OptionID = ?',
        [questionID, optionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if(result.length == 0)
            {
                return res.status(404).json({message: "No such Option Exists for this Question"});
            }
            const newOptionText = OptionText ?? result[0].OptionText;
            const newIsCorrect = IsCorrect ?? result[0].IsCorrect;                      //Only goes to 2nd option if first is null or undefined
            db.query(
                'UPDATE Options SET OptionText = ?, IsCorrect = ? WHERE (QuestionID = ? AND OptionID = ?)', 
                [newOptionText, newIsCorrect, questionID, optionID], (err2) => {
                    if (err2)
                    {
                        return res.status(500).json({message: "Database Error!"});
                    }
                    res.status(200).json({message: "Option Updated Successfully!"});
                }
            );
        }
    );     
};

exports.deleteOption = (req, res) => {
    const questionID = req.params.questionID;
    const optionID = req.params.optionID;

    //Option Exists?
    db.query(
        'SELECT * FROM Options WHERE QuestionID = ? AND OptionID = ?',
        [questionID, optionID], (err, result) => {
            if (err)
            {
                return res.status(500).json({message: "Database Error!"});
            }
            if(result.length == 0)
            {
                return res.status(404).json({message: "No such Option Exists for this Question"});
            }
            db.query(
                'DELETE FROM Options WHERE OptionID = ?', 
                [optionID], (err2) => {
                    if (err2)
                    {
                        return res.status(500).json({message: "Database Error!"});
                    }
                    res.status(200).json({message: "Option Deleted Successfully!"});
                }
            );
        }
    );     
};