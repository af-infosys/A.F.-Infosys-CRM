import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./Form.scss";
import { useAuth } from "../../config/AuthContext";
import apiPath from "../../isProduction";

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

    whatBusiness: "",
    workVillage: "",
    clientAnswer: "",
    numberOfHouses: "",
    price: "",
    estimatedBill: "",
    budget: "",
    dateOfCall: "",
    meetingDate: "",

    telecaller: { id: user?.id, name: user?.name, time: new Date() },
  });

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

  const [villageInfoMap, setVillageInfoMap] = useState({}); // { villageName: { taluka, district } }

  const fetchIndex = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const data = result?.data;
      if (!Array.isArray(data) || data.length === 0) return;

      // Set new serial number
      setFormData((prevData) => ({
        ...prevData,
        serialNumber: Number(data[data.length - 1][0]) + 1 || "",
      }));

      const villageSet = new Set();
      const talukaSet = new Set();
      const districtSet = new Set();
      const mapping = {};

      for (let item of data) {
        const village = item[5]?.trim();
        const taluka = item[7]?.trim();
        const district = item[8]?.trim();

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
  }, []);

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
        navigate("/customers/report");

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

            whatBusiness: "",
            workVillage: "",
            clientAnswer: "",
            numberOfHouses: "",
            price: "",
            estimatedBill: "",
            budget: "",
            dateOfCall: "",
            meetingDate: "",

            telecaller: { id: user?.id, name: user?.name, time: new Date() },
          });
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
            serialNumber: record[0] || "",
            customerFullName: record[1] || "",

            mobileNo: record[2] || "",
            whatsaapNo: record[3] || "",
            category: record[4] || "",
            village: record[5] || "",
            villageOfCharge: record[6] || "",
            taluko: record[7] || "",
            jilla: record[8] || "",

            whatBusiness: record[9] || "",
            workVillage: record[10] || "",
            clientAnswer: record[11] || "",
            numberOfHouses: record[12] || "",
            price: record[13] || "",
            estimatedBill: record[14] || "",
            budget: record[15] || "",
            dateOfCall: record[16] || "",
            meetingDate: record[17] || "",

            telecaller: { id: user?.id, name: user?.name, time: new Date() },
          });
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
  }, [id, isEditMode, user?.id]);

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

  return (
    <div className="form-container p-8">
      {/* Added margin for sidebar */}

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Contact List Form {isEditMode ? "(Update)" : ""}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Field 1: અનું ક્રમાંક */}
          <div className="form-field">
            <label htmlFor="serialNumber" className="form-label">
              1. અનું કૂમાંક
            </label>
            <input
              type="number"
              id="serialNumber"
              name="serialNumber"
              className="form-input"
              placeholder="દા.ત. 001"
              value={formData?.serialNumber}
              onChange={handleChange}
              disabled={isEditMode}
              required
            />
          </div>

          {/* Field 2: મિલ્કત ક્રમાંક */}
          <div className="form-field">
            <label htmlFor="customerFullName" className="form-label">
              2. Customer Full Name / કસ્ટમર & ગ્રાહકનું પુરૂ નામ
            </label>
            <input
              type="text"
              id="customerFullName"
              name="customerFullName"
              className="form-input"
              placeholder="customer Full Name"
              value={formData?.customerFullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Field 4: માલિકનું નામ */}
          <div className="form-field">
            <label htmlFor="mobileNo" className="form-label">
              3. Mobile No. / મોબાઈલ નંબર
            </label>
            <input
              type="text"
              id="mobileNo"
              name="mobileNo"
              className="form-input"
              placeholder="Mobile No."
              value={formData?.mobileNo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Field 5: જુનો મિલકત નંબર */}
          <div className="form-field">
            <label htmlFor="whatsaapNo" className="form-label">
              4. Whatsaap No. / વોટસેઅપ નબંર
            </label>
            <input
              type="text"
              id="whatsaapNo"
              name="whatsaapNo"
              className="form-input"
              placeholder="જો હોય તો દાખલ કરો"
              value={formData?.whatsaapNo}
              onChange={handleChange}
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
              5. Category Customer / કેટેગરી
            </label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData?.category}
              onChange={handleChange}
            >
              <option value="TCM">TCM / તલાટી કમ મંત્રી</option>
              <option value="Sarpanch">Sarpanch / સરપંચ</option>
            </select>
          </div>
        </div>

        {/* Field 7: મિલ્ક્ત પર લખેલ નામ મકાન/દુકાન/ કારખાના/ કંપનીનું નામ */}
        <div className="form-field md:col-span-2">
          <label htmlFor="village" className="form-label">
            6. Village / ગામ
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
            7. Village of charge / ચાર્જ નું ગામ
          </label>
          <input
            type="text"
            id="villageOfCharge"
            name="villageOfCharge"
            className="form-input"
            value={formData?.villageOfCharge}
            onChange={handleChange}
          />
        </div>

        {/* Field 8: Jilla  / જિલ્લો */}
        <div className="form-field">
          <label htmlFor="taluko" className="form-label">
            8. Taluko / તાલુકો
          </label>
          <input
            list="taluka-options"
            type="text"
            id="taluko"
            name="taluko"
            className="form-input"
            value={formData?.taluko}
            onChange={handleChange}
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
            9. Jilla / જિલ્લો
          </label>
          <input
            list="district-options"
            type="text"
            id="jilla"
            name="jilla"
            className="form-input"
            value={formData?.jilla}
            onChange={handleChange}
          />

          <datalist id="district-options">
            {districts.map((d, i) => (
              <option key={i} value={d} />
            ))}
          </datalist>
        </div>

        {/* Field 8: Jilla  / જિલ્લો */}
        {isEditMode ? (
          <>
            {/* Field 8: Jilla  / જિલ્લો */}
            <div className="form-field">
              <label htmlFor="whatBusiness" className="form-label">
                10. What business did you call for? / કયુ કામ વસ્તુ માટે ફોન
                કરેલ
              </label>
              <input
                type="text"
                id="whatBusiness"
                name="whatBusiness"
                className="form-input"
                value={formData?.whatBusiness}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="workVillage" className="form-label">
                11. Which village do you want to work for ? / કયા ગામનું કામ
                કરવાનું છે
              </label>
              <input
                type="text"
                id="workVillage"
                name="workVillage"
                className="form-input"
                value={formData?.workVillage}
                onChange={handleChange}
              />
            </div>
            {/* Field 8: Jilla  / જિલ્લો */}

            <div className="form-field">
              <label htmlFor="clientAnswer" className="form-label">
                12. What did the customer/client answer ? / જવાબ શું આપ્યો
                કસ્ટમર / ગ્રાહક
              </label>
              <input
                type="text"
                id="clientAnswer"
                name="clientAnswer"
                className="form-input"
                value={formData?.clientAnswer}
                onChange={handleChange}
              />
            </div>
            {/* Field 8: Jilla  / જિલ્લો */}

            <div className="form-field">
              <label htmlFor="numberOfHouses" className="form-label">
                13. How many households/villages are there? / ઘર/ ખાતા ગામના
                કેટલા છે
              </label>
              <input
                type="text"
                id="numberOfHouses"
                name="numberOfHouses"
                className="form-input"
                value={formData?.numberOfHouses}
                onChange={handleChange}
              />
            </div>
            {/* Field 8: Jilla  / જિલ્લો */}

            <div className="form-field">
              <label htmlFor="price" className="form-label">
                14. Price per household account / ભાવ ઘર ખાતા દીઠ
              </label>
              <input
                type="text"
                id="price"
                name="price"
                className="form-input"
                value={formData?.price}
                onChange={handleChange}
              />
            </div>

            {/* Field 15: Jilla  / જિલ્લો */}
            <div className="form-field">
              <label htmlFor="estimatedBill" className="form-label">
                15. Estimated bill amount Rs. / અંદાજીત બીલ રકમ રૂ
              </label>
              <input
                type="text"
                id="estimatedBill"
                name="estimatedBill"
                className="form-input"
                value={formData?.estimatedBill}
                onChange={handleChange}
              />
            </div>

            {/* Field 16: Jilla  / જિલ્લો */}
            <div className="form-field">
              <label htmlFor="budget" className="form-label">
                16. How much money can the customer afford to pay for the
                house/account? / કસ્ટમરને કેટલા પૈસા સુધી પોસાય ઘર/ખાતા
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                className="form-input"
                value={formData?.budget}
                onChange={handleChange}
              />
            </div>

            {/* Field 17: Jilla  / જિલ્લો */}
            <div className="form-field">
              <label htmlFor="dateOfCall" className="form-label">
                17. Date of call Telecaller / ફોન કર્યા તારીખ ટેલીકોલર
              </label>
              <input
                type="date"
                id="dateOfCall"
                name="dateOfCall"
                className="form-input"
                value={formData?.dateOfCall}
                onChange={handleChange}
              />
            </div>

            {/* Field 18 Jilla  / જિલ્લો */}
            <div className="form-field">
              <label htmlFor="meetingDate" className="form-label">
                18. Meeting date: Meet in person. / મીટીંગ તારીખ રૂબરુ મળવા જવુ
              </label>
              <input
                type="date"
                id="meetingDate"
                name="meetingDate"
                className="form-input"
                value={formData?.meetingDate}
                onChange={handleChange}
              />
            </div>
          </>
        ) : null}

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

        <button type="submit" className="submit-button">
          {isEditMode ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ContactListForm;
