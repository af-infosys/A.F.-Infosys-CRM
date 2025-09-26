import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiPath from "../../isProduction";
import { useAuth } from "../../config/AuthContext";
import handleShareCall from "./handleShareCall";

import OutGoing from "../../assets/icon/outgoing-call.png";
import Incoming from "../../assets/icon/incoming-call.png";
import MobileNoIcon from "../../assets/icon/mobileNo.png";
import WhatsappNoIcon from "../../assets/icon/whatsappNo.png";
import WhatsappIcon from "../../assets/icon/whatsapp.png";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const AddCall = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCall, setNewCall] = useState({
    incoming: false,
    whatBusiness: "",
    workVillage: "",
    clientAnswer: "",
    numberOfHouses: "",
    price: "",
    estimatedBill: "",
    budget: "",
    dateOfCall: dayjs().format("YYYY-MM-DD") || "",
    meetingDate: "",
    reminderDate: "",

    createdAt: { id: user?.id, name: user?.name, time: new Date() },
    updatedAt: { id: user?.id, name: user?.name, time: new Date() },
  });

  const [callHistory, setCallHistory] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          //   reminderDate: "",

          setCallHistory([]);
          // navigate("/customers/report");
        }
      } else {
        setError("No Records Found!");
      }
    } catch (err) {
      console.error("Error fetching records:", err);

      setError(
        "Error Fetching Records! Try Again Later. OR Contact the Admin."
      );
      // navigate("/customers/report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!id) navigate("/customers/report");
    fetchRecords();
  }, []);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setNewCall((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    const isIncoming = value === "true";

    setNewCall((prev) => ({
      ...prev,
      incoming: isIncoming,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true when the form is submitted
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

        navigate("/customers/report");
      } else {
        console.error("Error submitting form:", result.message);
        setError(`Error While Submiting: ${result.message}`);
      }
    } catch (error) {
      console.error("Network error or unexpected issue:", error);
      setError("નેટવર્ક ભૂલ અથવા અણધારી સમસ્યા આવી.");
    } finally {
      setLoading(false); // Set loading to false when the request is complete (success or error)
    }
  };

  const [services, setServices] = useState([]);
  const [answers, setAnswers] = useState([]);

  const fetchIndex = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const data = result?.data;
      if (!Array.isArray(data) || data?.length === 0) return;

      const serviceSet = new Set();
      const answerSet = new Set();

      for (let item of data) {
        if (!item[10]) continue;

        for (let callHistory of JSON.parse(item[10] || "[]")) {
          const service = callHistory?.whatBusiness;
          const answer = callHistory?.clientAnswer;

          if (service) serviceSet.add(service);
          if (answer) answerSet.add(answer);
        }
      }

      setServices([...serviceSet]);
      setAnswers([...answerSet]);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  useEffect(() => {
    fetchIndex();
  }, []);

  console.log(services, answers);

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center", fontSize: "1.2rem" }}>
        Add Call Details Form
      </h2>
      <h3 style={{ textAlign: "center", fontSize: "1rem" }}>Call History</h3>

      <br />
      <p
        style={{
          fontSize: "2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          "Loading..."
        ) : (
          <>
            <span>{data?.customerFullName}</span>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <b
                style={{
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: ".5rem",
                }}
              >
                <img
                  src={MobileNoIcon}
                  alt="Phone Number"
                  style={{ width: "20px", height: "20px" }}
                />{" "}
                {data?.mobileNo || "0000-000-0000"}
              </b>
              <b
                style={{
                  fontSize: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: ".5rem",
                }}
              >
                <img
                  src={WhatsappNoIcon}
                  alt="Whatsapp Number"
                  style={{ width: "20px", height: "20px" }}
                />{" "}
                {data?.whatsaapNo || "0000-000-0000"}
              </b>
            </div>
          </>
        )}
      </p>

      {!loading ? (
        <p
          style={{
            fontSize: "1.4rem",
            textAlign: "center",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <span>ગામ: {data?.village}</span>
          <span>તાલુકો: {data?.taluko}</span>
          <span>જિલ્લો: {data?.jilla}</span>
        </p>
      ) : null}

      <br />
      <br />
      <hr />
      <br />

      {error && <p className="error">{error}</p>}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
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
            name="incoming"
            value="false"
            checked={newCall.incoming === false}
            onChange={handleRadioChange}
            style={{ marginRight: "0.5rem" }}
          />{" "}
          <img
            src={OutGoing}
            alt="Outgoing"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
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
            name="incoming"
            value="true"
            checked={newCall.incoming === true}
            onChange={handleRadioChange}
            style={{ marginRight: "0.5rem" }}
          />
          <img
            src={Incoming}
            alt="Incoming"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          />
          આવેલ ફોન
        </label>
      </div>

      <br />
      <hr />
      <br />

      <div className="form-field">
        <label htmlFor="whatBusiness" className="form-label">
          A{") "} {/* What business did you call for?  */}
          કયુ કામ વસ્તુ માટે ફોન કરેલ
        </label>
        <input
          list="service-options"
          type="text"
          id="whatBusiness"
          name="whatBusiness"
          className="form-input"
          value={newCall.whatBusiness}
          onChange={handleChange}
        />

        <datalist id="service-options">
          {services?.map((service, index) => (
            <option key={index} value={service} />
          ))}
        </datalist>
      </div>

      <div className="form-field">
        <label htmlFor="workVillage" className="form-label">
          B{") "} {/* Which village do you want to work for ? */}
          કયા ગામનું કામ કરવાનું છે
        </label>
        <input
          type="text"
          id="workVillage"
          name="workVillage"
          className="form-input"
          value={newCall.workVillage}
          onChange={handleChange}
          style={{ maxWidth: "200px" }}
        />
      </div>

      <div className="form-field">
        <label htmlFor="clientAnswer" className="form-label">
          C{") "}
          {/* What did the customer/client answer ? / */}
          જવાબ શું આપ્યો કસ્ટમર / ગ્રાહક
        </label>
        <input
          list="answer-option"
          type="text"
          id="clientAnswer"
          name="clientAnswer"
          className="form-input"
          value={newCall.clientAnswer}
          onChange={handleChange}
        />

        <datalist id="answer-option">
          {answers?.map((answer, index) => (
            <option key={index} value={answer} />
          ))}
        </datalist>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: ".5rem",
        }}
      >
        <div className="form-field" style={{ maxWidth: "100px" }}>
          <label htmlFor="numberOfHouses" className="form-label">
            D{") "} {/* How many households/villages are there? / */}
            ઘર/ ખાતા ગામના કેટલા છે
          </label>
          <input
            type="text"
            id="numberOfHouses"
            name="numberOfHouses"
            className="form-input"
            value={newCall.numberOfHouses}
            onChange={(e) => {
              handleChange(e);

              setCallHistory((prev) => [
                ...prev,
                {
                  ...newCall,
                  estimatedBill:
                    Number(newCall?.numberOfHouses) && Number(newCall?.price)
                      ? Number(newCall?.numberOfHouses) * Number(newCall?.price)
                      : "",
                },
              ]);
            }}
            maxLength="6"
          />
        </div>

        <div className="form-field" style={{ maxWidth: "65px" }}>
          <label htmlFor="price" className="form-label">
            E{") "} {/* Price per household account /  */}
            ભાવ ઘર ખાતા દીઠ
          </label>
          <input
            type="text"
            id="price"
            name="price"
            className="form-input"
            value={newCall.price}
            onChange={(e) => {
              handleChange(e);

              setCallHistory((prev) => [
                ...prev,
                {
                  ...newCall,
                  estimatedBill:
                    Number(newCall?.numberOfHouses) && Number(newCall?.price)
                      ? Number(newCall?.numberOfHouses) * Number(newCall?.price)
                      : "",
                },
              ]);
            }}
            maxLength="3"
          />
        </div>

        <div className="form-field" style={{ maxWidth: "140px" }}>
          <label htmlFor="estimatedBill" className="form-label">
            F{") "} {/* Estimated bill amount Rs. / */}
            અંદાજીત બીલ રકમ રૂ
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

        <div className="form-field" style={{ maxWidth: "130px" }}>
          <label htmlFor="budget" className="form-label">
            G{") "}
            {/* How much money can the customer afford to pay for the
          house/account? / */}
            કસ્ટમરને કેટલા પૈસા સુધી પોસાય ઘર/ખાતા
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="form-field">
          <label htmlFor="dateOfCall" className="form-label">
            H{") "} {/* Date of call Telecaller /  */}
            ફોન કર્યા તારીખ ટેલીકોલર
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
          <label htmlFor="reminderDate" className="form-label">
            I{") "}
            ગ્રાહકને ફરી કોલ કરવો (Reminder date/Follow Up.)
          </label>
          <input
            type="date"
            id="reminderDate"
            name="reminderDate"
            className="form-input"
            value={newCall.reminderDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="meetingDate" className="form-label">
            J{") "} {/* Meeting date: Meet in person. / */}
            મીટીંગ તારીખ રૂબરુ મળવા જવુ
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
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
          onClick={() => handleShareCall(newCall, data)}
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: ".5rem",
            padding: "1rem",
          }}
        >
          <img
            src={WhatsappIcon}
            alt="Whatsapp Number"
            style={{
              width: "20px",
              height: "20px",
              background: "#fff",
              borderRadius: "50px",
              borderBottomLeftRadius: "0px",
            }}
          />{" "}
          Share Call Detail
        </button>

        <button
          type="submit"
          className="submit-button"
          style={{
            maxWidth: "fit-content",
            margin: 0,
            padding: "1rem",
            minWidth: "120px",
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      <br />
      <br />
    </form>
  );
};

export default AddCall;
