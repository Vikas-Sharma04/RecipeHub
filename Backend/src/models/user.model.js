import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipe" }],
  },
  { timestamps: true }
);

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (!doc) return next();
    const recipeModel = mongoose.model("recipe");
    const recipes = await recipeModel.find({ user: doc._id });
    
    for (const recipe of recipes) {
       await recipeModel.findByIdAndDelete(recipe._id);
    }

    next();
  } catch (err) {
    next(err);
  }
});

const userModel = mongoose.model("user", userSchema);
export default userModel;