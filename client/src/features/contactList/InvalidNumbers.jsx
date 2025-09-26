import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../Report.scss";
import apiPath from "../../isProduction";
import { useAuth } from "../../config/AuthContext";

const InvalidNumbers = () => {
  const { user } = useAuth();

  // State for the invalid numbers from the URL
  const [invalidNumbers, setInvalidNumbers] = useState([]);
  const [searchParams] = useSearchParams();

  // State for all records fetched from the API
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the filtered records
  const [filteredRecords, setFilteredRecords] = useState([]);

  const navigate = useNavigate();

  // Effect to parse numbers from the URL
  useEffect(() => {
    const encodedNumbers = searchParams.get("numbers");
    if (encodedNumbers) {
      try {
        const numbersString = decodeURIComponent(encodedNumbers);
        const parsedNumbers = JSON.parse(numbersString);
        if (Array.isArray(parsedNumbers)) {
          setInvalidNumbers(parsedNumbers);
        } else {
          console.error("Parsed data is not an array:", parsedNumbers);
          setInvalidNumbers([]);
        }
      } catch (error) {
        console.error("Failed to parse invalid numbers from URL:", error);
        setInvalidNumbers([]);
      }
    } else {
      setInvalidNumbers([]);
    }
  }, [searchParams]);

  // Effect to fetch all records from the API
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

  // Effect to filter records based on the invalidNumbers list
  useEffect(() => {
    if (records.length > 0 && invalidNumbers.length > 0) {
      // Create a Set for efficient lookup of invalid numbers
      const invalidNumbersSet = new Set(invalidNumbers);

      const filtered = records.filter((record) => {
        const whatsAppNumber = record[4];
        return invalidNumbersSet.has(whatsAppNumber);
      });
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([]);
    }
  }, [records, invalidNumbers]);

  const background = "#007bff";

  // This is the new function to handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Invalid WhatsApp Numbers Report",
          text: "Invalid WhatsApp numbers Report.",
          url: window.location.href,
        });
        console.log("Report shared successfully");
      } catch (error) {
        console.error("Error sharing the report:", error);
      }
    } else {
      alert(
        `The Web Share API is not supported in this browser. You can copy the link from the address bar.`
      );
    }
  };

  return (
    <>
      <div className="container mx-auto p-2 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Customer List with Invalid Whatsapp Numbers
        </h1>
        <h2 className="text-xl text-center mb-8 text-gray-600">
          by - A.F. Infosys
        </h2>

        <div
          className="flex justify-between items-center gap-1 mb-1 flex-wrap"
          style={{ userSelect: "none" }}
        >
          <button
            className="add-btn"
            onClick={() => navigate("/customers/report")}
            style={{ fontSize: ".8rem", padding: ".8rem .9rem", margin: 0 }}
          >
            View Full Report
          </button>

          <button
            className="add-btn"
            onClick={handleShare}
            style={{
              fontSize: ".8rem",
              padding: ".8rem .9rem",
              margin: 0,
              backgroundColor: "#25D366",
            }}
          >
            Share Report
          </button>
        </div>
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
                  className={`px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg`}
                  style={{ color: "white", background: background }}
                >
                  અનું ક્રમાંક
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
                  style={{
                    color: "white",
                    background: background,
                    minWidth: "150px",
                  }}
                >
                  કયુ કામ વસ્તુ માટે ફોન કરેલ
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  કયા ગામનું કામ કરવાનું છે
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  જવાબ શું આપ્યો કસ્ટમર / ગ્રાહક
                </th>{" "}
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  ઘર/ ખાતા ગામના કેટલા છે
                </th>{" "}
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  ભાવ ઘર ખાતા દીઠ
                </th>{" "}
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  અંદાજીત બીલ રકમ રૂ
                </th>{" "}
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  કસ્ટમરને કેટલા પૈસા સુધી પોસાય ઘર/ખાતા
                </th>{" "}
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  ફોન કર્યા તારીખ ટેલીકોલર
                </th>{" "}
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  મીટીંગ તારીખ રૂબરુ મળવા જવુ
                </th>
                {/* Entry Date */}
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  ઑફીસમા યાદી બનાવેલ તારીખ
                </th>
                <th
                  className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ color: "white", background: background }}
                >
                  કમ્પની ને મળેલ તારીખ
                </th>
              </tr>
            </thead>

            {/* Index Start */}
            <tr>
              {/* 1 to 18 th for index */}
              {Array.from({ length: 20 }).map((_, index) => (
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
              {filteredRecords.map((record, index) => {
                let survayorData = record[13];

                if (typeof survayorData === "string") {
                  try {
                    survayorData = JSON.parse(survayorData);
                  } catch (error) {
                    console.error("Error parsing survayor data:", error);
                    survayorData = null;
                  }
                }

                let callHistory = record[10] || [{}];

                if (typeof callHistory === "string") {
                  try {
                    callHistory = JSON.parse(callHistory);
                  } catch (error) {
                    console.error("Error parsing Call History:", error);
                    callHistory = [{}];
                  }
                }

                function formatDate(date) {
                  if (!date) return " ";
                  const d = new Date(date);
                  const day = d.getDate();
                  const month = d.toLocaleString("en-US", { month: "short" });
                  const year = d.getFullYear();
                  return `${day} ${month}, ${year}`;
                }

                return (
                  <tr key={index}>
                    {/* અહીં Google Sheet માંથી આવતા ડેટાને કૉલમમાં મેપ કરો */}
                    {/* અનું કૂમાંક (serialNumber) */}
                    <td className="px-1 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record[1]}
                    </td>
                    {/* Customer Full Name */}
                    <td
                      className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                      onClick={() => {
                        if (user.role === "owner")
                          navigate(`/customers/history/${record[0]}`);
                      }}
                    >
                      {record[2]}
                    </td>{" "}
                    {/* Mobile No.  */}
                    <td className="px-1 py-2 whitespace-nowrap text-sm text-gray-500">
                      {record[3]?.includes(",") ? (
                        record[3]?.split(",")?.map((number, index) => (
                          <>
                            <a
                              key={index}
                              href={`tel:${number?.trim()}`}
                              className="text-blue-600 hover:underline"
                            >
                              {number?.trim()}
                            </a>{" "}
                          </>
                        ))
                      ) : (
                        <a
                          href={`tel:${record[3]?.trim()}`}
                          className="text-blue-600 hover:underline"
                        >
                          {record[3]?.trim()}
                        </a>
                      )}
                    </td>{" "}
                    {/* Whatsaap No. */}
                    <td
                      className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                      style={{ background: "#ffb3b3b2" }}
                    >
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
                    {/* Call History */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {callHistory[callHistory?.length - 1]?.whatBusiness ||
                        " "}
                    </td>
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {callHistory[callHistory?.length - 1]?.workVillage || " "}
                    </td>{" "}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {callHistory[callHistory?.length - 1]?.clientAnswer ||
                        " "}
                    </td>{" "}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {callHistory[callHistory?.length - 1]?.numberOfHouses ||
                        " "}
                    </td>{" "}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {callHistory[callHistory?.length - 1]?.price || " "}
                    </td>{" "}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {callHistory[callHistory?.length - 1]?.estimatedBill ||
                        " "}
                    </td>{" "}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      {callHistory[callHistory?.length - 1]?.budget || " "}
                    </td>
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      <p style={{ whiteSpace: "nowrap" }}>
                        {formatDate(
                          callHistory[callHistory?.length - 1]?.dateOfCall || ""
                        )}
                      </p>
                    </td>
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      <p style={{ whiteSpace: "nowrap" }}>
                        {formatDate(
                          callHistory?.[callHistory.length - 1]?.meetingDate ||
                            ""
                        )}
                      </p>
                    </td>
                    {/* Data Entry Resources Dates */}
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      <p style={{ whiteSpace: "nowrap" }}>
                        {formatDate(record[11] || "")}
                      </p>
                    </td>
                    <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                      <p style={{ whiteSpace: "nowrap" }}>
                        {formatDate(record[12] || "")}
                      </p>
                    </td>
                  </tr>
                );
              })}

              {filteredRecords.length === 0 && !loading && !error && (
                <tr>
                  <td
                    colSpan="20"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No Records Found with Invalid WhatsApp Numbers!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default InvalidNumbers;
