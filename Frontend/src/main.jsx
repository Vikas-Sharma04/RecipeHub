import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import RecipeProvider from "./context/RecipeContext";
import AuthProvider from "./context/AuthContext"; 

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RecipeProvider>
      <BrowserRouter>
        <App />
        <ToastContainer position="bottom-right" autoClose={3000}/>
      </BrowserRouter>
    </RecipeProvider>
  </AuthProvider>
);
