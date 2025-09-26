import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./Form.scss";
import { useAuth } from "../../config/AuthContext";
import apiPath from "../../isProduction";
import customerCategory from "../customerCategoryList";
import handleShareCall from "./handleShareCall";

import OutGoing from "../../assets/icon/outgoing-call.png";
import Incoming from "../../assets/icon/incoming-call.png";

const ContactListForm = () => {
  const { user } = useAuth();

  const { id } = useParams();
  const isEditMode = !!id;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serialNumber: "",
    customerFullName: "",

    mobileNo: "",
    whatsaapNo: "",
    category: "TCM",
    village: "",
    villageOfCharge: "",
    taluko: "",
    jilla: "",

    listCreated: "",
    listReceived: "",

    isInterested: false,
  });

  // [
  //   ID,
  //   serialNumber,
  //   customerFullName,
  //   mobileNo,
  //   whatsaapNo,
  //   category,
  //   village,
  //   villageOfCharge,
  //   taluko,
  //   jilla,
  //   callHistory,
  //   listCreated,
  //   listReceived,
  //   telecaller,
  // ];

  const [callHistory, setCallHistory] = useState([
    {
      incoming: false,
      whatBusiness: "",
      workVillage: "",
      clientAnswer: "",
      numberOfHouses: "",
      price: "",
      estimatedBill: "",
      budget: "",
      dateOfCall: "",
      meetingDate: "",
      reminderDate: "",
    },
  ]);

  console.log(formData);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const convertGujaratiToEnglishDigits = (input) => {
    const gujaratiDigits = "૦૧૨૩૪૫૬૭૮૯";
    const englishDigits = "0123456789";

    return input.replace(
      /[૦૧૨૩૪૫૬૭૮૯]/g,
      (char) => englishDigits[gujaratiDigits.indexOf(char)]
    );
  };

  const [villages, setVillages] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [villageInfoMap, setVillageInfoMap] = useState({});

  const fetchIndex = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const data = result?.data;
      if (!Array.isArray(data) || data?.length === 0) return;

      // Set new serial number
      setFormData((prevData) => ({
        ...prevData,
        serialNumber: Number(data[data?.length - 1][1]) + 1 || "",

        taluko: data[data?.length - 1][8] || "",
        jilla: data[data?.length - 1][9] || "",

        listCreated: data[data?.length - 1][11] || "",
        listReceived: data[data?.length - 1][12] || "",
      }));

      const villageSet = new Set();
      const talukaSet = new Set();
      const districtSet = new Set();
      const mapping = {};

      for (let item of data) {
        const village = item[6]?.trim();
        const taluka = item[8]?.trim();
        const district = item[9]?.trim();

        if (village) villageSet.add(village);
        if (taluka) talukaSet.add(taluka);
        if (district) districtSet.add(district);

        if (village && taluka && district) {
          mapping[village] = {
            taluka,
            district,
          };
        }
      }

      setVillages([...villageSet]);
      setTalukas([...talukaSet]);
      setDistricts([...districtSet]);
      setVillageInfoMap(mapping);

      console.log("Index Data:", data.length);
      console.log("Village Map:", mapping);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  useEffect(() => {
    if (!isEditMode) fetchIndex();
  }, [isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "village") {
      const matched = villageInfoMap[value];
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          taluko: matched.taluka,
          jilla: matched.district,
        }));
        return;
      }
    }

    // Convert Gujarati digits to English
    const englishValue = convertGujaratiToEnglishDigits(value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: englishValue,
    }));

    if (sameNumber && name === "mobileNo") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: englishValue,
        whatsaapNo: englishValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const fullFormData = {
      ...formData,
      callHistory: isEditMode ? callHistory : [],
    };

    try {
      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode
        ? `${await apiPath()}/api/contactList/${id}`
        : `${await apiPath()}/api/contactList`;

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(fullFormData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result.message);
        alert(`Successfully ${isEditMode ? "Updated" : "Sumbited"}!`);
        isEditMode
          ? navigate(`/customers/report`)
          : navigate("/customers/overview");

        // Reset form only if it's a new submission
        if (!isEditMode) {
          setFormData({
            serialNumber: "",
            customerFullName: "",

            mobileNo: "",
            whatsaapNo: "",
            category: "",
            village: "",
            villageOfCharge: "",
            taluko: "",
            jilla: "",

            listCreated: "",
            listReceived: "",

            isInterested: false,

            telecaller: { id: user?.id, name: user?.name, time: new Date() },
          });

          setCallHistory([
            // whatBusiness: record[10] || "",

            {
              incoming: false,
              whatBusiness: "",
              workVillage: "",
              clientAnswer: "",
              numberOfHouses: "",
              price: "",
              estimatedBill: "",
              budget: "",
              dateOfCall: "",
              meetingDate: "",
              reminderDate: "",
            },
          ]);
        }
      } else {
        console.error("Error submitting form:", result.message);
        setFormError(
          `Error While ${isEditMode ? "Updating" : "Submiting"}: ${
            result.message
          }`
        );
      }
    } catch (error) {
      console.error("Network error or unexpected issue:", error);
      setFormError("નેટવર્ક ભૂલ અથવા અણધારી સમસ્યા આવી.");
    } finally {
      setFormLoading(false);
    }
  };

  // Effect to load existing data if in edit mode
  useEffect(() => {
    const fetchRecordForEdit = async () => {
      if (!isEditMode || !id) return;

      setFormLoading(true);
      setFormError(null);

      try {
        const response = await fetch(
          `${await apiPath()}/api/contactList/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const record = result.data;

        if (record) {
          // Populate formData
          setFormData({
            serialNumber: record[1] || "",
            customerFullName: record[2] || "",

            mobileNo: record[3] || "",
            whatsaapNo: record[4] || "",
            category: record[5] || "",
            village: record[6] || "",
            villageOfCharge: record[7] || "",
            taluko: record[8] || "",
            jilla: record[9] || "",

            listCreated: record[11] || "",
            listReceived: record[12] || "",

            isInterested: record[16] === "TRUE" ? true : false,

            telecaller: { id: user?.id, name: user?.name, time: new Date() },
          });

          if (record[10]) {
            try {
              const parsedFloors = JSON.parse(record[10]);
              setCallHistory(parsedFloors);
            } catch (jsonError) {
              console.error("Error parsing floors JSON:", jsonError);
              setCallHistory([
                {
                  incoming: false,
                  whatBusiness: "",
                  workVillage: "",
                  clientAnswer: "",
                  numberOfHouses: "",
                  price: "",
                  estimatedBill: "",
                  budget: "",
                  dateOfCall: "",
                  meetingDate: "",
                  reminderDate: "",
                },
              ]);
            }
          } else {
            setCallHistory([
              {
                incoming: false,
                whatBusiness: "",
                workVillage: "",
                clientAnswer: "",
                numberOfHouses: "",
                price: "",
                estimatedBill: "",
                budget: "",
                dateOfCall: "",
                meetingDate: "",
                reminderDate: "",
              },
            ]);
          }
        } else {
          setFormError("No Records Found!");
        }
      } catch (err) {
        console.error("Error fetching record for edit:", err);
        setFormError("Error Fetching Records!");
      } finally {
        setFormLoading(false);
      }
    };

    fetchRecordForEdit();
  }, [id, isEditMode, user?.id, user?.name]);

  const [sameNumber, setSameNumber] = useState(false);

  const handleSameNumber = () => {
    setSameNumber((prev) => !prev);
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      whatsaapNo: sameNumber ? prevData.mobileNo : "",
    }));
  }, [sameNumber]);

  const handleCallHistoryChange = (index, e) => {
    const { name, value } = e.target;

    const updatedHistory = callHistory.map((call, i) =>
      i === index ? { ...call, [name]: value } : call
    );
    setCallHistory(updatedHistory);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleCallHistoryCheckboxChange = (index, e) => {
    const { name, checked } = e.target;

    const updatedHistory = callHistory.map((call, i) =>
      i === index ? { ...call, [name]: checked } : call
    );

    setCallHistory(updatedHistory);
  };

  const handleCallHistoryRadioChange = (index, e) => {
    const { value } = e.target;
    const isIncoming = value === "true";

    const updatedHistory = callHistory.map((call, i) =>
      i === index ? { ...call, incoming: isIncoming } : call
    );

    setCallHistory(updatedHistory);
  };

  const addCallHistory = () => {
    setCallHistory((prevHistory) => [
      ...prevHistory,
      {
        incoming: false,
        whatBusiness: "",
        workVillage: "",
        clientAnswer: "",
        numberOfHouses: "",
        price: "",
        estimatedBill: "",
        budget: "",
        dateOfCall: "",
        meetingDate: "",
        reminderDate: "",

        telecaller: { id: user?.id, name: user?.name, time: new Date() },
      },
    ]);
  };

  const deleteCallHistory = (indexToDelete) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    setCallHistory((prevHistory) =>
      prevHistory.filter((_, index) => index !== indexToDelete)
    );
  };

  function useRouteChange(callback) {
    const location = useLocation();

    useEffect(() => {
      callback(location.pathname);
    }, [callback, location.pathname]);
  }

  useRouteChange((path) => {
    console.log("Route changed to:", path);
  });

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // This triggers the default browser confirmation
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div
      className="form-container"
      style={{ padding: 0, background: "transparent" }}
    >
      {/* Added margin for sidebar */}

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        1. Customer List Form {isEditMode ? "(Update)" : ""}
      </h1>

      {formLoading && (
        <div className="text-center text-blue-600 text-lg mb-4">
          {isEditMode ? "Loading Records..." : "Submiting Form..."}
        </div>
      )}

      {formError && (
        <div className="text-center text-red-600 text-lg mb-4">{formError}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-field" style={{ display: "flex", gap: ".5rem" }}>
          <label
            htmlFor="isInterested"
            className="form-label"
            style={{ userSelect: "none" }}
          >
            રસ ધરાવે છે ? (Interested Customer?){" "}
            <span
              style={{
                fontSize: "1.3rem",
                color: `${formData.isInterested ? "blue" : "orange"}`,
              }}
            >
              '{formData.isInterested ? "હા" : "ના"}'
            </span>
          </label>
          <input
            type="checkbox"
            id="isInterested"
            name="isInterested"
            className="form-checkbox"
            checked={formData.isInterested}
            onChange={handleCheckboxChange}
            disabled={isEditMode && formLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Field 1: અનું ક્રમાંક */}
          <div className="form-field">
            <label htmlFor="serialNumber" className="form-label">
              1. અનું ક્રમાંક
            </label>
            <input
              type="number"
              id="serialNumber"
              name="serialNumber"
              className="form-input"
              placeholder="દા.ત. 001"
              value={formData?.serialNumber}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
              required
              style={{ maxWidth: "82px" }}
              maxLength="5"
            />
          </div>

          {/* Field 2: મિલ્કત ક્રમાંક */}
          <div className="form-field">
            <label htmlFor="customerFullName" className="form-label">
              2. ગ્રાહકનું & કસ્ટમર પુરૂ નામ
            </label>
            <input
              type="text"
              id="customerFullName"
              name="customerFullName"
              className="form-input"
              placeholder="customer Full Name"
              value={formData?.customerFullName}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
              required
            />
          </div>

          {/* Field 4: માલિકનું નામ */}
          <div className="form-field">
            <label htmlFor="mobileNo" className="form-label">
              3. મોબાઈલ નંબર
            </label>
            <input
              type="text"
              id="mobileNo"
              name="mobileNo"
              className="form-input"
              placeholder="e.g. 7201840095, 9429703896"
              value={formData?.mobileNo}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
            />
          </div>

          {/* Field 5: જુનો મિલકત નંબર */}
          <div className="form-field">
            <label htmlFor="whatsaapNo" className="form-label">
              4. વોટસેઅપ નબંર
            </label>
            <input
              type="text"
              id="whatsaapNo"
              name="whatsaapNo"
              className="form-input"
              placeholder="જો હોય તો દાખલ કરો"
              value={formData?.whatsaapNo}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
              style={{ maxWidth: "140px" }}
              maxLength="10"
            />

            <div style={{ display: "flex", gap: ".5rem" }}>
              <input
                type="checkbox"
                id="sameNumber"
                name="sameNumber"
                checked={sameNumber}
                onChange={handleSameNumber}
                className="form-checkbox"
                placeholder="જો હોય તો દાખલ કરો"
              />

              <label htmlFor="sameNumber" style={{ userSelect: "none" }}>
                {" "}
                Same Number
              </label>
            </div>
          </div>

          {/* Field 5: મકાન category */}
          <div className="form-field">
            <label htmlFor="category" className="form-label">
              5. કેટેગરી
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData?.category}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
              style={{ maxWidth: "200px" }}
            >
              {/* <option value="TCM" selected>
                TCM / તલાટી કમ મંત્રી
              </option>
              <option value="Sarpanch">Sarpanch / સરપંચ</option> */}

              {customerCategory?.map((category, index) => (
                <option key={index} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Field 6: Gaam */}
        <div className="form-field md:col-span-2">
          <label htmlFor="village" className="form-label">
            6. ગામ
          </label>
          <input
            list="village-options"
            type="text"
            id="village"
            name="village"
            className="form-input"
            placeholder="village"
            value={formData?.village}
            onChange={handleChange}
            disabled={isEditMode && formLoading}
            style={{ maxWidth: "200px" }}
          />

          <datalist id="village-options">
            {villages?.map((village, index) => (
              <option key={index} value={village} />
            ))}
          </datalist>
        </div>

        {/* Field 7: મોબાઈલ નંબર */}
        <div className="form-field">
          <label htmlFor="villageOfCharge" className="form-label">
            7. ચાર્જ નું ગામ
          </label>
          <input
            type="text"
            id="villageOfCharge"
            name="villageOfCharge"
            className="form-input"
            value={formData?.villageOfCharge}
            onChange={handleChange}
            disabled={isEditMode && formLoading}
            style={{ maxWidth: "200px" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Field 8: Jilla  / જિલ્લો */}
          <div className="form-field">
            <label htmlFor="taluko" className="form-label">
              8. તાલુકો
            </label>
            <input
              list="taluka-options"
              type="text"
              id="taluko"
              name="taluko"
              className="form-input"
              value={formData?.taluko}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
            />

            <datalist id="taluka-options">
              {talukas.map((t, i) => (
                <option key={i} value={t} />
              ))}
            </datalist>
          </div>

          {/* Field 8: Jilla  / જિલ્લો */}
          <div className="form-field">
            <label htmlFor="jilla" className="form-label">
              9. જિલ્લો
            </label>
            <input
              list="district-options"
              type="text"
              id="jilla"
              name="jilla"
              className="form-input"
              value={formData?.jilla}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
            />

            <datalist id="district-options">
              {districts.map((d, i) => (
                <option key={i} value={d} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Field 8: Jilla  / જિલ્લો */}
        {isEditMode ? (
          <div>
            {callHistory
              ? callHistory?.map((call, index) => (
                  <div key={index} className="call-history">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-semibold">Call {index + 1}</h2>

                      <button
                        type="button"
                        onClick={() => deleteCallHistory(index)}
                        className="delete-call-button text-red-600 text-sm flex items-center gap-1"
                        disabled={isEditMode && formLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 6a1 1 0 011-1h6a1 1 0 011 1v10a1 1 0 11-2 0V7H8v9a1 1 0 11-2 0V6zM4 4a1 1 0 011-1h10a1 1 0 011 1v1H4V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                    <br />

                    <div key={index} className="call-item">
                      {/* Other call details */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <label
                          style={{
                            whiteSpace: "nowrap",
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="radio"
                            name={`incoming-${index}`} // Unique name for each radio group
                            value="false"
                            checked={call.incoming === false}
                            onChange={(e) =>
                              handleCallHistoryRadioChange(index, e)
                            }
                            style={{ marginRight: "0.5rem" }}
                          />
                          <img
                            src={OutGoing}
                            alt="Outgoing"
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "5px",
                            }}
                          />
                          ફોન કરેલ
                        </label>

                        <label
                          style={{
                            whiteSpace: "nowrap",
                            userSelect: "none",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <input
                            type="radio"
                            name={`incoming-${index}`} // Unique name for each radio group
                            value="true"
                            checked={call.incoming === true}
                            onChange={(e) =>
                              handleCallHistoryRadioChange(index, e)
                            }
                            style={{ marginRight: "0.5rem" }}
                          />
                          <img
                            src={Incoming}
                            alt="Incoming"
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "5px",
                            }}
                          />
                          આવેલ ફોન
                        </label>
                      </div>
                    </div>

                    <br />
                    <hr />
                    <br />

                    {/* Field 8: What business did you call for */}
                    <div className="form-field">
                      <label htmlFor="whatBusiness" className="form-label">
                        A{")"} કયુ કામ વસ્તુ માટે ફોન કરેલ
                      </label>
                      <input
                        type="text"
                        id="whatBusiness"
                        name="whatBusiness"
                        className="form-input"
                        value={call?.whatBusiness}
                        onChange={(e) => handleCallHistoryChange(index, e)}
                        disabled={isEditMode && formLoading}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="workVillage" className="form-label">
                        B{")"} કયા ગામનું કામ કરવાનું છે
                      </label>
                      <input
                        type="text"
                        id="workVillage"
                        name="workVillage"
                        className="form-input"
                        value={call?.workVillage}
                        onChange={(e) => handleCallHistoryChange(index, e)}
                        disabled={isEditMode && formLoading}
                        style={{ maxWidth: "200px" }}
                      />
                    </div>
                    {/* Field 8: Jilla  / જિલ્લો */}

                    <div className="form-field">
                      <label htmlFor="clientAnswer" className="form-label">
                        C{")"} ગ્રાહકે શું જવાબ આપ્યો
                      </label>
                      <input
                        type="text"
                        id="clientAnswer"
                        name="clientAnswer"
                        className="form-input"
                        value={call?.clientAnswer}
                        onChange={(e) => handleCallHistoryChange(index, e)}
                        disabled={isEditMode && formLoading}
                      />
                    </div>
                    {/* Field 8: Jilla  / જિલ્લો */}

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: ".5rem",
                      }}
                    >
                      <div className="form-field" style={{ maxWidth: "100px" }}>
                        <label htmlFor="numberOfHouses" className="form-label">
                          D{")"} ઘર/ખાતા ગામના કેટલા છે
                        </label>
                        <input
                          type="text"
                          id="numberOfHouses"
                          name="numberOfHouses"
                          className="form-input"
                          value={call?.numberOfHouses}
                          onChange={(e) => handleCallHistoryChange(index, e)}
                          disabled={isEditMode && formLoading}
                          // style={{ width: "100%" }}
                          maxLength="6"
                        />
                      </div>
                      {/* Field 8: Jilla  / જિલ્લો */}

                      <div className="form-field" style={{ maxWidth: "65px" }}>
                        <label htmlFor="price" className="form-label">
                          E{")"} ભાવ ઘર ખાતા દીઠ
                        </label>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          className="form-input"
                          value={call?.price}
                          onChange={(e) => handleCallHistoryChange(index, e)}
                          disabled={isEditMode && formLoading}
                          maxLength="3"
                        />
                      </div>

                      {/* Field 15: Jilla  / જિલ્લો */}
                      <div className="form-field" style={{ maxWidth: "140px" }}>
                        <label htmlFor="estimatedBill" className="form-label">
                          F{")"} અંદાજીત બીલ રકમ રૂ
                        </label>
                        <input
                          type="text"
                          id="estimatedBill"
                          name="estimatedBill"
                          className="form-input"
                          // value={call?.estimatedBill}

                          value={
                            Number(call?.numberOfHouses) && Number(call?.price)
                              ? Number(call?.numberOfHouses) *
                                Number(call?.price)
                              : ""
                          }
                          readOnly
                          // onChange={(e) => handleCallHistoryChange(index, e)}
                          disabled={isEditMode && formLoading}
                        />
                      </div>

                      {/* Field 16: Jilla  / જિલ્લો */}
                      <div className="form-field" style={{ maxWidth: "130px" }}>
                        <label htmlFor="budget" className="form-label">
                          G{")"} કસ્ટમરને કેટલા પૈસા સુધી પોસાય ઘર/ખાતા
                        </label>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          className="form-input"
                          value={call?.budget}
                          onChange={(e) => handleCallHistoryChange(index, e)}
                          disabled={isEditMode && formLoading}
                        />
                      </div>
                    </div>

                    {/* Field 17: Jilla  / જિલ્લો */}
                    <div className="form-field">
                      <label htmlFor="dateOfCall" className="form-label">
                        H{")"} ફોન કર્યા તારીખ ટેલીકોલર
                      </label>
                      <input
                        type="date"
                        id="dateOfCall"
                        name="dateOfCall"
                        className="form-input"
                        value={call?.dateOfCall}
                        onChange={(e) => handleCallHistoryChange(index, e)}
                        disabled={isEditMode && formLoading}
                      />
                    </div>

                    {/* Field 18 Jilla  / જિલ્લો */}
                    <div className="form-field">
                      <label htmlFor="reminderDate" className="form-label">
                        I{")"} ગ્રાહકને ફરી કોલ કરવો
                      </label>
                      <input
                        type="date"
                        id="reminderDate"
                        name="reminderDate"
                        className="form-input"
                        value={call?.reminderDate}
                        onChange={(e) => handleCallHistoryChange(index, e)}
                        disabled={isEditMode && formLoading}
                      />
                    </div>

                    {/* Field 18 Jilla  / જિલ્લો */}
                    <div className="form-field">
                      <label htmlFor="meetingDate" className="form-label">
                        J{")"} મીટીંગ તારીખ રૂબરુ મળવા જવુ
                      </label>
                      <input
                        type="date"
                        id="meetingDate"
                        name="meetingDate"
                        className="form-input"
                        value={call?.meetingDate}
                        onChange={(e) => handleCallHistoryChange(index, e)}
                        disabled={isEditMode && formLoading}
                      />
                    </div>

                    <div
                      className="form-field"
                      onClick={() => handleShareCall(call, formData)}
                    >
                      <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                        type="button"
                      >
                        Share Call Detail
                      </button>
                    </div>
                  </div>
                ))
              : null}
          </div>
        ) : null}

        {isEditMode && (
          <button
            type="button"
            onClick={addCallHistory}
            className="add-floor-button"
            disabled={isEditMode && formLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Call Detail
          </button>
        )}

        <br />
        <br />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Field 11: Date the List was Created in the office ઑફીસમા યાદી બનાવેલ તારીખ */}
          <div className="form-field">
            <label htmlFor="listCreated" className="form-label">
              11. ઑફીસમા યાદી બનાવેલ તારીખ
            </label>
            <input
              type="date"
              id="listCreated"
              name="listCreated"
              className="form-input"
              value={formData?.listCreated}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
            />
          </div>

          {/* Field 11: Date the List was Created in the office ઑફીસમા યાદી બનાવેલ તારીખ */}
          <div className="form-field">
            <label htmlFor="listCreated" className="form-label">
              12. કમ્પની ને મળેલ તારીખ
            </label>
            <input
              type="date"
              id="listReceived"
              name="listReceived"
              className="form-input"
              value={formData?.listReceived}
              onChange={handleChange}
              disabled={isEditMode && formLoading}
            />
          </div>
        </div>

        <br />

        {/* Field 17: રીમાર્કસ */}
        {/* <div className="form-field md:col-span-2">
          <label htmlFor="remarks" className="form-label">
            8. રીમાર્કસ/નોંધ
          </label>
          <textarea
            id="remarks"
            name="remarks"
            className="form-textarea"
            rows="3"
            value={formData?.remarks}
            onChange={handleChange}
          ></textarea>
        </div> */}

        <button
          type="submit"
          className="submit-button"
          disabled={isEditMode && formLoading}
        >
          {isEditMode ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactListForm;
