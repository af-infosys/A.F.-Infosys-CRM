import React, { useState, useEffect } from "react";
import apiPath from "../../isProduction";

export default function ManageAkarni() {
  // ---------------------------------------------------------
  // State Management
  // ---------------------------------------------------------
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // Fetch Data on Component Mount
  // ---------------------------------------------------------
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${await apiPath()}/api/work`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log(result);
      setReportData(result.data || []);

      //   const mockData = [
      //   {
      //     id: 1,
      //     formNumber: "010 A.S.",
      //     gaam: "કડિયાળી",
      //     taluka: "રાજુલા",
      //     district: "અમરેલી",
      //     talatiName: "પરેશભાઈ મેહુરીયા",
      //     sarpanchName: "લાખાભાઈ જાળાસણીયા",
      //     totalHouses: 500,
      //     expectedCompletionDate: "2026-07-01",
      //   }
      // ];
      // setReportData(mockData);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("ડેટા લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Filtering Logic
  // ---------------------------------------------------------
  const filteredData = reportData.filter(
    (item) =>
      item?.spot?.gaam?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item?._id?.toLowerCase().includes(searchTerm?.toLowerCase()),
  );

  // ---------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------
  const handleEdit = (id) => {
    console.log("Edit requested for ID:", id);
    // TODO: Implement edit logic (e.g., open modal with pre-filled form)
    alert(`એડિટ આઈડી: ${id} - આ સુવિધા ટૂંક સમયમાં ઉપલબ્ધ થશે.`);
  };

  const handleDelete = (id) => {
    if (window.confirm("શું તમે ખરેખર આ એન્ટ્રી ડિલીટ કરવા માંગો છો?")) {
      console.log("Delete requested for ID:", id);
      // TODO: Implement actual delete API call here
      // After successful delete, filter out the item from state
      setReportData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  // ---------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              આકારણી સર્વે ઓર્ડર યાદી
            </h1>
            {/* <p className="text-gray-600 mt-1">
              સબમિટ થયેલા તમામ ફોર્મ્સની માહિતી
            </p> */}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="ગામ અથવા ફોર્મ નંબરથી શોધો..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center items-center flex-col">
              <svg
                className="animate-spin h-10 w-10 text-blue-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-500 text-lg">માહિતી લોડ થઈ રહી છે...</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50 border-b border-gray-200 text-gray-700 font-semibold text-sm tracking-wide">
                    <th className="px-6 py-4">ઓર્ડર નંબર</th>
                    <th className="px-6 py-4">ગામ / તાલુકો, જિલ્લો</th>
                    <th className="px-6 py-4">તલાટી / સરપંચ</th>
                    <th className="px-6 py-4">મોબાઈલ નં.</th>
                    <th className="px-6 py-4">રેકર્ડ ઓફિસ પર આવ્યા તારીખ</th>
                    <th className="px-6 py-4">કુલ ઘર</th>
                    <th className="px-6 py-4">પૂર્ણ થવાની તારીખ</th>
                    <th className="px-6 py-4">
                      રેકર્ડ પરત મંત્રીને સોપ્યા/ આપ્યા તારીખ
                    </th>
                    <th className="px-6 py-4">નોંધ / રિમાર્ક્સ</th>
                    <th className="px-6 py-4 text-center">એક્શન્સ</th>
                  </tr>

                  <tr>
                    {Array.from({ length: 10 }, (_, index) => (
                      <th key={index} className="px-4 py-2 text-center">
                        {index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-gray-600 text-sm">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td
                          className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap"
                          style={{ width: "50px" }}
                        >
                          {item._id}
                        </td>
                        <td
                          className="px-6 py-4"
                          style={{ minWidth: "200px", maxWidth: "200px" }}
                        >
                          <div className="font-semibold text-gray-800">
                            {item?.spot?.gaam}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item?.spot?.taluka}, {item?.spot?.district}
                          </div>
                        </td>
                        <td
                          className="px-6 py-4"
                          style={{ minWidth: "250px", width: "200px" }}
                        >
                          <div>ત.: {item?.details?.tcmName || "-"}</div>
                          <div>સ.: {item?.details?.sarpanchName || "-"}</div>
                        </td>
                        <td
                          className="px-6 py-4"
                          style={{ minWidth: "170px", width: "100px" }}
                        >
                          <div>ત.: {item?.details?.tcmNumber || "-"}</div>
                          <div>સ.: {item?.details?.sarpanchNumber || "-"}</div>
                        </td>

                        <td></td>
                        <td className="px-6 py-4 text-center font-medium">
                          {item?.details?.totalHouses || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.expectedCompletionDate
                            ? new Date(
                                item.expectedCompletionDate,
                              ).toLocaleDateString("en-GB")
                            : "-"}
                        </td>
                        <td></td>
                        <td></td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 p-2 rounded-md"
                              title="એડિટ કરો"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            {/* <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 p-2 rounded-md"
                              title="ડિલીટ કરો"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-300 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="text-lg">કોઈ ડેટા મળ્યો નથી</p>
                          {searchTerm && (
                            <p className="text-sm mt-1">
                              તમારો સર્ચ શબ્દ બદલીને ફરી પ્રયાસ કરો.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination/Footer Info (Optional placeholder) */}
          {!loading && filteredData.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 text-sm text-gray-600 flex justify-between items-center">
              <span>કુલ {filteredData.length} એન્ટ્રીઓ દર્શાવેલ છે</span>
              {/* Add actual pagination UI here if needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
