import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiPath from "../../isProduction";

const Staff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState({}); // State to manage password visibility per user ID
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [currentStaffForWork, setCurrentStaffForWork] = useState(null); // Staff member whose work is being edited/assigned

  const [workSheetId, setWorkSheetId] = useState();

  const [actionMessage, setActionMessage] = useState(""); // For success/error messages after work operations

  const navigate = useNavigate();

  // Function to fetch all users/staff
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${await apiPath()}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      const usersWithWork = data.map((user) => ({
        ...user,
        work: user.work || { gaam: "", taluka: "", district: "" },
      }));
      setUsers(usersWithWork);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("સ્ટાફ ડેટા લાવવામાં નિષ્ફળ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle opening the work assignment/edit modal
  const openWorkModal = (staff) => {
    setCurrentStaffForWork(staff);
    setWorkSheetId(staff.workSheetId || "");
    setIsWorkModalOpen(true);
    setActionMessage("");
  };

  // Handle closing the work assignment/edit modal
  const closeWorkModal = () => {
    setIsWorkModalOpen(false);
    setCurrentStaffForWork(null);
    setWorkSheetId("");
  };

  // Handle assigning or editing work
  const handleAssignEditWork = async () => {
    if (!currentStaffForWork) return;
    setLoading(true);
    setActionMessage("");

    try {
      const method =
        currentStaffForWork.workSheetId || currentStaffForWork.work
          ? "PUT"
          : "POST";

      const endpoint = `${await apiPath()}/api/users/work/${
        currentStaffForWork?._id
      }`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ workSheetId }), // ⬅️ send only this
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setActionMessage(
        `કાર્ય સફળતાપૂર્વક ${method === "PUT" ? "સંપાદિત" : "સોંપાયેલ"}: ${
          result.message
        }`
      );
      closeWorkModal();
      fetchUsers();
    } catch (err) {
      console.error("Error assigning/editing work:", err);
      setActionMessage(`કાર્ય નિષ્ફળ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting work
  const handleDeleteWork = async (staffId) => {
    if (!window.confirm("શું તમે ખરેખર આ સ્ટાફનું કાર્ય દૂર કરવા માંગો છો?")) {
      return;
    }

    setLoading(true);
    setActionMessage("");
    try {
      const response = await fetch(
        `${await apiPath()}/api/users/work/${staffId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      setActionMessage(`કાર્ય સફળતાપૂર્વક દૂર થયું: ${result.message}`);
      fetchUsers(); // Refresh staff list
    } catch (err) {
      console.error("Error deleting work:", err);
      setActionMessage(`કાર્ય દૂર કરવામાં નિષ્ફળ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const [workEntries, setWorkEntries] = useState([]);
  const [billWorks, setBillWorks] = useState([]);

  // --- Fetch Work Entries ---
  const fetchWorkEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${await apiPath()}/api/work`, {
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

  const fetchBillWorks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${await apiPath()}/api/work/bill`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("here is the data", result.data);
      setBillWorks(result.data);
    } catch (err) {
      console.error("Error fetching work entries:", err);
      setError("Bill na કાર્યની વિગતો લાવવામાં નિષ્ફળ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkEntries();
    fetchBillWorks();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Staff Management
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

      {/* All Staff Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Staff</h3>
        {loading && <p className="text-blue-600">Loading Staff...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && users.length === 0 && !error && (
          <p className="text-gray-500">No Staff Found!</p>
        )}
        {!loading && users.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((staff) => (
                  <tr key={staff._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {staff.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {staff.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        value={staff.password}
                        readOnly
                        type={showPassword[staff.id] ? "text" : "password"}
                        onMouseEnter={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            [staff.id]: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            [staff.id]: false,
                          }))
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 w-full max-w-[120px] focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      style={{ display: "flex", gap: "5px" }}
                    >
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        style={{ whiteSpace: "nowrap", fontSize: "10px" }}
                        onClick={() => {
                          navigate(`/staff/view/${staff._id}`);
                        }}
                      >
                        View
                      </button>

                      <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded"
                        style={{ whiteSpace: "nowrap", fontSize: "10px" }}
                        onClick={() => {
                          navigate(`/staff/edit/${staff._id}`);
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Button */}
      <button
        onClick={() => {
          navigate("/staff/add");
        }}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
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
          className="lucide lucide-user-plus"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
        <span>Add Staff</span>
      </button>

      <hr className="my-8 border-t-2 border-gray-200" />

      {/* Surveyors Table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Survayors</h3>
        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading &&
          users.filter((user) => user.role === "surveyor").length === 0 &&
          !error && <p className="text-gray-500">No Survayors Found!</p>}
        {!loading &&
          users.filter((user) => user.role === "surveyor").length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Work
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
                  {users
                    .filter((user) => user.role === "surveyor")
                    .map((staff) => (
                      <tr key={staff.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(() => {
                            const assignedEntry = workEntries.find(
                              (entry) => entry._id === staff.work
                            );
                            if (!assignedEntry)
                              return (
                                <p className="text-gray-400">Not Assigned</p>
                              );

                            return (
                              <>
                                <p>ગામ: {assignedEntry.spot?.gaam || "N/A"}</p>
                                <p>
                                  તાલુકો: {assignedEntry.spot?.taluka || "N/A"}
                                </p>
                                <p>
                                  જિલ્લો:{" "}
                                  {assignedEntry.spot?.district || "N/A"}
                                </p>
                              </>
                            );
                          })()}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openWorkModal(staff)}
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200 ${
                                workEntries.find((e) => e._id === staff.work)
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
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
                              <span className="ml-1">
                                {workEntries.find((e) => e._id === staff.work)
                                  ? "Edit"
                                  : "Assign"}
                              </span>
                            </button>

                            {workEntries.find((e) => e._id === staff.work) && (
                              <button
                                onClick={() => handleDeleteWork(staff._id)}
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
                                  setCurrentStaffForWork
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash-2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                                <span className="ml-1">Remove</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      <hr className="my-8 border-t-2 border-gray-200" />

      {/* Biller table */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Billers</h3>
        {loading && <p className="text-blue-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading &&
          users.filter((user) => user.role === "biller").length === 0 &&
          !error && <p className="text-gray-500">No Billers Found!</p>}
        {!loading &&
          users.filter((user) => user.role === "biller").length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Work
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
                  {users
                    .filter((user) => user.role === "biller")
                    .map((staff) => (
                      <tr key={staff.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {staff.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(() => {
                            const assignedEntry = billWorks.find(
                              (entry) => entry.id === staff.work
                            );
                            if (!assignedEntry)
                              return (
                                <p className="text-gray-400">Not Assigned</p>
                              );

                            return (
                              <>
                                <p>ગામ: {assignedEntry?.gaam || "N/A"}</p>
                                <p>તાલુકો: {assignedEntry?.taluko || "N/A"}</p>
                                <p>
                                  જિલ્લો: {assignedEntry?.district || "N/A"}
                                </p>
                              </>
                            );
                          })()}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openWorkModal(staff)}
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors duration-200 ${
                                billWorks.find((e) => e.id === staff.work)
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
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
                              <span className="ml-1">
                                {billWorks.find((e) => e.id === staff.work)
                                  ? "Edit"
                                  : "Assign"}
                              </span>
                            </button>

                            {billWorks.find((e) => e.id === staff.work) && (
                              <button
                                onClick={() => handleDeleteWork(staff._id)}
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
                                <span className="ml-1">Remove</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Work Assignment/Edit Modal */}
      {isWorkModalOpen && currentStaffForWork && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg sha6dow-xl w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {currentStaffForWork.work &&
              (currentStaffForWork.work.gaam ||
                currentStaffForWork.work.taluka ||
                currentStaffForWork.work.district)
                ? "Edit Work"
                : "Assign Work"}{" "}
              <span className="text-blue-600">
                - {currentStaffForWork.name}
                <br /> ({currentStaffForWork?.role})
              </span>
            </h3>
            <div className="space-y-4">
              <select
                id="sheetId"
                name="sheetId"
                value={workSheetId}
                onChange={(e) => setWorkSheetId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                  Select Sheet Id
                </option>

                {currentStaffForWork?.role === "biller"
                  ? billWorks.map((workEntry) => (
                      <option key={workEntry.id} value={workEntry.id}>
                        {workEntry.id} - {workEntry?.gaam}, {workEntry?.taluko}
                      </option>
                    ))
                  : workEntries.map((workEntry) => (
                      <option key={workEntry._id} value={workEntry._id}>
                        {workEntry.sheetId} - {workEntry.spot?.gaam},{" "}
                        {workEntry.spot?.taluka}
                      </option>
                    ))}
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={closeWorkModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out"
                disabled={loading}
              >
                Cancle
              </button>
              <button
                onClick={handleAssignEditWork}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
