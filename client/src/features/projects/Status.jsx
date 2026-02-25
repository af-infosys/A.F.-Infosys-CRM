import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiPath from "../../isProduction";
import { toast } from "react-toastify";
import axios from "axios";

const UpdateStatus = () => {
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigate();

  // Track the original status from the DB to lock it if it's already completed or cancelled
  const [initialStatus, setInitialStatus] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = await apiPath();
      const res = await fetch(`${url}/api/users`, {
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
      toast.error("સ્ટાફ ડેટા લાવવામાં નિષ્ફળ.");
    } finally {
      setLoading(false);
    }
  };

  async function fetchProject() {
    setLoading(true);
    try {
      const url = await apiPath();
      const data = await axios.get(`${url}/api/work/project/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const projectData = data?.data?.data || {};
      setProject(projectData);

      // Save the original status when data loads
      setInitialStatus(projectData?.other?.status || "");

      toast.success("Project loaded successfully");
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProject();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleUpdate(e) {
    setProject((prevProject) => ({
      ...prevProject,
      other: { ...prevProject.other, [e.target.name]: e.target.value },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const url = await apiPath();
      const response = await axios.put(
        `${url}/api/work/project/status/${id}`,
        project,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(
          "માહિતી સફળતાપૂર્વક સેવ થઈ ગઈ છે! (Updated Successfully)",
        );
        // Update the lock condition upon successful save
        setInitialStatus(project?.other?.status);

        switch (project?.other?.status) {
          case "completed":
            navigation("/projects/final");
            break;
          case "cancelled":
            navigation("/projects/cancled");
            break;
          case "working":
            navigation("/projects/current");
            break;
          default:
            navigation("/projects/first");
            break;
        }
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("માહિતી સેવ કરવામાં ભૂલ આવી. (Error during update)");
    } finally {
      setLoading(false);
    }
  }

  // Determine if the status should be locked based on the original DB value
  const isStatusLocked = ["completed", "cancelled"].includes(initialStatus);

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Gaam: <span className="text-indigo-600">{project?.spot?.gaam}</span>
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 font-medium">
          <h2 className="flex items-center gap-1">
            <span className="text-gray-400">Taluka:</span>{" "}
            {project?.spot?.taluka}
          </h2>
          <h2 className="flex items-center gap-1">
            <span className="text-gray-400">District:</span>{" "}
            {project?.spot?.district}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Updates Field */}
        <div>
          <label
            htmlFor="updates"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Updates (સ્થિતિ)
          </label>
          <input
            value={project?.other?.updates || ""}
            onChange={handleUpdate}
            type="text"
            id="updates"
            name="updates"
            list="update-suggestions"
            placeholder="Type or select an update..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          <datalist id="update-suggestions">
            <option value="સરપંચ સાથે વાત કરી કામ શરૂ કરવું" />
            <option value="કામ નક્કિ કરવું સરપંચ સાથે રુબરુ મળવું" />
          </datalist>
        </div>

        {/* Status Radio Group */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-700">
              Status
            </label>
            {isStatusLocked && (
              <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                🔒 Locked
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {["working", "completed", "cancelled"].map((statusOption) => {
              const isSelected = project?.other?.status === statusOption;

              // Define dynamic colors based on the status option
              let colors = {
                text: "text-blue-600",
                ring: "focus:ring-blue-500",
                hoverText: "group-hover:text-blue-600",
                selectedBg: "bg-blue-50 border-blue-300",
                selectedText: "text-blue-700",
              };

              if (statusOption === "completed") {
                colors = {
                  text: "text-green-600",
                  ring: "focus:ring-green-500",
                  hoverText: "group-hover:text-green-600",
                  selectedBg: "bg-green-50 border-green-300",
                  selectedText: "text-green-700",
                };
              } else if (statusOption === "cancelled") {
                colors = {
                  text: "text-red-600",
                  ring: "focus:ring-red-500",
                  hoverText: "group-hover:text-red-600",
                  selectedBg: "bg-red-50 border-red-300",
                  selectedText: "text-red-700",
                };
              }

              return (
                <label
                  key={statusOption}
                  className={`flex-1 flex items-center justify-center sm:justify-start px-4 py-3 rounded-lg border transition-all group ${
                    isSelected
                      ? colors.selectedBg
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  } ${isStatusLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={statusOption}
                    checked={isSelected}
                    onChange={handleUpdate}
                    disabled={isStatusLocked}
                    className={`w-4 h-4 bg-gray-100 border-gray-300 focus:ring-2 ${colors.text} ${colors.ring} ${
                      isStatusLocked ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  />
                  <span
                    className={`ml-2.5 text-sm font-semibold capitalize transition-colors ${
                      isSelected
                        ? colors.selectedText
                        : `text-gray-600 ${colors.hoverText}`
                    }`}
                  >
                    {statusOption}
                  </span>
                </label>
              );
            })}
          </div>
          {isStatusLocked && (
            <p className="text-xs text-gray-500 mt-2">
              આ પ્રોજેક્ટ પૂર્ણ અથવા રદ થઈ ગયો હોવાથી તમે સ્થિતિ બદલી શકતા નથી.
              (Status cannot be changed once completed or cancelled).
            </p>
          )}
        </div>

        {/* Remarks Field */}
        <div>
          <label
            htmlFor="remarks"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Remarks (નોંધ / રિમાર્કસ)
          </label>
          <input
            value={project?.other?.remarks || ""}
            onChange={handleUpdate}
            type="text"
            id="remarks"
            name="remarks"
            placeholder="Enter any additional remarks..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Surveyor Assignment Select */}
        <div>
          <label
            htmlFor="surveyor"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Assign Surveyor (સર્વેયર)
          </label>
          <select
            id="surveyor"
            name="surveyor"
            value={project?.other?.surveyor || ""}
            onChange={handleUpdate}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="" disabled>
              -- Select Surveyor --
            </option>
            {users?.length === 0 ? (
              <option disabled>Loading Staff Data...</option>
            ) : (
              users
                ?.filter((user) => user.role === "surveyor")
                ?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))
            )}
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving Data...
              </>
            ) : (
              "Submit Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStatus;
