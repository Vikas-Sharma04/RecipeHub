import mongoose from "mongoose";
import userModel from "./user.model.js";

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    category: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

recipeSchema.pre("remove", async function (next) {
  try {
    if (this._id) {
      await userModel.updateMany(
        { favorites: this._id },
        { $pull: { favorites: this._id } }
      );
    }
    next();
  } catch (err) {
    console.error("Error in recipe pre-hook:", err);
    next(err);
  }
});


// Also handle findOneAndDelete / findByIdAndDelete
recipeSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
      await userModel.updateMany(
        { favorites: doc._id },
        { $pull: { favorites: doc._id } }
      );
    }
    next();
  } catch (err) {
    next(err);
  }
});

const recipeModel = mongoose.model("recipe", recipeSchema);
export default recipeModel;
