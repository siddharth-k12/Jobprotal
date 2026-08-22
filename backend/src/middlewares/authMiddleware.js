const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {

    try {

        const token = req.cookies?.token;

        console.log("AUTH TOKEN EXISTS:", !!token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        console.log("JWT DECODED:", decoded);

        req.user = decoded.id;

        console.log("REQ.USER:", req.user);

        next();

    } catch (error) {

        console.error(
            "JWT ERROR:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
}

module.exports = authMiddleware;