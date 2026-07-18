import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import apiPath from "../../isProduction";
import { useAuth } from "../../config/AuthContext";
import { useParams } from "react-router-dom";

const SurveyBulkUpload = () => {
  const { user } = useAuth();
  const { projectId } = useParams();

  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [stats, setStats] = useState({ matched: 0, mismatched: 0, total: 0 });
  const [isMerged, setIsMerged] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });

  // Track status of Area upload
  const [areaUploadStatus, setAreaUploadStatus] = useState("");

  const file1Ref = useRef(null);
  const file2Ref = useRef(null);

  const readExcelByIndex = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
          });
          resolve(rows);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsBinaryString(file);
    });
  };

  const handleMergeData = async () => {
    if (!file1 || !file2) {
      setGlobalError("કૃપા કરીને બન્ને એક્સેલ ફાઈલ અપલોડ કરો.");
      setSuccessMessage("");
      return;
    }

    setLoading(true);
    setGlobalError("");
    setSuccessMessage("");
    setAreaUploadStatus("");

    try {
      const rows1 = await readExcelByIndex(file1);
      const rows2 = await readExcelByIndex(file2);

      const taxDataMap = new Map();

      for (let i = 7; i < rows2.length; i += 3) {
        const row1 = rows2[i] || [];
        const row2 = rows2[i + 1] || [];

        const propNumRaw = row1[0];
        if (
          propNumRaw !== undefined &&
          propNumRaw !== null &&
          propNumRaw !== ""
        ) {
          const propNum = String(propNumRaw).trim();

          taxDataMap.set(propNum, {
            prevHT: Number(row2[1]) || 0,
            currHT: Number(row2[2]) || 0,
            prevNW: Number(row2[3]) || 0,
            currNW: Number(row2[4]) || 0,
            prevSW: Number(row2[5]) || 0,
            currSW: Number(row2[6]) || 0,
            prevClean: Number(row2[7]) || 0,
            currClean: Number(row2[8]) || 0,
            prevLight: Number(row2[11]) || 0,
            currLight: Number(row2[12]) || 0,
          });
        }
      }

      const mergedData = [];
      let matchedCount = 0;
      let mismatchedCount = 0;

      for (let i = 6; i < rows1.length; i++) {
        const r = rows1[i];

        if (!r || r.length === 0 || r[0] === "" || r[0] === undefined) continue;

        const propNumRaw = r[2];
        const propNum = propNumRaw ? String(propNumRaw).trim() : "";

        if (!propNum) continue;

        const taxData = taxDataMap.get(propNum);
        const isMatched = !!taxData;

        if (isMatched) {
          matchedCount++;
        } else {
          mismatchedCount++;
        }

        const record = {
          serialNumber: r[0],
          areaSocietyName: String(r[1] || ""),
          propertyNumber: propNum,
          oldPropertyNumber: String(r[3] || ""),
          propertyDescription: String(r[7] || ""),
          ownerName: String(r[8] || ""),
          occupierName: String(r[9] || ""),
          astimatedPrice: Number(r[10]) || 0,
          houseTaxCurrent: taxData ? taxData.currHT : Number(r[11]) || 0,
          mobileNumber: "",
          propertyName: "",
          category: "",
          kitech: 0,
          bathroom: 0,
          farjo: "",
          tapConnections: "",
          toilet: 0,
          remarks: "",
          propertyDetails: [
            {
              floorType: "ગ્રાઉન્ડ ફ્લોર",
              roomDetails: [
                {
                  type: "પાકા",
                  roomHallShopGodown: "રૂમ",
                  slabRooms: "2",
                  tinRooms: "",
                  woodenRooms: "",
                  tileRooms: "",
                },
              ],
            },
          ],
          houseTaxPrev: taxData ? taxData.prevHT : 0,
          otherTaxCurrent: {
            normal_water: { curr: taxData ? taxData.currNW : 0 },
            special_water: { curr: taxData ? taxData.currSW : 0 },
            light: { curr: taxData ? taxData.currLight : 0 },
            cleaning: { curr: taxData ? taxData.currClean : 0 },
          },
          otherTaxPrev: {
            normal_water: { prev: taxData ? taxData.prevNW : 0 },
            special_water: { prev: taxData ? taxData.prevSW : 0 },
            light: { prev: taxData ? taxData.prevLight : 0 },
            cleaning: { prev: taxData ? taxData.prevClean : 0 },
          },
          _isMatched: isMatched,
        };

        mergedData.push(record);
      }

      if (mergedData.length === 0) {
        setGlobalError("આ ફાઇલોમાંથી કોઈ યોગ્ય ડેટા મળ્યો નથી. ફોર્મેટ ચકાસો.");
        return;
      }

      setPreviewData(mergedData);
      setStats({
        matched: matchedCount,
        mismatched: mismatchedCount,
        total: mergedData.length,
      });
      setIsMerged(true);
    } catch (error) {
      console.error(error);
      setGlobalError(
        "ફાઈલ પ્રોસેસ કરવામાં ભૂલ. ફાઈલનું ફોર્મેટ યોગ્ય છે કે નહિ તે ચકાસો.",
      );
    } finally {
      setLoading(false);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleBulkSubmit = async () => {
    setGlobalError("");
    setSuccessMessage("");
    setAreaUploadStatus("");

    // 1. Prepare Main Payload
    const validPayload = previewData.map((row) => ({
      serialNumber: row.serialNumber,
      areaSocietyName: row.areaSocietyName,
      propertyNumber: row.propertyNumber,
      ownerName: row.ownerName,
      occupierName: row.occupierName,
      oldPropertyNumber: row.oldPropertyNumber,
      mobileNumber: row.mobileNumber,
      propertyName: row.propertyName,
      category: row.category,
      kitech: row.kitech,
      bathroom: row.bathroom,
      farjo: row.farjo,
      tapConnections: row.tapConnections,
      toilet: row.toilet,
      remarks: row.remarks,
      propertyDetails: row.propertyDetails,
      propertyDescription: row.propertyDescription,
      astimatedPrice: row.astimatedPrice,
      houseTaxCurrent: row.houseTaxCurrent,
      houseTaxPrev: row.houseTaxPrev,
      otherTaxCurrent: row.otherTaxCurrent,
      otherTaxPrev: row.otherTaxPrev,
      created_at: { id: user?.id, name: user?.name, time: new Date() },
    }));

    if (validPayload.length === 0) {
      setGlobalError("Upload કરવા માટે કોઈ યોગ્ય ડેટા નથી!");
      return;
    }

    // 2. Extract Unique Areas
    const uniqueAreas = [
      ...new Set(
        validPayload
          .map((row) => row.areaSocietyName?.trim())
          .filter((area) => area && area !== ""),
      ),
    ];

    setLoading(true);
    setUploadProgress({ current: 0, total: validPayload.length });

    const CHUNK_SIZE = 5;
    const PAUSE_TIME = 2500;

    try {
      const baseUrl = await apiPath();

      // --- Upload Unique Areas (Single Request) ---
      if (uniqueAreas.length > 0) {
        setAreaUploadStatus(`Uploading ${uniqueAreas.length} Unique Areas...`);
        try {
          // You can create this endpoint on your backend to handle area uploads
          const areaResponse = await fetch(`${baseUrl}/api/sheet/areas/bulk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ areas: uniqueAreas, workId: projectId }),
          });
          if (areaResponse.ok) {
            setAreaUploadStatus("Areas successfully uploaded!");
          } else {
            console.warn("Area upload API returned an error.");
            setAreaUploadStatus(
              "Failed to upload areas, continuing with records...",
            );
          }
        } catch (areaError) {
          console.error("Area upload failed", areaError);
          setAreaUploadStatus(
            "Failed to upload areas, continuing with records...",
          );
        }
      }

      // --- Upload Main Data in Chunks ---
      for (let i = 0; i < validPayload.length; i += CHUNK_SIZE) {
        const chunk = validPayload.slice(i, i + CHUNK_SIZE);
        const currentCount = Math.min(i + CHUNK_SIZE, validPayload.length);

        setUploadProgress({
          current: currentCount,
          total: validPayload.length,
        });

        const response = await fetch(`${baseUrl}/api/sheet/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ records: chunk, workId: projectId }),
        });

        if (!response.ok) {
          throw new Error(
            `Batch અકસ્માતે નિષ્ફળ ગઈ (રેકોર્ડ ${i + 1} થી શરૂ થતી)`,
          );
        }

        if (i + CHUNK_SIZE < validPayload.length) {
          await delay(PAUSE_TIME);
        }
      }

      setSuccessMessage(
        `${validPayload.length} રેકોર્ડ સફળતાપૂર્વક સર્વર પર અપલોડ થઈ ગયા છે!`,
      );
      setPreviewData([]);
      setIsMerged(false);
      setFile1(null);
      setFile2(null);
      if (file1Ref.current) file1Ref.current.value = "";
      if (file2Ref.current) file2Ref.current.value = "";
    } catch (error) {
      console.error("Batch upload failed", error);
      setGlobalError(`અપલોડ દરમિયાન ભૂલ આવી: ${error.message}`);
    } finally {
      setLoading(false);
      // clear status message after a few seconds if you want
      setTimeout(() => setAreaUploadStatus(""), 5000);
    }
  };

  return (
    <div className="p-6 max-w-full mx-auto font-sans text-gray-800 relative">
      {/* Loading Overlay Animation */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex flex-col justify-center items-center text-white">
          <div className="bg-white text-gray-900 p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
            <h3 className="text-lg font-semibold mb-1">Processing...</h3>

            {/* Area Status Text */}
            {areaUploadStatus && (
              <p className="text-xs text-blue-600 mb-2 font-medium">
                {areaUploadStatus}
              </p>
            )}

            {uploadProgress.total > 0 && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Uploading {uploadProgress.current} of {uploadProgress.total}{" "}
                  records
                </p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Survey Data Upload (Merge Files)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          પ્રોપર્ટી ડેટા અને ટેક્સ ડેટાની બંને ફાઈલો પસંદ કરો. સિસ્ટમ Property
          Number મુજબ બંનેને મર્જ કરશે.
        </p>
      </div>

      {globalError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-md shadow-sm">
          {globalError}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-md shadow-sm">
          {successMessage}
        </div>
      )}

      {/* File Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            1. Property Details File (File 1)
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={file1Ref}
            onChange={(e) => setFile1(e.target.files[0])}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer border border-gray-200 rounded-md p-1 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-2">Row 7 થી ડેટા રીડ થશે.</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            2. Tax Details File (File 2)
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            ref={file2Ref}
            onChange={(e) => setFile2(e.target.files[0])}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer border border-gray-200 rounded-md p-1 disabled:opacity-50"
          />
          <p className="text-xs text-gray-400 mt-2">
            Row 8 થી, દરેક રેકોર્ડ 3-row ના ગ્રુપમાં રીડ થશે.
          </p>
        </div>
      </div>

      {!isMerged && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleMergeData}
            disabled={loading || !file1 || !file2}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-md shadow-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
          >
            Process & Merge Data
          </button>
        </div>
      )}

      {/* Preview Section */}
      {isMerged && previewData.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Data Preview</h2>
              <div className="text-sm mt-1 flex gap-4">
                <span className="text-gray-600">
                  Total: <strong>{stats.total}</strong>
                </span>
                <span className="text-green-600">
                  Matched: <strong>{stats.matched}</strong>
                </span>
                <span className="text-red-600">
                  Mismatched: <strong>{stats.mismatched}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleBulkSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md shadow-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              Upload Server Data
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm mb-6 max-h-[600px]">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 border-b border-r sticky left-0 bg-gray-100 z-20">
                    Match Status
                  </th>
                  <th className="px-4 py-3 border-b border-r bg-gray-100">
                    Sr No
                  </th>
                  <th className="px-4 py-3 border-b border-r bg-gray-100">
                    Prop Number
                  </th>
                  <th className="px-4 py-3 border-b">Old Prop Num</th>
                  <th className="px-4 py-3 border-b">Area/Society</th>
                  <th className="px-4 py-3 border-b">Owner Name</th>
                  <th className="px-4 py-3 border-b">Occupier Name</th>
                  <th className="px-4 py-3 border-b">Mobile</th>
                  <th className="px-4 py-3 border-b">Prop Description</th>
                  <th className="px-4 py-3 border-b border-l bg-blue-50">
                    Est. Price
                  </th>
                  <th className="px-4 py-3 border-b bg-blue-50">
                    House Tax (Curr | Prev)
                  </th>
                  <th className="px-4 py-3 border-b bg-blue-50">
                    Normal Water (Curr | Prev)
                  </th>
                  <th className="px-4 py-3 border-b bg-blue-50">
                    Special Water (Curr | Prev)
                  </th>
                  <th className="px-4 py-3 border-b bg-blue-50">
                    Light Tax (Curr | Prev)
                  </th>
                  <th className="px-4 py-3 border-b border-r bg-blue-50">
                    Clean Tax (Curr | Prev)
                  </th>
                  <th className="px-4 py-3 border-b">Category</th>
                  <th className="px-4 py-3 border-b">
                    Facilities (Kit/Bath/Toi)
                  </th>
                  <th className="px-4 py-3 border-b">Prop Details (JSON)</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      row._isMatched ? "bg-white" : "bg-red-50"
                    } border-b hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-4 py-2 border-r sticky left-0 z-10 bg-inherit">
                      {row._isMatched ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Matched
                        </span>
                      ) : (
                        <span
                          className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"
                          title="File 2 માં આ પ્રોપર્ટી નંબર મળ્યો નથી."
                        >
                          Mismatched
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 border-r text-gray-600">
                      {row.serialNumber || "-"}
                    </td>
                    <td className="px-4 py-2 border-r text-gray-900 font-semibold">
                      {row.propertyNumber || "-"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {row.oldPropertyNumber || "-"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {row.areaSocietyName || "-"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {row.ownerName || "-"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {row.occupierName || "-"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {row.mobileNumber || "-"}
                    </td>

                    <td
                      className="px-4 py-2 text-gray-600 truncate max-w-[200px]"
                      title={row.propertyDescription}
                    >
                      {row.propertyDescription || "-"}
                    </td>

                    <td className="px-4 py-2 border-l font-medium text-gray-800 bg-blue-50/30">
                      {row.astimatedPrice}
                    </td>
                    <td className="px-4 py-2 text-gray-700 bg-blue-50/30">
                      <span className="text-blue-700 font-medium">
                        {row.houseTaxCurrent}
                      </span>{" "}
                      <span className="text-gray-400 mx-1">|</span>{" "}
                      {row.houseTaxPrev}
                    </td>
                    <td className="px-4 py-2 text-gray-700 bg-blue-50/30">
                      <span className="text-blue-700 font-medium">
                        {row.otherTaxCurrent?.normal_water?.curr || 0}
                      </span>{" "}
                      <span className="text-gray-400 mx-1">|</span>{" "}
                      {row.otherTaxPrev?.normal_water?.prev || 0}
                    </td>
                    <td className="px-4 py-2 text-gray-700 bg-blue-50/30">
                      <span className="text-blue-700 font-medium">
                        {row.otherTaxCurrent?.special_water?.curr || 0}
                      </span>{" "}
                      <span className="text-gray-400 mx-1">|</span>{" "}
                      {row.otherTaxPrev?.special_water?.prev || 0}
                    </td>
                    <td className="px-4 py-2 text-gray-700 bg-blue-50/30">
                      <span className="text-blue-700 font-medium">
                        {row.otherTaxCurrent?.light?.curr || 0}
                      </span>{" "}
                      <span className="text-gray-400 mx-1">|</span>{" "}
                      {row.otherTaxPrev?.light?.prev || 0}
                    </td>
                    <td className="px-4 py-2 border-r text-gray-700 bg-blue-50/30">
                      <span className="text-blue-700 font-medium">
                        {row.otherTaxCurrent?.cleaning?.curr || 0}
                      </span>{" "}
                      <span className="text-gray-400 mx-1">|</span>{" "}
                      {row.otherTaxPrev?.cleaning?.prev || 0}
                    </td>

                    <td className="px-4 py-2 text-gray-600">
                      {row.category || "-"}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      K:{row.kitech} / B:{row.bathroom} / T:{row.toilet}
                    </td>
                    <td
                      className="px-4 py-2 text-gray-500 text-xs truncate max-w-[200px]"
                      title={JSON.stringify(row.propertyDetails)}
                    >
                      {JSON.stringify(row.propertyDetails)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyBulkUpload;
