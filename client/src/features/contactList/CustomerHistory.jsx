import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiPath from "../../isProduction";

// Helper function to parse JSON strings safely
const safeParse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON string:", e);
    return [];
  }
};

// Helper function to format a timestamp string to a readable date
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch (e) {
    console.error("Failed to format date:", e);
    return timestamp; // Return original if formatting fails
  }
};

const CustomerHistory = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const [customer, setCustomer] = useState(null);

  const fetchInfo = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/contactList/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setCustomer(result.data);
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
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Loading customer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-xl text-red-700">{error}</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Customer not found.</p>
      </div>
    );
  }

  // Parse JSON data from the customer array
  const callHistory = safeParse(customer[10]);
  const whatsappSent = safeParse(customer[14]);
  const whatsappReceived = safeParse(customer[15]);
  const createdBy = safeParse(customer[13]);
  const lastUpdated = safeParse(customer[18]);
  const isInterested = customer[16] === "TRUE";

  // Combine and sort WhatsApp messages by timestamp
  const allWhatsAppMessages = [
    ...whatsappReceived.map((msg) => ({ ...msg, type: "received" })),
    ...whatsappSent.map((msg) => ({ ...msg, type: "sent" })),
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header Section - Improved for responsiveness */}
        <div className="bg-gray-800 text-white p-6 flex flex-col sm:flex-row justify-between items-center sm:items-start">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 text-center sm:text-left mb-4 sm:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-yellow-400 mb-2 sm:mb-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h1 className="text-3xl font-bold">{customer[2] || "N/A"}</h1>
              <p className="text-gray-400">
                Customer ID: {customer[0] || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isInterested
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  isInterested ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              {isInterested ? "Interested" : "Not Interested"}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Contact and General Info Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 1a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Contact Details
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">Mobile:</span>{" "}
                {customer[3] || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">WhatsApp:</span>{" "}
                {customer[4] || "N/A"}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Location
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">Village:</span>{" "}
                {customer[6] || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">Taluko:</span>{" "}
                {customer[8] || "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Jillo:</span>{" "}
                {customer[9] || "N/A"}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM6 11a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zM8 15a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                </svg>
                Administrative Details
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">SR Number:</span>{" "}
                {customer[1] || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">Category:</span>{" "}
                {customer[5] || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">
                  Village of Charge:
                </span>{" "}
                {customer[7] || "N/A"}
              </p>
            </div>
          </div>

          {/* History and Activity Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Call History */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.087 11.087 0 006.103 6.103l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call History
              </h2>
              <div className="space-y-4">
                {callHistory.length > 0 ? (
                  callHistory.map((call, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">
                          {call.dateOfCall || "N/A"}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {call.incoming ? "Incoming Call" : "Outgoing Call"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">
                          Reason for Business:
                        </span>{" "}
                        {call.whatBusiness || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-semibold">
                          Client's Response:
                        </span>{" "}
                        {call.clientAnswer || "N/A"}
                      </p>
                      {call.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Logged on: {formatDate(call.createdAt.time)} by{" "}
                          {call.createdAt.name}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No call history available.
                  </p>
                )}
              </div>
            </div>

            {/* WhatsApp Activity */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm4.5 1a.5.5 0 00-.5.5v5a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-5a.5.5 0 00-.5-.5h-7z" />
                  <path d="M7 7.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-.5z" />
                  <path
                    fillRule="evenodd"
                    d="M12.5 12a.5.5 0 01.5.5v.5a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-.5a.5.5 0 01.5-.5h5z"
                    clipRule="evenodd"
                  />
                </svg>
                WhatsApp Activity
              </h2>

              {/* Combined and sorted messages */}
              <div className="space-y-2 max-h-80 overflow-y-auto p-2">
                {allWhatsAppMessages.length > 0 ? (
                  allWhatsAppMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.type === "received"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl max-w-xs md:max-w-md shadow-md text-gray-900 ${
                          msg.type === "received"
                            ? "bg-blue-200 rounded-bl-none"
                            : "bg-green-200 rounded-br-none"
                        }`}
                      >
                        <p className="text-sm">{msg.text || "N/A"}</p>
                        <p className="text-xs text-right mt-1 text-gray-600">
                          {formatDate(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    No WhatsApp messages available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-200 p-4 text-sm text-gray-600 text-center border-t">
          <p>
            <span className="font-medium">ઑફીસમા યાદી બનાવેલ તારીખ:</span>{" "}
            {customer[11] || "N/A"} |
            <span className="font-medium"> કમ્પની ને મળેલ તારીખ:</span>{" "}
            {customer[12] || "N/A"}
          </p>
          {createdBy && (
            <p className="mt-2">
              <span className="font-medium">Created By:</span> {createdBy.name}{" "}
              on {formatDate(createdBy.time)}
            </p>
          )}
          {lastUpdated && (
            <p className="mt-1">
              <span className="font-medium">Last Updated:</span>{" "}
              {lastUpdated.name} on {formatDate(lastUpdated.time)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;
