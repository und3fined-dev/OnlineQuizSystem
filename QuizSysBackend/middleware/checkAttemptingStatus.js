const db = require("../config/db");

function checkAttemptingStatus(req, res, next) {
    const attemptID = req.params.attemptID;

    db.query(
        "SELECT Status FROM Attempt WHERE AttemptID = ?",
        [attemptID], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Database Error!" });
            }
            if (result.length === 0) {
                return res.status(404).json({ message: "Attempt not found" });
            }
            if (result[0].Status === "Submitted") {
                return res.status(400).json({ message: "Attempt already completed, cannot modify answers" });
            }
            next();
        }
    );
};

module.exports = checkAttemptingStatus;