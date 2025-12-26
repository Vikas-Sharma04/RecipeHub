import { useContext, useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { RecipeContext } from "../context/RecipeContext";
import SearchBar from "../components/SearchBar";
import { FaUtensils, FaSearch } from "react-icons/fa";

const Recipes = () => {
  const { recipes, fetchRecipes } = useContext(RecipeContext);
  const [loading, setLoading] = useState(true);
  const [displayedRecipes, setDisplayedRecipes] = useState([]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        await fetchRecipes();
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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <FaUtensils className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 animate-pulse" />
        </div>
        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Curating Flavors</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-8 lg:px-12 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10 pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      {/* Hero Header */}
      <header className="max-w-5xl mx-auto text-center mb-20 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm">
           Discover Global Tastes
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
          Taste the <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Extraordinary</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed opacity-80">
          Unleash your inner chef. Explore a curated world of ingredients, techniques, and community-favorite dishes.
        </p>
      </header>

      {/* Search Section Container */}
      <section className="max-w-4xl mx-auto mb-24">
        <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative group">
          {/* Subtle Outer Glow on Search Bar */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2.6rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative z-10">
            <SearchBar recipes={recipes} onFilter={setDisplayedRecipes} />
          </div>

          {/* Integrated Results Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-white/5 px-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">
                  {displayedRecipes.length} <span className="text-gray-500 ml-1">Results Found</span>
                </p>
              </div>
            </div>

            {displayedRecipes.length !== recipes.length && (
              <button 
                onClick={() => setDisplayedRecipes(recipes)}
                className="group flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white text-gray-400 hover:text-black rounded-full transition-all duration-500 active:scale-95"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Clear Filters</span>
                <FaSearch className="text-[8px] group-hover:rotate-12 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto">
        {displayedRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10 mx-4">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-inner">
              <FaSearch className="text-4xl text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Zero matches found</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-10 leading-relaxed font-medium">
              We couldn't find what you were looking for. Try a different keyword or category.
            </p>
            <button 
               onClick={() => setDisplayedRecipes(recipes)}
               className="px-10 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5"
            >
              Reset Discovery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-14 px-2">
            {displayedRecipes.map((recipe, index) => (
              <div 
                key={recipe._id || recipe.id} 
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both"
              >
                <RecipeCard item={recipe} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Recipes;