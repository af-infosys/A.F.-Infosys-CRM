import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Report.scss";
import apiPath from "../../isProduction";

const ContactListReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [sendingStatus, setSendingStatus] = useState("");
  const [invalid, setInvalid] = useState([]);

  // New state to track status for each record
  const [messageStatuses, setMessageStatuses] = useState({});

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
      setRecords(records.filter((record) => record[0] !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const handleCheckboxChange = (recordId) => {
    setSelectedRecords((prevSelected) =>
      prevSelected.includes(recordId)
        ? prevSelected.filter((id) => id !== recordId)
        : [...prevSelected, recordId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRecordIds = records.map((record) => record[0]);
      setSelectedRecords(allRecordIds);
    } else {
      setSelectedRecords([]);
    }
  };

  const handleSelectByTaluka = (taluka) => {
    // Find all record IDs that match the given taluka
    const recordsToSelect = records
      .filter((record) => record[8]?.trim() === taluka?.trim())
      .map((record) => record[0]);

    // Check if all of these records are already selected
    const allAreSelected = recordsToSelect.every((id) =>
      selectedRecords.includes(id)
    );

    // If all are selected, unselect them. Otherwise, add them to the selection.
    if (allAreSelected) {
      setSelectedRecords((prevSelected) =>
        prevSelected.filter((id) => !recordsToSelect.includes(id))
      );
    } else {
      setSelectedRecords((prevSelected) => {
        const newSelected = new Set(prevSelected);
        recordsToSelect.forEach((id) => newSelected.add(id));
        return Array.from(newSelected);
      });
    }
  };

  const sendMessageToWhatsApp = async () => {
    if (selectedRecords.length === 0) {
      setSendingStatus("Please select at least one record to send a message.");
      return;
    }

    setSendingStatus(
      `Sending messages to ${selectedRecords.length} contacts...`
    );

    const initialStatuses = {};
    selectedRecords.forEach((id) => {
      initialStatuses[id] = "sending";
    });
    setMessageStatuses(initialStatuses);

    for (const recordId of selectedRecords) {
      const record = records.find((r) => r[0] === recordId);
      if (!record) continue;

      const number = String(record[4]).trim();
      const formattedNumber = number.length === 10 ? `91${number}` : number;

      try {
        const response = await fetch(`${await apiPath()}/send-message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            number: formattedNumber,
            imageUrl:
              "https://afinfosys.netlify.app/server/assets/VisitingCard.jpeg",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setMessageStatuses((prevStatuses) => ({
          ...prevStatuses,
          [recordId]: "sent",
        }));
      } catch (error) {
        console.error(`Error sending message to ${formattedNumber}:`, error);

        setMessageStatuses((prevStatuses) => ({
          ...prevStatuses,
          [recordId]: "failed",
        }));
      }
    }

    setSendingStatus(
      "All messages have been processed. Check individual statuses below."
    );
    setSelectedRecords([]);
  };

  const checkWhatsAppNumbers = async () => {
    if (selectedRecords.length === 0) {
      setSendingStatus("Please select at least one record to check.");
      return;
    }

    setSendingStatus("Checking numbers...");
    try {
      const selectedWhatsAppNumbers = records
        .filter((record) => selectedRecords.includes(record[0]))
        .map((record) => String(record[4]).trim());

      const response = await fetch(
        `${await apiPath()}/check-whatsapp-numbers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ numbers: selectedWhatsAppNumbers }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result?.invalid.length > 0) {
        setInvalid(result?.invalid);
      }
      setSendingStatus(
        `Check complete: ${result?.valid.length} valid numbers found, ${result?.invalid.length} invalid numbers found.`
      );
      console.log("Valid WhatsApp numbers:", result?.valid, result?.invalid);
    } catch (error) {
      console.error("Error checking numbers:", error);
      setSendingStatus("Failed to check numbers. Please try again.");
    }
  };

  const background = "#007bff";

  const handleViewInvalids = () => {
    const numbersString = JSON.stringify(invalid);
    const encodedNumbers = encodeURIComponent(numbersString);
    navigate(`/customers/invalids?numbers=${encodedNumbers}`);
  };

  const getStatusDisplay = (recordId) => {
    const status = messageStatuses[recordId];
    if (!status) return null;

    let color = "";
    let text = "";

    switch (status) {
      case "sending":
        color = "text-yellow-500";
        text = "Sending...";
        break;
      case "sent":
        color = "text-green-500";
        text = "Done!";
        break;
      case "failed":
        color = "text-red-500";
        text = "Failed";
        break;
      default:
        return null;
    }

    return <span className={`${color} font-bold ml-2`}>({text})</span>;
  };

  return (
    <>
      <div
        className="container mx-auto p-2 sm:p-6 lg:p-8"
        style={{ paddingBottom: `${isSelectionMode ? "300px" : "100px"}` }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Customer List Report [ C. L . R. ] / ટેલીકોલર ફોર્મ દરરોજ ફોન કરેલ
          યાદી
        </h1>
        <h2 className="text-xl text-center mb-8 text-gray-600">
          by - A.F. Infosys
        </h2>
        {sendingStatus && (
          <div
            className="text-center p-3 text-white font-bold rounded-md mb-4"
            style={{ backgroundColor: background }}
          >
            {sendingStatus}
            {invalid?.length > 0 && (
              <>
                <br />
                <button
                  style={{
                    background: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: ".3rem 1rem",
                    marginTop: ".4rem",
                  }}
                  onClick={handleViewInvalids}
                  className="ml-2 cursor-pointer"
                >
                  View Invalids
                </button>
              </>
            )}{" "}
          </div>
        )}
        <div
          className="flex justify-between items-center gap-1 mb-4 flex-wrap"
          style={{ userSelect: "none" }}
        >
          <button
            className="add-btn"
            onClick={() => navigate("/customers/form")}
            style={{ fontSize: ".8rem", padding: ".8rem .9rem", margin: "0" }}
          >
            Add New Customer Record
          </button>

          <div
            style={
              isSelectionMode
                ? {
                    position: "fixed",
                    bottom: "0",
                    left: "0",
                    width: "100vw",
                    padding: "1rem",
                    background: "white",
                    zIndex: 100,
                    display: "flex",
                    gap: ".4rem",
                    flexWrap: "wrap",
                  }
                : { display: "flex", gap: ".4rem", flexWrap: "wrap" }
            }
          >
            {isSelectionMode ? (
              <>
                <button
                  onClick={sendMessageToWhatsApp}
                  disabled={
                    selectedRecords.length === 0 ||
                    Object.values(messageStatuses).includes("sending")
                  }
                  className="add-btn flex items-center gap-2"
                  style={{
                    fontSize: ".8rem",
                    padding: ".8rem .9rem",
                    background: "green",
                    margin: "0",
                    opacity:
                      selectedRecords.length === 0 ||
                      Object.values(messageStatuses).includes("sending")
                        ? 0.5
                        : 1,
                  }}
                >
                  Send Message
                </button>

                <button
                  onClick={checkWhatsAppNumbers}
                  disabled={
                    selectedRecords.length === 0 ||
                    !!sendingStatus.includes("Checking")
                  }
                  className="add-btn flex items-center gap-2"
                  style={{
                    fontSize: ".8rem",
                    padding: ".8rem .9rem",
                    background: "green",
                    margin: "0",

                    opacity:
                      selectedRecords.length === 0 ||
                      !!sendingStatus.includes("Checking")
                        ? 0.5
                        : 1,
                  }}
                >
                  Check Valid Numbers
                </button>
              </>
            ) : null}

            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className="add-btn flex items-center gap-2"
              style={{
                fontSize: ".8rem",
                padding: ".8rem .9rem",

                margin: "0",
              }}
            >
              {isSelectionMode ? (
                <p>
                  Exit Selection{" "}
                  <b style={{ fontSize: "1rem" }}>{selectedRecords.length}</b>
                </p>
              ) : (
                "Select Records"
              )}
              {!isSelectionMode && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-whatsapp"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L.05 15l4.204-1.102a7.933 7.933 0 0 0 3.79.998h.006c4.366 0 7.92-3.558 7.924-7.926a7.864 7.864 0 0 0-2.342-5.556zm-1.157 1.353a6.708 6.708 0 0 1-4.904 2.19c-.58 0-1.15-.09-1.697-.26l-.42-.16-.39.2c-1.395.736-2.583 1.954-3.327 3.42l-.08.19.12.06c.725.372 1.488.57 2.26.572h.002c1.745 0 3.398-.67 4.673-1.876a6.67 6.67 0 0 0 1.848-4.735v-.002zm-1.802 4.75a.94.94 0 0 1-.66-.27l-2.028-1.986c-.19-.184-.44-.27-.7-.27-.26 0-.51.09-.7.27l-1.015 1.01-.002.002a.84.84 0 0 1-.65.26c-.25 0-.5-.09-.69-.28l-.51-.51a.92.92 0 0 1 0-1.31L7.54 3.73c.184-.19.44-.28.7-.28s.51.09.7.28l.5.5c.18.18.28.43.28.69s-.1.5-.28.69l-.6.6c.19.19.44.28.7.28s.51-.09.7-.28l2.028-1.986a.93.93 0 0 1 1.31 0c.37.37.37 1 0 1.37l-2.028 1.986a.94.94 0 0 1-.66.27z" />
                </svg>
              )}
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
                  {isSelectionMode && (
                    <th
                      className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                      style={{ color: "white", background: background }}
                    >
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedRecords.length === records.length &&
                          records.length > 0
                        }
                      />
                    </th>
                  )}
                  <th
                    className={`px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      !isSelectionMode && "rounded-tl-lg"
                    }`}
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
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ color: "white", background: background }}
                  >
                    Reminder Date
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
                  {/* Status */}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ color: "white", background: background }}
                  >
                    Updated by
                  </th>
                  <th
                    className={`px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      !isSelectionMode && "rounded-tr-lg"
                    }`}
                    style={{ color: "white", background: background }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              {/* Index Start */}
              <tr>
                {isSelectionMode && (
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      textAlign: "center",
                      color: "white",
                      background: background,
                    }}
                  >
                    #
                  </th>
                )}
                {/* 1 to 18 th for index */}
                {Array.from({ length: 23 }).map((_, index) => (
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
                      {isSelectionMode && (
                        <td className="px-1 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(record[0])}
                            onChange={() => handleCheckboxChange(record[0])}
                            disabled={!!messageStatuses[record[0]]}
                          />
                        </td>
                      )}
                      {/* અહીં Google Sheet માંથી આવતા ડેટાને કૉલમમાં મેપ કરો */}
                      {/* અનું કૂમાંક (serialNumber) */}
                      <td className="px-1 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record[1]}
                      </td>
                      {/* Customer Full Name */}
                      <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
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
                      <td className="px-1 py-2 whitespace-normal text-sm text-gray-500 flex items-center">
                        <a
                          href={`https://wa.me/91${record[4]?.trim()}`}
                          className="text-blue-600 hover:underline"
                        >
                          {record[4]?.trim()}
                        </a>
                        {isSelectionMode && getStatusDisplay(record[0])}
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
                      <td
                        className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                        onClick={() =>
                          isSelectionMode &&
                          record[8] &&
                          handleSelectByTaluka(record[8])
                        }
                        style={{
                          cursor: isSelectionMode ? "pointer" : "default",
                        }}
                      >
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
                        {callHistory[callHistory?.length - 1]?.workVillage ||
                          " "}
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
                            callHistory[callHistory?.length - 1]?.dateOfCall ||
                              ""
                          )}
                        </p>
                      </td>
                      <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                        <p style={{ whiteSpace: "nowrap" }}>
                          {formatDate(
                            callHistory?.[callHistory.length - 1]
                              ?.meetingDate || ""
                          )}
                        </p>
                      </td>
                      {/* Reminder Date */}
                      <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                        <p style={{ whiteSpace: "nowrap" }}>
                          {formatDate(
                            callHistory?.[callHistory.length - 1]
                              ?.reminderDate || ""
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
                      {/* Action */}
                      <td className="px-1 py-2 whitespace-normal text-sm text-gray-500">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <p style={{ whiteSpace: "nowrap", fontSize: "13px" }}>
                            {survayorData?.name || "Unknown"}
                          </p>
                          {survayorData?.time && (
                            <p
                              style={{
                                whiteSpace: "nowrap",
                                fontSize: "10px",
                                marginTop: "-5px",
                              }}
                            >
                              {formatDate(survayorData?.time)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td
                        className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                        style={{
                          display: "flex",
                          gap: ".3rem",
                          alignItems: "center",
                        }}
                      >
                        <button
                          onClick={() =>
                            navigate(`/customers/add-call/${record[0]}`)
                          }
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                          style={{ whiteSpace: "nowrap", fontSize: "10px" }}
                        >
                          Add Call Detail
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/customers/form/${record[0]}`)
                          }
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                          style={{ whiteSpace: "nowrap", fontSize: "10px" }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(record[0])}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          style={{ whiteSpace: "nowrap", fontSize: "10px" }}
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
                      colSpan="25"
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
    </>
  );
};

export default ContactListReport;
