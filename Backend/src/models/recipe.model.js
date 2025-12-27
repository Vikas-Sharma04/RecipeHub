import mongoose from "mongoose";

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

recipeSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
      const userModel = mongoose.model("user"); 
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