// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import apiPath from "../../isProduction";
// import { toast } from "react-toastify";
// import axios from "axios";

// const UpdateStatus = () => {
//   const { id } = useParams();

//   const [project, setProject] = useState({});
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const navigation = useNavigate();

//   // Track the original status from the DB to lock it if it's already completed or cancelled
//   const [initialStatus, setInitialStatus] = useState("");

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const url = await apiPath();
//       const res = await fetch(`${url}/api/users`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }
//       const data = await res.json();

//       const usersWithWork = data.map((user) => ({
//         ...user,
//         work: user.work || { gaam: "", taluka: "", district: "" },
//       }));
//       setUsers(usersWithWork);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//       toast.error("સ્ટાફ ડેટા લાવવામાં નિષ્ફળ.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   async function fetchProject() {
//     setLoading(true);
//     try {
//       const url = await apiPath();
//       const data = await axios.get(`${url}/api/work/project/${id}`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const projectData = data?.data?.data || {};
//       setProject(projectData);

//       // Save the original status when data loads
//       setInitialStatus(projectData?.other?.status || "");

//       toast.success("Project loaded successfully");
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//       toast.error(`Error Fetching Projects: ${error}`);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchProject();
//     fetchUsers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   function handleUpdate(e) {
//     setProject((prevProject) => ({
//       ...prevProject,
//       other: { ...prevProject.other, [e.target.name]: e.target.value },
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const url = await apiPath();
//       const response = await axios.put(
//         `${url}/api/work/project/status/${id}`,
//         project,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       if (response.status === 200 || response.status === 201) {
//         toast.success(
//           "માહિતી સફળતાપૂર્વક સેવ થઈ ગઈ છે! (Updated Successfully)",
//         );
//         // Update the lock condition upon successful save
//         setInitialStatus(project?.other?.status);

//         switch (project?.other?.status) {
//           case "completed":
//             navigation("/projects/final");
//             break;
//           case "cancelled":
//             navigation("/projects/cancled");
//             break;
//           case "working":
//             navigation("/projects/current");
//             break;
//           default:
//             navigation("/projects/first");
//             break;
//         }
//       }
//     } catch (error) {
//       console.error("Error updating project:", error);
//       toast.error("માહિતી સેવ કરવામાં ભૂલ આવી. (Error during update)");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Determine if the status should be locked based on the original DB value
//   // const isStatusLocked = ["completed", "cancelled"].includes(initialStatus);

//   return (
//     <div className="max-w-2xl mx-auto my-10 p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
//       {/* Header Section */}
//       <div className="mb-8 border-b border-gray-200 pb-5">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Gaam: <span className="text-indigo-600">{project?.spot?.gaam}</span>
//         </h1>
//         <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 font-medium">
//           <h2 className="flex items-center gap-1">
//             <span className="text-gray-400">Taluka:</span>{" "}
//             {project?.spot?.taluka}
//           </h2>
//           <h2 className="flex items-center gap-1">
//             <span className="text-gray-400">District:</span>{" "}
//             {project?.spot?.district}
//           </h2>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Updates Field */}
//         <div>
//           <label
//             htmlFor="updates"
//             className="block text-sm font-semibold text-gray-700 mb-1"
//           >
//             Updates (સ્થિતિ)
//           </label>
//           <input
//             value={project?.other?.updates || ""}
//             onChange={handleUpdate}
//             type="text"
//             id="updates"
//             name="updates"
//             list="update-suggestions"
//             placeholder="Type or select an update..."
//             className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
//           />
//           <datalist id="update-suggestions">
//             <option value="સરપંચ સાથે વાત કરી કામ શરૂ કરવું" />
//             <option value="કામ નક્કિ કરવું સરપંચ સાથે રુબરુ મળવું" />
//           </datalist>
//         </div>

//         {/* Status Radio Group */}
//         <div>
//           <div className="flex items-center justify-between mb-3">
//             <label className="block text-sm font-semibold text-gray-700">
//               Status
//             </label>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             {["working", "completed", "cancelled"].map((statusOption) => {
//               const isSelected = project?.other?.status === statusOption;

//               // Define dynamic colors based on the status option
//               let colors = {
//                 text: "text-blue-600",
//                 ring: "focus:ring-blue-500",
//                 hoverText: "group-hover:text-blue-600",
//                 selectedBg: "bg-blue-50 border-blue-300",
//                 selectedText: "text-blue-700",
//               };

//               if (statusOption === "completed") {
//                 colors = {
//                   text: "text-green-600",
//                   ring: "focus:ring-green-500",
//                   hoverText: "group-hover:text-green-600",
//                   selectedBg: "bg-green-50 border-green-300",
//                   selectedText: "text-green-700",
//                 };
//               } else if (statusOption === "cancelled") {
//                 colors = {
//                   text: "text-red-600",
//                   ring: "focus:ring-red-500",
//                   hoverText: "group-hover:text-red-600",
//                   selectedBg: "bg-red-50 border-red-300",
//                   selectedText: "text-red-700",
//                 };
//               }

