const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    // Extract the token (Remove the 'Bearer ' part)
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access Denied. No token found.');
    }

    const secretKey = process.env.JWT; // Ensure JWT secret key is correctly set in .env

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token.');
        }

        // Attach user data to the request object
        req.user = {
          id: decoded._id, // Make sure the token contains _id
          email: decoded.email,
          role: decoded.user_role // Assuming 'user_role' is in the token
        };

        // Proceed to the next middleware or route handler
        next();
    });
};

module.exports = authMiddleware;
