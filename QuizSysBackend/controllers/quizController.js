const db = require('../config/db');

exports.create = (req, res) => {
    const{QuizTitle, Description} = req.body || {};
    const CreatedBy = req.user.id ;             //comes from JWT after verification
    if (!QuizTitle)
    {
        return res.status(400).json({message: "Quiz title is required!"});
    }
    db.query(
        'INSERT INTO Quiz(QuizTitle, Description, CreatedBy) VALUES (?, ?, ?)',
        [QuizTitle, Description, CreatedBy],
        (err, result) => {
            if (err)
            {
                console.error("DB ERROR: ", JSON.stringify(err, null, 2));
                return res.status(500).json({message: "Quiz Database Error!"});
            }
            const quizID = result.insertID;
            res.json({message: "Quiz Created Successfully!", quizID});
        }
    );
};

exports.viewQuizzes = (req, res) => {
    const userID = req.user.id;
    const role = req.user.role;


    let sql = "";
    let params = [];

    if(role == "Teacher")
    {
        sql = "SELECT * FROM Quiz WHERE CreatedBy = ?";
        params = [userID];
    }
    else if (role == "Student")
    {
        sql = "SELECT * FROM Quiz";
    }
    else
    {
        return res.status(403).json({message: "Invalid Role :("});
    }
    db.query(sql, params, (err, result) => {
        if (err)
        {
            res.status(500).json({message: "Database Error!"});
            return;
        }
            res.json(result);
    });
};

exports.viewQuiz = (req, res) => {
    const quizID = req.params.quizID                    //Parameter from URL
    db.query(
        'SELECT * FROM Quiz WHERE QuizID = ?',
        [quizID], (err, result) => {
            if (err)
            {
                console.error(err);
                return res.status(500).json({message: "Database Error!"});
            }
            if (result.length == 0)
            {
                return res.status(404).json({message: "No such Quiz Exists!"});       
            }
            res.status(200).json(result);
        }
    );
};

exports.updateQuiz = (req, res) => {
    const quizID = req.params.quizID;
    const oldTitle = req.quiz.QuizTitle;                                //from checkquizOwner
    const oldDescription = req.quiz.Description;
    const {QuizTitle, Description} = req.body || {};
    
    const newTitle = QuizTitle ?? oldTitle;                   //Only goes to 2nd option if first is null or undefined
    const newDescription = Description ?? oldDescription;
    db.query(
        'UPDATE Quiz SET QuizTitle = ?, Description = ? WHERE QuizID = ?',
        [newTitle, newDescription, quizID], (err, updateResult) =>{
            if (err)
            {
                console.error(err);
                return res.status(500).json({message: "Database Update Error"});  
            }
            res.status(200).json({message: "Quiz Updated Successfully!"});
        }
    );
};

exports.DeleteQuiz = (req, res) => {
    const quizID = req.params.quizID;   
    db.query(
        'DELETE FROM Quiz WHERE QuizID = ?',
        [quizID], (err) => {
            if (err)
            {
                console.error(err);
                return res.status(500).json({message: "Database Delete Error!"});
            }
            res.status(200).json({message: "Quiz Deleted Successfully!"});
        } 
    );
};
    
