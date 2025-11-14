USE Quiz;

INSERT INTO User (Name, Email, Password, Address, Role)
VALUES
	('teacher1', 'teacher1@example.com', 'hashedpassword1', 'City1', 'Teacher'),
    ('student1', 'student1@example.com', 'hashedpassword2', 'City2', 'Student'),
	('student2', 'student2@example.com', 'hashedpassword3', 'City3', 'Student');

INSERT INTO Quiz (QuizTitle, Description, CreatedBy) 
VALUES
	('Basic Math Quiz', 'A simple quiz to test basic math skills', 1),
	('PF Quiz', 'A simple quiz to test Programming skills', 1);


INSERT INTO Question (QuizID, QuestionText) 
VALUES
	(1, 'What is 2 + 2?'),
	(1, 'What is 5 * 3?'),
	(2, 'What does cout stand for?');
    
INSERT INTO Options (QuestionID, OptionText, IsCorrect) 
VALUES
(1, '3', FALSE),
(1, '4', TRUE),
(1, '5', FALSE),
(2, '15', TRUE),
(2, '10', FALSE),
(2, '20', FALSE),
(3, 'carry out', FALSE),
(3, 'console output', FALSE),
(3, 'character output', TRUE);


ALTER TABLE User ADD UNIQUE (email);

SHOW TABLES;
SELECT * FROM User;
SELECT * FROM Quiz;
SELECT * FROM Question;
SELECT * FROM Options;
SELECT * FROM Attempt;
SELECT * FROM Answer;

DELETE FROM Answer WHERE AnswerID = 2;

INSERT INTO User (Name, Email, Password, Role)
VALUES
	('Mustafa', 'mustafa@example.com', '12345', 'City1', 'Student')
