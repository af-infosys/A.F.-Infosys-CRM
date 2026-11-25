import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import apiPath from "../../../isProduction";
import { useAuth } from "../../../config/AuthContext";

const SurvayorReport = () => {
  const { user } = useAuth();

  const [surveyors, setSurveyors] = useState([]);
  const [works, setWorks] = useState([]);
  const [selectedWorkId, setSelectedWorkId] = useState("all");

  const [allEntry, setAllEntry] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [selectedSurveyor, setSelectedSurveyor] = useState(null);
  const [individualReportData, setIndividualReportData] = useState([]);
  const [error, setError] = useState(null);

  // Safely parse surveyor info from index 18 (primary) or index 16 (legacy fallback)
  const parseSurveyorInfo = (entry) => {
    if (!Array.isArray(entry)) return null;

    for (const idx of [18, 16]) {
      const raw = entry[idx];
      if (!raw) continue;

      if (typeof raw === "object" && (raw.id || raw.time || raw.name)) {
        return raw;
      }

      if (typeof raw === "string" && raw.trim().startsWith("{")) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.id || parsed.time || parsed.name)) {
            return parsed;
          }
        } catch {
          // Ignore malformed JSON and check next fallback index
        }
      }
    }
    return null;
  };

  // Helper to get surveyor name
  const getSurveyorName = (surveyorId) => {
    const surveyor = surveyors.find(
      (s) => s._id === surveyorId || s.id === surveyorId,
    );
    return surveyor ? surveyor.name : "Unknown Surveyor";
  };

  // Fetch all surveyors
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
      const surveyorList = (
        Array.isArray(users) ? users : users?.data || []
      ).filter((u) => u.role === "surveyor");
      setSurveyors(surveyorList);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch staff data:", err);
      setError("Failed to fetch Surveyor data. Please try again later.");
    }
  };

  // Fetch all works / villages list for dropdown
  const fetchWorksList = async () => {
    try {
      const base = await apiPath();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      let workList = [];
      const res = await fetch(`${base}/api/work`, { method: "GET", headers });

      if (res.ok) {
        const result = await res.json();
        workList = Array.isArray(result)
          ? result
          : result?.works || result?.data || [];
      } else if (user?.id) {
        // Fallback if /api/work is not exposed and only user-assigned work exists
        const singleRes = await fetch(`${base}/api/work/${user.id}`, {
          method: "GET",
          headers,
        });
        if (singleRes.ok) {
          const singleData = await singleRes.json();
          if (singleData?.work) workList = [singleData.work];
        }
      }

      setWorks(workList);
      return workList;
    } catch (err) {
      console.error("Failed to fetch works list:", err);
      return [];
    }
  };

  // Fetch entries for All Work or Specific Work (workId)
  const fetchSheetRecords = useCallback(
    async (workIdParam, availableWorks = works) => {
      setLoading(true);
      try {
        const base = await apiPath();

        if (workIdParam && workIdParam !== "all") {
          const response = await fetch(
            `${base}/api/sheet?workId=${workIdParam}`,
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          const matchedWork = availableWorks.find((w) => w._id === workIdParam);
          const gaamName = matchedWork?.spot?.gaam || "";

          const taggedEntries = (result.data || []).map((row) => {
            const copy = [...row];
            copy._workId = workIdParam;
            copy._gaam = gaamName;
            return copy;
          });

          setAllEntry(taggedEntries);
          setError(null);
          return;
        }

        // Case: "all" works selected
        // Try fetching aggregated /api/sheet first; if empty/unsupported, fetch per workId
        let combinedEntries = [];
        try {
          const response = await fetch(`${base}/api/sheet`);
          if (response.ok) {
            const result = await response.json();
            if (Array.isArray(result.data) && result.data.length > 0) {
              combinedEntries = result.data;
            }
          }
        } catch {
          // Fallback to per-work fetch below
        }

        if (combinedEntries.length === 0 && availableWorks.length > 0) {
          const allResponses = await Promise.all(
            availableWorks.map(async (work) => {
              try {
                const res = await fetch(`${base}/api/sheet?workId=${work._id}`);
                if (!res.ok) return [];
                const json = await res.json();
                const gaamName = work?.spot?.gaam || "";
                return (json.data || []).map((row) => {
                  const copy = [...row];
                  copy._workId = work._id;
                  copy._gaam = gaamName;
                  return copy;
                });
              } catch {
                return [];
              }
            }),
          );
          combinedEntries = allResponses.flat();
        }

        setAllEntry(combinedEntries);
        setError(null);
      } catch (err) {
        console.error("Error fetching records:", err);
        setError("Error fetching survey records. Please try again later.");
        setAllEntry([]);
      } finally {
        setLoading(false);
      }
    },
    [works],
  );

  // Core logic to generate the report for Date Range + Work filter
  const generateReport = useCallback(() => {
    setSelectedSurveyor(null);
    setIndividualReportData([]);

    if (allEntry.length === 0 || surveyors.length === 0) {
      setReportData([]);
      return;
    }

    // 1. Filter entries by Start Date to End Date (inclusive)
    const filteredEntries = allEntry.filter((entry) => {
      const surveyorInfo = parseSurveyorInfo(entry);
      const entryDateString = surveyorInfo?.time || "";
      if (!entryDateString) return false;

      const parsedDate = dayjs(entryDateString);
      if (!parsedDate.isValid()) return false;

      const entryDate = parsedDate.format("YYYY-MM-DD");
      const isAfterStart = !startDate || entryDate >= startDate;
      const isBeforeEnd = !endDate || entryDate <= endDate;

      return isAfterStart && isBeforeEnd;
    });

    // 2. Group and count by Surveyor ID
    const counts = {};
    const detailedData = {};

    filteredEntries.forEach((entry) => {
      const surveyorInfo = parseSurveyorInfo(entry);
      const surveyorId = surveyorInfo?.id;

      if (surveyorId) {
        counts[surveyorId] = (counts[surveyorId] || 0) + 1;
        if (!detailedData[surveyorId]) {
          detailedData[surveyorId] = [];
        }
        detailedData[surveyorId].push(entry);
      }
    });

    // 3. Create final report sorted by highest entries first
    const finalReport = surveyors.map((surveyor) => {
      const sid = surveyor._id || surveyor.id;
      const entries = (detailedData[sid] || []).sort((a, b) => {
        const tA = dayjs(parseSurveyorInfo(a)?.time || 0).valueOf();
        const tB = dayjs(parseSurveyorInfo(b)?.time || 0).valueOf();
        return tA - tB;
      });

      return {
        id: sid,
        name: surveyor.name,
        entryCount: counts[sid] || 0,
        entries,
      };
    });

    setReportData(finalReport);
  }, [startDate, endDate, allEntry, surveyors]);

  // Handle viewing the detailed report for a specific surveyor
  const viewDetails = (surveyorId) => {
    setSelectedSurveyor(surveyorId);
    const surveyorReport = reportData.find((r) => r.id === surveyorId);
    if (surveyorReport) {
      setIndividualReportData(surveyorReport.entries);
    }
    setTimeout(() => {
      const detailSection = document.getElementById("detail-report");
      if (detailSection) {
        detailSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchStaffData();
      const loadedWorks = await fetchWorksList();
      await fetchSheetRecords("all", loadedWorks);
      setLoading(false);
    };
    init();
  }, []);

  // Re-fetch when Work / Gaam changes
  const handleWorkChange = async (e) => {
    const newWorkId = e.target.value;
    setSelectedWorkId(newWorkId);
    await fetchSheetRecords(newWorkId, works);
  };

  // Generate Report whenever date range or raw data changes
  useEffect(() => {
    generateReport();
  }, [startDate, endDate, generateReport]);

  // Quick Date Range Presets
  const applyPreset = (preset) => {
    const today = dayjs();
    if (preset === "today") {
      const d = today.format("YYYY-MM-DD");
      setStartDate(d);
      setEndDate(d);
    } else if (preset === "yesterday") {
      const y = today.subtract(1, "day").format("YYYY-MM-DD");
      setStartDate(y);
      setEndDate(y);
    } else if (preset === "last7") {
      setStartDate(today.subtract(6, "day").format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
    } else if (preset === "thisMonth") {
      setStartDate(today.startOf("month").format("YYYY-MM-DD"));
      setEndDate(today.format("YYYY-MM-DD"));
    }
  };

  const totalEntriesCount = reportData.reduce(
    (sum, item) => sum + item.entryCount,
    0,
  );

  const selectedWorkObj = works.find((w) => w._id === selectedWorkId);
  const selectedWorkLabel =
    selectedWorkId === "all"
      ? "All Work (બધા ગામ)"
      : selectedWorkObj?.spot?.gaam || "Selected Work";

  const formattedRangeLabel =
    startDate === endDate
      ? dayjs(startDate).format("DD MMMM, YYYY")
      : `${dayjs(startDate).format("DD MMM, YYYY")} — ${dayjs(endDate).format("DD MMM, YYYY")}`;

  return (
    <div className="min-h-screen font-sans antialiased bg-gray-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 border-b-2 border-purple-500 pb-2">
              Surveyor Work Status Report
            </h1>
            <p className="text-gray-600">
              Work:{" "}
              <span className="font-bold text-purple-700">
                {selectedWorkLabel}
              </span>{" "}
              | Period:{" "}
              <span className="font-bold text-purple-600">
                {formattedRangeLabel}
              </span>{" "}
              | Total Entries:{" "}
              <span className="font-bold text-green-600">
                {totalEntriesCount}
              </span>
            </p>
          </div>

          {/* --- FILTER BAR: WORK SELECTOR + DATE RANGE --- */}
          <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex flex-wrap items-end justify-between gap-4">
              {/* Work / Gaam Dropdown */}
              <div className="flex flex-col w-full sm:w-64">
                <label
                  htmlFor="work-select"
                  className="font-semibold text-sm text-gray-700 mb-1"
                >
                  Select Work / ગામ:
                </label>
                <select
                  id="work-select"
                  value={selectedWorkId}
                  onChange={handleWorkChange}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800"
                >
                  <option value="all">All Work (બધા ગામ)</option>
                  {works.map((work) => (
                    <option key={work._id} value={work._id}>
                      {work?.spot?.gaam || work?.name || work._id}
                      {work?.spot?.taluka ? ` (${work.spot.taluka})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date & End Date Inputs */}
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="start-date"
                    className="font-semibold text-sm text-gray-700 mb-1"
                  >
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(e) => {
                      const val = e.target.value;
                      setStartDate(val);
                      if (endDate && val > endDate) setEndDate(val);
                    }}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner w-40"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="end-date"
                    className="font-semibold text-sm text-gray-700 mb-1"
                  >
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEndDate(val);
                      if (startDate && val < startDate) setStartDate(val);
                    }}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner w-40"
                  />
                </div>
              </div>

              {/* Quick Date Range Presets */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("today")}
                  className="px-3 py-1.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("yesterday")}
                  className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Yesterday
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("last7")}
                  className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset("thisMonth")}
                  className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  This Month
                </button>
              </div>
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
                        ક્રમ
                      </th>
                      <th scope="col" className="py-3 px-4 text-purple-700">
                        Surveyor Name
                      </th>
                      <th scope="col" className="py-3 px-4 text-purple-700">
                        Total Survey (Entries)
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
                      reportData.map((surveyor, idx) => (
                        <tr
                          key={surveyor.id}
                          className="bg-white border-b hover:bg-purple-50/50 transition-colors duration-200"
                        >
                          <td className="py-3 px-4 text-gray-600">{idx + 1}</td>
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
                                className="text-purple-600 hover:text-purple-800 font-semibold focus:outline-none transition-colors duration-200"
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
                          colSpan="4"
                          className="py-4 text-center text-gray-500"
                        >
                          No surveyors or data found for this selection.
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
                    Survey Work Report for{" "}
                    <span className="text-purple-600">
                      {getSurveyorName(selectedSurveyor)}
                    </span>{" "}
                    ({formattedRangeLabel})
                  </h2>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                        <tr>
                          <th scope="col" className="py-3 px-3 rounded-tl-lg">
                            ક્રમ (Sr. No.)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            તારીખ અને સમય (Date & Time)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            ગામ (Gaam)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            મિલ્કત નં. (Prop. No.)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            વિસ્તાર (Area)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            માલિકનું નામ (Owner Name)
                          </th>
                          <th scope="col" className="py-3 px-3">
                            કેટેગરી (Category)
                          </th>
                          <th scope="col" className="py-3 px-3 rounded-tr-lg">
                            નોંધ / રીમાર્કસ (Remarks)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {individualReportData.length > 0 ? (
                          individualReportData.map((entryData, index) => {
                            const sInfo = parseSurveyorInfo(entryData);
                            return (
                              <tr
                                key={index}
                                className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
                              >
                                <td className="py-3 px-3 text-center">
                                  {index + 1}
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  {sInfo?.time
                                    ? dayjs(sInfo.time).format(
                                        "DD/MM/YYYY hh:mm A",
                                      )
                                    : "-"}
                                </td>
                                <td className="py-3 px-3 font-medium text-gray-900">
                                  {entryData._gaam ||
                                    selectedWorkObj?.spot?.gaam ||
                                    "-"}
                                </td>
                                <td className="py-3 px-3 font-semibold text-gray-800">
                                  {entryData[2] || entryData[0] || "-"}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[1] || "-"}
                                </td>
                                <td className="py-3 px-3 font-medium text-gray-900">
                                  {entryData[3] || "-"}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[8] || "-"}
                                </td>
                                <td className="py-3 px-3">
                                  {entryData[14] || "-"}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="py-4 text-center text-gray-500"
                            >
                              No survey entries found for this surveyor in{" "}
                              {formattedRangeLabel}.
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
