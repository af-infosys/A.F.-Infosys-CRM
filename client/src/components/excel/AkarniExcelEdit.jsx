import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiPath from "../../isProduction";
import { toast } from "react-toastify";
import axios from "axios";
import SurveyEditForm from "./SurveyEditForm";

const AkarniExcelEdit = () => {
  const navigation = useNavigate();

  const [initialData, setInitialData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notSaved, setNotSaved] = useState(false);
  const [error, setError] = useState(null);

  const [lastSaved, setLastSaved] = useState(null);

  const [project, setProject] = useState({});
  const { projectId } = useParams();

  const CHUNK_SIZE = 80; // safe for Google Sheets
  const DELAY_MS = 700; // 1.5 sec gap (rate limit safe)

  const fetchRecords = async () => {
    try {
      // passing projectId in body as workId

      const response = await fetch(
        `${await apiPath()}/api/sheet?workId=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setData(result.data);
      setInitialData(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);

      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await axios.get(
        `${await apiPath()}/api/work/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(data);
      setProject(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchProject();
  }, []);

  const handleCellChange = (rowIndex, key, value) => {
    setNotSaved(true);
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

  const handleSave = async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      toast.info("Saving Data... Please Wait!");

      let startIndex = 0; // row tracking (backend overwrite logic use karega)

      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        setLoading(i);

        const chunk = data.slice(i, i + CHUNK_SIZE);

        const payload = {
          workId: projectId,
          start: startIndex,
          payload: chunk,
        };

        console.log(
          `Uploading rows ${startIndex} → ${startIndex + chunk.length - 1}`,
        );

        await axios.put(`${await apiPath()}/api/sheet/excel`, payload);

        // move start pointer for next overwrite
        startIndex += chunk.length;

        // hold to avoid Google Sheets API rate limit
        await sleep(DELAY_MS);
      }

      toast.success("All data saved successfully 🚀");
      setLastSaved(new Date());
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.response?.data?.message || "Error Saving Data");
    } finally {
      setLoading(false);
      setNotSaved(false);
    }
  };

  const handleInsert = async () => {
    try {
      setLoading(true);
      toast.info("Attempting to insert record");
      navigation(`/survay/insert/${projectId}`);
    } catch (err) {
      console.error("Error inserting record:", err);
      toast.error("Error inserting record:", err);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const handleEditPopup = async (value) => {
    if (showModal !== false) setData(value);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      toast.info("Attempting to delete record with ID:", id);

      // workId = projectId in body
      const res = await fetch(`${await apiPath()}/api/sheet/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          workId: projectId,
        }),
      });

      if (res.status !== 200) {
        throw new Error(res.statusText);
      }

      toast.success(
        `Record deleted successfully! \n with id: ${Number(id)}, name: ${data[Number(id) - 1][3]} `,
      );

      setData([]);
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
      toast.error("Error deleting record:", err);
    } finally {
      setLoading(false);
    }
  };

  // Map original column keys to the correct INDEX in the data tuple
  const COLUMN_MAP = {
    sNo: { label: "અનુ ક્રમાંક", width: "w-[4%]", colIndex: 0 },
    areaName: { label: "વિસ્તારનું નામ", width: "w-[10%]", colIndex: 1 },
    propNo: { label: "મિલ્કત ક્રમાંક", width: "w-[8%]", colIndex: 2 },
    owner: { label: "માલિકનું નામ", width: "w-[15%]", colIndex: 3 },
    occupant: { label: "કબ્જેદારનું નામ", width: "w-[15%]", colIndex: 4 },
    oldPropNo: { label: "જુનો મિ.નં.", width: "w-[6%]", colIndex: 5 },
    mobile: { label: "મોબાઈલ નંબર", width: "w-[8%]", type: "tel", colIndex: 6 },
    propName: { label: "મિલ્કત પર લખેલ નામ", width: "w-[10%]", colIndex: 7 },
    description: { label: "મિલ્કતનું વર્ણન", width: "w-[16%]", colIndex: 16 },
    valuation: {
      label: "મિલ્કતની કિંમત",
      width: "w-[8%]",
      type: "text",
      colIndex: 19,
    },
    tax: {
      label: "ધર વેરો",
      width: "w-[8%]",
      type: "text",
      colIndex: 20,
    },
    preTax: {
      label: "ધર વેરો (પાછલી બાકી)",
      width: "w-[9%]",
      type: "text",
      colIndex: 22,
    },
    otherTax: {
      label: "અન્ય વેરા",
      width: "w-[280px]",
      type: "text",
      colIndex: 21,
    },
    preOtherTax: {
      label: "અન્ય વેરા (પાછલી બાકી)",
      width: "w-[280px]",
      type: "text",
      colIndex: 23,
    },

    tap: { label: "નળ", width: "w-[3%]", type: "number", colIndex: 12 }, // Yes/No or 1/0
    toilet: { label: "શોચાલય", width: "w-[3%]", type: "text", colIndex: 13 }, // Yes/No or 1/0
    remarks: { label: "નોંધ / રીમાર્કસ", width: "w-[8%]", colIndex: 14 },
    delete: { label: "delete", width: "w-[8%]", colIndex: 15 },
  };

  const COLUMN_KEYS = Object.keys(COLUMN_MAP);

  // Utility to get the current column width class
  const getColumnWidth = (key) => COLUMN_MAP[key]?.width || "flex-1";

  // Custom input style for the spreadsheet look
  const inputStyle =
    "w-full p-0.5 text-xs bg-transparent border-0 focus:ring-1 focus:ring-blue-500 focus:z-10 focus:bg-yellow-50 outline-none h-full resize-none";

  return (
    <div className="container mx-auto p-2 bg-gray-50 min-h-screen">
      <SurveyEditForm
        index={showModal}
        setShowModal={setShowModal}
        handleChange={handleEditPopup}
        record={data}
      />

      <div className="flex justify-between items-center bg-white p-4 sticky top-0 shadow-md rounded-b-lg z-20 flex-wrap">
        <h1 className="text-2xl font-extrabold text-blue-800">
          Editable Spreadsheet
        </h1>

        <div className="flex space-x-3">
          {/* insert button */}
          <button
            onClick={handleInsert}
            className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-150 shadow-md ${loading !== false || notSaved ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Insert Row"
            disabled={loading !== false || notSaved}
          >
            <span>Insert Row</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-4 py-2 ${
              lastSaved ? "bg-green-600" : "bg-orange-600"
            }
             ${lastSaved ? "hover:bg-green-700" : "hover:bg-orange-700"}
             text-white rounded-lg transition duration-150 shadow-md`}
            title="Save Data"
            disabled={loading !== false}
          >
            <span>Save Data</span>
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
          સને {project?.details?.akaraniYear || "2025/26"} ના વર્ષ માટેના
          વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની યાદી
        </h2>
        <div className="flex justify-around text-sm font-medium text-gray-600">
          <span>ગામ: {project?.spot?.gaam}</span>
          <span>તાલુકો: {project?.spot?.taluka}</span>
          <span>જિલ્લો: {project?.spot?.district}</span>
        </div>
      </div>

      {/* Virtual Spreadsheet Container */}
      <div
        className="overflow-x-auto relative shadow-xl rounded-lg border border-gray-200"
        style={{ maxHeight: "80vh" }}
      >
        <div className="inline-block min-w-full">
          {/* Table Header Row */}
          <div
            className="flex bg-gray-100 font-bold text-gray-700 sticky z-10 border-b-2 border-gray-400 text-center text-xs whitespace-nowrap"
            style={{ position: "sticky", top: "0px" }}
          >
            {COLUMN_KEYS.map((key, index) => (
              <div
                key={key}
                className={`p-2 border-r border-gray-300 flex-shrink-0 ${getColumnWidth(
                  key,
                )}`}
                style={{
                  minWidth: key === "description" ? "120px" : "60px",
                  maxWidth:
                    key === "otherTax" || key === "preOtherTax"
                      ? "280px"
                      : "auto",
                  minHeight: "80px",
                }}
              >
                {COLUMN_MAP[key].label}
                <div className="text-gray-500 font-normal mt-0.5 text-[10px]">
                  ({COLUMN_MAP[key].colIndex + 1})
                </div>

                {key === "otherTax" || key === "preOtherTax" ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div className="mt-0.5 text-[10px]">સા.પા.</div>
                    <div className="mt-0.5 text-[10px]">ખા.પા.</div>
                    <div className="mt-0.5 text-[10px]">લાઈટ</div>
                    <div className="mt-0.5 text-[10px]">સફાઈ</div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Table Data Rows */}
          {data.map((record, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex border-b border-gray-200 hover:bg-yellow-50 transition duration-50 ${loading !== false ? (loading > rowIndex ? "bg-green-300" : loading === rowIndex || loading <= rowIndex + CHUNK_SIZE ? "bg-yellow-50" : "") : ""}`}
              style={{ minHeight: "32px" }}
            >
              {COLUMN_KEYS.map((key) => {
                const colIndex = COLUMN_MAP[key].colIndex;

                if (key === "delete") {
                  return (
                    <div
                      key={key}
                      className={`border-r border-gray-200 flex-shrink-0 ${getColumnWidth(
                        key,
                      )} p-0 text-center flex items-center justify-center`}
                      style={{
                        minWidth: "60px",
                      }}
                    >
                      {/* Editable Input Field */}
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you Sure to Delete = ${record[0]} ?`,
                            )
                          )
                            handleDelete(record[0]);
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-150 shadow-md ${loading !== false || notSaved ? "opacity-50 cursor-not-allowed" : ""}`}
                        title="Delete Row"
                        disabled={loading !== false || notSaved}
                      >
                        <span>Delete</span>
                      </button>
                    </div>
                  );
                }

                const value = record[colIndex] || ""; // Retrieve value using index, default to '' to prevent uncontrolled warnings

                if (key === "description") {
                  return (
                    <div
                      key={key}
                      className={`border-r border-gray-200 flex-shrink-0 ${getColumnWidth(
                        key,
                      )} p-0 text-center flex items-center justify-center`}
                      style={{
                        minWidth: "120px",
                        fontSize: "12px",
                      }}
                    >
                      <button
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        onClick={() => {
                          setShowModal(rowIndex);
                        }}
                      >
                        {value}
                      </button>
                    </div>
                  );
                }

                if (key === "otherTax") {
                  return (
                    <div style={{ display: "flex" }}>
                      <div
                        key={key + "1"}
                        className={`border-r border-gray-200 flex-shrink-0 ${
                          getColumnWidth(key) / 4
                        } p-0 text-center flex items-center justify-center`}
                      >
                        <input
                          type={COLUMN_MAP[key].type || "text"}
                          value={
                            JSON.parse(value || "{}")?.normal_water?.curr || ""
                          }
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              key,
                              JSON.stringify({
                                ...JSON.parse(value || "{}"),
                                normal_water: {
                                  curr: Number(e.target.value || 0),
                                },
                              }),
                            )
                          }
                          className={inputStyle}
                          style={{
                            textAlign: "left",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            // Special case for description and remarks to allow more vertical space
                            height: "100%",
                            minHeight: "32px",
                            width: "70px",

                            background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
                          }}
                        />
                      </div>{" "}
                      <div
                        key={key + "2"}
                        className={`border-r border-gray-200 flex-shrink-0 ${
                          getColumnWidth(key) / 4
                        } p-0 text-center flex items-center justify-center`}
                      >
                        <input
                          type={COLUMN_MAP[key].type || "text"}
                          value={
                            JSON.parse(value || "{}")?.special_water?.curr || ""
                          }
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              key,

                              JSON.stringify({
                                ...JSON.parse(value || "{}"),
                                special_water: {
                                  curr: Number(e.target.value || 0),
                                },
                              }),
                            )
                          }
                          className={inputStyle}
                          style={{
                            textAlign: "left",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            // Special case for description and remarks to allow more vertical space
                            height: "100%",
                            minHeight: "32px",
                            width: "70px",

                            background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
                          }}
                        />
                      </div>
                      <div
                        key={key + "3"}
                        className={`border-r border-gray-200 flex-shrink-0 ${
                          getColumnWidth(key) / 4
                        } p-0 text-center flex items-center justify-center`}
                      >
                        <input
                          type={COLUMN_MAP[key].type || "text"}
                          value={JSON.parse(value || "{}")?.light?.curr || ""}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              key,
                              JSON.stringify({
                                ...JSON.parse(value || "{}"),
                                light: {
                                  curr: Number(e.target.value || 0),
                                },
                              }),
                            )
                          }
                          className={inputStyle}
                          style={{
                            textAlign: "left",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            // Special case for description and remarks to allow more vertical space
                            height: "100%",
                            minHeight: "32px",
                            width: "70px",

                            background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
                          }}
                        />
                      </div>
                      <div
                        key={key + "4"}
                        className={`border-r border-gray-200 flex-shrink-0 ${
                          getColumnWidth(key) / 4
                        } p-0 text-center flex items-center justify-center`}
                      >
                        <input
                          type={COLUMN_MAP[key].type || "text"}
                          value={
                            JSON.parse(value || "{}")?.cleaning?.curr || ""
                          }
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              key,
                              JSON.stringify({
                                ...JSON.parse(value || "{}"),
                                cleaning: {
                                  curr: Number(e.target.value || 0),
                                },
                              }),
                            )
                          }
                          className={inputStyle}
                          style={{
                            textAlign: "left",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            // Special case for description and remarks to allow more vertical space
                            height: "100%",
                            minHeight: "32px",
                            width: "70px",

                            background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                if (key === "preOtherTax") {
                  return (
                    <div style={{ display: "flex" }}>
                      <div
                        key={key + "5"}
                        className={`border-r border-gray-200 flex-shrink-0 ${
                          getColumnWidth(key) / 4
                        } p-0 text-center flex items-center justify-center`}
                      >
                        <input
                          type={COLUMN_MAP[key].type || "text"}
                          value={
                            JSON.parse(value || "{}")?.normal_water?.prev || ""
                          }
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              key,
                              JSON.stringify({
                                ...JSON.parse(value || "{}"),
                                normal_water: {
                                  prev: Number(e.target.value || 0),
                                },
                              }),
                            )
                          }
                          className={inputStyle}
                          style={{
                            textAlign: "left",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            // Special case for description and remarks to allow more vertical space
                            height: "100%",
                            minHeight: "32px",
                            width: "70px",

                            background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
                          }}
                        />
                      </div>{" "}
                      <div
                        key={key + "6"}
                        className={`border-r border-gray-200 flex-shrink-0 ${
                          getColumnWidth(key) / 4
                        } p-0 text-center flex items-center justify-center`}
                      >
                        <input
                          type={COLUMN_MAP[key].type || "text"}
                          value={
                            JSON.parse(value || "{}")?.special_water?.prev || ""
                          }
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              key,
                              JSON.stringify({
                                ...JSON.parse(value || "{}"),
                                special_water: {
                                  prev: Number(e.target.value || 0),
                                },
                              }),
                            )
                          }
                          className={inputStyle}
                          style={{
                            textAlign: "left",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            // Special case for description and remarks to allow more vertical space
                            height: "100%",
                            minHeight: "32px",
                            width: "70px",

                            background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
                          }}
                        />
                      </div>
                      <div
                        key={key + "7"}
                        className={`border-r border-gray-200 flex-shrink-0 ${
                          getColumnWidth(key) / 4
                        } p-0 text-center flex items-center justify-center`}
                      >
                        <input
                          type={COLUMN_MAP[key].type || "text"}
                          value={JSON.parse(value || "{}")?.light?.prev || ""}
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              key,
                              JSON.stringify({
                                ...JSON.parse(value || "{}"),
                                light: {
                                  prev: Number(e.target.value || 0),
                                },
                              }),
                            )
                          }
                          className={inputStyle}
                          style={{
                            textAlign: "left",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            // Special case for description and remarks to allow more vertical space
                            height: "100%",
                            minHeight: "32px",
                            width: "70px",

                            background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
                          }}
                        />
                      </div>
                      <div
                        key={key + "8"}
                        className={`border-r border-gray-200 flex-shrink-0 ${
                          getColumnWidth(key) / 4
                        } p-0 text-center flex items-center justify-center`}
                      >
                        <input
                          type={COLUMN_MAP[key].type || "text"}
                          value={
                            JSON.parse(value || "{}")?.cleaning?.prev || ""
                          }
                          onChange={(e) =>
                            handleCellChange(
                              rowIndex,
                              key,
                              JSON.stringify({
                                ...JSON.parse(value || "{}"),
                                cleaning: {
                                  prev: Number(e.target.value || 0),
                                },
                              }),
                            )
                          }
                          className={inputStyle}
                          style={{
                            textAlign: "left",
                            paddingLeft: "4px",
                            paddingRight: "4px",
                            // Special case for description and remarks to allow more vertical space
                            height: "100%",
                            minHeight: "32px",
                            width: "70px",

                            background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    className={`border-r border-gray-200 flex-shrink-0 ${getColumnWidth(
                      key,
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

                        background: `${initialData[rowIndex][colIndex] == value ? "" : "yellow"}`,
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
                  key,
                )} p-0 text-center`}
                style={{ minWidth: key === "description" ? "120px" : "60px" }}
              >
                <div className="h-full bg-gray-50"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AkarniExcelEdit;
