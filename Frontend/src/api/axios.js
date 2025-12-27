import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired");
    }
    return Promise.reject(error);
  }
);

// -------- AUTH --------
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = () => api.get("/auth/logout");
export const getCurrentUser = () => api.get("/auth/user"); 
export const deleteUserAccount = () => api.delete("/auth/user/delete"); 
export const updateUserAccount = (data) => api.put("/auth/user/update", data);

// -------- RECIPES --------
export const getAllRecipes = () => api.get("/recipes");
export const createRecipe = (data) => api.post("/recipes", data);
export const getMyRecipes = () => api.get("/recipes/my");
export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data);
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
export const toggleFavorite = (id) => api.patch(`/recipes/${id}/favorite`);
export const generateRecipeAI = (data) => api.post("/recipes/generate", data);

export default api;
