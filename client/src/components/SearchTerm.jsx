import React, { useState } from "react";
import SearchIcon from "../assets/icon/search.png";
import customerCategory from "../features/customerCategoryList";

const SearchTerm = ({
  onSearch,
  currentFilters,
  uniqueDistricts = [],
  uniqueTalukas = [],
  uniqueVillages = [],
}) => {
  const [text, setText] = useState(currentFilters?.text || "");
  const [district, setDistrict] = useState(currentFilters?.district || "");
  const [taluka, setTaluka] = useState(currentFilters?.taluka || "");
  const [village, setVillage] = useState(currentFilters?.village || "");
  const [category, setCategory] = useState(currentFilters?.category || ""); // New Category State

  const triggerSearch = (
    updatedText,
    updatedDistrict,
    updatedTaluka,
    updatedVillage,
    updatedCategory,
  ) => {
    onSearch({
      text: updatedText !== undefined ? updatedText : text,
      district: updatedDistrict !== undefined ? updatedDistrict : district,
      taluka: updatedTaluka !== undefined ? updatedTaluka : taluka,
      village: updatedVillage !== undefined ? updatedVillage : village,
      category: updatedCategory !== undefined ? updatedCategory : category,
    });
  };

  const clearAll = () => {
    setText("");
    setDistrict("");
    setTaluka("");
    setVillage("");
    setCategory("");
    onSearch({ text: "", district: "", taluka: "", village: "", category: "" });
  };

  return (
    <div className="w-full flex flex-col items-center mb-6 space-y-4">
      {/* Text Search Input */}
      <div className="relative w-full max-w-md flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
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
              triggerSearch("", district, taluka, village, category);
            }}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        )}
      </div>

      {/* 4 Dropdown Filters (Updated to 4 columns on medium screens) */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* District Filter */}
        <select
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            triggerSearch(text, e.target.value, taluka, village, category);
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

        {/* Taluka Filter */}
        <select
          value={taluka}
          onChange={(e) => {
            setTaluka(e.target.value);
            triggerSearch(text, district, e.target.value, village, category);
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

        {/* Village Filter */}
        <select
          value={village}
          onChange={(e) => {
            setVillage(e.target.value);
            triggerSearch(text, district, taluka, e.target.value, category);
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

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            triggerSearch(text, district, taluka, village, e.target.value);
          }}
          className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-blue-400 focus:outline-none bg-white"
        >
          <option value="">બધી કેટેગરી (All Categories)</option>
          {customerCategory.map((cat, i) => (
            <option key={i} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear All Button */}
      {(district || taluka || village || category || text) && (
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
