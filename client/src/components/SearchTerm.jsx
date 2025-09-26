import React, { useState } from "react";

import SearchIcon from "../assets/icon/search.png";

const SearchTerm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      onSearch(searchTerm); // parent callback for actual searching
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full flex justify-center mb-6">
      <div className="relative w-full max-w-md flex items-center">
        {/* Input Box */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search by Full Name, Phone, or WhatsApp..."
          className="w-full px-4 py-2 text-sm border rounded-l-full shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-400 
            focus:border-blue-400 transition-all duration-200"
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-blue-500 px-4 py-2 rounded-r-full flex items-center justify-center hover:bg-blue-600 transition"
        >
          <img src={SearchIcon} alt="Search" className="w-5 h-5" />
        </button>

        {/* Clear Button */}
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 
              text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchTerm;
