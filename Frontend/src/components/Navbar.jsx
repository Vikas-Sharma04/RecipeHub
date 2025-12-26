import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { user, logout, deleteAccount } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const lastScrollY = useRef(0);

  // Constants for better maintenance
  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Recipes", path: "/recipes" },
    { label: "Create Recipe", path: "/create-recipe" },
    { label: "Favorite", path: "/favorite" },
    { label: "My Recipes", path: "/my-recipes" },
  ];

  // Optimized Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Prevent navbar from hiding at the very top (elastic scroll bounce)
      if (currentScrollY <= 10) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Add a threshold (e.g., 5px) to prevent jitter on tiny movements
      if (Math.abs(currentScrollY - lastScrollY.current) < 5) return;

      if (currentScrollY > lastScrollY.current && visible) {
        setVisible(false); // Scrolling down
      } else if (currentScrollY < lastScrollY.current && !visible) {
        setVisible(true); // Scrolling up
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  // Dropdown Close Logic
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Handle Actions
  const handleLogout = useCallback(() => {
    logout();
    setMenuOpen(false);
    setMobileMenu(false);
    navigate("/login");
  }, [logout, navigate]);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (confirmed) {
      await deleteAccount();
      setMenuOpen(false);
      setMobileMenu(false);
      navigate("/login");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between 
          px-4 sm:px-8 py-3 sm:py-4 m-2 sm:m-4 rounded-full text-white text-sm 
          shadow-lg border border-white/20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md
          transition-all duration-500 ease-in-out
          ${visible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"}
        `}
      >
        <NavLink
          to="/"
          className="transition-transform duration-700 ease-in-out hover:rotate-[360deg] hover:scale-110 active:scale-95"
        >
          <img src="/logo.png" className="w-12 sm:w-16 h-auto" alt="logo" />
        </NavLink>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                ${isActive 
                  ? "bg-white shadow-[0px_0px_20px_4px_rgba(255,255,255,0.4)] text-black" 
                  : "text-gray-300 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 text-white font-bold text-lg shadow-lg cursor-pointer hover:ring-2 ring-white/50 transition-all"
              >
                {user.username?.charAt(0).toUpperCase()}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <Link
                    to="/user/edit"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-100 transition font-medium"
                  >
                    Edit Profile
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition font-medium"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition font-semibold"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Get Started
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenu(true)} 
            className="text-white p-2 hover:bg-white/10 rounded-full transition"
            aria-label="Open Menu"
          >
            <HiMenu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900/98 
          text-white shadow-[[-10px_0_30px_rgba(0,0,0,0.5)]] transform transition-transform duration-500 ease-in-out z-[70]
          ${mobileMenu ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center px-6 py-6 border-b border-white/10">
          <span className="text-xl font-bold tracking-tight">Navigation</span>
          <button onClick={() => setMobileMenu(false)} className="p-2 hover:bg-white/10 rounded-full transition">
            <HiX size={26} />
          </button>
        </div>

        <div className="flex flex-col p-6 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) =>
                `px-6 py-3 rounded-xl font-medium transition-all text-center
                ${isActive 
                  ? "bg-white text-black shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
            {user ? (
              <>
                <Link
                  to="/user/edit"
                  onClick={() => setMobileMenu(false)}
                  className="block px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-center font-bold"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 bg-white/5 text-gray-300 rounded-xl text-center font-bold"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full px-6 py-3 bg-red-600/10 text-red-500 border border-red-600/20 rounded-xl text-center font-bold"
                >
                  Delete Account
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="block bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg text-center"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;