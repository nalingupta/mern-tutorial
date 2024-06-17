const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Retrieve the token from the header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("not authorized");
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized. No token");
    }
});

module.exports = { protect };
