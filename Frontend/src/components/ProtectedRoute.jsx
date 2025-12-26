import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext); 
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please login first!");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;