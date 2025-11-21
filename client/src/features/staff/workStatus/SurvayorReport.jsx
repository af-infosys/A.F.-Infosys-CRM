import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import apiPath from "../../../isProduction";

const SurvayorReport = () => {
  const [surveyors, setSurveyors] = useState([]);
  const [allEntry, setAllEntry] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD") // Defaulting to a date with mock data
  );
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [selectedSurveyor, setSelectedSurveyor] = useState(null);
  const [individualReportData, setIndividualReportData] = useState([]);
  const [error, setError] = useState(null);

  // Helper function to extract Surveyor ID from the 16th index (17th element)
  const extractSurveyorId = (entry) => {
    // The surveyor ID is provided as a JSON string at index 16 of the array
    const surveyorJsonString = entry[16];
    if (surveyorJsonString) {
      try {
        const surveyorInfo = JSON.parse(surveyorJsonString);
        // *** CHANGE: Using 'id' instead of 'id' based on user feedback ***
        return surveyorInfo.id;
      } catch (e) {
        // console.warn("Error parsing surveyor info at index 16:", e);
        return null;
      }
    }
    return null;
  };

  // Helper to get surveyor name
  const getSurveyorName = (surveyorId) => {
    const surveyor = surveyors.find((s) => s._id === surveyorId);
    return surveyor ? surveyor.name : "Unknown Surveyor";
  };

  const fetchStaffData = async () => {
    try {
      const res = await fetch(`${await apiPath()}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const users = await res.json();
      const surveyors = users.filter((user) => user.role === "surveyor");
      console.log(surveyors);
      setSurveyors(surveyors);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch staff data:", err);
      setError("Failed to fetch Surveyor data. Please try again later.");
    }
  };

  const fetchCallRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/sheet`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAllEntry(result.data);
      console.log(result.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Error fetching call records. Please try again later.");
    }
  };

  // Core logic to generate the report
  const generateReport = useCallback(() => {
    // Clear individual report when generating the main report
    setSelectedSurveyor(null);
    setIndividualReportData([]);

    if (allEntry.length === 0 || surveyors.length === 0) {
      setReportData([]);
      return;
    }

    const targetDate = dayjs(selectedDate).format("YYYY-MM-DD");

    // 1. Filter entries by selected date (assuming date/time is at index 15)
    const filteredEntries = allEntry.filter((entry) => {
      const entryDateString = JSON.parse(entry[16])?.time || ""; // Hypothetical date/timestamp index
      if (!entryDateString) return false;

      const entryDate = dayjs(entryDateString).format("YYYY-MM-DD") || "";

      return entryDate === targetDate;
    });

    // 2. Group and count by Surveyor ID
    const counts = {};
    const detailedData = {}; // Stores actual entries

    filteredEntries.forEach((entry) => {
      const surveyorId = extractSurveyorId(entry);

      if (surveyorId) {
        // *** FIX: Corrected typo from 'surveyId' to 'surveyorId' ***
        counts[surveyorId] = (counts[surveyorId] || 0) + 1;
        if (!detailedData[surveyorId]) {
          detailedData[surveyorId] = [];
        }
        detailedData[surveyorId].push(entry);
      }
    });

    console.log("Counts by Surveyor ID:", counts);

    // 3. Create the final report data structure
    const finalReport = surveyors.map((surveyor) => {
      console.log("Processing surveyor:", surveyor);

      return {
        id: surveyor._id, // Matching internal state key to surveyor list ID
        name: surveyor.name,
        entryCount: counts[surveyor._id] || 0,
        entries: detailedData[surveyor._id] || [], // Store entries for quick detail retrieval
      };
    });

    console.log("Generated Report Data:", finalReport);

    setReportData(finalReport);
  }, [selectedDate, allEntry, surveyors]);

  // Handle viewing the detailed report for a specific surveyor
  const viewDetails = (surveyorId) => {
    setSelectedSurveyor(surveyorId);
    const surveyorReport = reportData.find((r) => r.id === surveyorId);
    if (surveyorReport) {
      setIndividualReportData(surveyorReport.entries);
    }
    // Scroll to the detail section
    setTimeout(() => {
      const detailSection = document.getElementById("detail-report");
      if (detailSection) {
        detailSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Use mock functions
      await fetchStaffData();
      await fetchCallRecords();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Generate Report whenever date or raw data changes
  useEffect(() => {
    generateReport();
  }, [selectedDate, generateReport]);

  // Helper for date navigation (not strictly necessary but cleans up JSX)
  const navigateDate = (direction) => {
    const newDate = dayjs(selectedDate)
      .add(direction, "day")
      .format("YYYY-MM-DD");
    setSelectedDate(newDate);
  };

  // --- JSX Rendering ---

  // Hypothetical mapping of array indices to the table headers (0 to 8 after index/date)
  const DETAIL_MAPPING = {
    village: 0,
    day: 1,
    startHouse: 2,
    endHouse: 3,
    totalHouses: 4,
    remarks: 5,
    expense: 6,
    taluka: 7,
    district: 8,
  };

  return (
    <div className="min-h-screen font-sans antialiased bg-gray-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 border-b-2 border-purple-500 pb-2">
            Surveyor Work Status Report
          </h1>
          <p className="text-gray-500">
            View the daily data report for all Surveyors. Current Date:{" "}
            <span className="font-bold text-purple-600">
              {dayjs(selectedDate).format("DD MMMM, YYYY")}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <label
                htmlFor="report-date"
                className="font-semibold text-gray-700"
              >
                Select Date:
              </label>

              {/* Decrement Button */}
              <button
                type="button"
                onClick={() => navigateDate(-1)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-400"
                aria-label="Previous Day"
              >
                &lt;
              </button>

              <input
                type="date"
                id="report-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 shadow-inner w-40"
              />

              {/* Increment Button */}
              <button
                type="button"
                onClick={() => navigateDate(1)}
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-md hover:shadow-lg focus:ring-2 focus:ring-green-400"
                aria-label="Next Day"
              >
                &gt;
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="text-lg text-gray-600 ml-4">Loading data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 bg-red-100 border border-red-400 p-4 rounded-xl shadow-md">
              {error}
            </div>
          ) : (
            <>
              {/* --- MAIN SUMMARY TABLE --- */}
              <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200 bg-white">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-purple-100/70 border-b border-purple-200">
                    <tr>
                      <th
                        scope="col"
                        className="py-3 px-4 rounded-tl-xl text-purple-700"
                      >
                        Surveyor
                      </th>
                      <th scope="col" className="py-3 px-4 text-purple-700">
                        Total Survay (Entries)
                      </th>
                      <th
                        scope="col"
                        className="py-3 px-4 rounded-tr-xl text-purple-700"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.length > 0 ? (
                      reportData.map((surveyor) => (
                        <tr
                          key={surveyor.id}
                          className="bg-white border-b hover:bg-purple-50/50 transition-colors duration-200"
                        >
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            {surveyor.name}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-md font-bold ${
                                surveyor.entryCount > 0
                                  ? "text-green-600"
                                  : "text-red-500"
                              } p-1 rounded-md`}
                            >
                              {surveyor.entryCount}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {surveyor.entryCount > 0 ? (
                              <button
                                onClick={() => viewDetails(surveyor.id)}
                                className="text-purple-600 hover:text-purple-800 font-semibold focus:outline-none transition-colors duration-200 disabled:opacity-50"
                                disabled={surveyor.entryCount === 0}
                              >
                                View Details
                              </button>
                            ) : (
                              <span className="text-gray-400">No data</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-4 text-center text-gray-500"
                        >
                          No surveyors or data found for this date.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* --- INDIVIDUAL DETAIL REPORT TABLE --- */}
              {selectedSurveyor && (
                <div
                  id="detail-report"
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                    Daily Work Report for{" "}
                    <span className="text-purple-600">
                      {getSurveyorName(selectedSurveyor)}
                    </span>{" "}
                    on {dayjs(selectedDate).format("DD MMMM, YYYY")}
                  </h2>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                        <tr>
                          <th
                            scope="col"
                            className="py-3 px-3 rounded-tl-lg"
                            style={{ width: "60px" }}
                          >
                            ક્રમ (Sr. No.)
                          </th>
                          <th
                            scope="col"
                            className="py-3 px-3"
                            style={{ width: "100px" }}
                          >
                            તારીખ કામની (Date)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            ગામ સર્વે કરેલ (Village)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            દિવસ (Day)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            શરૂ કરેલ સર્વેઘર નં. (Start H.)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            પુર્ણ કરેલ સર્વેઘર નં. (End H.)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            કુલ ઘર (Total)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            નોંધ / રીમાર્કસ (Remarks)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            પરચુરણ ખર્ચ (Misc. Exp.)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            તાલુકો (Taluka)
                          </th>
                          <th scope="col" className="py-3 px-3 rounded-tr-lg">
                            જીલ્લો (District)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {individualReportData.length > 0 ? (
                          individualReportData.map((entryData, index) => {
                            // Using the hypothetical DETAIL_MAPPING indices
                            return (
                              <tr
                                key={index}
                                className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
                              >
                                <td className="py-3 px-3 text-center">
                                  {index + 1}
                                </td>
                                {/* Index 15 is used for the date/timestamp */}
                                <td className="py-3 px-3">
                                  {dayjs(entryData[15]).format("HH:mm A")}
                                </td>
                                <td className="py-3 px-3 capitalize font-medium text-gray-900">
                                  {entryData[DETAIL_MAPPING.village]}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[DETAIL_MAPPING.day]}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[DETAIL_MAPPING.startHouse]}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[DETAIL_MAPPING.endHouse]}
                                </td>
                                <td className="py-3 px-3 font-bold text-green-700">
                                  {entryData[DETAIL_MAPPING.totalHouses]}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[DETAIL_MAPPING.remarks]}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[DETAIL_MAPPING.expense]}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[DETAIL_MAPPING.taluka]}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[DETAIL_MAPPING.district]}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="11"
                              className="py-4 text-center text-gray-500"
                            >
                              No survey entries found for this surveyor on{" "}
                              {dayjs(selectedDate).format("DD MMMM, YYYY")}.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurvayorReport;
