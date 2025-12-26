import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaShieldAlt, FaArrowRight } from "react-icons/fa";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await signup({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success("Account created! Welcome to the Hub.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-20">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-600/15 blur-[120px] rounded-full -z-10 animate-pulse"></div>

      <div className="w-full max-w-lg bg-gray-900/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 sm:p-12 border border-white/10 relative">
        
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/5 rounded-full border border-white/10 shadow-inner">
            <FaUserPlus className="text-4xl text-indigo-400" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">
          Join the Hub
        </h2>
        <p className="text-center text-gray-400 text-sm mb-10">
          Start your culinary journey with us today
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username & Email Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <FaUser className="text-[8px]" /> Username
              </label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                placeholder="chef_master"
                className="w-full px-5 py-3 rounded-2xl bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500 transition-all outline-none text-sm"
              />
              {errors.username && <p className="text-red-400 text-[10px] font-semibold mt-1 ml-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <FaEnvelope className="text-[8px]" /> Email
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="you@example.com"
                className="w-full px-5 py-3 rounded-2xl bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500 transition-all outline-none text-sm"
              />
              {errors.email && <p className="text-red-400 text-[10px] font-semibold mt-1 ml-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <FaLock className="text-[8px]" /> Password
              </label>
              <input
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-2xl bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500 transition-all outline-none text-sm"
              />
              {errors.password && <p className="text-red-400 text-[10px] font-semibold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <FaShieldAlt className="text-[8px]" /> Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-2xl bg-white/5 text-white placeholder-gray-500 border border-white/10 focus:border-indigo-500 transition-all outline-none text-sm"
              />
              {errors.confirmPassword && <p className="text-red-400 text-[10px] font-semibold mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group mt-6 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white transition-all duration-500 active:scale-[0.98] shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>Create Account <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-gray-500 tracking-wide">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-bold hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;