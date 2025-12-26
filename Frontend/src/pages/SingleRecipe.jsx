import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RecipeContext } from "../context/RecipeContext";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
  FaTrash,
  FaSave,
  FaLayerGroup,
  FaListUl,
  FaInfoCircle,
} from "react-icons/fa";

const SingleRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    recipes,
    updateRecipe,
    deleteRecipe,
    favorites,
    toggleFavorite,
    fetchRecipes,
  } = useContext(RecipeContext);

  const currentRecipe = recipes.find((r) => r._id === id || r.id === id);

  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const ownerId = currentRecipe?.user?._id || currentRecipe?.user;
  const isOwner = user?._id === ownerId;
  const isFavorite =
    currentRecipe && Array.isArray(favorites)
      ? favorites.includes(currentRecipe._id || currentRecipe.id)
      : false;

  useEffect(() => {
    if (!currentRecipe) return;
    reset({
      image: currentRecipe.image || "",
      title: currentRecipe.title || "",
      description: currentRecipe.description || "",
      ingredients: Array.isArray(currentRecipe.ingredients)
        ? currentRecipe.ingredients.join(", ")
        : currentRecipe.ingredients || "",
      category: currentRecipe.category || "",
    });
  }, [currentRecipe, reset]);

  if (!currentRecipe) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 tracking-widest uppercase text-xs">
        Recipe not found or loading...
      </div>
    );
  }

  const submitHandler = async (data) => {
    if (data.ingredients) {
      data.ingredients = data.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i);
    }
    try {
      setLoading(true);
      await updateRecipe(id, data);
      toast.success("Recipe updated successfully!");
      await fetchRecipes();
    } catch (err) {
      toast.error("Failed to update recipe.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    if (window.confirm("Delete this masterpiece permanently?")) {
      try {
        setLoading(true);
        await deleteRecipe(id);
        toast.success("Recipe deleted!");
        navigate("/recipes");
      } catch (err) {
        toast.error("Failed to delete recipe.", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFavoriteClick = async () => {
    if (!currentRecipe || favLoading) return;
    try {
      setFavLoading(true);
      await toggleFavorite(currentRecipe._id || currentRecipe.id);
    } catch (err) {
      toast.error("Favorite toggle failed.", err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 lg:px-16 relative">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* LEFT: CONTENT VIEW */}
        <div className="flex-[1.5] space-y-8">
          <div className="relative group rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
            <img
              src={currentRecipe.image}
              alt={currentRecipe.title}
              className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

            {/* Action Buttons Overlay */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button
                onClick={handleFavoriteClick}
                disabled={favLoading}
                className={`p-4 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                  isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isFavorite ? (
                  <AiFillHeart size={24} />
                ) : (
                  <AiOutlineHeart size={24} />
                )}
              </button>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <span className="px-4 py-1 rounded-full bg-indigo-500 text-[10px] font-black uppercase tracking-widest text-white mb-4 inline-block">
                {currentRecipe.category || "General"}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {currentRecipe.title}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
              <div className="flex items-center gap-2 text-indigo-400 mb-4 font-bold uppercase tracking-widest text-xs">
                <FaInfoCircle /> Description
              </div>
              <p className="text-gray-300 leading-relaxed italic">
                "{currentRecipe.description}"
              </p>
            </div>

            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 mb-4 font-bold uppercase tracking-widest text-xs">
                <FaListUl /> Ingredients
              </div>
              <ul className="space-y-3">
                {currentRecipe.ingredients?.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-gray-300 text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT: EDIT PANEL (Sticky) */}
        {isOwner && (
          <div className="flex-1 lg:max-w-md">
            <div className="sticky top-32 bg-gray-900/50 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Recipe Settings
                </h2>
              </div>

              <form
                onSubmit={handleSubmit(submitHandler)}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Image URL
                  </label>
                  <input
                    {...register("image")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Title
                  </label>
                  <input
                    {...register("title")}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Ingredients (Comma Separated)
                  </label>
                  <textarea
                    {...register("ingredients")}
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="Breakfast">🍳 Breakfast</option>
                    <option value="Lunch">🥗 Lunch</option>
                    <option value="Dinner">🍝 Dinner</option>
                    <option value="Dessert">🍰 Dessert</option>
                    <option value="Snack">🥪 Snack</option>
                    <option value="Drinks">🍹 Drinks</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                  >
                    <FaSave /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all active:scale-95"
                  >
                    <FaTrash />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleRecipe;
