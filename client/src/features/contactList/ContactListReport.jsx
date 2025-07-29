import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Report.scss"; // CSS ને હવે ઇનલાઇન કરવામાં આવ્યું છે
import { useAuth } from "../../config/AuthContext";
import apiPath from "../../isProduction";

const ContactListReport = () => {
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

  return (
    <div className="container mx-auto p-2 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Customer List Report [ C. L . R. ] / ટેલીકોલર ફોર્મ દરરોજ ફોન કરેલ યાદી
      </h1>
      <h2 className="text-xl text-center mb-8 text-gray-600">
        by - A.F. Infosys
      </h2>

      <div className="flex justify-between items-center">
        <button className="add-btn" onClick={() => navigate("/customers/form")}>
          Add New Customer Record
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
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  અનું કૂમાંક
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "150px" }}
                >
                  Customer Full Name <br /> કસ્ટમર / ગ્રાહકનું પુરૂ નામ
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile No. <br /> મોબાઈલ નંબર
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Whatsaap No. <br /> વોટસેઅપ નબંર
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Customer <br /> કેટેગરી
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Village <br /> ગામ
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Village of charge <br /> ચાર્જ નું ગામ
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taluko <br /> તાલુકો
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Jilla <br /> જિલ્લો
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  What business did you call for? <br /> કયુ કામ વસ્તુ માટે ફોન
                  કરેલ
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Which village do you want to work for ? <br /> કયા ગામનું કામ
                  કરવાનું છે
                </th>
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  What did the customer/client answer ? <br /> જવાબ શું આપ્યો
                  કસ્ટમર / ગ્રાહક
                </th>{" "}
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  How many households/villages are there? <br /> ઘર/ ખાતા ગામના
                  કેટલા છે
                </th>{" "}
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Price per household account <br /> ભાવ ઘર ખાતા દીઠ
                </th>{" "}
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Estimated bill amount Rs. <br /> અંદાજીત બીલ રકમ રૂ
                </th>{" "}
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  How much money can the customer afford to pay for the
                  house/account? <br /> કસ્ટમરને કેટલા પૈસા સુધી પોસાય ઘર/ખાતા
                </th>{" "}
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Date of call Telecaller <br /> ફોન કર્યા તારીખ ટેલીકોલર
                </th>{" "}
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Meeting date: Meet in person. <br /> મીટીંગ તારીખ રૂબરુ મળવા
                  જવુ
                </th>{" "}
                <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Updated by
                </th>
              </tr>
            </thead>

            {/* Index Start */}
            <tr>
              {/* 1 to 18 th for index */}
              {Array.from({ length: 19 }).map((_, index) => (
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                  style={{ textAlign: "center" }}
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
                    <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record[0]}
                    </td>
                    {/* Customer Full Name */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[1]}
                    </td>{" "}
                    {/* Mobile No. <br /> */}
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={`tel:${record[2]}`}
                        className="text-blue-600 hover:underline"
                      >
                        {record[2]}
                      </a>
                    </td>{" "}
                    {/* Whatsaap No.  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[3]}
                    </td>
                    {/* Category Customer  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[4]}
                    </td>{" "}
                    {/* Village  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[5]}
                    </td>
                    {/* Village of charge  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[6]}
                    </td>
                    {/* Taluko  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[7]}
                    </td>
                    {/* Jilla  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[8]}
                    </td>
                    {/* What business did you call for? */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[9]}
                    </td>
                    {/* Which village do you want to work for ?  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[10]}
                    </td>
                    {/* What did the customer/client answer ?  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[11]}
                    </td>
                    {/* How many households/villages are there?  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[12]}
                    </td>
                    {/* Price per household account  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[13]}
                    </td>
                    {/* Estimated bill amount Rs.  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[14]}
                    </td>
                    {/* How much money can the customer afford to pay for the Work */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[15]}
                    </td>
                    {/* Date of call Telecaller  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[16]}
                    </td>
                    {/* Meeting date: Meet in person.  */}
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      {record[17]}
                    </td>
                    {/* Action */}
                    <td
                      className="px-2 py-4 whitespace-normal text-sm text-gray-500"
                      style={{
                        display: "flex",
                        gap: ".5rem",
                        height: "100%",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", gap: ".6rem" }}>
                        <button
                          onClick={() =>
                            navigate(`/customers/form/${record[0]}`)
                          }
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          style={{ maxHeight: "fit-content" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record[0])}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          style={{ maxHeight: "fit-content" }}
                        >
                          Delete
                        </button>
                      </div>

                      <p style={{ whiteSpace: "nowrap" }}>
                        Last Updated by <br /> {survayorData?.name || "Unknown"}
                      </p>
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

export default ContactListReport;
