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

import { CheckCircle2, Clock3, Circle } from "lucide-react";
import React, { useEffect, useState } from "react";

function ProgressTracker({ progress }) {
  const steps = [
    {
      key: "a",
      title: "ઓડર વેલ્યુએશન ભર્યા તારીખ",
    },
    {
      key: "b",
      title: "સર્વે કામ શરૂ કર્યા તારીખ",
    },
    {
      key: "c",
      title: "સર્વેયર કામ પુર્ણ કર્યા તારીખ",
    },
    {
      key: "d",
      title: "કાચી યાદિ રેકર્ડ બનાવ્યા તારીખ",
    },
    {
      key: "e",
      title: "મંત્રીને કાચી યાદિ રેકર્ડ મોકલ્યા તારીખ",
    },
    {
      key: "f",
      title: "સુધારો પાકી યાદિ રેકર્ડ બનાવ્યા તારીખ",
    },
    {
      key: "g",
      title: "રેકર્ડ પરત મંત્રીને સોપ્યા/ આપ્યા તારીખ",
    },
  ];
  const completedCount = steps.filter(
    (step) => progress?.[step.key]?.date,
  ).length;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-0">
        {steps.map((step, index) => {
          const completed = !!progress?.[step.key]?.date;

          const current = !completed && index === completedCount;

          return (
            <div className="flex flex-col items-center text-center min-w-[170px] px-2">
              {/* Step */}
              <div className="flex flex-col items-center min-w-[70px]">
                {completed ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : current ? (
                  <Clock3 size={20} className="text-blue-600" />
                ) : (
                  <Circle size={20} className="text-gray-300" />
                )}
              </div>
              {/* {icon} */}

              <span className="font-bold text-xs mt-1">
                {step.key.toUpperCase()}
              </span>

              <span className="text-[11px] mt-2 leading-4 font-medium text-gray-700">
                {step.title}
              </span>

              <span className="text-[11px] text-blue-600 mt-2">
                {progress?.[step.key]?.date
                  ? new Date(progress[step.key].date).toLocaleDateString(
                      "en-GB",
                    )
                  : "--"}
              </span>

              <span
                className="text-[10px] text-gray-500 mt-1"
                title={progress?.[step.key]?.name}
              >
                {progress?.[step.key]?.name || "--"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UpdateStatus() {
  // ---------------------------------------------------------
  // State Management
  // ---------------------------------------------------------
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // ---------------------------------------------------------
  // Fetch Data on Component Mount
  // ---------------------------------------------------------
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // MOCK DATA: Matching the fields from the provided image
      const mockData = [
        {
          _id: 1,
          gam: "ડુંગર",
          taluko: "રાજુલા",
          jillo: "અમરેલી",
          caseNo: "CASE-2026-001",
          status: "Current", // a. Final, b. Current, c. Completed, d. Canceled
          progress: {
            a: { date: "2026-05-10", name: "મહેશભાઈ (Owner)" }, // ઓર્ડર વેલ્યુએશન
            b: { date: "2026-05-12", name: "યુનુશભાઈ (Surveyor)" }, // સર્વે શરૂ
            c: { date: "2026-05-20", name: "યુનુશભાઈ (Surveyor)" }, // સર્વે પૂર્ણ
            d: { date: "2026-05-25", name: "રાકેશભાઈ (MD)" }, // કાચી યાદિ રેકર્ડ
            e: { date: "2026-05-28", name: "મહેશભાઈ (Owner)" }, // મંત્રીને મોકલ્યા
            f: { date: "", name: "" }, // સુધારો પાકી યાદિ (Pending)
            g: { date: "", name: "" }, // રેકર્ડ પરત (Pending)
          },
          remarks: "પ્રોસેસ ચાલુ છે",
        },
        {
          _id: 2,
          gam: "હિંડોરણા",
          taluko: "રાજુલા",
          jillo: "અમરેલી",
          caseNo: "CASE-2026-002",
          status: "Completed",
          progress: {
            a: { date: "2026-04-01", name: "રમેશભાઈ (Owner)" },
            b: { date: "2026-04-05", name: "કિશોરભાઈ (Surveyor)" },
            c: { date: "2026-04-15", name: "કિશોરભાઈ (Surveyor)" },
            d: { date: "2026-04-20", name: "દિનેશભાઈ (MD)" },
            e: { date: "2026-04-22", name: "રમેશભાઈ (Owner)" },
            f: { date: "2026-04-28", name: "દિનેશભાઈ (MD)" },
            g: { date: "2026-05-02", name: "રમેશભાઈ (Owner)" },
          },
          remarks: "કામ પૂર્ણ",
        },
        {
          _id: 3,
          gam: "વિક્ટર",
          taluko: "રાજુલા",
          jillo: "અમરેલી",
          caseNo: "CASE-2026-003",
          status: "Canceled",
          progress: {
            a: { date: "2026-06-01", name: "અશોકભાઈ (Owner)" },
            b: { date: "", name: "" },
            c: { date: "", name: "" },
            d: { date: "", name: "" },
            e: { date: "", name: "" },
            f: { date: "", name: "" },
            g: { date: "", name: "" },
          },
          remarks: "પાર્ટી દ્વારા રદ્દ",
        },
      ];
      setReportData(mockData);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("ડેટા લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Filtering Logic
  // ---------------------------------------------------------
  const filteredData = reportData.filter(
    (item) =>
      item?.gam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.caseNo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Status Badge Color Map
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "current":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "final":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // ---------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="w-full mx-auto max-w-[1800px]">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Akarni Work Status / Staff Progress Report
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              સ્ટેટસ અને વર્ક પ્રોગ્રેસ રિપોર્ટ
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="ગામ અથવા Case No. થી શોધો..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300">
          {loading ? (
            <div className="p-16 flex justify-center items-center flex-col">
              <svg
                className="animate-spin h-10 w-10 text-blue-600 mb-4"
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
              <p className="text-gray-500 font-medium">
                ડેટા લોડ થઈ રહ્યો છે...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse border border-gray-400 min-w-[1200px]">
                {/* Table Head */}
                <thead className="sticky top-0 z-10 bg-slate-800 text-white">
                  {/* Super Header matching the image */}
                  <tr>
                    <th
                      colSpan="7"
                      className="text-center py-3 text-lg font-bold border border-gray-400"
                    >
                      Akarni Work Status / Staff Progress Report
                    </th>
                  </tr>
                  <tr className="text-center">
                    <th className="p-4">Gam</th>
                    <th className="p-4">Taluko</th>
                    <th className="p-4">Jillo</th>
                    <th className="p-4">Case No</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progress Tracker</th>
                    <th className="p-4">Remarks</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-sm text-gray-700">
                  {filteredData.map((item, index) => (
                    <React.Fragment key={item._id}>
                      <tr
                        className={`hover:bg-blue-50 transition ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }`}
                      >
                        {/* Gam */}
                        <td className="border border-slate-300 p-3 text-center font-semibold">
                          {item.gam}
                        </td>

                        {/* Taluko */}
                        <td className="border border-slate-300 p-3 text-center">
                          {item.taluko}
                        </td>

                        {/* Jillo */}
                        <td className="border border-slate-300 p-3 text-center">
                          {item.jillo}
                        </td>

                        {/* Case */}
                        <td className="border border-slate-300 p-3 text-center font-mono text-blue-700">
                          {item.caseNo}
                        </td>

                        {/* Status */}
                        <td className="border border-slate-300 p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Progress */}
                        <td className="border border-slate-300 p-4 min-w-[350px] align-top">
                          <ProgressTracker progress={item.progress} />
                        </td>

                        {/* Remarks */}
                        <td className="border border-slate-300 p-3 text-center">
                          {item.remarks}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer details */}
          {!loading && filteredData.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-300 px-6 py-4 text-sm text-gray-700 flex justify-between items-center font-medium">
              <span>કુલ રેકર્ડ્સ: {filteredData.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
