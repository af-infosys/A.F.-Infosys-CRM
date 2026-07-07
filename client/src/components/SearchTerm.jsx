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
  // Existing States
  const [text, setText] = useState(currentFilters?.text || "");
  const [district, setDistrict] = useState(currentFilters?.district || "");
  const [taluka, setTaluka] = useState(currentFilters?.taluka || "");
  const [village, setVillage] = useState(currentFilters?.village || "");
  const [category, setCategory] = useState(currentFilters?.category || "");
  const [interested, setInterested] = useState(
    currentFilters?.interested || false,
  );

  // Call History States
  const [startDate, setStartDate] = useState(currentFilters?.startDate || "");
  const [endDate, setEndDate] = useState(currentFilters?.endDate || "");
  const [callDirection, setCallDirection] = useState(
    currentFilters?.callDirection || "both",
  );
  const [hasFollowUp, setHasFollowUp] = useState(
    currentFilters?.hasFollowUp || false,
  );

  const triggerSearch = (
    updatedText,
    updatedDistrict,
    updatedTaluka,
    updatedVillage,
    updatedCategory,
    updatedInterested,
    updatedStartDate,
    updatedEndDate,
    updatedDirection,
    updatedFollowUp,
  ) => {
    onSearch({
      text: updatedText !== undefined ? updatedText : text,
      district: updatedDistrict !== undefined ? updatedDistrict : district,
      taluka: updatedTaluka !== undefined ? updatedTaluka : taluka,
      village: updatedVillage !== undefined ? updatedVillage : village,
      category: updatedCategory !== undefined ? updatedCategory : category,
      interested:
        updatedInterested !== undefined ? updatedInterested : interested,
      startDate: updatedStartDate !== undefined ? updatedStartDate : startDate,
      endDate: updatedEndDate !== undefined ? updatedEndDate : endDate,
      callDirection:
        updatedDirection !== undefined ? updatedDirection : callDirection,
      hasFollowUp:
        updatedFollowUp !== undefined ? updatedFollowUp : hasFollowUp,
    });
  };

  const clearAll = () => {
    setText("");
    setDistrict("");
    setTaluka("");
    setVillage("");
    setCategory("");
    setInterested(false);
    setStartDate("");
    setEndDate("");
    setCallDirection("both");
    setHasFollowUp(false);
    onSearch({
      text: "",
      district: "",
      taluka: "",
      village: "",
      category: "",
      interested: false,
      startDate: "",
      endDate: "",
      callDirection: "both",
      hasFollowUp: false,
    });
  };

  const clearDateRangeOnly = () => {
    setStartDate("");
    setEndDate("");
    triggerSearch(
      text,
      district,
      taluka,
      village,
      category,
      interested,
      "",
      "",
      callDirection,
      hasFollowUp,
    );
  };

  // --- Date Formatting and Quick Selection Logic ---
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleQuickDate = (rangeType) => {
    const today = new Date();
    let newStart = "";
    let newEnd = formatDateForInput(today);

    if (rangeType === "today") {
      newStart = newEnd;
    } else if (rangeType === "thisMonth") {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      newStart = formatDateForInput(firstDayOfMonth);
    } else if (rangeType === "last3Months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      newStart = formatDateForInput(threeMonthsAgo);
    }

    setStartDate(newStart);
    setEndDate(newEnd);
    triggerSearch(
      text,
      district,
      taluka,
      village,
      category,
      interested,
      newStart,
      newEnd,
      callDirection,
      hasFollowUp,
    );
  };

  return (
    <div className="w-full flex flex-col items-center mb-6 space-y-4">
      {/* 1. Text Search Input */}
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
              triggerSearch(
                "",
                district,
                taluka,
                village,
                category,
                interested,
                startDate,
                endDate,
                callDirection,
                hasFollowUp,
              );
            }}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        )}
      </div>

      {/* 2. Dropdown Filters (Location & Category) */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* District Dropdown */}
        <select
          value={district}
          onChange={(e) => {
            const newDistrict = e.target.value;
            setDistrict(newDistrict);
            setTaluka("");
            setVillage("");
            triggerSearch(
              text,
              newDistrict,
              "",
              "",
              category,
              interested,
              startDate,
              endDate,
              callDirection,
              hasFollowUp,
            );
          }}
          className={`border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-blue-400 focus:outline-none transition-colors ${
            district ? "bg-yellow-100 border-yellow-400" : "bg-white"
          }`}
        >
          <option value="">બધા જિલ્લા (All Districts)</option>
          {uniqueDistricts.map((d, i) => (
            <option key={i} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Taluka Dropdown */}
        <select
          value={taluka}
          onChange={(e) => {
            const newTaluka = e.target.value;
            setTaluka(newTaluka);
            setVillage("");
            triggerSearch(
              text,
              district,
              newTaluka,
              "",
              category,
              interested,
              startDate,
              endDate,
              callDirection,
              hasFollowUp,
            );
          }}
          className={`border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-blue-400 focus:outline-none transition-colors ${
            taluka ? "bg-yellow-100 border-yellow-400" : "bg-white"
          }`}
        >
          <option value="">બધા તાલુકા (All Talukas)</option>
          {uniqueTalukas.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Village Dropdown */}
        <select
          value={village}
          onChange={(e) => {
            setVillage(e.target.value);
            triggerSearch(
              text,
              district,
              taluka,
              e.target.value,
              category,
              interested,
              startDate,
              endDate,
              callDirection,
              hasFollowUp,
            );
          }}
          className={`border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-blue-400 focus:outline-none transition-colors ${
            village ? "bg-yellow-100 border-yellow-400" : "bg-white"
          }`}
        >
          <option value="">બધા ગામ (All Villages)</option>
          {uniqueVillages.map((v, i) => (
            <option key={i} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            triggerSearch(
              text,
              district,
              taluka,
              village,
              e.target.value,
              interested,
              startDate,
              endDate,
              callDirection,
              hasFollowUp,
            );
          }}
          className={`border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-blue-400 focus:outline-none transition-colors ${
            category ? "bg-yellow-100 border-yellow-400" : "bg-white"
          }`}
        >
          <option value="">બધી કેટેગરી (All Categories)</option>
          {customerCategory.map((cat, i) => (
            <option key={i} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Call History Filters */}
      <div className="w-full max-w-4xl bg-gray-50 p-3 rounded-lg border flex flex-col space-y-3">
        {/* Quick Date Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-medium mr-1">
            Quick Dates:
          </span>
          <button
            onClick={() => handleQuickDate("today")}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition shadow-sm"
          >
            Today
          </button>
          <button
            onClick={() => handleQuickDate("thisMonth")}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition shadow-sm"
          >
            This Month
          </button>
          <button
            onClick={() => handleQuickDate("last3Months")}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition shadow-sm"
          >
            Last 3 Months
          </button>
          {(startDate || endDate) && (
            <button
              onClick={clearDateRangeOnly}
              className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition shadow-sm ml-auto sm:ml-2"
            >
              Clear Dates ✖
            </button>
          )}
        </div>

        {/* Date Inputs & Direction Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                triggerSearch(
                  text,
                  district,
                  taluka,
                  village,
                  category,
                  interested,
                  e.target.value,
                  endDate,
                  callDirection,
                  hasFollowUp,
                );
              }}
              // Added yellow highlight here as well for better UX!
              className={`border rounded-lg px-3 py-1.5 text-sm shadow-sm focus:ring-blue-400 focus:outline-none transition-colors ${
                startDate ? "bg-yellow-100 border-yellow-400" : "bg-white"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                triggerSearch(
                  text,
                  district,
                  taluka,
                  village,
                  category,
                  interested,
                  startDate,
                  e.target.value,
                  callDirection,
                  hasFollowUp,
                );
              }}
              // Added yellow highlight here as well!
              className={`border rounded-lg px-3 py-1.5 text-sm shadow-sm focus:ring-blue-400 focus:outline-none transition-colors ${
                endDate ? "bg-yellow-100 border-yellow-400" : "bg-white"
              }`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Call Direction</label>
            <select
              value={callDirection}
              onChange={(e) => {
                setCallDirection(e.target.value);
                triggerSearch(
                  text,
                  district,
                  taluka,
                  village,
                  category,
                  interested,
                  startDate,
                  endDate,
                  e.target.value,
                  hasFollowUp,
                );
              }}
              className={`border rounded-lg px-3 py-1.5 text-sm shadow-sm focus:ring-blue-400 focus:outline-none transition-colors ${
                callDirection !== "both"
                  ? "bg-yellow-100 border-yellow-400"
                  : "bg-white"
              }`}
            >
              <option value="both">Both (Incoming & Outgoing)</option>
              <option value="incoming">Incoming Only</option>
              <option value="outgoing">Outgoing Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Checkbox Filters & Main Clear Button */}
      <div className="w-full max-w-4xl flex justify-between items-center px-2 flex-wrap gap-2">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={interested}
              onChange={(e) => {
                setInterested(e.target.checked);
                triggerSearch(
                  text,
                  district,
                  taluka,
                  village,
                  category,
                  e.target.checked,
                  startDate,
                  endDate,
                  callDirection,
                  hasFollowUp,
                );
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 font-medium">
              Interested ✅
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasFollowUp}
              onChange={(e) => {
                setHasFollowUp(e.target.checked);
                triggerSearch(
                  text,
                  district,
                  taluka,
                  village,
                  category,
                  interested,
                  startDate,
                  endDate,
                  callDirection,
                  e.target.checked,
                );
              }}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
            />
            <span className="text-sm text-gray-700 font-medium">
              Pending Follow-up ⏰
            </span>
          </label>
        </div>

        {(district ||
          taluka ||
          village ||
          category ||
          text ||
          interested ||
          startDate ||
          endDate ||
          callDirection !== "both" ||
          hasFollowUp) && (
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:underline font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchTerm;
