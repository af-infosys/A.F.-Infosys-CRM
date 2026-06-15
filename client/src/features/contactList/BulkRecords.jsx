import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import apiPath from "../../isProduction";
import { useAuth } from "../../config/AuthContext";

const EXPECTED_HEADERS = [
  "અનું ક્રમાંક",
  "ગ્રાહકનું & કસ્ટમર પુરૂ નામ",
  "કેટેગરી",
  "ગામ",
  "ચાર્જ નું ગામ",
  "મોબાઈલ નંબર",
  "તાલુકો",
  "જિલ્લો",
  "કમ્પની ને મળેલ તારીખ",
];

const BulkRecords = () => {
  const { user } = useAuth();

  const [previewData, setPreviewData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const fileInputRef = useRef(null);

  // 1. Download Starter Template File
  const downloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([EXPECTED_HEADERS]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads_Template");
    XLSX.writeFile(workbook, "Lead_Upload_Template.xlsx");
  };

  // 2. Strict Row Validation
  const validateRow = (row) => {
    let isValid = true;
    let errors = [];

    // 1. Serial Number Validation: Only English Digits (Sequence doesn't matter)
    const serial = row["અનું ક્રમાંક"];
    if (
      serial !== undefined &&
      serial !== null &&
      serial.toString().trim() !== ""
    ) {
      const serialStr = serial.toString().trim();
      if (!/^\d+$/.test(serialStr)) {
        isValid = false;
        errors.push("Invalid Serial No (Only English digits)");
      }
    }

    // 2. Category Validation: Strictly "TCM" or "SARPANCH" (Case Sensitive)
    const category = row["કેટેગરી"];
    if (
      category !== undefined &&
      category !== null &&
      category.toString().trim() !== ""
    ) {
      const catStr = category.toString().trim();
      if (catStr !== "TCM" && catStr !== "SARPANCH") {
        isValid = false;
        errors.push("Invalid Category (Must be exactly TCM or SARPANCH)");
      }
    }

    // 3. Mobile Number Validation: Multiple allowed, ONLY English digits, comma, and space
    const mobile = row["મોબાઈલ નંબર"];
    if (
      mobile !== undefined &&
      mobile !== null &&
      mobile.toString().trim() !== ""
    ) {
      const mobileStr = mobile.toString().trim();

      // Check for strictly English digits, commas, and spaces
      if (!/^[\d,\s]+$/.test(mobileStr)) {
        isValid = false;
        errors.push("Invalid Mobile (Only English digits allowed)");
      } else {
        // Check if every individual number entered is exactly 10 digits
        const numbersList = mobileStr
          .split(",")
          .map((n) => n.trim())
          .filter((n) => n !== "");
        for (let num of numbersList) {
          if (num.length !== 10) {
            isValid = false;
            errors.push("Each mobile number must be exactly 10 digits");
            break;
          }
        }
      }
    }

    // 4. Date Validation: Strictly YYYY-MM-DD
    const dateField = row["કમ્પની ને મળેલ તારીખ"];
    if (
      dateField !== undefined &&
      dateField !== null &&
      dateField.toString().trim() !== ""
    ) {
      const dateStr = dateField.toString().trim();
      // Regex expects exactly 4 digits - 2 digits - 2 digits
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateStr)) {
        isValid = false;
        errors.push("Invalid Date (Must be strictly YYYY-MM-DD)");
      }
    }

    return { ...row, __isValid: isValid, __errors: errors };
  };

  // 3. Handle File Upload & Parse Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setGlobalError("");
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;

        // Removed cellDates: true so we can get exactly what the user typed for strict Date matching
        const workbook = XLSX.read(bstr, { type: "binary" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // raw: false converts excel cells exactly to string as displayed in the excel sheet
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          raw: false,
        });

        if (rawData.length === 0) {
          setGlobalError("Upload ki gayi file empty hai.");
          return;
        }

        // Validate Headers
        const fileHeaders = Object.keys(rawData[0]);
        const isValidFormat = EXPECTED_HEADERS.every((header) =>
          fileHeaders.includes(header),
        );

        if (!isValidFormat) {
          setGlobalError(
            "Excel format match nahi ho raha. Kripaya starter file ka use karein.",
          );
          setPreviewData([]);
          return;
        }

        // Validate each row based on our rules
        const validatedData = rawData.map((row) => validateRow(row));
        setPreviewData(validatedData);
        setIsUploaded(true);
      } catch (error) {
        setGlobalError(
          "File read karne me error aayi. Please correct format upload karein.",
        );
      }
    };

    reader.readAsBinaryString(file);
  };

  // 4. Handle Bulk Submission (Sending to Server)
  const handleBulkSubmit = async () => {
    const validPayload = previewData
      .filter((row) => row.__isValid)
      .map((row) => ({
        serialNumber: row["અનું ક્રમાંક"],
        customerFullName: row["ગ્રાહકનું & કસ્ટમર પુરૂ નામ"],
        category: row["કેટેગરી"],
        village: row["ગામ"],
        villageOfCharge: row["ચાર્જ નું ગામ"],
        mobileNo: row["મોબાઈલ નંબર"],
        taluko: row["તાલુકો"],
        jilla: row["જિલ્લો"],
        listReceived: row["કમ્પની ને મળેલ તારીખ"],
        telecaller: { id: user?.id, name: user?.name, time: new Date() },
      }));

    console.log("Payload ready:", validPayload);

    try {
      const response = await fetch(`${await apiPath()}/api/contactList/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: validPayload }),
      });

      const result = await response.json();
      alert(result.message);

      setPreviewData([]);
      setIsUploaded(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-gray-800">
      <div className="mb-8 border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bulk Leads Upload
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Excel file ke through bulk data import karein. Missing fields
            allowed hain, par format sahi hona chahiye.
          </p>
        </div>
        <button
          onClick={downloadTemplate}
          className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          Download Starter File
        </button>
      </div>

      {globalError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
          {globalError}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Excel File
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-200 rounded-md p-1"
        />
      </div>

      {isUploaded && previewData.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Data Preview
            </h2>
            <div className="text-sm">
              Total: {previewData.length} | Valid:{" "}
              <span className="text-green-600 font-bold">
                {previewData.filter((r) => r.__isValid).length}
              </span>{" "}
              | Invalid:{" "}
              <span className="text-red-600 font-bold">
                {previewData.filter((r) => !r.__isValid).length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm mb-6">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 border-b">Status</th>
                  {EXPECTED_HEADERS.map((header, idx) => (
                    <th key={idx} className="px-4 py-3 border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      row.__isValid ? "bg-white" : "bg-red-50"
                    } border-b hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3 border-r">
                      {row.__isValid ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Valid
                        </span>
                      ) : (
                        <span
                          className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                          title={row.__errors.join(", ")}
                        >
                          Invalid
                        </span>
                      )}
                    </td>
                    {EXPECTED_HEADERS.map((header, idx) => (
                      <td key={idx} className="px-4 py-3 text-gray-600">
                        {row[header] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleBulkSubmit}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md shadow-md hover:bg-blue-700 transition-colors font-medium"
            >
              Upload Valid Records to Server
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkRecords;
