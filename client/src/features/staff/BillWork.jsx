import React, { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import BASE_URL from "../../config";

const BillWork = () => {
  const [workEntries, setWorkEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWork, setCurrentWork] = useState(null); // Work entry being edited
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    gaam: "",
    taluko: "",
    district: "",
  });
  const [actionMessage, setActionMessage] = useState(""); // For success/error messages

  // --- Fetch Work Entries ---
  const fetchWorkEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${await apiPath()}/api/work/bill`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setWorkEntries(result.data);
    } catch (err) {
      console.error("Error fetching work entries:", err);
      setError("કાર્યની વિગતો લાવવામાં નિષ્ફળ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkEntries();
  }, []);

  // --- Modal Control ---
  const openModal = (work = null) => {
    setCurrentWork(work); // Null for Add, object for Edit
    if (work) {
      setFormData({
        id: work?.id || "",
        password: work?.password || "",
        gaam: work?.gaam || "",
        taluko: work?.taluko || "",
        district: work?.district || "",
      });
    } else {
      setFormData({
        id: "",
        password: "",
        gaam: "",
        taluko: "",
        district: "",
      });
    }
    setIsModalOpen(true);
    setActionMessage("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentWork(null);
    setFormData({
      id: "",
      password: "",
      gaam: "",
      taluko: "",
      district: "",
    });
  };

  // --- Form Input Change Handler ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Add/Edit Work Entry ---
  const handleAddEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setActionMessage("");

    if (
      !formData.id.trim() ||
      !formData.password.trim() ||
      !formData.gaam.trim() ||
      !formData.taluko.trim() ||
      !formData.district.trim()
    ) {
      setActionMessage("કૃપા કરીને બધા ફરજિયાત ક્ષેત્રો ભરો.");
      setLoading(false);
      return;
    }

    try {
      const method = currentWork ? "PUT" : "POST";
      const endpoint = currentWork
        ? `${BASE_URL}/new-work/${currentWork.sheetId}` // Use sheetId as identifier
        : `${BASE_URL}/new-work`;

      const payload = {
        id: formData.id.trim(),
        password: formData.password.trim(),
        gaam: formData.gaam.trim(),
        taluko: formData.taluko.trim(),
        district: formData.district.trim(),
      };

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setActionMessage(
        `કાર્ય સફળતાપૂર્વક ${currentWork ? "અપડેટ" : "ઉમેરવામાં"} આવ્યું: ${
          result.message
        }`
      );
      closeModal();
      fetchWorkEntries(); // Refresh list
    } catch (err) {
      console.error("Error adding/editing work:", err);
      setActionMessage(
        `કાર્ય ${currentWork ? "અપડેટ" : "ઉમેરવામાં"} નિષ્ફળ: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Work Entry ---
  const handleDeleteWork = async (sheetId) => {
    if (!window.confirm("શું તમે ખરેખર આ કાર્ય એન્ટ્રી દૂર કરવા માંગો છો?")) {
      return;
    }

    setLoading(true);
    setActionMessage("");
    try {
      const response = await fetch(`${await apiPath()}/api/work/${sheetId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setActionMessage(`કાર્ય સફળતાપૂર્વક દૂર થયું: ${result.message}`);
      fetchWorkEntries(); // Refresh list
    } catch (err) {
      console.error("Error deleting work:", err);
      setActionMessage(`કાર્ય દૂર કરવામાં નિષ્ફળ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  async function fetchData(work) {
    setLoading(true);

    const login_id = work.id;
    const password = work.password;

    try {
      const response = await fetch(`${BASE_URL}/fetch-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_id, password }),
      });

      const result = await response.json();
      console.log(result);
    } catch (err) {
      window.alert("Server is not Rechable:", err);
      setError("Please Start your Local Server", err);
    }

    setLoading(false);
  }

  return (
    <div className="p-8">
      {" "}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Gramsuvidha Bill Work Management
      </h2>
      {actionMessage && (
        <div
          className={`p-4 mb-6 rounded-lg text-white ${
            actionMessage.includes("નિષ્ફળ") ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {actionMessage}
        </div>
      )}
      {/* Add New Work Button */}
      <button
        onClick={() => openModal()}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={loading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-plus"
        >
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        Add new Work
      </button>
      {/* List of Work Entries */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Work</h3>
        {loading && (
          <p className="text-blue-600">કાર્યની વિગતો લોડ થઈ રહી છે...</p>
        )}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && workEntries.length === 0 && !error && (
          <p className="text-gray-500">કોઈ કાર્યની વિગતો મળી નથી.</p>
        )}
        {!loading && workEntries.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Site ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Password
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ગામ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    તાલુકો
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    જિલ્લો
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workEntries.map((work) => (
                  <tr key={work.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {work.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {work?.password || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {work?.gaam || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {work?.taluko || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {work?.district || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            fetchData(work);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                        >
                          <span className="ml-1">Fetch Data</span>
                        </button>
                        {/* <button
                          onClick={() => openModal(work)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-edit"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          <span className="ml-1">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteWork(work.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-trash-2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                          <span className="ml-1">Delete</span>
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Add/Edit Work Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {currentWork ? "કાર્ય સંપાદિત કરો" : "નવું કાર્ય ઉમેરો"}
            </h3>
            <form onSubmit={handleAddEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="id"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Site ID:
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={currentWork !== null || loading} // Disable sheetId if editing
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Password:
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="gaam"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    ગામ:
                  </label>
                  <input
                    type="text"
                    id="gaam"
                    name="gaam"
                    value={formData.gaam}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="taluko"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    તાલુકો:
                  </label>
                  <input
                    type="text"
                    id="taluko"
                    name="taluko"
                    value={formData.taluko}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="district"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    જિલ્લો:
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out"
                  disabled={loading}
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "સાચવાઈ રહ્યું છે..." : "સાચવો"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillWork;
