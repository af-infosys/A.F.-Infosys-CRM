import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiPath from "../../isProduction";

const AkarniExcelEdit = () => {
  const navigation = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lastSaved, setLastSaved] = useState(null);

  const { projectId } = useParams();

  const fetchRecords = async () => {
    try {
      // passing projectId in body as workId

      const response = await fetch(`${await apiPath()}/api/sheet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workId: projectId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setData(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);

      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  console.log(data);

  useEffect(() => {
    fetchRecords();
  }, []);

  const project = {
    spot: {
      gaam: "રાજુલા",
      taluka: "રાજુલા",
      district: "અમરેલી",
    },
  };

  const handleCellChange = (rowIndex, key, value) => {
    const colIndex = COLUMN_MAP[key].colIndex;

    setData((prevData) => {
      const newData = [...prevData];
      const newRow = [...newData[rowIndex]];
      let formattedValue = value;

      if (COLUMN_MAP[key].type === "number") {
        formattedValue = value === "" ? "" : value;
      }

      newRow[colIndex] = formattedValue;

      newData[rowIndex] = newRow;

      return newData;
    });
  };

  const handleSave = () => {
    // In a real application, you would send 'data' to Firestore here
    console.log("Saving data:", data);
    setLastSaved(new Date());
    // Display a confirmation message using a custom modal (not alert!)
  };

  // Map original column keys to the correct INDEX in the data tuple
  const COLUMN_MAP = {
    sNo: { label: "અનુ ક્રમાંક", width: "w-[4%]", colIndex: 0 },
    areaName: { label: "વિસ્તારનું નામ", width: "w-[10%]", colIndex: 1 },
    propNo: { label: "મિલ્કત ક્રમાંક", width: "w-[8%]", colIndex: 2 },
    owner: { label: "માલિકનું નામ", width: "w-[15%]", colIndex: 3 },
    oldPropNo: { label: "જુનો મિ.નં.", width: "w-[6%]", colIndex: 4 },
    mobile: { label: "મોબાઈલ નંબર", width: "w-[8%]", type: "tel", colIndex: 5 },
    propName: { label: "મિલ્કત પર લખેલ નામ", width: "w-[10%]", colIndex: 6 },
    description: { label: "મિલ્કતનું વર્ણન", width: "w-[16%]", colIndex: 15 },
    valuation: {
      label: "મિલ્કતની કિંમત",
      width: "w-[8%]",
      type: "number",
      colIndex: 18,
    },
    tax: {
      label: "આકારેલ વેરાની રકમ",
      width: "w-[8%]",
      type: "number",
      colIndex: 19,
    },
    tap: { label: "નળ", width: "w-[3%]", type: "number", colIndex: 11 }, // Yes/No or 1/0
    toilet: { label: "શોચાલય", width: "w-[3%]", type: "number", colIndex: 12 }, // Yes/No or 1/0
    remarks: { label: "નોંધ / રીમાર્કસ", width: "w-[8%]", colIndex: 13 },
  };

  const COLUMN_KEYS = Object.keys(COLUMN_MAP);

  // Utility to get the current column width class
  const getColumnWidth = (key) => COLUMN_MAP[key]?.width || "flex-1";

  // Custom input style for the spreadsheet look
  const inputStyle =
    "w-full p-0.5 text-xs bg-transparent border-0 focus:ring-1 focus:ring-blue-500 focus:z-10 focus:bg-yellow-50 outline-none h-full resize-none";

  return (
    <div className="container mx-auto p-2 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 sticky top-0 shadow-md rounded-b-lg z-20">
        <h1 className="text-2xl font-extrabold text-blue-800">
          પંચાયત હિસાબ નમુનો - ૮ (Editable Spreadsheet)
        </h1>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-4 py-2 ${
              lastSaved ? "bg-green-600" : "bg-orange-600"
            }
             ${lastSaved ? "hover:bg-green-700" : "hover:bg-orange-700"}
             text-white rounded-lg transition duration-150 shadow-md`}
            title="Save Data (Simulated)"
          >
            <span className="hidden sm:inline">Save Data</span>
          </button>
        </div>
      </div>

      {/* Last Saved Info */}
      <div className="text-right text-sm text-gray-500 mt-2 pr-4">
        {lastSaved
          ? `Last Saved: ${lastSaved.toLocaleTimeString()}`
          : "Unsaved changes"}
      </div>

      {/* Report Header */}
      <div className="bg-white p-4 my-4 border border-gray-300 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold text-center text-gray-700 mb-2">
          સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની
          યાદી
        </h2>
        <div className="flex justify-around text-sm font-medium text-gray-600">
          <span>ગામ: {project?.spot?.gaam}</span>
          <span>તાલુકો: {project?.spot?.taluka}</span>
          <span>જિલ્લો: {project?.spot?.district}</span>
        </div>
      </div>

      {/* Virtual Spreadsheet Container */}
      <div className="overflow-x-auto relative shadow-xl rounded-lg border border-gray-200">
        <div className="inline-block min-w-full">
          {/* Table Header Row */}
          <div className="flex bg-gray-100 font-bold text-gray-700 sticky z-10 border-b-2 border-gray-400 text-center text-xs whitespace-nowrap">
            {COLUMN_KEYS.map((key, index) => (
              <div
                key={key}
                className={`p-2 border-r border-gray-300 flex-shrink-0 ${getColumnWidth(
                  key
                )}`}
                style={{ minWidth: key === "description" ? "120px" : "60px" }}
              >
                {COLUMN_MAP[key].label}
                <div className="text-gray-500 font-normal mt-0.5 text-[10px]">
                  ({COLUMN_MAP[key].colIndex + 1})
                </div>
              </div>
            ))}
          </div>

          {/* Table Data Rows */}
          {data.map((record, rowIndex) => (
            <div
              key={rowIndex}
              className="flex border-b border-gray-200 hover:bg-yellow-50 transition duration-50"
              style={{ minHeight: "32px" }}
            >
              {COLUMN_KEYS.map((key) => {
                const colIndex = COLUMN_MAP[key].colIndex;
                const value = record[colIndex] || ""; // Retrieve value using index, default to '' to prevent uncontrolled warnings

                return (
                  <div
                    key={key}
                    className={`border-r border-gray-200 flex-shrink-0 ${getColumnWidth(
                      key
                    )} p-0 text-center flex items-center justify-center`}
                    style={{
                      minWidth: key === "description" ? "120px" : "60px",
                    }}
                  >
                    {/* Editable Input Field */}
                    <input
                      type={COLUMN_MAP[key].type || "text"}
                      value={value}
                      onChange={(e) =>
                        handleCellChange(rowIndex, key, e.target.value)
                      }
                      className={inputStyle}
                      style={{
                        textAlign:
                          key === "valuation" || key === "tax" || key === "sNo"
                            ? "right"
                            : "left",
                        paddingLeft: "4px",
                        paddingRight: "4px",
                        // Special case for description and remarks to allow more vertical space
                        height: "100%",
                        minHeight: "32px",
                      }}
                      // sNo should not be manually editable
                      readOnly={key === "sNo" || key === "description"}
                      disabled={key === "sNo" || key === "description"}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Add Empty Row Placeholder for aesthetic completeness */}
          <div
            className="flex border-b border-gray-200 bg-gray-50"
            style={{ minHeight: "32px" }}
          >
            {COLUMN_KEYS.map((key) => (
              <div
                key={`empty-${key}`}
                className={`border-r border-gray-200 flex-shrink-0 ${getColumnWidth(
                  key
                )} p-0 text-center`}
                style={{ minWidth: key === "description" ? "120px" : "60px" }}
              >
                <div className="h-full bg-gray-50"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional: Display the structure of the saved data for debugging */}
      {/* <div className="mt-8 p-4 bg-gray-700 text-white rounded-lg">
        <h3 className="font-bold mb-2">Current Data State (JSON)</h3>
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default AkarniExcelEdit;
