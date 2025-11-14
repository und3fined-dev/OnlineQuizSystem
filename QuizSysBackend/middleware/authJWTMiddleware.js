const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(404).json({ message: "No token provided!" });

    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized!" });

        req.user = decoded; // decoded contains { id: user.UserID }
        next();
    });
}

module.exports = verifyToken;