//               return (
//                 <label
//                   key={statusOption}
//                   className={`flex-1 flex items-center justify-center sm:justify-start px-4 py-3 rounded-lg border transition-all group ${
//                     isSelected
//                       ? colors.selectedBg
//                       : "bg-white border-gray-200 hover:bg-gray-50"
//                   } cursor-pointer`}
//                 >
//                   <input
//                     type="radio"
//                     name="status"
//                     value={statusOption}
//                     checked={isSelected}
//                     onChange={handleUpdate}
//                     className={`w-4 h-4 bg-gray-100 border-gray-300 focus:ring-2 ${colors.text} ${colors.ring} cursor-pointer`}
//                   />
//                   <span
//                     className={`ml-2.5 text-sm font-semibold capitalize transition-colors ${
//                       isSelected
//                         ? colors.selectedText
//                         : `text-gray-600 ${colors.hoverText}`
//                     }`}
//                   >
//                     {statusOption}
//                   </span>
//                 </label>
//               );
//             })}
//           </div>
//         </div>

//         {/* Remarks Field */}
//         <div>
//           <label
//             htmlFor="remarks"
//             className="block text-sm font-semibold text-gray-700 mb-1"
//           >
//             Remarks (નોંધ / રિમાર્કસ)
//           </label>
//           <input
//             value={project?.other?.remarks || ""}
//             onChange={handleUpdate}
//             type="text"
//             id="remarks"
//             name="remarks"
//             placeholder="Enter any additional remarks..."
//             className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
//           />
//         </div>

//         {/* Surveyor Assignment Select */}
//         <div>
//           <label
//             htmlFor="surveyor"
//             className="block text-sm font-semibold text-gray-700 mb-1"
//           >
//             Assign Surveyor (સર્વેયર)
//           </label>
//           <select
//             id="surveyor"
//             name="surveyor"
//             value={project?.other?.surveyor || ""}
//             onChange={handleUpdate}
//             className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
//           >
//             <option value="" disabled>
//               -- Select Surveyor --
//             </option>
//             {users?.length === 0 ? (
//               <option disabled>Loading Staff Data...</option>
//             ) : (
//               users
//                 ?.filter((user) => user.role === "surveyor")
//                 ?.map((user) => (
//                   <option key={user._id} value={user._id}>
//                     {user.name}
//                   </option>
//                 ))
//             )}
//           </select>
//         </div>

//         {/* Submit Button */}
//         <div className="pt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
//           >
//             {loading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Saving Data...
//               </>
//             ) : (
//               "Submit Update"
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateStatus;

import React, { useEffect, useState } from "react";
// react-router-dom ના બદલે અહી સાદું ફંક્શન વાપરશું કારણ કે કમ્પાઇલરમાં રાઉટીંગ નથી હોતું.
// import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, Info } from "lucide-react";
import apiPath from "../../isProduction";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const stepsConfig = [
  { key: "a", label: "8. ઓડર વેલ્યુએશન ભર્યું" },
  { key: "b", label: "9. સર્વે કામ શરૂ કર્યું" },
  { key: "c", label: "10. સર્વેયર કામ પુર્ણ કર્યું" },
  { key: "d", label: "11. કાચી યાદિ રેકર્ડ બનાવ્યા" },
  { key: "e", label: "12. મંત્રીને કાચી યાદિ રેકર્ડ મોકલ્યા" },
  { key: "f", label: "13. સુધારો પાકી યાદિ રેકર્ડ બનાવ્યા" },
  { key: "g", label: "14. રેકર્ડ પરત મંત્રીને સોપ્યા/ આપ્યા" },
];

