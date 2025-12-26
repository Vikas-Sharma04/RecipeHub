import { useContext, useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { RecipeContext } from "../context/RecipeContext";
import SearchBar from "../components/SearchBar";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { FaPlus, FaBookOpen, FaRobot } from "react-icons/fa6"; // Using fa6 for consistency

const Myrecipes = () => {
  const { recipes, fetchMyRecipes } = useContext(RecipeContext);
  const [loading, setLoading] = useState(true);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        await fetchMyRecipes();
      } catch (err) {
        console.error("Failed to load recipes:", err);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  useEffect(() => {
    setDisplayedRecipes(recipes);
  }, [recipes]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Reviewing Your Kitchen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-8 lg:px-12 relative overflow-hidden">
      {/* Decorative Gradient Glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] -z-10 rounded-full"></div>

      <header className="max-w-6xl mx-auto mb-16 px-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <FaRobot className="text-xs" /> Culinary Portfolio
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              My <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Creations</span>
            </h1>
            <p className="mt-4 text-gray-500 text-sm md:text-base font-medium max-w-md">
              Managing and refining your personal collection of world-class recipes.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative text-center px-8 py-4 bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem]">
                <p className="text-3xl font-black text-white">{recipes.length}</p>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Dishes</p>
              </div>
            </div>

            <Link
              to="/create-recipe"
              className="group flex items-center gap-3 px-8 py-5 bg-blue-600 hover:bg-white text-white hover:text-black rounded-[2rem] shadow-2xl shadow-blue-500/20 transition-all duration-500 active:scale-95"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">New Recipe</span>
              <FaPlus className="group-hover:rotate-90 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      </header>

      {/* Modern Glass Search Wrapper */}
      <div className="max-w-3xl mx-auto mb-20 px-4">
        <div className="max-w-2xl mx-auto mb-16 px-2">
          <SearchBar recipes={recipes} onFilter={setDisplayedRecipes} />
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-4">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-inner">
              <FaBookOpen className="text-4xl text-gray-700" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 tracking-tight">Your cookbook is empty</h2>
            <p className="text-gray-500 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
              Start your journey by documenting your very first secret ingredient.
            </p>
            <Link
              to="/create-recipe"
              className="bg-white text-black px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl"
            >
              Add First Recipe
            </Link>
          </div>
        ) : displayedRecipes.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No matches in your collection</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-14">
            {displayedRecipes.map((recipe, index) => (
              <div 
                key={recipe._id || recipe.id} 
                onClick={() => navigate(`/recipes/detail/${recipe._id || recipe.id}`)}
                className="cursor-pointer group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <RecipeCard item={recipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Myrecipes;