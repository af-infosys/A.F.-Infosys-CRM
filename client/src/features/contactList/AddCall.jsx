import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiPath from "../../isProduction";
import { useAuth } from "../../config/AuthContext";

const AddCall = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCall, setNewCall] = useState({
    whatBusiness: "",
    workVillage: "",
    clientAnswer: "",
    numberOfHouses: "",
    price: "",
    estimatedBill: "",
    budget: "",
    dateOfCall: "",
    meetingDate: "",
  });

  const [callHistory, setCallHistory] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const record = result?.data;

      if (record) {
        // Populate formData
        setData({
          serialNumber: record[1] || "",
          customerFullName: record[2] || "",

          mobileNo: record[3] || "",
          whatsaapNo: record[4] || "",
          category: record[5] || "",
          village: record[6] || "",
          villageOfCharge: record[7] || "",
          taluko: record[8] || "",
          jilla: record[9] || "",

          // whatBusiness: record[10] || "",
          // workVillage: record[11] || "",
          // clientAnswer: record[12] || "",
          // numberOfHouses: record[13] || "",
          // price: record[14] || "",
          // estimatedBill: record[15] || "",
          // budget: record[16] || "",
          // dateOfCall: record[17] || "",
          // meetingDate: record[18] || "",

          telecaller: { id: user?.id, name: user?.name, time: new Date() },
        });

        if (record[10]) {
          try {
            const calls = JSON.parse(record[10]);
            setCallHistory(calls || []);
          } catch (jsonError) {
            console.error("Error parsing floors JSON:", jsonError);
            setCallHistory([]);
          }
        } else {
          //   whatBusiness: "",
          //   workVillage: "",
          //   clientAnswer: "",
          //   numberOfHouses: "",
          //   price: "",
          //   estimatedBill: "",
          //   budget: "",
          //   dateOfCall: "",
          //   meetingDate: "",

          setCallHistory([]);
          navigate("/customers/report");
        }
      } else {
        setError("No Records Found!");
      }
    } catch (err) {
      console.error("Error fetching records:", err);

      setError(
        "Error Fetching Records! Try Again Later. OR Contact the Admin."
      );
      navigate("/customers/report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) navigate("/customers/report");
    fetchRecords();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setNewCall((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const newFormData = { ...data, callHistory: [...callHistory, newCall] };

    console.log("Ready to Submit: ", newFormData);

    try {
      const response = await fetch(`${await apiPath()}/api/contactList/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newFormData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result.message);
        alert(`Successfully Sumbited!`);
        navigate("/customers/overview");
      } else {
        console.error("Error submitting form:", result.message);
        setError(`Error While Submiting: ${result.message}`);
      }
    } catch (error) {
      console.error("Network error or unexpected issue:", error);
      setError("નેટવર્ક ભૂલ અથવા અણધારી સમસ્યા આવી.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Call Details</h2>
      <h3>Call History</h3>

      <p>{loading ? "Loading..." : data?.customerFullName}</p>

      {error && <p className="error">{error}</p>}

      <div className="form-field">
        <label htmlFor="whatBusiness" className="form-label">
          1. What business did you call for? / કયુ કામ વસ્તુ માટે ફોન કરેલ
        </label>
        <input
          type="text"
          id="whatBusiness"
          name="whatBusiness"
          className="form-input"
          value={newCall.whatBusiness}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="workVillage" className="form-label">
          2. Which village do you want to work for ? / કયા ગામનું કામ કરવાનું છે
        </label>
        <input
          type="text"
          id="workVillage"
          name="workVillage"
          className="form-input"
          value={newCall.workVillage}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="clientAnswer" className="form-label">
          3. What did the customer/client answer ? / જવાબ શું આપ્યો કસ્ટમર /
          ગ્રાહક
        </label>
        <input
          type="text"
          id="clientAnswer"
          name="clientAnswer"
          className="form-input"
          value={newCall.clientAnswer}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="numberOfHouses" className="form-label">
          4. How many households/villages are there? / ઘર/ ખાતા ગામના કેટલા છે
        </label>
        <input
          type="text"
          id="numberOfHouses"
          name="numberOfHouses"
          className="form-input"
          value={newCall.numberOfHouses}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="price" className="form-label">
          5. Price per household account / ભાવ ઘર ખાતા દીઠ
        </label>
        <input
          type="text"
          id="price"
          name="price"
          className="form-input"
          value={newCall.price}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="estimatedBill" className="form-label">
          6. Estimated bill amount Rs. / અંદાજીત બીલ રકમ રૂ
        </label>
        <input
          type="text"
          id="estimatedBill"
          name="estimatedBill"
          className="form-input"
          // value={newCall.estimatedBill}

          value={
            Number(newCall?.numberOfHouses) && Number(newCall?.price)
              ? Number(newCall?.numberOfHouses) * Number(newCall?.price)
              : ""
          }
          readOnly
          // onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="budget" className="form-label">
          7. How much money can the customer afford to pay for the
          house/account? / કસ્ટમરને કેટલા પૈસા સુધી પોસાય ઘર/ખાતા
        </label>
        <input
          type="text"
          id="budget"
          name="budget"
          className="form-input"
          value={newCall.budget}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="dateOfCall" className="form-label">
          8. Date of call Telecaller / ફોન કર્યા તારીખ ટેલીકોલર
        </label>
        <input
          type="date"
          id="dateOfCall"
          name="dateOfCall"
          className="form-input"
          value={newCall.dateOfCall}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="meetingDate" className="form-label">
          9. Meeting date: Meet in person. / મીટીંગ તારીખ રૂબરુ મળવા જવુ
        </label>
        <input
          type="date"
          id="meetingDate"
          name="meetingDate"
          className="form-input"
          value={newCall.meetingDate}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default AddCall;
