import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import apiPath from "../../../isProduction";
import { useAuth } from "../../../config/AuthContext";
import { useNavigate } from "react-router-dom";

// This is the main component for the Telecaller Work Status Report.
const TelecallerReport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [telecallers, setTelecallers] = useState([]);
  const [allCalls, setAllCalls] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);
  const [selectedTelecaller, setSelectedTelecaller] = useState(null);
  const [individualReportData, setIndividualReportData] = useState([]);
  const [error, setError] = useState(null);

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
      const telecallers = users.filter((user) => user.role === "telecaller");
      setTelecallers(telecallers);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch staff data:", err);
      setError("Failed to fetch telecaller data. Please try again later.");
    }
  };

  const fetchCallRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setAllCalls(result.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Error fetching call records. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchStaffData();
      await fetchCallRecords();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    generateReport();
  }, [selectedDate, allCalls, telecallers]);

  const generateReport = () => {
    if (telecallers.length === 0 || allCalls.length === 0) {
      setReportData([]);
      return;
    }

    // Create a map to store call counts for each telecaller.
    const callCounts = telecallers.reduce((acc, telecaller) => {
      acc[telecaller._id] = 0;
      return acc;
    }, {});

    allCalls.forEach((record) => {
      const callDataArray = JSON.parse(record[10] || "[]");

      if (!Array.isArray(callDataArray)) {
        // If it's not an array, treat it as a single object for backwards compatibility.
        const callData = callDataArray;

        if (
          callData?.createdAt?.time &&
          dayjs(callData.createdAt.time).format("YYYY-MM-DD") === selectedDate
        ) {
          const telecallerId = callData.createdAt.id;
          if (telecallerId) {
            callCounts[telecallerId] = (callCounts[telecallerId] || 0) + 1;
          }
        }
      } else {
        // If it's an array, iterate through it to count all calls.
        callDataArray.forEach((callData) => {
          if (
            callData?.createdAt?.time &&
            dayjs(callData.createdAt.time).format("YYYY-MM-DD") === selectedDate
          ) {
            const telecallerId = callData.createdAt.id;
            if (telecallerId) {
              callCounts[telecallerId] = (callCounts[telecallerId] || 0) + 1;
            }

            console.log(callData);
          }
        });
      }
    });

    const finalReport = telecallers.map((telecaller) => ({
      ...telecaller,
      callCount: callCounts[telecaller._id] || 0,
    }));
    setReportData(finalReport);
  };

  const viewDetails = (telecallerId) => {
    let details = [];
    allCalls.forEach((record) => {
      const callDataArray = JSON.parse(record[10] || "[]");

      // Extract customer details from the record
      const customerInfo = {
        customerId: record[0],
        customerName: record[2],
        customerNumber: record[3],
        customerVillage: record[6],
      };

      if (Array.isArray(callDataArray)) {
        const matchedCalls = callDataArray.filter((callData) => {
          const createdDate = dayjs(callData.createdAt?.time).format(
            "YYYY-MM-DD"
          );
          return (
            callData.createdAt?.id === telecallerId &&
            createdDate === selectedDate
          );
        });
        // Add customer info to each matched call record
        const callsWithCustomerInfo = matchedCalls.map((call) => ({
          ...call,
          ...customerInfo,
        }));
        details = details.concat(callsWithCustomerInfo);
      } else {
        // Backwards compatibility for single object
        const callData = callDataArray;
        const createdDate = dayjs(callData.createdAt?.time).format(
          "YYYY-MM-DD"
        );
        if (
          callData.createdAt?.id === telecallerId &&
          createdDate === selectedDate
        ) {
          // Add customer info to the single call record
          details.push({ ...callData, ...customerInfo });
        }
      }
    });
    setSelectedTelecaller(telecallerId);
    setIndividualReportData(details);
  };

  const getTelecallerName = (id) => {
    const caller = telecallers.find((t) => t._id === id);
    return caller ? caller.name : "Unknown";
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0"); // 28
    const month = date.toLocaleString("en-US", { month: "short" }); // Aug
    const year = date.getFullYear(); // 2025

    return `${day} ${month}, ${year}`;
  }

  return (
    <div className="min-h-screen font-sans antialiased" style={{ padding: 0 }}>
      <div className="container mx-auto max-w-7xl">
        <div className="">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
            Telecaller Work Status Report
          </h1>
          <p className="text-gray-500 mb-6">
            View the daily call report for all telecallers.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
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
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setSelectedDate(newDate.toISOString().split("T")[0]);
                }}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                style={{
                  minWidth: "35px",
                }}
              >
                -
              </button>

              <input
                type="date"
                id="report-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
              />

              {/* Increment Button */}
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 1);
                  setSelectedDate(newDate.toISOString().split("T")[0]);
                }}
                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                style={{
                  minWidth: "35px",
                }}
              >
                +
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-gray-600">Loading data...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200 mb-8">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                      <th scope="col" className="py-3 px-4 rounded-tl-xl">
                        Telecaller
                      </th>
                      <th scope="col" className="py-3 px-4">
                        Total Calls
                      </th>
                      <th scope="col" className="py-3 px-4 rounded-tr-xl">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.length > 0 ? (
                      reportData.map((telecaller) => (
                        <tr
                          key={telecaller._id}
                          className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            {telecaller.name}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-md font-bold ${
                                telecaller.callCount > 0
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {telecaller.callCount}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => viewDetails(telecaller._id)}
                              className="text-purple-600 hover:text-purple-800 font-semibold focus:outline-none transition-colors duration-200"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-4 text-center text-gray-500"
                        >
                          No telecallers or data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {selectedTelecaller && (
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Call Details for {getTelecallerName(selectedTelecaller)}
                  </h2>
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full text-sm text-left text-gray-500">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                        <tr>
                          <th
                            scope="col"
                            className="py-3 px-4 rounded-tl-lg"
                            style={{ maxWidth: "30px" }}
                          >
                            અનું ક્રમાંક
                          </th>

                          <th scope="col" className="py-3 px-4">
                            કસ્ટમર / ગ્રાહકનું પુરૂ નામ
                          </th>
                          <th scope="col" className="py-3 px-4">
                            મોબાઈલ નંબર
                          </th>

                          {/* વોટસેઅપ નબંર */}
                          {/* કેટેગરી */}

                          <th scope="col" className="py-3 px-4">
                            ગામ
                          </th>
                          {/* ચાર્જ નું ગામ */}
                          {/* તાલુકો */}
                          {/* જિલ્લો */}
                          <th scope="col" className="py-3 px-4">
                            કયુ કામ વસ્તુ માટે ફોન કરેલ
                          </th>
                          <th scope="col" className="py-3 px-4 rounded-tr-lg">
                            કયા ગામનું કામ કરવાનું છે
                          </th>
                          <th scope="col" className="py-3 px-4 rounded-tr-lg">
                            ગ્રાહકે શું જવાબ આપ્યો
                          </th>

                          <th
                            scope="col"
                            className="py-3 px-4 rounded-tl-lg"
                            style={{ width: "100px" }}
                          >
                            Call Time
                          </th>
                        </tr>

                        <tr>
                          {Array.from({ length: 13 }).map((item, index) => (
                            <th scope="col" className="py-3 px-4 rounded-tl-lg">
                              {index + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {individualReportData.length > 0 ? (
                          individualReportData.map((callData, index) => {
                            return (
                              <tr
                                key={index}
                                className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
                              >
                                <td className="py-3 px-4">{index + 1}</td>

                                <td
                                  className="py-3 px-4 capitalize"
                                  onClick={() => {
                                    if (user.role === "owner")
                                      navigate(
                                        `/customers/history/${callData?.customerId}`
                                      );
                                  }}
                                >
                                  {callData?.customerName}
                                </td>
                                <td className="py-3 px-4">
                                  {callData?.customerNumber}
                                </td>
                                <td className="py-3 px-4 capitalize">
                                  {callData?.customerVillage}
                                </td>
                                <td className="py-3 px-4 capitalize">
                                  {callData?.whatBusiness}
                                </td>
                                <td className="py-3 px-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                  {callData?.workVillage}
                                </td>
                                <td className="py-3 px-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                  {callData?.clientAnswer}
                                </td>

                                <td className="py-3 px-4">
                                  {dayjs(callData?.createdAt?.time).format(
                                    "hh:mm A"
                                  )}
                                </td>
                                {/* <td className="py-3 px-4">
                                  {dayjs(callData?.createdAt?.time).format(
                                    "YYYY-MM-DD"
                                  )}
                                </td> */}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="7"
                              className="py-4 text-center text-gray-500"
                            >
                              No calls found for this date.
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

export default TelecallerReport;
