import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Report.scss";
import apiPath from "../../isProduction";
import { useAuth } from "../../config/AuthContext";

import SelectMessagePopup from "../../components/SelectMessagePopup";

import WhatsappIcon from "../../assets/icon/whatsapp.png";
import CheckIcon from "../../assets/icon/check.png";
import SelectIcon from "../../assets/icon/select.png";
import SearchTerm from "../../components/SearchTerm";

import * as XLSX from "xlsx";

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

  const tableRef = useRef(null);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollLeft = e.target.scrollLeft;

    localStorage.setItem("scrollTopA", scrollTop);
    localStorage.setItem("scrollLeftA", scrollLeft);
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRecords(result.data);

      setTimeout(() => {
        const savedScrollTop = localStorage.getItem("scrollTopA");
        const savedScrollLeft = localStorage.getItem("scrollLeftA");

        if (tableRef.current && savedScrollTop) {
          tableRef.current.scrollTop = Number(savedScrollTop);
        }
        if (tableRef.current && savedScrollLeft) {
          tableRef.current.scrollLeft = Number(savedScrollLeft);
        }
      }, 900);
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
        : [...prevSelected, recordId],
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
      selectedRecords.includes(id),
    );

    // If all are selected, unselect them. Otherwise, add them to the selection.
    if (allAreSelected) {
      setSelectedRecords((prevSelected) =>
        prevSelected.filter((id) => !recordsToSelect.includes(id)),
      );
    } else {
      setSelectedRecords((prevSelected) => {
        const newSelected = new Set(prevSelected);
        recordsToSelect.forEach((id) => newSelected.add(id));
        return Array.from(newSelected);
      });
    }
  };

  const selectedColor = "rgb(255 226 181)";

  const sendMessageToWhatsApp = async (msg) => {
    console.log(msg);

    // const msg = {
    //   audioLink: "",
    //   documentLink: "",
    //   formattedDate: "23 Aug 2025",
    //   formattedTime: "10:30 PM",
    //   imageLink:
    //     "https://afinfosys.netlify.app/server/assets/VisitingCard.jpeg",
    //   text: "",
    //   timestamp: "2025-08-23T17:00:17.002Z",
    //   title: "Visiting Card",
    //   uniqueId: "423450",
    //   videoLink: "",
    // };

    if (selectedRecords.length === 0) {
      setSendingStatus("Please select at least one record to send a message.");
      return;
    }

    setSendingStatus(
      `Sending messages to ${selectedRecords.length} contacts...`,
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

      // send message with msg.text and (msg.imageLink || msg.videoLink || msg.audioLink || msg.documentLink)
      window.open(
        `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
          msg.text,
        )}${msg.imageLink && `&image=${msg.imageLink}`}${
          msg.videoLink && `&video=${msg.videoLink}`
        }${msg.audioLink && `&audio=${msg.audioLink}`}${
          msg.documentLink && `&document=${msg.documentLink}`
        }`,
      );

      try {
        // const response = await fetch(`${await apiPath()}/send-message`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        //   body: JSON.stringify({
        //     number: formattedNumber,

        //     imageUrl: msg.imageLink,
        //     videoUrl: msg.videoLink,
        //     text: msg.text,
        //     audioUrl: msg.audioLink,
        //     docUrl: msg.documentLink,
        //   }),
        // });

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

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
      "All messages have been processed. Check individual statuses below.",
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
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      if (result?.invalid.length > 0) {
        setInvalid(result?.invalid);
      }
      setSendingStatus(
        `Check complete: ${result?.valid.length} valid numbers found, ${result?.invalid.length} invalid numbers found.`,
      );
      console.log("Valid WhatsApp numbers:", result?.valid, result?.invalid);
    } catch (error) {
      console.error("Error checking numbers:", error);
      setSendingStatus("Failed to check numbers. Please try again.");
    }
  };

  const background = "#007bff";
  const callBackground = "rgb(255 161 52)";

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

  const { user } = useAuth();

  // Filtered records
  // const filteredRecords = records.filter((record) => {
  //   const fullName = record[2]?.toLowerCase() || "";
  //   const phone = record[3]?.toString() || "";
  //   const whatsapp = record[4]?.toString() || "";

  //   return (
  //     fullName.includes(searchTerm.toLowerCase()) ||
  //     phone.includes(searchTerm) ||
  //     whatsapp.includes(searchTerm)
  //   );
  // });

  // 1. Update State to include new call history filters
  const [filters, setFilters] = useState(() => {
    try {
      const savedFilters = localStorage.getItem("myAppFilters");
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    } catch (error) {
      console.error("Error reading localStorage", error);
    }
    return {
      text: "",
      district: "",
      taluka: "",
      village: "",
      category: "",
      interested: false,
      startDate: "",
      endDate: "",
      callDirection: "both",
      hasFollowUp: false,
    };
  });

  // 2. Save to localStorage (Remains the same)
  useEffect(() => {
    localStorage.setItem("myAppFilters", JSON.stringify(filters));
  }, [filters]);

  // Extract Unique values (Remains the same)
  const uniqueDistricts = [
    ...new Set(records.map((r) => r[9]).filter(Boolean)),
  ].sort();
  const uniqueTalukas = [
    ...new Set(records.map((r) => r[8]).filter(Boolean)),
  ].sort();
  const uniqueVillages = [
    ...new Set(records.map((r) => r[6]).filter(Boolean)),
  ].sort();

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  // 3. Update filteredRecords logic to include Call History parsing
  const filteredRecords = records.filter((record) => {
    const fullName = record[2]?.toLowerCase() || "";
    const phone = record[3]?.toString() || "";
    const whatsapp = record[4]?.toString() || "";
    const category = record[5] || "";
    const village = record[6] || "";
    const taluka = record[8] || "";
    const district = record[9] || "";
    const isInterested = record[16] || "";

    // Parse Call History safely
    const callHistoryStr = record[10] || "[]";
    let callHistory = [];
    try {
      callHistory = JSON.parse(callHistoryStr);
    } catch (e) {
      console.error("Error parsing call history", e);
      callHistory = [];
    }

    // --- Basic Text & Dropdown Checks ---
    const searchText = filters.text.toLowerCase();
    const matchesText =
      !searchText ||
      fullName.includes(searchText) ||
      phone.includes(searchText) ||
      whatsapp.includes(searchText);
    const matchesDistrict = !filters.district || district === filters.district;
    const matchesTaluka = !filters.taluka || taluka === filters.taluka;
    const matchesVillage = !filters.village || village === filters.village;
    const matchesCategory = !filters.category || category === filters.category;
    const matchesInterested = !filters.interested || isInterested === "TRUE";

    // --- New Call History Checks ---

    // 1. Date Range & Valid Call (clientAnswer !== "")
    let matchesDateRange = true;
    if (filters.startDate || filters.endDate) {
      // 'some' checks if AT LEAST ONE call matches our criteria
      matchesDateRange = callHistory.some((call) => {
        // Track karne ke liye ki calls hue hai ya nahi
        if (!call.clientAnswer || call.clientAnswer.trim() === "") return false;

        const callDate = call.dateOfCall; // Format: "YYYY-MM-DD"
        if (!callDate) return false;

        let isAfterStart = true;
        let isBeforeEnd = true;

        if (filters.startDate) isAfterStart = callDate >= filters.startDate;
        if (filters.endDate) isBeforeEnd = callDate <= filters.endDate;

        return isAfterStart && isBeforeEnd;
      });
    }

    // 2. Call Direction (incoming: true/false)
    let matchesDirection = true;
    if (filters.callDirection === "incoming") {
      matchesDirection = callHistory.some((call) => call.incoming === true);
    } else if (filters.callDirection === "outgoing") {
      matchesDirection = callHistory.some((call) => call.incoming === false);
    }

    // 3. Follow-up on LAST Call Only
    let matchesFollowUp = true;
    if (filters.hasFollowUp) {
      if (callHistory.length > 0) {
        const lastCall = callHistory[callHistory.length - 1];
        matchesFollowUp =
          lastCall.reminderDate && lastCall.reminderDate.trim() !== "";
      } else {
        matchesFollowUp = false; // No calls exist, so no follow-up
      }
    }

    return (
      matchesText &&
      matchesDistrict &&
      matchesTaluka &&
      matchesVillage &&
      matchesCategory &&
      matchesInterested &&
      matchesDateRange &&
      matchesDirection &&
      matchesFollowUp
    );
  });

  useEffect(() => {
    if (!isSelectionMode) return;

    const scroller = document.querySelector("main"); // or ".dashboard-layout main"
    if (scroller) {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    } else {
      // fallback if layout changes
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isSelectionMode]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);

    // Confirm before sending
    if (window.confirm(`Send this format to WhatsApp?\n\n${msg.title}`)) {
      sendMessageToWhatsApp(msg);
    }
  };

  const handleDownloadExcel = () => {
    // 1. Title Row
    const excelData = [
      ["customers contact list - lead"], // Sirf ek Title
      [], // Ek khali row thodi spacing ke liye
    ];

    // 2. Table Headers (Aapke UI ke hisaab se)
    const headers = [
      "અનું ક્રમાંક",
      "કસ્ટમર / ગ્રાહકનું પુરૂ નામ",
      "મોબાઈલ નંબર",
      "વોટસેઅપ નબંર",
      "કેટેગરી",
      "ગામ",
      "ચાર્જ નું ગામ",
      "તાલુકો",
      "જિલ્લો",
      "કયુ કામ વસ્તુ માટે ફોન કરેલ",
      "કયા ગામનું કામ કરવાનું છે",
      "ગ્રાહકે શું જવાબ આપ્યો",
      "ઘર/ ખાતા ગામના કેટલા છે",
      "ભાવ ઘર ખાતા દીઠ",
      "અંદાજીત બીલ રકમ રૂ",
      "કસ્ટમરને કેટલા પૈસા સુધી પોસાય",
      "ફોન કર્યા તારીખ",
      "મીટીંગ તારીખ",
      "Reminder Date",
      "ઑફીસમા યાદી બનાવેલ તારીખ",
      "કમ્પની ને મળેલ તારીખ",
      "Updated by",
    ];
    excelData.push(headers);

    // Date format karne ke liye helper function
    const formatDate = (date) => {
      if (!date) return " ";
      const d = new Date(date);
      const day = d.getDate();
      const month = d.toLocaleString("en-US", { month: "short" });
      const year = d.getFullYear();
      return `${day} ${month}, ${year}`;
    };

    // 3. JSON Data ko Array Rows me convert karna
    filteredRecords.forEach((record) => {
      // JSON strings ko parse karna (same jaise aapne table me kiya hai)
      let callHistory = record[10] || [{}];
      if (typeof callHistory === "string") {
        try {
          callHistory = JSON.parse(callHistory);
        } catch (e) {
          callHistory = [{}];
        }
      }
      const lastCall = callHistory[callHistory.length - 1] || {};

      let survayorData = record[13];
      if (typeof survayorData === "string") {
        try {
          survayorData = JSON.parse(survayorData);
        } catch (e) {
          survayorData = null;
        }
      }

      // Har row ka data map karna
      const rowData = [
        record[1] || "", // અનું ક્રમાંક
        record[2] || "", // Customer Name
        record[3] || "", // Mobile No
        record[4] || "", // WhatsApp No
        record[5] || "", // Category
        record[6] || "", // Village
        record[7] || "", // Charge Village
        record[8] || "", // Taluka
        record[9] || "", // District
        lastCall.whatBusiness || "",
        lastCall.workVillage || "",
        lastCall.clientAnswer || "",
        lastCall.numberOfHouses || "",
        lastCall.price || "",
        lastCall.estimatedBill || "",
        lastCall.budget || "",
        formatDate(lastCall.dateOfCall),
        formatDate(lastCall.meetingDate),
        formatDate(lastCall.reminderDate),
        formatDate(record[11]), // Entry Date
        formatDate(record[12]), // Company Received Date
        survayorData?.name
          ? `${survayorData.name} (${formatDate(survayorData.time)})`
          : "Unknown", // Updated By
      ];

      excelData.push(rowData);
    });

    // 4. Excel sheet aur workbook banani hai
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Title ko center/merge karne ke liye (A-V columns tak)
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lead Data");

    // 5. File Download trigger karna
    XLSX.writeFile(workbook, "customers_contact_list_lead.xlsx");
  };

  return (
    <>
      {/* Selected Message Preview */}
      {selectedMessage && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h3 className="font-bold">{selectedMessage.title}</h3>
          <p>{selectedMessage.text}</p>
        </div>
      )}

      {/* Popup */}
      <SelectMessagePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSelect={handleSelectMessage}
      />

      <div
        className="container mx-auto p-2 sm:p-6 lg:p-8"
        style={{
          paddingBottom: isSelectionMode
            ? window.innerWidth < 640
              ? "140px"
              : "100px" // small vs larger devices
            : window.innerWidth < 640
              ? "8px"
              : "32px",
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          2. Customer List Report [C.L.R.] <br /> ટેલીકોલર ફોર્મ દરરોજ ફોન કરેલ
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
                    color: "blue",
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
          style={{ userSelect: "none", width: "100%" }}
        >
          <button
            className="add-btn"
            onClick={() => navigate("/customers/form")}
            style={{ fontSize: ".8rem", padding: ".8rem .9rem", margin: "0" }}
          >
            Add New Customer Record
          </button>

          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download Excel
          </button>

          {(user?.role === "owner" || user?.role === "telecaller") && (
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
                    onClick={() => setIsPopupOpen(true)}
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

                      display: "flex",
                      alignItems: "center",

                      opacity:
                        selectedRecords.length === 0 ||
                        Object.values(messageStatuses).includes("sending")
                          ? 0.5
                          : 1,
                    }}
                  >
                    <img
                      src={WhatsappIcon}
                      alt="Share to Whatsapp Image"
                      style={{ width: "20px", height: "20px" }}
                    />
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

                      display: "flex",
                      alignItems: "center",

                      opacity:
                        selectedRecords.length === 0 ||
                        !!sendingStatus.includes("Checking")
                          ? 0.5
                          : 1,
                    }}
                  >
                    <img
                      src={CheckIcon}
                      alt="Share to Whatsapp Image"
                      style={{ width: "20px", height: "20px" }}
                    />
                    Check Valid Numbers
                  </button>
                </>
              ) : null}

              {/* <button
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
                  <img
                    src={SelectIcon}
                    alt="Share to Whatsapp Image"
                    style={{ width: "20px", height: "20px" }}
                  />
                )}
              </button> */}
            </div>
          )}
        </div>

        {/* Search Section Start */}
        <SearchTerm
          onSearch={handleSearch}
          currentFilters={filters}
          uniqueDistricts={uniqueDistricts}
          uniqueTalukas={uniqueTalukas}
          uniqueVillages={uniqueVillages}
        />
        {/* Search Section End */}

        {error ? (
          <div className="flex justify-center items-center h-screen text-red-600">
            Error: {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-screen text-gray-700">
            Loading Data...
          </div>
        ) : (
          <div
            ref={tableRef}
            onScroll={handleScroll}
            className={`table-container rounded-lg shadow-md border border-gray-200 overflow-y-auto ${
              isSelectionMode ? "max-h-[75vh]" : "max-h-[82vh]"
            }`}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {isSelectionMode && (
                    <th
                      className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg sticky top-0 z-10"
                      style={{ color: "blue", background: background }}
                      rowSpan="2"
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
                    } sticky top-0 z-10`}
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    અનું ક્રમાંક
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "blue",
                      background: background,
                      minWidth: "180px",
                    }}
                    rowSpan="2"
                  >
                    કસ્ટમર / ગ્રાહકનું પુરૂ નામ
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    મોબાઈલ નંબર
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    વોટસેઅપ નબંર
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    કેટેગરી
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    ગામ
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    ચાર્જ નું ગામ
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    તાલુકો
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    જિલ્લો
                  </th>

                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                    colSpan="10"
                  >
                    Call History
                  </th>

                  {/* Entry Date */}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    ઑફીસમા યાદી બનાવેલ તારીખ
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    કમ્પની ને મળેલ તારીખ
                  </th>
                  {/* Status */}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: background }}
                    rowSpan="2"
                  >
                    Updated by
                  </th>

                  {(user.role === "owner" || user.role === "telecaller") && (
                    <th
                      className={`px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10 ${
                        !isSelectionMode && "rounded-tr-lg"
                      }`}
                      style={{ color: "blue", background: background }}
                      rowSpan="2"
                    >
                      Action
                    </th>
                  )}
                </tr>

                <tr>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "blue",
                      background: callBackground,
                      minWidth: "150px",
                    }}
                  >
                    કયુ કામ વસ્તુ માટે ફોન કરેલ
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                  >
                    કયા ગામનું કામ કરવાનું છે
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "blue",
                      background: callBackground,
                      minWidth: "180px",
                    }}
                  >
                    ગ્રાહકે શું જવાબ આપ્યો
                  </th>{" "}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                  >
                    ઘર/ ખાતા ગામના કેટલા છે
                  </th>{" "}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                  >
                    ભાવ ઘર ખાતા દીઠ
                  </th>{" "}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                  >
                    અંદાજીત બીલ રકમ રૂ
                  </th>{" "}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                  >
                    કસ્ટમરને કેટલા પૈસા સુધી પોસાય ઘર/ખાતા
                  </th>{" "}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                  >
                    ફોન કર્યા તારીખ ટેલીકોલર
                  </th>{" "}
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                  >
                    મીટીંગ તારીખ રૂબરુ મળવા જવુ
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{ color: "blue", background: callBackground }}
                  >
                    Reminder Date
                  </th>
                </tr>

                {/* Index Start */}
                <tr>
                  {isSelectionMode && (
                    <th
                      className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        textAlign: "center",
                        color: "blue",
                        background: background,
                      }}
                    >
                      #
                    </th>
                  )}
                  {/* 1 to 18 th for index */}
                  {Array.from({
                    length:
                      user.role === "owner" || user.role === "telecaller"
                        ? 23
                        : 22,
                  }).map((_, index) => (
                    <th
                      className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{
                        textAlign: "center",
                        color: "blue",
                        background: [
                          9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                        ].includes(index)
                          ? callBackground
                          : background,
                      }}
                      key={index}
                    >
                      {index + 1}
                    </th>
                  ))}
                </tr>
                {/* Index End */}
              </thead>

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
                      {isSelectionMode && (
                        <td className="record whitespace-nowrap text-sm font-medium text-gray-900 text-center">
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
                      <td
                        className="record whitespace-nowrap text-sm font-medium text-gray-900"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {record[1]}
                      </td>
                      {/* Customer Full Name */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                        onClick={() => {
                          if (user.role === "owner")
                            window.open(
                              `/customers/history/${record[0]}`,
                              "_blank",
                            );
                        }}
                      >
                        {record[2]}
                      </td>{" "}
                      {/* Mobile No.  */}
                      <td
                        className="record whitespace-nowrap text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
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
                      </td>
                      {/* Whatsaap No. */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : {
                                display: "flex",
                                flexWrap: "nowrap",
                                gap: "10px",
                                border: "none",
                              }
                        }
                      >
                        <a
                          href={`https://wa.me/91${record[4]?.trim()}`}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                        >
                          {record[4]?.trim()}
                        </a>

                        <button
                          onClick={() => {
                            setSelectedRecords([record[0]]);
                            setIsPopupOpen(true);
                          }}
                          style={{
                            color: "white",
                            background: "#21bf63",
                            padding: "5px 8px",
                          }}
                        >
                          Send
                        </button>

                        {isSelectionMode && getStatusDisplay(record[0])}
                      </td>
                      {/* Category Customer  */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {record[5]}
                      </td>{" "}
                      {/* Village  */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {record[6]}
                      </td>
                      {/* Village of charge  */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {record[7]}
                      </td>
                      {/* Taluko  */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        onClick={() =>
                          isSelectionMode &&
                          record[8] &&
                          handleSelectByTaluka(record[8])
                        }
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: "#ff0" }
                            : isSelectionMode
                              ? { cursor: "pointer", background: "#ff0" }
                              : { cursor: "default" }
                        }
                      >
                        {record[8]}
                      </td>
                      {/* Jilla  */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {record[9]}
                      </td>
                      {/* Call History */}
                      {/* Which type of Work */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {callHistory[callHistory?.length - 1]?.whatBusiness ||
                          " "}
                      </td>
                      {/* Work Village */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {callHistory[callHistory?.length - 1]?.workVillage ||
                          " "}
                      </td>
                      {/* Customer Answer */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {callHistory[callHistory?.length - 1]?.clientAnswer ||
                          " "}
                      </td>
                      {/* Number of Houses */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {callHistory[callHistory?.length - 1]?.numberOfHouses ||
                          " "}
                      </td>
                      {/* Price */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {callHistory[callHistory?.length - 1]?.price || " "}
                      </td>
                      {/* Bill Amount */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {callHistory[callHistory?.length - 1]?.estimatedBill ||
                          " "}
                      </td>
                      {/* Customer Budget */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        {callHistory[callHistory?.length - 1]?.budget || " "}
                      </td>
                      {/* Call Date */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        <p style={{ whiteSpace: "nowrap" }}>
                          {formatDate(
                            callHistory[callHistory?.length - 1]?.dateOfCall ||
                              "",
                          )}
                        </p>
                      </td>
                      {/* Meeting Date */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        <p style={{ whiteSpace: "nowrap" }}>
                          {formatDate(
                            callHistory?.[callHistory.length - 1]
                              ?.meetingDate || "",
                          )}
                        </p>
                      </td>
                      {/* Reminder Date */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        <p style={{ whiteSpace: "nowrap" }}>
                          {formatDate(
                            callHistory?.[callHistory.length - 1]
                              ?.reminderDate || "",
                          )}
                        </p>
                      </td>
                      {/* Data Entry Resources Dates */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        <p style={{ whiteSpace: "nowrap" }}>
                          {formatDate(record[11] || "")}
                        </p>
                      </td>
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
                        <p style={{ whiteSpace: "nowrap" }}>
                          {formatDate(record[12] || "")}
                        </p>
                      </td>
                      {/* Action */}
                      <td
                        className="record whitespace-normal text-sm text-gray-500"
                        style={
                          isSelectionMode && selectedRecords.includes(record[0])
                            ? { background: selectedColor }
                            : null
                        }
                      >
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
                      {(user.role === "owner" ||
                        user.role === "telecaller") && (
                        <td
                          className="record whitespace-normal text-sm text-gray-500"
                          style={{
                            display: "flex",
                            gap: ".3rem",
                            alignItems: "center",
                            height: "100%",

                            background: `${
                              isSelectionMode &&
                              selectedRecords.includes(record[0])
                                ? selectedColor
                                : "#fff"
                            }`,
                          }}
                        >
                          {(user.role === "owner" ||
                            user.role === "telecaller") && (
                            <button
                              onClick={() =>
                                navigate(`/customers/add-call/${record[0]}`)
                              }
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                              style={{ whiteSpace: "nowrap", fontSize: "10px" }}
                            >
                              Add Call Detail
                            </button>
                          )}

                          {(user.role === "owner" ||
                            user.role === "telecaller") && (
                            <button
                              onClick={() =>
                                navigate(`/customers/form/${record[0]}`)
                              }
                              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded"
                              style={{ whiteSpace: "nowrap", fontSize: "10px" }}
                            >
                              Edit
                            </button>
                          )}

                          {user.role === "owner" && (
                            <button
                              onClick={() => handleDelete(record[0])}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                              style={{ whiteSpace: "nowrap", fontSize: "10px" }}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      )}
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
