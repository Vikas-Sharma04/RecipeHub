import recipeModel from "../models/recipe.model.js";
import userModel from "../models/user.model.js";
import generateRecipe from "../services/generateRecipe.js";

const createRecipeController = async (req, res) => {
  try {
    let { title, description, ingredients, image, category } = req.body;

    // Normalize inputs
    title = title?.trim();
    description = description?.trim();
    image = image?.trim();
    category = category?.trim();
    ingredients = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === "string"
      ? ingredients.split(",").map(i => i.trim()).filter(i => i)
      : [];

    // Validate required fields
    if (!title || !description || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const recipe = await recipeModel.create({
      title,
      description,
      ingredients,
      image,
      category,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ message: err.message });
  }
};

const generateRecipeController = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Image is required" });

    const aiData = await generateRecipe(image);

    res.status(200).json({
      message: "AI recipe generated successfully",
      recipe: aiData,
    });
  } catch (err) {
    console.error("Error generating AI recipe:", err);
    res.status(500).json({ message: err.message });
  }
};


// DELETE RECIPE
const deleteRecipeController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find recipe first
    const recipe = await recipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check ownership
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to delete this recipe" });
    }

    // Delete recipe
    await recipe.deleteOne();

    // Remove recipe from all users' favorites
    await userModel.updateMany(
      { favorites: recipe._id },
      { $pull: { favorites: recipe._id } }
    );

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// UPDATE RECIPE
const updateRecipeController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find recipe first
    const recipe = await recipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check ownership
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to update this recipe" });
    }

    // Update recipe
    Object.assign(recipe, req.body);
    await recipe.save();

    res.status(200).json({ message: "Recipe updated successfully", updatedRecipe: recipe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get only recipes created by the logged-in user
const getMyRecipesController = async (req, res) => {
  try {
    const recipes = await recipeModel.find({ user: req.user._id });
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle favorite status of a recipe
const toggleFavoriteRecipeController = async (req, res) => {
  try {
    const { id } = req.params; // recipe id
    const user = await userModel.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.findIndex(favId => favId.toString() === id);

    if (index > -1) {
      user.favorites.splice(index, 1); // remove
    } else {
      user.favorites.push(id); // add
    }

    await user.save();

    res.status(200).json({
      message: "Favorites updated",
      favorites: user.favorites
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all recipes
const getAllRecipesController = async (req, res) => {
  try {
    const recipes = await recipeModel.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {generateRecipeController, createRecipeController, deleteRecipeController, updateRecipeController, getMyRecipesController, toggleFavoriteRecipeController, getAllRecipesController };