import { createContext, useState, useEffect, useContext } from "react";
import {
  getAllRecipes,
  getMyRecipes,
  createRecipe as apiCreateRecipe,
  updateRecipe as apiUpdateRecipe,
  deleteRecipe as apiDeleteRecipe,
  toggleFavorite as apiToggleFavorite,
  generateRecipeAI,
  getCurrentUser
} from "../api/axios";
import { AuthContext } from "./AuthContext";

const RecipeContext = createContext(null);

const RecipeProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]); // store recipe ids

  // --- Fetch all recipes
  const fetchRecipes = async () => {
    try {
      const res = await getAllRecipes();
      const mapped = res.data.map(r => ({ ...r, id: r._id }));
      setRecipes(mapped);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    }
  };

  // --- Fetch my recipes only
  const fetchMyRecipes = async () => {
    try {
      const res = await getMyRecipes();
      const mapped = res.data.map(r => ({ ...r, id: r._id }));
      setRecipes(mapped);
    } catch (err) {
      console.error("Failed to fetch my recipes:", err);
    }
  };

  // --- Create recipe
  const createRecipe = async (data) => {
    try {
      const res = await apiCreateRecipe(data);
      const newRecipe = { ...res.data, id: res.data._id };
      setRecipes(prev => [...prev, newRecipe]);
    } catch (err) {
      console.error("Failed to create recipe:", err.response?.data?.message || err);
    }
  };

  // --- Update recipe
  const updateRecipe = async (id, updatedData) => {
    try {
      const res = await apiUpdateRecipe(id, updatedData);
      const updatedRecipe = { ...res.data, id: res.data._id };
      setRecipes(prev => prev.map(r => r.id === id ? updatedRecipe : r));
    } catch (err) {
      console.error("Failed to update recipe:", err.response?.data?.message || err);
    }
  };

  // --- Delete recipe
  const deleteRecipe = async (id) => {
    try {
      await apiDeleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
      setFavorites(prev => prev.filter(fid => fid !== id));
    } catch (err) {
      console.error("Failed to delete recipe:", err.response?.data?.message || err);
    }
  };

  // --- Toggle favorite (syncs backend + updates AuthContext.user)
  const toggleFavorite = async (id) => {
    try {
      // optimistic update
      setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
      setRecipes(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));

      await apiToggleFavorite(id);

      // Refresh user (so AuthContext stays in sync)
      const res = await getCurrentUser();
      setUser(res.data.user);

      // Update favorites again from fresh user
      const favIds = res.data.user?.favorites?.map(f => (typeof f === "object" ? f._id : f)) || [];
      setFavorites(favIds);

    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  // --- Generate recipe using AI
const generateRecipe = async (imageUrl) => {
  try {
    const res = await generateRecipeAI({ image: imageUrl });
    const aiRecipe = res.data.recipe;

    // Normalize ingredients to comma-separated string if array
    if (aiRecipe.ingredients && Array.isArray(aiRecipe.ingredients)) {
      aiRecipe.ingredients = aiRecipe.ingredients.join(", ");
    }

    return aiRecipe;
  } catch (err) {
    console.error("Failed to generate AI recipe:", err.response?.data?.message || err);
    return null;
  }
};


  // --- When user changes, update favorites + recipes
  useEffect(() => {
    if (user) {
      fetchRecipes();
      const favIds = user.favorites?.map(f => (typeof f === "object" ? f._id : f)) || [];
      setFavorites(favIds);
    } else {
      setFavorites([]);
      setRecipes([]);
    }
  }, [user]);

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        setRecipes,
        favorites,
        setFavorites,
        fetchRecipes,
        fetchMyRecipes,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite,
        generateRecipe
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export { RecipeContext };
export default RecipeProvider;