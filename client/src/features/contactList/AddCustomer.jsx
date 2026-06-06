import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./Form.scss";
import { useAuth } from "../../config/AuthContext";
import apiPath from "../../isProduction";
import customerCategory from "../customerCategoryList";
import DynamicOrderForm from "../../components/DynamicOrderForm";

const AddCustomer = () => {
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

    sarpanchName: "",
    sarpanchMobile: "",
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

  console.log(formData);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const convertGujaratiToEnglishDigits = (input) => {
    const gujaratiDigits = "૦૧૨૩૪૫૬૭૮૯";
    const englishDigits = "0123456789";

    return input.replace(
      /[૦૧૨૩૪૫૬૭૮૯]/g,
      (char) => englishDigits[gujaratiDigits.indexOf(char)],
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

        listReceived: new Date().toISOString().split("T")[0] || "",
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const fullFormData = {
      ...formData,
      callHistory: [],
    };

    try {
      const response = await fetch(`${await apiPath()}/api/contactList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(fullFormData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result.message);
        alert(`Successfully Sumbited!`);
        window.location.reload();

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
      } else {
        console.alert("Error submitting form:", result.message);
        setFormError(
          `Error While ${isEditMode ? "Updating" : "Submiting"}: ${
            result.message
          }`,
        );
      }
    } catch (error) {
      console.alert("Network error or unexpected issue:", error);
      setFormError("નેટવર્ક ભૂલ અથવા અણધારી સમસ્યા આવી.");
    } finally {
      setFormLoading(false);
    }
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

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
        1.2 Add Customer
      </h1>

      <span className="text-gray-600 text-center mb-8">
        તાલુકો: {formData?.taluko} | જિલ્લો: {formData?.jilla}
      </span>

      {formLoading && (
        <div className="text-center text-blue-600 text-lg mb-4">
          {isEditMode ? "Loading Records..." : "Submiting Form..."}
        </div>
      )}

      {formError && (
        <div className="text-center text-red-600 text-lg mb-4">{formError}</div>
      )}

      <DynamicOrderForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formLoading={formLoading}
        customerCategory={customerCategory}
        villages={villages}
        talukas={talukas}
        districts={districts}
      />

      {/* <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="serialNumber" className="form-label">
            અનું ક્રમાંક
          </label>
          <input
            type="number"
            id="serialNumber"
            name="serialNumber"
            className="form-input"
            placeholder="દા.ત. 001"
            value={formData?.serialNumber}
            onChange={handleChange}
            disabled={formLoading}
            required
            style={{ maxWidth: "82px" }}
            maxLength="5"
          />
        </div>

        <div className="form-field">
          <label htmlFor="customerFullName" className="form-label">
            ગ્રાહકનું & કસ્ટમર પુરૂ નામ
          </label>
          <input
            type="text"
            id="customerFullName"
            name="customerFullName"
            className="form-input"
            placeholder="customer Full Name"
            value={formData?.customerFullName}
            onChange={handleChange}
            disabled={formLoading}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="category" className="form-label">
            કેટેગરી
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData?.category}
            onChange={handleChange}
            disabled={formLoading}
            style={{ maxWidth: "200px" }}
          >
            {customerCategory?.map((category, index) => (
              <option key={index} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field md:col-span-2">
          <label htmlFor="village" className="form-label">
            ગામ
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
            disabled={formLoading}
            style={{ maxWidth: "200px" }}
          />

          <datalist id="village-options">
            {villages?.map((village, index) => (
              <option key={index} value={village} />
            ))}
          </datalist>
        </div>

        <div className="form-field">
          <label htmlFor="mobileNo" className="form-label">
            મોબાઈલ નંબર
          </label>
          <input
            type="text"
            id="mobileNo"
            name="mobileNo"
            className="form-input"
            placeholder="e.g. 7201840095, 9429703896"
            value={formData?.mobileNo}
            onChange={handleChange}
            disabled={formLoading}
            style={{ maxWidth: "250px" }}
          />
        </div>

        <div className="form-field">
          <label htmlFor="villageOfCharge" className="form-label">
            ચાર્જ નું ગામ
          </label>
          <input
            type="text"
            id="villageOfCharge"
            name="villageOfCharge"
            className="form-input"
            value={formData?.villageOfCharge}
            onChange={handleChange}
            disabled={formLoading}
            style={{ maxWidth: "200px" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="form-field">
            <label htmlFor="taluko" className="form-label">
              તાલુકો
            </label>
            <input
              list="taluka-options"
              type="text"
              id="taluko"
              name="taluko"
              className="form-input"
              value={formData?.taluko}
              onChange={handleChange}
              disabled={formLoading}
            />

            <datalist id="taluka-options">
              {talukas.map((t, i) => (
                <option key={i} value={t} />
              ))}
            </datalist>
          </div>

          <div className="form-field">
            <label htmlFor="jilla" className="form-label">
              જિલ્લો
            </label>
            <input
              list="district-options"
              type="text"
              id="jilla"
              name="jilla"
              className="form-input"
              value={formData?.jilla}
              onChange={handleChange}
              disabled={formLoading}
            />

            <datalist id="district-options">
              {districts.map((d, i) => (
                <option key={i} value={d} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="listCreated" className="form-label">
            કમ્પની ને મળેલ તારીખ
          </label>
          <input
            type="date"
            id="listReceived"
            name="listReceived"
            className="form-input"
            value={formData?.listReceived}
            onChange={handleChange}
            disabled={formLoading}
          />
        </div>

        <button type="submit" className="submit-button" disabled={formLoading}>
          Submit
        </button>
      </form> */}
    </div>
  );
};

export default AddCustomer;
