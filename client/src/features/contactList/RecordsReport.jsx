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

  // ✅ Aggregation Logic for Counts
  const districtStats = {};
  const talukaStats = {};
  const villageStats = {};

  records.forEach((r) => {
    // Array indices based on your base code: 6: Village, 8: Taluka, 9: District
    const village = r[6] || "N/A";
    const taluka = r[8] || "N/A";
    const district = r[9] || "N/A";

    // 1. Village Level Aggregation
    const vKey = `${district}_${taluka}_${village}`;
    if (!villageStats[vKey]) {
      villageStats[vKey] = { district, taluka, village, customers: 0 };
    }
    villageStats[vKey].customers += 1;

    // 2. Taluka Level Aggregation
    const tKey = `${district}_${taluka}`;
    if (!talukaStats[tKey]) {
      talukaStats[tKey] = {
        district,
        taluka,
        villages: new Set(),
        customers: 0,
      };
    }
    talukaStats[tKey].villages.add(village);
    talukaStats[tKey].customers += 1;

    // 3. District Level Aggregation
    const dKey = district;
    if (!districtStats[dKey]) {
      districtStats[dKey] = {
        district,
        talukas: new Set(),
        villages: new Set(),
        customers: 0,
      };
    }
    districtStats[dKey].talukas.add(taluka);
    districtStats[dKey].villages.add(`${taluka}_${village}`); // unique village per taluka
    districtStats[dKey].customers += 1;
  });

  // Convert grouped objects into arrays for rendering
  const districtRecords = Object.values(districtStats);
  const talukaRecords = Object.values(talukaStats);
  const villageRecords = Object.values(villageStats);

  // ✅ Calculate overall unique counts for top cards
  const uniqueVillages = new Set(records.map((r) => `${r[8]}_${r[6]}`)).size;
  const uniqueTalukos = new Set(records.map((r) => r[8])).size;
  const uniqueJillos = new Set(records.map((r) => r[9])).size;
  const totalCustomers = records.length;

  if (loading) return <p className="text-center p-4"> Loading... </p>;
  if (error) return <p className="text-red-500 text-center p-4"> {error} </p>;

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

      {/* Table 1: કુલ તાલુકાના ગામ ની સંખ્યા */}
      <div className="overflow-x-auto">
        <table
          className="border border-gray-300 rounded-xl"
          style={{ maxWidth: "fit-content" }}
        >
          <thead className="bg-gray-200">
            <tr>
              <th
                colSpan="5"
                className="px-2 py-1 border text-center text-white"
                style={{
                  background,
                  color: "#000",
                  fontSize: "1rem",
                  padding: "4px",
                }}
              >
                કુલ તાલુકાના ગામ ની સંખ્યા
              </th>
            </tr>
            <tr>
              {[
                "ક્રમ",
                "જિલ્લાનું નામ",
                "તાલુકાનું નામ",
                "ગામની સંખ્યા",
                "કસ્ટમરની સંખ્યા",
              ].map((head, i) => (
                <th
                  key={i}
                  className="px-2 py-1 border text-center text-white"
                  style={{ background, color: "#000" }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {talukaRecords.map((record, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="px-2 py-1 border">{index + 1}</td>
                <td className="px-2 py-1 border">{record.district}</td>
                <td className="px-2 py-1 border">{record.taluka}</td>
                <td className="px-2 py-1 border">{record.villages.size}</td>
                <td className="px-2 py-1 border">{record.customers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />
      <hr />
      <br />

      {/* Table 2: કુલ જિલ્લાઓના ગામ ની સંખ્યા */}
      <div className="overflow-x-auto">
        <table
          className="border border-gray-300 rounded-xl"
          style={{ maxWidth: "fit-content" }}
        >
          <thead className="bg-gray-200">
            <tr>
              <th
                colSpan="5"
                className="px-2 py-1 border text-center text-white"
                style={{
                  background,
                  color: "#000",
                  fontSize: "1rem",
                  padding: "4px",
                }}
              >
                કુલ જિલ્લાઓના ગામ ની સંખ્યા
              </th>
            </tr>
            <tr>
              {[
                "ક્રમ",
                "જિલ્લાઓ",
                "તાલુકા સંખ્યા",
                "ગામની સંખ્યા",
                "કસ્ટમરની સંખ્યા",
              ].map((head, i) => (
                <th
                  key={i}
                  className="px-2 py-1 border text-center text-white"
                  style={{ background, color: "#000" }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {districtRecords.map((record, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="px-2 py-1 border">{index + 1}</td>
                <td className="px-2 py-1 border">{record.district}</td>
                <td className="px-2 py-1 border">{record.talukas.size}</td>
                <td className="px-2 py-1 border">{record.villages.size}</td>
                <td className="px-2 py-1 border">{record.customers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />
      <hr />
      <br />

      {/* Table 3: કુલ ગામ ની સંખ્યા */}
      <div className="overflow-x-auto">
        <table
          className="border border-gray-300 rounded-xl"
          style={{ maxWidth: "fit-content" }}
        >
          <thead className="bg-gray-200">
            <tr>
              <th
                colSpan="5"
                className="px-2 py-1 border text-center text-white"
                style={{
                  background,
                  color: "#000",
                  fontSize: "1rem",
                  padding: "4px",
                }}
              >
                કુલ ગામ ની સંખ્યા
              </th>
            </tr>
            <tr>
              {[
                "ક્રમ",
                "જિલ્લાનું નામ",
                "તાલુકાનું નામ",
                "ગામનું નામ",
                "કસ્ટમરની સંખ્યા",
              ].map((head, i) => (
                <th
                  key={i}
                  className="px-2 py-1 border text-center text-white"
                  style={{ background, color: "#000" }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {villageRecords.map((record, index) => (
              <tr key={index} className="text-center hover:bg-gray-50">
                <td className="px-2 py-1 border">{index + 1}</td>
                <td className="px-2 py-1 border">{record.district}</td>
                <td className="px-2 py-1 border">{record.taluka}</td>
                <td className="px-2 py-1 border">{record.village}</td>
                <td className="px-2 py-1 border">{record.customers}</td>
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
