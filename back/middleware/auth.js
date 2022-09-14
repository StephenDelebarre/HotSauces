const jwt = require("jsonwebtoken")
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            res.status(403).json({message: "Requête non autorisé"});
        } else {
            next()
        }
    } catch(error) {
        res.status(401).json({error});
    };
};