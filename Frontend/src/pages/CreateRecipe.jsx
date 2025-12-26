import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { RecipeContext } from "../context/RecipeContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaCheckCircle, FaImage } from "react-icons/fa";

const CreateRecipe = () => {
  const { register, handleSubmit, reset, setValue, getValues, watch } = useForm();
  const { createRecipe, generateRecipe } = useContext(RecipeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Watch the image field to show a live preview
  const imagePreview = watch("image");

  const handleAIGenerate = async () => {
    const imageUrl = getValues("image");
    if (!imageUrl) return toast.error("Please provide an image URL first!");

    try {
      setAiLoading(true);
      const aiRecipe = await generateRecipe(imageUrl);
      if (!aiRecipe) return;

      setValue("title", aiRecipe.title || "");
      setValue("description", aiRecipe.description || "");
      setValue("ingredients", aiRecipe.ingredients || "");
      setValue("category", aiRecipe.category || "");

      toast.success("AI generated recipe successfully!");
    } catch (err) {
      toast.error("Failed to generate AI recipe.",err);
    } finally {
      setAiLoading(false);
    }
  };

  const submitHandler = async (data) => {
    if (!data.title || !data.description || !data.ingredients || !data.category || !data.image) {
      return toast.error("All fields are required!");
    }

    // Convert ingredients to array
    const ingredientsArray = typeof data.ingredients === "string"
      ? data.ingredients.split(",").map((i) => i.trim()).filter((i) => i)
      : [];

    try {
      setLoading(true);
      await createRecipe({ ...data, ingredients: ingredientsArray });
      toast.success("Recipe created successfully!");
      reset();
      navigate("/recipes");
    } catch (err) {
      toast.error("Failed to create recipe. Try again.",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 flex justify-center items-center bg-transparent">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-gray-900/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 border border-white/10 shadow-2xl">
        
        {/* Left Side: Preview & Instructions */}
        <div className="hidden md:flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Share Your <br/><span className="text-indigo-400">Culinary Masterpiece</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fill out the details manually or let our <span className="text-green-400 font-semibold">AI Assistant</span> identify the dish from your image link.
            </p>
          </div>

          {/* Square Image Preview Card */}
<div className="relative group flex-1 w-full aspect-square rounded-[2rem] border-2 border-dashed border-white/10 overflow-hidden bg-white/5 flex items-center justify-center transition-all duration-500">
  {imagePreview ? (
    <img 
      src={imagePreview} 
      alt="Preview" 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
  ) : (
    <div className="text-center text-gray-500">
      <div className="relative mb-4 flex justify-center">
        {/* Subtle pulsing glow for empty state */}
        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-150 animate-pulse"></div>
        <FaImage className="text-6xl relative z-10 opacity-20" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">
        Live Preview
      </p>
    </div>
  )}
  
  {/* Modern overlay for active preview */}
  {imagePreview && (
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
  )}
</div>

          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
             <p className="text-xs text-indigo-300 italic">"Good food is the foundation of genuine happiness."</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div className="md:hidden text-center mb-6">
             <h2 className="text-2xl font-bold text-white">Create Recipe</h2>
          </div>

          {/* AI Helper Button */}
          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={aiLoading}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 p-px font-semibold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <div className="relative flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 transition-all group-hover:bg-transparent">
              <FaRobot className={aiLoading ? "animate-bounce" : ""} />
              <span>{aiLoading ? "AI is thinking..." : "Magic Auto-Fill with AI"}</span>
            </div>
          </button>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Dish Image URL</label>
            <input
              {...register("image")}
              type="text"
              placeholder="https://example.com/food.jpg"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Recipe Title</label>
            <input
              {...register("title")}
              type="text"
              placeholder="e.g. Classic Margherita Pizza"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Category</label>
              <select
                {...register("category")}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white focus:border-indigo-500 outline-none"
              >
                <option value="">Select...</option>
        <option value="Breakfast">🍳 Breakfast</option>
        <option value="Lunch">🥗 Lunch</option>
        <option value="Dinner">🍝 Dinner</option>
        <option value="Dessert">🍰 Dessert</option>
        <option value="Snack">🥪 Snack</option>
        <option value="Drinks">🍹 Drinks</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Ingredients (comma separated)</label>
            <textarea
              {...register("ingredients")}
              rows="2"
              placeholder="Flour, Water, Yeast..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-500 transition-all outline-none"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FaCheckCircle /> Publish Recipe</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;