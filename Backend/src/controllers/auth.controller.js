import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import recipeModel from '../models/recipe.model.js';

const getUserController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ user: null });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel
      .findById(decoded._id)
      .select("-password")
      .populate("favorites");

    if (!user) {
      return res.status(200).json({ user: null });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(200).json({ user: null });
  }
};

const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const bcryptPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: bcryptPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { identifier, password } = req.body; 

    const user = await userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // UPDATE: Added maxAge for 7-day persistence
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "User logged in successfully",
      user: userData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutController = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.json({
    message: "Logged out successfully"
  });
};

const deleteAccountController = async (req, res) => {
  try {
    const userId = req.user._id;

    await recipeModel.deleteMany({ user: userId });

    await userModel.updateMany(
      { favorites: { $in: userId } },
      { $pull: { favorites: userId } }
    );

    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Account and all your recipes deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, email, password } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} is already in use` });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export {
  registerController, 
  loginController,
  logoutController,
  getUserController,
  deleteAccountController,
  updateUserController
};