export default function UpdateStatus() {
  const { id } = useParams();
  const navigation = useNavigate();

  // ડેમો માટે હાર્ડકોડ કરેલો કેસ નંબર
  const caseNo = id;

  // ડેમો નેવિગેશન ફંક્શન
  const goBack = () => {
    window.history.back();
  };

  // ---------------------------------------------------------
  // State Management
  // ---------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);

  const [project, setProject] = useState({});

  const [projectInfo, setProjectInfo] = useState({
    gam: "",
    taluko: "",
    jillo: "",
  });

  const [formData, setFormData] = useState({
    status: "",
    remarks: "",
    progress: {
      a: { date: "", id: "" },
      b: { date: "", id: "" },
      c: { date: "", id: "" },
      d: { date: "", id: "" },
      e: { date: "", id: "" },
      f: { date: "", id: "" },
      g: { date: "", id: "" },
    },
  });

  useEffect(() => {
    setProject((prev) => {
      const updated = {
        ...prev,
        other: {
          ...(prev?.other || {}),
          ...(formData || {}),
        },
      };

      console.log(updated);

      return updated;
    });
  }, [formData]);

  // ---------------------------------------------------------
  // Fetch Data on Component Mount
  // ---------------------------------------------------------
  useEffect(() => {
    fetchInitialData();
  }, [caseNo]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // API call સિમ્યુલેટ કરવા માટે ટાઇમઆઉટ
      const url = await apiPath();
      const data = await axios.get(`${url}/api/work/project/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const projectData = data?.data?.data || {};

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
      const data2 = await res.json();

      const usersWithWork = data2.map((user) => ({
        ...user,
        work: user.work || { gaam: "", taluka: "", district: "" },
      }));

      setUsers(usersWithWork);

      setProject(projectData || {});

      // 2. Mock Work Data
      setProjectInfo({
        gam: projectData?.spot?.gaam || "",
        taluko: projectData?.spot?.taluka || "",
        jillo: projectData?.spot?.district || "",
      });

      setFormData({
        status: projectData?.other?.status || "",
        remarks: projectData?.other?.remarks || "",
        progress: {
          a: {
            date: projectData?.other?.progress?.a?.date || "",
            id: projectData?.other?.progress?.a?.id || "",
          },
          b: {
            date: projectData?.other?.progress?.b?.date || "",
            id: projectData?.other?.progress?.b?.id || "",
          },
          c: {
            date: projectData?.other?.progress?.c?.date || "",
            id: projectData?.other?.progress?.c?.id || "",
          },
          d: {
            date: projectData?.other?.progress?.d?.date || "",
            id: projectData?.other?.progress?.d?.id || "",
          },
          e: {
            date: projectData?.other?.progress?.e?.date || "",
            id: projectData?.other?.progress?.e?.id || "",
          },
          f: {
            date: projectData?.other?.progress?.f?.date || "",
            id: projectData?.other?.progress?.f?.id || "",
          },
          g: {
            date: projectData?.other?.progress?.g?.date || "",
            id: projectData?.other?.progress?.g?.id || "",
          },
        },
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("ડેટા લાવવામાં નિષ્ફળતા.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------
  const handleProgressChange = (stepKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [stepKey]: {
          ...prev.progress[stepKey],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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
  };

  // ---------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">માહિતી લોડ થઈ રહી છે...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Area */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              title="પાછા જાઓ"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Update Status / Progress
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Case No:{" "}
                <span className="font-semibold text-blue-600">{caseNo}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "સેવ થઈ રહ્યું છે..." : "Save Changes"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Section: Basic Info & Main Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold">બેઝિક માહિતી અને સ્ટેટસ</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  ગામ
                </label>
                <div className="text-gray-900 font-semibold bg-gray-50 p-2.5 rounded border border-gray-200">
                  {projectInfo.gam || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  તાલુકો
                </label>
                <div className="text-gray-900 font-semibold bg-gray-50 p-2.5 rounded border border-gray-200">
                  {projectInfo.taluko || "-"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  જિલ્લો
                </label>
                <div className="text-gray-900 font-semibold bg-gray-50 p-2.5 rounded border border-gray-200">
                  {projectInfo.jillo || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Current Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none font-medium bg-white"
                  required
                >
                  <option value="final">Final</option>
                  <option value="current">Current (ચાલુ છે)</option>
                  <option value="completed">Completed (પૂર્ણ)</option>
                  <option value="canceled">Canceled (રદ્દ)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Middle Section: Progress Tracker Grid */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3">
              Work Progress (આકારણીના કામની સ્થિતિ)
            </h2>

            <div className="space-y-5">
              {stepsConfig.map((step) => (
                <div
                  key={step.key}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-blue-50/30 transition-colors"
                >
                  {/* Step Label */}
                  <div className="md:w-1/3">
                    <span className="font-semibold text-gray-800 text-sm">
                      {step.label}
                    </span>
                  </div>

                  {/* Date Input */}
                  <div className="md:w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      તારીખ (Date)
                    </label>
                    <input
                      type="date"
                      value={formData.progress[step.key].date}
                      onChange={(e) =>
                        handleProgressChange(step.key, "date", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    />
                  </div>

                  {/* Staff Select */}
                  <div className="md:w-1/3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      સ્ટાફ (Staff)
                    </label>
                    <select
                      value={formData.progress[step.key].id}
                      onChange={(e) =>
                        handleProgressChange(step.key, "id", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                      <option value="">-- સ્ટાફ પસંદ કરો --</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} {u.role ? `(${u.role})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section: Remarks */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
              Remarks (નોંધ)
            </h2>
            <textarea
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              placeholder="કોઈ વધારાની નોંધ અહીં લખો..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            ></textarea>
          </div>
        </form>
      </div>
    </div>
  );
}
