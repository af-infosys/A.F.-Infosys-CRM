import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Report.scss";
import apiPath from "../../isProduction";
import { useAuth } from "../../config/AuthContext";
import SearchTerm from "../../components/SearchTerm";

const ContactListReportOverview = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tableRef = useRef(null);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollLeft = e.target.scrollLeft;

    localStorage.setItem("scrollTopB", scrollTop);
    localStorage.setItem("scrollLeftB", scrollLeft);
  };

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRecords(result.data);

      setTimeout(() => {
        const savedScrollTop = localStorage.getItem("scrollTopB");
        const savedScrollLeft = localStorage.getItem("scrollLeftB");

        if (tableRef.current && savedScrollTop) {
          tableRef.current.scrollTop = Number(savedScrollTop);
        }
        if (tableRef.current && savedScrollLeft) {
          tableRef.current.scrollLeft = Number(savedScrollLeft);
        }
      }, 900);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await fetch(`${await apiPath()}/api/contactList/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecords(records.filter((record) => record.id !== id));
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  function formatDate(date) {
    if (!date) return " ";
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const background = "#007bff";

  // 1. Update State to include new call history filters
  const [filters, setFilters] = useState(() => {
    try {
      const savedFilters = localStorage.getItem("myAppFilters");
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    } catch (error) {
      console.error("Error reading localStorage", error);
    }
    return {
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
    };
  });

  // 2. Save to localStorage
  useEffect(() => {
    localStorage.setItem("myAppFilters", JSON.stringify(filters));
  }, [filters]);

  // --- Cascading Dropdown Logic ---
  const uniqueDistricts = [
    ...new Set(records.map((r) => r[9]).filter(Boolean)),
  ].sort();

  const recordsForTalukas = filters.district
    ? records.filter((r) => r[9] === filters.district)
    : records;
  const uniqueTalukas = [
    ...new Set(recordsForTalukas.map((r) => r[8]).filter(Boolean)),
  ].sort();

  let recordsForVillages = records;
  if (filters.district) {
    recordsForVillages = recordsForVillages.filter(
      (r) => r[9] === filters.district,
    );
  }
  if (filters.taluka) {
    recordsForVillages = recordsForVillages.filter(
      (r) => r[8] === filters.taluka,
    );
  }
  const uniqueVillages = [
    ...new Set(recordsForVillages.map((r) => r[6]).filter(Boolean)),
  ].sort();
  // --- End of Cascading Logic ---

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  // 3. Update filteredRecords logic to include Call History parsing
  const filteredRecords = records.filter((record) => {
    const fullName = record[2]?.toLowerCase() || "";
    const phone = record[3]?.toString() || "";
    const whatsapp = record[4]?.toString() || "";
    const category = record[5] || "";
    const village = record[6] || "";
    const taluka = record[8] || "";
    const district = record[9] || "";
    const isInterested = record[16] || "";

    const callHistoryStr = record[10] || "[]";
    let callHistory = [];
    try {
      callHistory = JSON.parse(callHistoryStr);
    } catch (e) {
      console.error("Error parsing call history", e);
      callHistory = [];
    }

    const searchText = filters.text.toLowerCase();
    const matchesText =
      !searchText ||
      fullName.includes(searchText) ||
      phone.includes(searchText) ||
      whatsapp.includes(searchText);
    const matchesDistrict = !filters.district || district === filters.district;
    const matchesTaluka = !filters.taluka || taluka === filters.taluka;
    const matchesVillage = !filters.village || village === filters.village;
    const matchesCategory = !filters.category || category === filters.category;
    const matchesInterested = !filters.interested || isInterested === "TRUE";

    let matchesDateRange = true;
    if (filters.startDate || filters.endDate) {
      matchesDateRange = callHistory.some((call) => {
        if (!call.clientAnswer || call.clientAnswer.trim() === "") return false;

        const callDate = call.dateOfCall;
        if (!callDate) return false;

        let isAfterStart = true;
        let isBeforeEnd = true;

        if (filters.startDate) isAfterStart = callDate >= filters.startDate;
        if (filters.endDate) isBeforeEnd = callDate <= filters.endDate;

        return isAfterStart && isBeforeEnd;
      });
    }

    let matchesDirection = true;
    if (filters.callDirection === "incoming") {
      matchesDirection = callHistory.some((call) => call.incoming === true);
    } else if (filters.callDirection === "outgoing") {
      matchesDirection = callHistory.some((call) => call.incoming === false);
    }

    let matchesFollowUp = true;
    if (filters.hasFollowUp) {
      if (callHistory.length > 0) {
        const lastCall = callHistory[callHistory.length - 1];
        matchesFollowUp =
          lastCall.reminderDate && lastCall.reminderDate.trim() !== "";
      } else {
        matchesFollowUp = false;
      }
    }

    return (
      matchesText &&
      matchesDistrict &&
      matchesTaluka &&
      matchesVillage &&
      matchesCategory &&
      matchesInterested &&
      matchesDateRange &&
      matchesDirection &&
      matchesFollowUp
    );
  });

  // Group records by Taluka and Jilla dynamically
  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const taluka = record[8] || "અજ્ઞાત તાલુકો";
    const jilla = record[9] || "અજ્ઞાત જિલ્લો";
    const key = `${taluka} - ${jilla}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(record);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-2 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        (Overview) Customer List Report [ C. L . R. ] / ટેલીકોલર ફોર્મ દરરોજ ફોન
        કરેલ યાદી
      </h1>
      <h2 className="text-xl text-center mb-8 text-gray-600">
        by - A.F. Infosys
      </h2>

      {/* Search Section Start */}
      <SearchTerm
        onSearch={handleSearch}
        currentFilters={filters}
        uniqueDistricts={uniqueDistricts}
        uniqueTalukas={uniqueTalukas}
        uniqueVillages={uniqueVillages}
      />
      {/* Search Section End */}

      <div className="flex justify-between items-center gap-2 mb-4">
        <button
          className="add-btn"
          onClick={() => navigate("/customers/form")}
          style={{ fontSize: ".8rem", padding: ".8rem .9rem" }}
        >
          Add New Customer Record
        </button>

        <button
          className="add-btn"
          onClick={() => navigate("/customers/report")}
          style={{ fontSize: ".8rem", padding: ".8rem .9rem" }}
        >
          Full Report
        </button>
      </div>

      {error ? (
        <div className="flex justify-center items-center h-screen text-red-600">
          Error: {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-screen text-gray-700">
          Loading Data...
        </div>
      ) : (
        <div
          ref={tableRef}
          onScroll={handleScroll}
          className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          {Object.entries(groupedRecords).map(
            ([groupName, groupData], groupIndex) => (
              <div key={groupIndex} className="mb-8">
                {/* Heading for Taluka - Jilla */}
                <div className="sticky top-0 z-20 bg-gray-200 px-4 py-3 shadow border-b border-gray-300">
                  <h3 className="text-lg font-bold text-gray-800">
                    {groupName}
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-12 z-10">
                      <tr>
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                          style={{ color: "blue", background: background }}
                        >
                          અનું ક્રમાંક
                        </th>
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{
                            color: "blue",
                            background: background,
                            minWidth: "150px",
                          }}
                        >
                          કસ્ટમર / ગ્રાહકનું પુરૂ નામ
                        </th>
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ color: "blue", background: background }}
                        >
                          વોટસેઅપ નબંર
                        </th>
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ color: "blue", background: background }}
                        >
                          કેટેગરી
                        </th>
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ color: "blue", background: background }}
                        >
                          ગામ
                        </th>
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ color: "blue", background: background }}
                        >
                          ચાર્જ નું ગામ
                        </th>

                        {/* New Call History Columns */}
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ color: "blue", background: background }}
                        >
                          કૉલ જવાબ ૧
                        </th>
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ color: "blue", background: background }}
                        >
                          કૉલ જવાબ ૨
                        </th>
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ color: "blue", background: background }}
                        >
                          કૉલ જવાબ ૩ (છેલ્લો)
                        </th>
                        {/* Mobile Column Shifted to End */}
                        <th
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{ color: "blue", background: background }}
                        >
                          મોબાઈલ નંબર
                        </th>
                        {(user.role === "owner" ||
                          user.role === "telecaller") && (
                          <th
                            className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                            style={{ color: "blue", background: background }}
                          >
                            Action
                          </th>
                        )}
                      </tr>

                      {/* Index Start */}
                      <tr>
                        {Array.from({
                          length:
                            user.role === "owner" || user.role === "telecaller"
                              ? 11
                              : 10,
                        }).map((_, index) => (
                          <th
                            className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                            style={{
                              textAlign: "center",
                              color: "blue",
                              background: background,
                            }}
                            key={index}
                          >
                            {index + 1}
                          </th>
                        ))}
                      </tr>
                      {/* Index End */}
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {groupData.map((record, index) => {
                        let survayorData = record[13];
                        if (typeof survayorData === "string") {
                          try {
                            survayorData = JSON.parse(survayorData);
                          } catch (error) {
                            survayorData = null;
                          }
                        }

                        let interested = record[16] === "TRUE";
                        let callHistory = JSON.parse(record[10] || "[]") || [];

                        let status = "remaining";
                        if (
                          callHistory.length > 0 &&
                          callHistory[0]?.clientAnswer !== ""
                        ) {
                          status = "completed";
                        }
                        if (
                          callHistory.length > 0 &&
                          callHistory[callHistory.length - 1]?.reminderDate !==
                            ""
                        ) {
                          status = "reminder";
                        }

                        // Logic for Call Answers (Last 3 calls)
                        const recentCalls = callHistory.slice(-3);
                        const ans1 = recentCalls[0]?.clientAnswer || " ";
                        const ans2 = recentCalls[1]?.clientAnswer || " ";
                        const ans3 = recentCalls[2]?.clientAnswer || " ";

                        return (
                          <tr key={index} className={status}>
                            <td className="record whitespace-nowrap text-sm font-medium text-gray-900">
                              {record[1]}
                            </td>
                            <td
                              className="record whitespace-normal text-sm text-gray-500 cursor-pointer"
                              onClick={() => {
                                if (user.role === "owner")
                                  navigate(`/customers/history/${record[0]}`);
                              }}
                              style={{
                                color: interested ? "green" : undefined,
                                fontWeight: interested ? "bold" : "normal",
                              }}
                              title={interested ? "Interested" : undefined}
                            >
                              {interested && (
                                <span
                                  className="text-green-600"
                                  style={{ fontSize: "20px" }}
                                >
                                  {" "}
                                  *{" "}
                                </span>
                              )}
                              {record[2]}
                            </td>

                            <td className="record whitespace-normal text-sm text-gray-500">
                              <a
                                href={`https://wa.me/91${record[4]?.trim()}`}
                                className="text-blue-600 hover:underline"
                              >
                                {record[4]?.trim()}
                              </a>
                            </td>

                            <td className="record whitespace-normal text-sm text-gray-500">
                              {record[5]}
                            </td>
                            <td className="record whitespace-normal text-sm text-gray-500">
                              {record[6]}
                            </td>
                            <td className="record whitespace-normal text-sm text-gray-500">
                              {record[7]}
                            </td>

                            {/* Call Answers Render */}
                            <td className="record whitespace-normal text-sm text-gray-500">
                              {ans1}
                            </td>
                            <td className="record whitespace-normal text-sm text-gray-500">
                              {ans2}
                            </td>
                            <td className="record whitespace-normal text-sm text-gray-500 font-bold">
                              {ans3}
                            </td>

                            {/* Mobile Number Moved Here */}
                            <td className="record whitespace-nowrap text-sm text-gray-500">
                              {record[3]?.includes(",") ? (
                                record[3]?.split(",")?.map((number, idx) => (
                                  <React.Fragment key={idx}>
                                    <a
                                      href={`tel:${number?.trim()}`}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {number?.trim()}
                                    </a>{" "}
                                  </React.Fragment>
                                ))
                              ) : (
                                <a
                                  href={`tel:${record[3]?.trim()}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {record[3]?.trim()}
                                </a>
                              )}
                            </td>

                            {(user.role === "owner" ||
                              user.role === "telecaller") && (
                              <td
                                className="record whitespace-normal text-sm text-gray-500"
                                style={{
                                  display: "flex",
                                  gap: ".3rem",
                                  alignItems: "center",
                                  height: "100%",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    navigate(`/customers/add-call/${record[0]}`)
                                  }
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                  style={{
                                    whiteSpace: "nowrap",
                                    fontSize: "10px",
                                  }}
                                >
                                  Add Call Detail
                                </button>

                                <button
                                  onClick={() =>
                                    navigate(`/customers/form/${record[0]}`)
                                  }
                                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded"
                                  style={{
                                    whiteSpace: "nowrap",
                                    fontSize: "10px",
                                  }}
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          )}

          {Object.keys(groupedRecords).length === 0 && !loading && !error && (
            <div className="px-6 py-4 text-center text-gray-500">
              No Records Found!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactListReportOverview;
