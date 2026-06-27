import React, { useState, useEffect } from "react";
import SearchIcon from "../assets/icon/search.png";

const SearchTerm = ({
  onSearch,
  currentFilters,
  uniqueDistricts = [],
  uniqueTalukas = [],
  uniqueVillages = [],
}) => {
  // Use currentFilters to set the initial state so inputs show saved values on refresh
  const [text, setText] = useState(currentFilters?.text || "");
  const [district, setDistrict] = useState(currentFilters?.district || "");
  const [taluka, setTaluka] = useState(currentFilters?.taluka || "");
  const [village, setVillage] = useState(currentFilters?.village || "");

  const triggerSearch = (
    updatedText,
    updatedDistrict,
    updatedTaluka,
    updatedVillage,
  ) => {
    onSearch({
      text: updatedText !== undefined ? updatedText : text,
      district: updatedDistrict !== undefined ? updatedDistrict : district,
      taluka: updatedTaluka !== undefined ? updatedTaluka : taluka,
      village: updatedVillage !== undefined ? updatedVillage : village,
    });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") triggerSearch();
  };

  const clearAll = () => {
    setText("");
    setDistrict("");
    setTaluka("");
    setVillage("");
    onSearch({ text: "", district: "", taluka: "", village: "" }); // Parent me reset karo
  };

  return (
    <div className="w-full flex flex-col items-center mb-6 space-y-4">
      {/* Search Input */}
      <div className="relative w-full max-w-md flex items-center">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress}
          placeholder="Search by Full Name, Phone, or WhatsApp..."
          className="w-full px-4 py-2 text-sm border rounded-l-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
        />
        <button
          onClick={() => triggerSearch()}
          className="bg-blue-500 px-4 py-2 rounded-r-full flex items-center justify-center hover:bg-blue-600 transition"
        >
          <img src={SearchIcon} alt="Search" className="w-5 h-5" />
        </button>
        {text && (
          <button
            onClick={() => {
              setText("");
              triggerSearch("", district, taluka, village);
            }}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            triggerSearch(text, e.target.value, taluka, village);
          }}
          className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-blue-400 focus:outline-none bg-white"
        >
          <option value="">બધા જિલ્લા (All Districts)</option>
          {uniqueDistricts.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={taluka}
          onChange={(e) => {
            setTaluka(e.target.value);
            triggerSearch(text, district, e.target.value, village);
          }}
          className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-blue-400 focus:outline-none bg-white"
        >
          <option value="">બધા તાલુકા (All Talukas)</option>
          {uniqueTalukas.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={village}
          onChange={(e) => {
            setVillage(e.target.value);
            triggerSearch(text, district, taluka, e.target.value);
          }}
          className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-blue-400 focus:outline-none bg-white"
        >
          <option value="">બધા ગામ (All Villages)</option>
          {uniqueVillages.map((v, i) => (
            <option key={i} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Clear All Button */}
      {(district || taluka || village || text) && (
        <button
          onClick={clearAll}
          className="text-sm text-red-500 hover:underline mt-2"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default SearchTerm;
