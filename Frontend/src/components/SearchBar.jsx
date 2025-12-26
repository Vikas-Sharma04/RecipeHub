import { useState } from "react";
import { Search } from "lucide-react"; // 👈 modern icon

const SearchBar = ({ recipes, onFilter }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filterRecipes = (query, selectedCategory) => {
    const filtered = recipes.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ? true : r.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    onFilter(filtered);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    filterRecipes(query, category);
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    filterRecipes(search, selected);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search recipes..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 text-white placeholder-gray-400 border border-slate-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none shadow-md transition duration-200"
        />
      </div>

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={handleCategoryChange}
        className="px-4 py-3 rounded-xl bg-gradient-to-r bg-[#1e293b] from-slate-800/60 to-slate-700/60 text-white border border-slate-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none shadow-md transition duration-200 w-full sm:w-56"
      >
        <option value="all">✨ All</option>
        <option value="Breakfast">🍳 Breakfast</option>
        <option value="Lunch">🥗 Lunch</option>
        <option value="Dinner">🍝 Dinner</option>
        <option value="Dessert">🍰 Dessert</option>
        <option value="Snack">🥪 Snack</option>
        <option value="Drinks">🍹 Drinks</option>
      </select>
    </div>
  );
};

export default SearchBar;