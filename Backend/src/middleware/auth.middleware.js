import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
    // 1. Get token from cookies
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized: No token provided" 
        });
    }

    try {
        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Find user and exclude password from the object for security
        const user = await userModel.findById(decoded.id || decoded._id).select("-password");
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: User not found" 
            });
        }

        // 4. Attach user to the request object
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);

        // 5. Handle specific JWT errors
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired, please login again" });
        }
        
        res.status(401).json({ message: "Invalid token, authorization denied" });
    }
};

export default authMiddleware;