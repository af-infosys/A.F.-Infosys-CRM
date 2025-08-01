import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Report.scss"; // CSS ને હવે ઇનલાઇન કરવામાં આવ્યું છે
import apiPath from "../../isProduction";

const ContactListReportOverview = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRecords(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError(
        "Error Fetching Records! Try Again Later. OR Contact the Admin."
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

  const background = "#007bff";

  return (
    <div className="container mx-auto p-2 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        (Overview) Customer List Report [ C. L . R. ] / ટેલીકોલર ફોર્મ દરરોજ ફોન
        કરેલ યાદી
      </h1>
      <h2 className="text-xl text-center mb-8 text-gray-600">
        by - A.F. Infosys
      </h2>

      <div className="flex justify-between items-center gap-2">
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
        <div className="table-container rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                  style={{ color: "white", background: background }}
                >
                  અનું કૂમાંક
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{
                    color: "white",
                    background: background,
                    minWidth: "150px",
                  }}
                >
                  કસ્ટમર / ગ્રાહકનું પુરૂ નામ
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  મોબાઈલ નંબર
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  વોટસેઅપ નબંર
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  કેટેગરી
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  ગામ
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  ચાર્જ નું ગામ
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  તાલુકો
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  જિલ્લો
                </th>

                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  Updated by
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                  style={{ color: "white", background: background }}
                >
                  Action
                </th>
              </tr>
            </thead>

            {/* Index Start */}
            <tr>
              {/* 1 to 18 th for index */}
              {Array.from({ length: 11 }).map((_, index) => (
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{
                    textAlign: "center",
                    color: "white",
                    background: background,
                  }}
                  key={index}
                >
                  {index + 1}
                </th>
              ))}
            </tr>
            {/* Index End */}

            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, index) => {
                let survayorData = record[19];

                if (typeof survayorData === "string") {
                  try {
                    survayorData = JSON.parse(survayorData);
                  } catch (error) {
                    console.error("Error parsing survayor data:", error);
                    survayorData = null;
                  }
                }

                return (
                  <tr key={index}>
                    {/* અહીં Google Sheet માંથી આવતા ડેટાને કૉલમમાં મેપ કરો */}
                    {/* અનું કૂમાંક (serialNumber) */}
                    <td className="px-1 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record[1]}
                    </td>
                    {/* Customer Full Name */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {record[2]}
                    </td>{" "}
                    {/* Mobile No. <br /> */}
                    <td className="px-1 py-2 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={`tel:${record[3]}`}
                        className="text-blue-600 hover:underline"
                      >
                        {record[3]}
                      </a>
                    </td>{" "}
                    {/* Whatsaap No.  */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {record[4]}
                    </td>
                    {/* Category Customer  */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {record[5]}
                    </td>{" "}
                    {/* Village  */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {record[6]}
                    </td>
                    {/* Village of charge  */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {record[7]}
                    </td>
                    {/* Taluko  */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {record[8]}
                    </td>
                    {/* Jilla  */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {record[9]}
                    </td>
                    {/* Action */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {survayorData?.name || "Unknown"}
                    </td>
                    <td
                      className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                      style={{
                        display: "flex",
                        gap: ".5rem",
                        alignItems: "center",
                      }}
                    >
                      <button
                        onClick={() => navigate(`/customers/form/${record[0]}`)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record[0])}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {records.length === 0 && !loading && !error && (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No Records Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactListReportOverview;
