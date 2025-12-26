import express from "express";
import {
  createRecipeController,
  deleteRecipeController,
  getAllRecipesController,
  updateRecipeController,
  getMyRecipesController,
  generateRecipeController,
  toggleFavoriteRecipeController,
} from "../controllers/recipe.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// CRUD
router.post("/", authMiddleware, createRecipeController);       // Create
router.get("/", getAllRecipesController);                       // Read (all)
router.get("/my", authMiddleware, getMyRecipesController);      // Read (my recipes)
router.put("/:id", authMiddleware, updateRecipeController);     // Update
router.delete("/:id", authMiddleware, deleteRecipeController);  // Delete
router.patch("/:id/favorite", authMiddleware, toggleFavoriteRecipeController);

// AI generate route
router.post("/generate", authMiddleware, generateRecipeController);

export default router;
