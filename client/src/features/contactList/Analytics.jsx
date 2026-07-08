import React, { useEffect, useState, useMemo } from "react";
import apiPath from "../../isProduction";

const Analytics = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Data fetch karna API se
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${await apiPath()}/api/contactList`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRecords(result.data || []);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError(
        "Error Fetching Records! Try Again Later. OR Contact the Admin.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // --- Date Formatting aur Quick Selection ---
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
  };

  const clearDateRange = () => {
    setStartDate("");
    setEndDate("");
  };

  // --- Text Normalizer (Fuzzy jaisa kaam karega common mistakes ke liye) ---
  const normalizeAnswer = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Remove common punctuation
      .replace(/\s{2,}/g, " "); // Remove extra multiple spaces
  };

  // --- Analytics Processing Logic (Memoized for performance) ---
  const analyticsData = useMemo(() => {
    if (!records || records.length === 0) return { grouped: [], totalValid: 0 };

    const answerMap = new Map();
    let totalValidAnswers = 0;

    records.forEach((record) => {
      // JSON parse securely
      let callHistory = [];
      try {
        callHistory = JSON.parse(record[10] || "[]");
      } catch (e) {
        callHistory = [];
      }

      if (callHistory.length === 0) return;

      // Filter calls by date range agar active hai
      let validCalls = callHistory;
      if (startDate || endDate) {
        validCalls = callHistory.filter((call) => {
          const callDate = call.dateOfCall; // Example: "2025-08-30"
          if (!callDate) return false;
          let isAfterStart = !startDate || callDate >= startDate;
          let isBeforeEnd = !endDate || callDate <= endDate;
          return isAfterStart && isBeforeEnd;
        });
      }

      // Agar date range ke baad calls bache hain, toh sabse aakhri (latest) call uthao
      if (validCalls.length > 0) {
        const lastCall = validCalls[validCalls.length - 1];
        const rawAnswer = lastCall.clientAnswer || "";

        if (rawAnswer.trim() !== "") {
          const normalized = normalizeAnswer(rawAnswer);

          if (!answerMap.has(normalized)) {
            answerMap.set(normalized, {
              originalText: rawAnswer, // Display ke liye original string rakhenge
              count: 0,
              customers: [],
            });
          }

          const mapItem = answerMap.get(normalized);
          mapItem.count += 1;
          // Name record[2] pe hota hai generally, id record[0] pe
          mapItem.customers.push({
            id: record[0],
            name: record[2] || "Unknown",
          });
          totalValidAnswers += 1;
        }
      }
    });

    // Map ko array me convert karke Count ke hisaab se Descending (highest pehle) sort karna
    const sortedGroupedAnswers = Array.from(answerMap.values()).sort(
      (a, b) => b.count - a.count,
    );

    return { grouped: sortedGroupedAnswers, totalValid: totalValidAnswers };
  }, [records, startDate, endDate]);

  const openCustomerProfile = (id) => {
    window.open(`/customers/history/${id}`, "_blank");
  };

  return (
    <div className="p-4 w-full max-w-7xl mx-auto font-sans">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Customer Call Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Common answers ka analysis aur customer count. (Total Valid Answers:{" "}
            {analyticsData.totalValid})
          </p>
        </div>

        {/* Date Filter Section */}
        <div className="flex flex-col space-y-2 w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-medium mr-1">
              Quick Dates:
            </span>
            <button
              onClick={() => handleQuickDate("today")}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
            >
              Today
            </button>
            <button
              onClick={() => handleQuickDate("thisMonth")}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
            >
              This Month
            </button>
            <button
              onClick={() => handleQuickDate("last3Months")}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
            >
              Last 3 Months
            </button>
            {(startDate || endDate) && (
              <button
                onClick={clearDateRange}
                className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
              >
                Clear ✖
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`border rounded-md px-3 py-1.5 text-sm outline-none transition-colors ${startDate ? "bg-yellow-50 border-yellow-400" : "bg-white border-gray-300"}`}
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`border rounded-md px-3 py-1.5 text-sm outline-none transition-colors ${endDate ? "bg-yellow-50 border-yellow-400" : "bg-white border-gray-300"}`}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center font-medium border border-red-100">
          {error}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <th className="p-4 font-semibold text-sm w-1/4">
                    Client Answer
                  </th>
                  <th className="p-4 font-semibold text-sm w-2/5">
                    Analysis (Count & Percentage)
                  </th>
                  <th className="p-4 font-semibold text-sm w-1/3">Customers</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.grouped.length > 0 ? (
                  analyticsData.grouped.map((item, index) => {
                    // Calculate percentage properly
                    const percentage =
                      analyticsData.totalValid > 0
                        ? (
                            (item.count / analyticsData.totalValid) *
                            100
                          ).toFixed(1)
                        : 0;

                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-4 text-sm text-gray-800 font-medium">
                          {item.originalText}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-700 min-w-[40px]">
                              {item.count}
                            </span>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 font-medium min-w-[45px]">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                            {item.customers.map((cust, idx) => (
                              <button
                                key={idx}
                                onClick={() => openCustomerProfile(cust.id)}
                                className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 rounded hover:bg-indigo-600 hover:text-white transition-colors truncate max-w-[150px]"
                                title={cust.name} // Full name hover pe dikhega
                              >
                                {cust.name}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">
                      No records found for the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
