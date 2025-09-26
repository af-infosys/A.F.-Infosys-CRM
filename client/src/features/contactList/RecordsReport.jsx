import React, { useEffect, useState } from "react";
import apiPath from "../../isProduction";

const RecordsReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // ✅ Calculate unique counts
  const uniqueVillages = new Set(records.map((r) => r[6])).size;
  const uniqueTalukos = new Set(records.map((r) => r[8])).size;
  const uniqueJillos = new Set(records.map((r) => r[9])).size;
  const totalCustomers = records.length;

  // unique records by village
  const uniqueVillageRecords = Array.from(
    new Map(records.map((r) => [r[6], r])).values()
  );

  const uniqueTalukaRecords = Array.from(
    new Map(records.map((r) => [r[8], r])).values()
  );

  const uniqueJillaRecords = Array.from(
    new Map(records.map((r) => [r[9], r])).values()
  );

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-red-500 text-center p-4">{error}</p>;

  const background = "#007bff";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center">📊 Records Report</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-orange-100 p-4 rounded-2xl shadow text-center">
          <h2 className="text-lg font-semibold">કુલ કસ્ટમર </h2>
          <p className="text-2xl font-bold">{totalCustomers}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-2xl shadow text-center">
          <h2 className="text-lg font-semibold">કુલ ગામ </h2>
          <p className="text-2xl font-bold">{uniqueVillages}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-2xl shadow text-center">
          <h2 className="text-lg font-semibold">કુલ તાલુકા </h2>
          <p className="text-2xl font-bold">{uniqueTalukos}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-2xl shadow text-center">
          <h2 className="text-lg font-semibold">કુલ જિલ્લા </h2>
          <p className="text-2xl font-bold">{uniqueJillos}</p>
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl">
          <thead className="bg-gray-200">
            <tr>
              <th
                colSpan="3"
                className="px-2 py-1 border text-center text-white"
                style={{
                  background: background,
                  fontSize: "1rem",
                  padding: "2px 4px",
                }}
              >
                ગામડાઓ
              </th>
            </tr>

            <tr>
              <th
                className="px-2 py-1 border text-center text-white"
                style={{
                  background: background,
                  fontSize: "1rem",
                  padding: "2px 4px",
                }}
              >
                ગામ
              </th>
              <th
                className="px-2 py-1 border text-center text-white"
                style={{
                  background: background,
                  fontSize: "1rem",
                  padding: "2px 4px",
                }}
              >
                તાલુકા
              </th>
              <th
                className="px-2 py-1 border text-center text-white"
                style={{
                  background: background,
                  fontSize: "1rem",
                  padding: "2px 4px",
                }}
              >
                જિલ્લા
              </th>
            </tr>
          </thead>
          <tbody>
            {uniqueVillageRecords.map((record, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="px-2 py-1 border">{record[6]}</td>
                <td className="px-2 py-1 border">{record[8]}</td>
                <td className="px-2 py-1 border">{record[9]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />
      <hr />
      <br />

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl">
          <thead className="bg-gray-200">
            <tr>
              <th
                colSpan="2"
                className="px-2 py-1 border text-center text-white"
                style={{
                  background: background,
                  fontSize: "1rem",
                  padding: "2px 4px",
                }}
              >
                તાલુકાઓ
              </th>
            </tr>

            <tr>
              <th
                className="px-2 py-1 border text-center text-white"
                style={{
                  background: background,
                  fontSize: "1rem",
                  padding: "2px 4px",
                }}
              >
                તાલુકા
              </th>
              <th
                className="px-2 py-1 border text-center text-white"
                style={{
                  background: background,
                  fontSize: "1rem",
                  padding: "2px 4px",
                }}
              >
                જિલ્લા
              </th>
            </tr>
          </thead>
          <tbody>
            {uniqueTalukaRecords.map((record, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="px-2 py-1 border">{record[8]}</td>
                <td className="px-2 py-1 border">{record[9]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />
      <hr />
      <br />

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-xl">
          <thead className="bg-gray-200">
            <tr>
              <th
                className="px-2 py-1 border text-center text-white"
                style={{
                  background: background,
                  fontSize: "1rem",
                  padding: "2px 4px",
                }}
              >
                જિલ્લા
              </th>
            </tr>
          </thead>
          <tbody>
            {uniqueJillaRecords.map((record, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="px-2 py-1 border">{record[9]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />
      <hr />
      <br />
    </div>
  );
};

export default RecordsReport;
