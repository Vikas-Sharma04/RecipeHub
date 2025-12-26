import express from 'express';
import authMiddleware from "../middleware/auth.middleware.js";
import { 
  registerController, 
  loginController, 
  logoutController, 
  getUserController,
  updateUserController,
  deleteAccountController  // import the new controller
} from '../controllers/auth.controller.js';

const router = express.Router();

// REGISTER
router.post('/register', registerController);

// LOGIN
router.post('/login', loginController);

// LOGOUT
router.get('/logout', logoutController);

// GET USER
router.get('/user', getUserController);

// DELETE ACCOUNT
router.delete('/user/delete', authMiddleware, deleteAccountController);

// UPDATE USER
router.put('/user/update', authMiddleware, updateUserController);

export default router;
