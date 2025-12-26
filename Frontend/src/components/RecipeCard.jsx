import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useContext, useState } from "react";
import { RecipeContext } from "../context/RecipeContext";
import { AuthContext } from "../context/AuthContext"; // Import your AuthContext
import { toast } from "react-toastify";
import { FaLayerGroup, FaUtensils } from "react-icons/fa6";

const RecipeCard = ({ item }) => {
  const { favorites, toggleFavorite } = useContext(RecipeContext);
  const { user } = useContext(AuthContext); // Get user status
  const [favLoading, setFavLoading] = useState(false);
  const navigate = useNavigate();

  // Safely handle both MongoDB _id and standard id
  const recipeId = item._id || item.id;
  const isFavorite = favorites.includes(recipeId);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevents Link navigation
    e.stopPropagation(); 

    // LOGIN CHECK
    if (!user) {
      toast.warn("Please login to add favorites");
      navigate("/login");
      return;
    }

    if (favLoading) return;

    try {
      setFavLoading(true);
      await toggleFavorite(recipeId);
    } catch (err) {
      toast.error("Action failed",err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="group relative bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 w-full max-w-[380px] mx-auto">
      
      {/* Floating Category Tag */}
      {item.category && (
        <div className="absolute top-4 left-4 z-20">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
            <FaLayerGroup className="text-indigo-400" /> {item.category}
          </span>
        </div>
      )}

      {/* Heart Action */}
      <button
        onClick={handleFavoriteClick}
        disabled={favLoading}
        className={`absolute top-4 right-4 z-20 p-2.5 rounded-full transition-all duration-300 shadow-xl ${
          isFavorite 
            ? "bg-red-500 text-white scale-110" 
            : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
        } ${favLoading ? "opacity-50" : "active:scale-90"}`}
      >
        {isFavorite ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
      </button>

      <Link to={`/recipes/detail/${recipeId}`} className="block">
        {/* Image Container with Zoom Effect */}
        <div className="relative h-56 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <FaUtensils className="text-white/20 text-4xl" />
            </div>
          )}
          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
        </div>

        {/* Content Area */}
        <div className="p-6">
          <h2 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors truncate">
            {item.title}
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4 font-medium">
            {item.description || "No description provided for this culinary masterpiece."}
          </p>

          {/* Mini Ingredients Preview */}
          <div className="flex flex-wrap gap-2">
            {item.ingredients?.slice(0, 3).map((ing, i) => (
              <span key={i} className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter bg-white/5 px-2 py-1 rounded-md border border-white/5">
                {ing}
              </span>
            ))}
            {item.ingredients?.length > 3 && (
              <span className="text-[10px] font-bold text-indigo-400 px-1 py-1">
                +{item.ingredients.length - 3} more
              </span>
            )}
          </div>

          {/* Card Footer Interaction */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
              View Details <span className="text-lg">→</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;