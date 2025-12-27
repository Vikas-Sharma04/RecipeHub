import { createContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  deleteUserAccount,
  updateUserAccount,
} from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        // res.data.user will now be the user object OR null (without crashing)
        setUser(res.data.user);
      } catch (err) {
        // This will now ONLY run if the server is actually down (500 error)
        console.error("Server connection failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // --- LOGIN ---
  const login = async (data) => {
    try {
      const res = await loginUser(data);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  // --- REGISTER ---
  const signup = async (data) => {
    try {
      const res = await registerUser(data);
      setUser(res.data.user);
      toast.success("Account created successfully 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.info("Logged out successfully!");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed");
    }
  };

  // --- DELETE ACCOUNT ---
  const deleteAccount = async () => {
    try {
      await deleteUserAccount();
      setUser(null);
      toast.success("Account deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  // --- UPDATE ACCOUNT ---
  const updateAccount = async (data) => {
    try {
      const res = await updateUserAccount(data);
      setUser(res.data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        logout,
        deleteAccount,
        loading,
        updateAccount,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;