import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaUserCircle, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data); 
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>

      <div className="w-full max-w-md bg-gray-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white/10 relative">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/5 rounded-full border border-white/10 shadow-inner">
            <FaUserCircle className="text-4xl text-indigo-400" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-center text-gray-400 text-sm mb-10">
          Enter your credentials to access your recipes
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identifier Field */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
              <FaEnvelope className="text-[8px]" /> Username / Email
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("identifier", {
                  required: "Username or Email is required",
                })}
                placeholder="chef_vikas or vikas@example.com"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-sm"
              />
            </div>
            {errors.identifier && (
              <p className="text-red-400 text-[10px] font-semibold mt-1 ml-1 uppercase tracking-wider">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <FaLock className="text-[8px]" /> Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-sm"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-[10px] font-semibold mt-1 ml-1 uppercase tracking-wider">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group mt-4 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-500 active:scale-[0.98] shadow-xl shadow-white/5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>Sign In <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500 tracking-wide">
            New to Recipe Hub?{" "}
            <Link to="/signup" className="text-white font-bold hover:text-indigo-400 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;