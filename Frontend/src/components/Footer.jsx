import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-400 py-8 px-4 border-t border-white/5">
      <div className="container mx-auto flex flex-col items-center space-y-4">
        
        {/* Simple Navigation Links */}
        <div className="flex gap-6 text-sm font-medium">
          <NavLink to="/" className="hover:text-white transition-colors">Home</NavLink>
          <NavLink to="/recipes" className="hover:text-white transition-colors">Recipes</NavLink>
          <NavLink to="/about" className="hover:text-white transition-colors">About</NavLink>
        </div>

        {/* Brand Divider */}
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

        {/* Copyright */}
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-500">
          © {new Date().getFullYear()} Recipe Hub • Handcrafted with 🤍 by Vikas Sharma
        </p>
      </div>
    </footer>
  );
};

export default Footer;