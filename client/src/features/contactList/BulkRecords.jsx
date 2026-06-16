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
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
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

    // 1. Serial Number Validation
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

    // 2. Category Validation
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

    // 3. Mobile Number Validation
    const mobile = row["મોબાઈલ નંબર"];
    if (
      mobile !== undefined &&
      mobile !== null &&
      mobile.toString().trim() !== ""
    ) {
      const mobileStr = mobile.toString().trim();

      if (!/^[\d,\s]+$/.test(mobileStr)) {
        isValid = false;
        errors.push("Invalid Mobile (Only English digits allowed)");
      } else {
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

    // 4. Date Validation
    const dateField = row["કમ્પની ને મળેલ તારીખ"];
    if (
      dateField !== undefined &&
      dateField !== null &&
      dateField.toString().trim() !== ""
    ) {
      const dateStr = dateField.toString().trim(); // MM-DD-YYYY (month/day can be 1 or 2 digits)
      const dateRegex = /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])-\d{4}$/;
      if (!dateRegex.test(dateStr)) {
        isValid = false;
        errors.push(
          "Invalid Date (Must be MM-DD-YYYY, e.g. 2-10-2026 or 02-10-2026)",
        );
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
        const workbook = XLSX.read(bstr, { type: "binary" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          raw: false,
        });

        if (rawData.length === 0) {
          setGlobalError("Upload ki gayi file empty hai.");
          return;
        }

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

  // Helper function to handle delay/pause between chunks
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 4. Handle Chunked Bulk Submission with Pause and Animation
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

    if (validPayload.length === 0) {
      alert("Upload karne ke liye koi valid record nahi mila!");
      return;
    }

    setLoading(true);
    setUploadProgress({ current: 0, total: validPayload.length });

    const CHUNK_SIZE = 50; // Ek baar me 50 records jayenge
    const PAUSE_TIME = 2500; // 2.5 seconds ka break chunks ke beech me
    const baseUrl = await apiPath();

    try {
      for (let i = 0; i < validPayload.length; i += CHUNK_SIZE) {
        const chunk = validPayload.slice(i, i + CHUNK_SIZE);
        const currentCount = Math.min(i + CHUNK_SIZE, validPayload.length);

        // Update progress state for current chunk
        setUploadProgress({
          current: currentCount,
          total: validPayload.length,
        });

        // API request for current chunk
        const response = await fetch(`${baseUrl}/api/contactList/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ records: chunk }),
        });

        if (!response.ok) {
          throw new Error(`Failed to upload batch starting at record ${i + 1}`);
        }

        // Agar aur chunks bache hain, toh next chunk bhejni se pehle delay karo
        if (i + CHUNK_SIZE < validPayload.length) {
          await delay(PAUSE_TIME);
        }
      }

      alert(`${validPayload.length} records successfully uploaded in batches!`);
      setPreviewData([]);
      setIsUploaded(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Batch upload failed", error);
      alert(`Upload ke dauran error aayi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans text-gray-800 relative">
      {/* Loading Overlay Animation */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex flex-col justify-center items-center text-white">
          <div className="bg-white text-gray-900 p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 flex flex-col items-center">
            {/* Custom CSS Spinner */}
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
            <h3 className="text-lg font-semibold mb-1">Uploading Records...</h3>
            <p className="text-sm text-gray-500 mb-4">
              Processing {uploadProgress.current} of {uploadProgress.total}{" "}
              leads
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

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
          disabled={loading}
          className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50"
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
          disabled={loading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-200 rounded-md p-1 disabled:opacity-50"
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
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md shadow-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
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
