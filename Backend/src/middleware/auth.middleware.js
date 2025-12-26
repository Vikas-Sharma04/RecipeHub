// authMiddleware.js
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User no longer exists" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Session expired, please login again" });
    }
};

export default authMiddleware;