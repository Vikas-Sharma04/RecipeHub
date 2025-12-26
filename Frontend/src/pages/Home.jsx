import React, { useContext, useEffect, useState } from "react"; // Added useEffect, useState
import { Link, useNavigate } from "react-router-dom";
import { RecipeContext } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";
import { FaArrowRight, FaFire, FaPlusCircle, FaUtensils } from "react-icons/fa";

const Home = () => {
  const { recipes, fetchRecipes } = useContext(RecipeContext);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch recipes if they haven't been loaded yet
  useEffect(() => {
    const initHome = async () => {
      if (recipes.length === 0) {
        setFetching(true);
        await fetchRecipes();
        setFetching(false);
      }
    };
    initHome();
  }, [fetchRecipes, recipes.length]);

  // Take first 3 recipes as featured
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <div className="text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-40 md:pb-32 px-4 sm:px-8 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full -z-10"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            The Ultimate Foodie Destination
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
            Cook. Share. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Inspire.
            </span>
          </h1>
          
          <p className="text-gray-400 text-base sm:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Join a global community of home chefs. Discover secret ingredients, 
            master new techniques, and share your culinary masterpieces.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/create-recipe"
              className="w-full sm:w-auto px-10 py-5 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-white/5 flex items-center justify-center gap-2 group"
            >
              <FaPlusCircle className="group-hover:rotate-90 transition-transform" /> Add New Recipe
            </Link>
            <Link
              to="/recipes"
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
            >
              Explore All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Recipes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-3">
              <FaFire className="animate-bounce" /> Trending Now
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Featured Creations</h2>
          </div>
          
          <Link 
            to="/recipes" 
            className="group px-6 py-2 rounded-full border border-white/5 hover:bg-white/5 text-gray-400 hover:text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all"
          >
            View Full Gallery <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {fetching ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Loading Masterpieces</p>
          </div>
        ) : featuredRecipes.length === 0 ? (
          <div className="py-32 text-center bg-white/5 border border-white/10 rounded-[3.5rem] border-dashed group hover:border-indigo-500/50 transition-colors">
            <FaUtensils className="text-4xl text-gray-800 mx-auto mb-6" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">The kitchen is quiet... for now.</p>
            <Link to="/create-recipe" className="mt-6 inline-block text-indigo-400 font-bold hover:underline">Be the first to cook something!</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-14">
            {featuredRecipes.map((recipe) => (
              <div 
                key={recipe._id || recipe.id} 
                onClick={() => navigate(`/recipes/detail/${recipe._id || recipe.id}`)}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
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

export default Home;