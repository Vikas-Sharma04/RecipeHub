import mongoose from "mongoose";
import recipeModel from "./recipe.model.js";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipe" }],
  },
  { timestamps: true }
);

// Pre-hook: delete all recipes created by this user before removing the user
userSchema.pre("remove", async function (next) {
  try {
    // Find all recipes created by this user
    const userRecipes = await recipeModel.find({ user: this._id });

    for (const recipe of userRecipes) {
      // This will trigger recipe pre-remove hooks to clean favorites
      await recipe.remove();
    }

    next();
  } catch (err) {
    next(err);
  }
});

// user.model.js
userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (!doc) return next(); // user not found

    const userRecipes = await recipeModel.find({ user: doc._id });
    for (const recipe of userRecipes) {
      if (recipe) {
        try {
          await recipe.remove();
        } catch (err) {
          console.error("Error removing recipe:", err);
        }
      }
    }

    next();
  } catch (err) {
    console.error("Error in user pre-hook:", err);
    next(err);
  }
});


const userModel = mongoose.model("user", userSchema);
export default userModel;
