import { useForm } from "react-hook-form";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaShieldAlt, FaSave } from "react-icons/fa";

const EditProfile = () => {
  const { user, updateAccount } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("password", "");

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      // Clean data: if password is empty, don't send it to the backend
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
        delete updateData.confirmPassword;
      }
      
      await updateAccount(updateData);
      navigate('/');
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-transparent">
      <div className="w-full max-w-xl bg-gray-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 text-center border-b border-white/5">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Account Settings</h2>
          <p className="text-gray-400 text-sm mt-1">Update your personal information and security</p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="p-8 sm:p-10 space-y-6">
          
          {/* Username & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaUser className="text-[8px]" /> Username
              </label>
              <input
                {...register("username", { required: "Username is required" })}
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 transition-all outline-none text-sm"
              />
              {errors.username && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaEnvelope className="text-[8px]" /> Email Address
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 transition-all outline-none text-sm"
              />
              {errors.email && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className="h-px bg-white/5 w-full my-2" />

          {/* Password Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaLock className="text-[8px]" /> New Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 transition-all outline-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FaShieldAlt className="text-[8px]" /> Confirm
              </label>
              <input
                {...register("confirmPassword", {
                  validate: (value) => !newPassword || value === newPassword || "Passwords do not match",
                })}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-500 transition-all outline-none text-sm"
              />
              {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <p className="text-[10px] text-gray-500 italic text-center">
            Leave password fields blank if you don't want to change it.
          </p>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gradient-to-r hover:from-blue-500 hover:to-pink-500 hover:text-white transition-all duration-500 active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl shadow-white/5"
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <><FaSave /> Save Changes</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;