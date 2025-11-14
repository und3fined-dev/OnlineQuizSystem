const bcryptjs = require ('bcryptjs');
const JWT = require ('jsonwebtoken');
const db = require ('../config/db');


exports.register = (req, res) => {

    const {name, email, password, role} = req.body || {};

    if (!name || !email || !password)
    {
        res.status(400).send('All fields are required for registration!');      //Bad Request
        return;
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    db.query(
        'INSERT INTO User(Name, Email, Password, Role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role],
        (err, insertResult) => {
            if (err)
            {
                res.status(500).send(err);
                return;
            }
            const userID = insertResult.insertId;
            db.query(
                'SELECT * FROM User WHERE UserID = ?',
                [userID],
                (err, result) => {
                     if (err)
                    {
                        res.status(500).send(err);
                        return;
                    }
                    const user = result[0];
                    const token = JWT.sign({id:user.UserID, role: user.Role}, process.env.JWT_KEY, {expiresIn:'1h'});
                    const role = user.Role;
                    res.json({"message" : "User registered Successfully!", role, token});
                }
            );
        }
    );
};

exports.login = (req, res) => {
    const{email, password} = req.body || {};
    if(!email || !password)
    {
        res.status(400).send("All fields are required for login!");
        return;
    }
    db.query(                   
        'SELECT * FROM User WHERE Email = ?', 
        [email], 
        (err, result) => {
            if (err)                //database Error fetch
            {
                return res.status(500).send(err);
            }
            if (result.length == 0)             //No user exists
            {
                return res.status(404).send('User Not Found!');
            }
            const user = result[0];             //Incorrect password
            const validPassword = bcryptjs.compareSync(password, user.Password);   
            if (!validPassword)
            {
                return res.status(401).send('Invalid Password!');
            }
            const token = JWT.sign({id:user.UserID, role: user.Role}, process.env.JWT_KEY, {expiresIn:'1h'});
            const role = user.Role;
            res.json({message:"Login Successful", role, token});
        }
    );
};
