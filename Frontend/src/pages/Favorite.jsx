import { useContext, useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import { RecipeContext } from "../context/RecipeContext";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";
import { FaHeart, FaArrowRight, FaRegFrownOpen } from "react-icons/fa";

const Favorites = () => {
  // Add 'loading' from your Context if available, or use the check below
  const { recipes, favorites, toggleFavorite, loading } = useContext(RecipeContext);

  // 1. Derive favorite recipes
  const favoriteRecipes = recipes.filter((r) =>
    favorites.includes(r._id || r.id)
  );

  const [displayedRecipes, setDisplayedRecipes] = useState(favoriteRecipes);

  // 2. Sync displayed recipes with favorites/recipes changes
  useEffect(() => {
    setDisplayedRecipes(favoriteRecipes);
  }, [favorites, recipes]);

  // 3. IMPROVED LOADER LOGIC
  // If we are actually fetching data, show loader. 
  // Otherwise, if we aren't loading, but recipes are 0, we don't block the UI.
  if (loading && recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium animate-pulse">Gathering your cookbook...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 lg:px-12">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-indigo-600/5 blur-[120px] -z-10 pointer-events-none"></div>

      <header className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest mb-4">
          <FaHeart className="animate-pulse" /> Curated Collection
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          My Favorites
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
          All the dishes you've loved, saved in one beautiful place.
        </p>
      </header>

      {/* Only show search if there are favorites to search through */}
      {favoriteRecipes.length > 0 && (
        <div className="max-w-2xl mx-auto mb-16 px-2">
          <SearchBar recipes={favoriteRecipes} onFilter={setDisplayedRecipes} />
        </div>
      )}

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto">
        {favoriteRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-white/10 rounded-[2.5rem] border-dashed">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <FaRegFrownOpen className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your heart list is empty</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-xs">
              Start exploring our gallery and save recipes that catch your eye!
            </p>
            <Link
              to="/recipes"
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-indigo-500 hover:text-white transition-all active:scale-95 group"
            >
              Discover Recipes <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {displayedRecipes.map((recipe) => (
              <div key={recipe._id || recipe.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <RecipeCard
                  item={recipe}
                  onToggleFavorite={() =>
                    toggleFavorite(recipe._id || recipe.id)
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* Search Results Empty State */}
        {favoriteRecipes.length > 0 && displayedRecipes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 italic">No favorites match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;