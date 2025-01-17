const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Extract token from "Bearer <token>"
    console.log(token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            console.error(err);
            // If token is invalid or expired, send an error
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        // If valid, attach the decoded user data to the request object
        console.log('Decoded payload: ', decoded);
        req.data = decoded;  // You can now access the decoded data in your routes (e.g., userId)
        next();  // Continue to the next middleware or route handler
    });
};
module.exports = authenticateToken;