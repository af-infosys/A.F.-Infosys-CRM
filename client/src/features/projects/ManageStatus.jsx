import { CheckCircle2, Clock3, Circle, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ManageStatus() {
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // State Management
  // ---------------------------------------------------------
  const [reportData, setReportData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // ---------------------------------------------------------
  // Fetch Data on Component Mount
  // ---------------------------------------------------------

  useEffect(() => {
    fetchReportData();
    fetchUsers();
  }, []);

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

  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulate network delay
      setLoading(true);

      const data = await axios.get(`${await apiPath()}/api/work`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("work data: ", data?.data?.data);

      setReportData(
        data?.data?.data?.map((item, index) => ({
          _id: index + 1,
          gam: item?.spot?.gaam || "",
          taluko: item?.spot?.taluka || "",
          jillo: item?.spot?.district || "",
          caseNo: item?.sheetId || "",
          status: item?.other?.status || "",
          progress: {
            a: {
              date: item?.other?.progress?.a?.date || "",
              id: item?.other?.progress?.a?.id || "",
            },
            b: {
              date: item?.other?.progress?.b?.date || "",
              id: item?.other?.progress?.b?.id || "",
            },
            c: {
              date: item?.other?.progress?.c?.date || "",
              id: item?.other?.progress?.c?.id || "",
            },
            d: {
              date: item?.other?.progress?.d?.date || "",
              id: item?.other?.progress?.d?.id || "",
            },
            e: {
              date: item?.other?.progress?.e?.date || "",
              id: item?.other?.progress?.e?.id || "",
            },
            f: {
              date: item?.other?.progress?.f?.date || "",
              id: item?.other?.progress?.f?.id || "",
            },
            g: {
              date: item?.other?.progress?.g?.date || "",
              id: item?.other?.progress?.g?.id || "",
            },
          },
          remarks: item?.other?.remarks || "",
        })),
      );
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "current":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (date) => {
    if (!date) return " ";
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  // ---------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="w-full mx-auto" style={{ maxWidth: "1600px" }}>
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
              placeholder="ગામ અથવા Order No. થી શોધો..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search className="h-5 w-5" />
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
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-300">
          {loading ? (
            <div className="p-16 flex justify-center items-center flex-col">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500 font-medium">
                ડેટા લોડ થઈ રહ્યો છે...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full pb-4">
              <table className="w-full text-left border-collapse border border-gray-800 min-w-[1400px]">
                {/* Table Head */}
                <thead className="bg-white text-gray-900">
                  {/* Row 1: Main Title */}
                  <tr>
                    <th
                      colSpan="15"
                      className="text-center py-2 text-xl font-extrabold border border-gray-800 tracking-wide"
                    >
                      Akarni Work Status / Staff Progress Report
                    </th>
                  </tr>

                  {/* Row 2: Headers */}
                  <tr className="text-center text-sm font-semibold bg-gray-50">
                    <th className="border border-gray-800 p-2 w-[60px]">
                      Serial No
                    </th>
                    <th className="border border-gray-800 p-2 w-[100px]">
                      Gam
                    </th>
                    <th className="border border-gray-800 p-2 w-[100px]">
                      Taluko
                    </th>
                    <th className="border border-gray-800 p-2 w-[100px]">
                      Jillo
                    </th>
                    <th className="border border-gray-800 p-2 w-[130px]">
                      Order No
                    </th>
                    <th className="border border-gray-800 p-2 w-[110px]">
                      Status
                    </th>
                    <th
                      colSpan="8"
                      className="border border-gray-800 p-2 font-bold"
                    >
                      Work Progress / આકારણીના કામની સ્થિતિ
                    </th>
                    <th className="border border-gray-800 p-2 w-[120px]">
                      Remarks
                    </th>
                    <th className="border border-gray-800 p-2 w-[120px]">
                      Action
                    </th>
                  </tr>

                  {/* Row 3: Numbering & Sub-headers */}
                  <tr className="text-center text-xs font-semibold bg-gray-50">
                    <th className="border border-gray-800 p-1 text-center">
                      1
                    </th>
                    <th className="border border-gray-800 p-1 text-center">
                      2
                    </th>
                    <th className="border border-gray-800 p-1 text-center">
                      3
                    </th>
                    <th className="border border-gray-800 p-1 text-center">
                      4
                    </th>
                    <th className="border border-gray-800 p-1 text-center">
                      5
                    </th>
                    <th className="border border-gray-800 p-1 text-center">
                      6
                    </th>
                    <th className="border border-gray-800 p-1 text-center w-[60px]">
                      7
                    </th>
                    <th className="border border-gray-800 p-2 text-center w-[120px]">
                      <div className="font-bold text-sm mb-1">8</div>
                      <div>ઓડર વેલ્યુએશન ભર્યું</div>
                    </th>
                    <th className="border border-gray-800 p-2 text-center w-[120px]">
                      <div className="font-bold text-sm mb-1">9</div>
                      <div>સર્વે કામ શરૂ કર્યું</div>
                    </th>
                    <th className="border border-gray-800 p-2 text-center w-[120px]">
                      <div className="font-bold text-sm mb-1">10</div>
                      <div>સર્વેયર કામ પુર્ણ કર્યું</div>
                    </th>
                    <th className="border border-gray-800 p-2 text-center w-[120px]">
                      <div className="font-bold text-sm mb-1">11</div>
                      <div>કાચી યાદિ રેકર્ડ બનાવ્યા</div>
                    </th>
                    <th className="border border-gray-800 p-2 text-center w-[120px]">
                      <div className="font-bold text-sm mb-1">12</div>
                      <div>મંત્રીને કાચી યાદિ રેકર્ડ મોકલ્યા</div>
                    </th>
                    <th className="border border-gray-800 p-2 text-center w-[120px]">
                      <div className="font-bold text-sm mb-1">13</div>
                      <div>સુધારો પાકી યાદિ રેકર્ડ બનાવ્યા</div>
                    </th>
                    <th className="border border-gray-800 p-2 text-center w-[120px]">
                      <div className="font-bold text-sm mb-1">14</div>
                      <div>રેકર્ડ પરત મંત્રીને સોપ્યા/ આપ્યા</div>
                    </th>
                    <th className="border border-gray-800 p-1 text-center">
                      15
                    </th>
                    <th className="border border-gray-800 p-1 text-center">
                      16
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-sm text-gray-800 font-medium">
                  {filteredData.map((item, index) => (
                    <React.Fragment key={item._id}>
                      {/* --- ITEM ROW 1 (DATES) --- */}
                      <tr className="hover:bg-blue-50/50 transition-colors">
                        {/* Common Columns (Spans 2 rows) */}
                        <td
                          rowSpan="2"
                          className="border border-gray-400 p-2 align-middle"
                        >
                          {index + 1}
                        </td>
                        <td
                          rowSpan="2"
                          className="border border-gray-400 p-2 align-middle"
                        >
                          {item.gam}
                        </td>
                        <td
                          rowSpan="2"
                          className="border border-gray-400 p-2 align-middle"
                        >
                          {item.taluko}
                        </td>
                        <td
                          rowSpan="2"
                          className="border border-gray-400 p-2 align-middle"
                        >
                          {item.jillo}
                        </td>
                        <td
                          rowSpan="2"
                          className="border border-gray-400 p-2 align-middle"
                        >
                          {item.caseNo}
                        </td>
                        <td
                          rowSpan="2"
                          className="border border-gray-400 p-2 align-middle"
                        >
                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-bold inline-block min-w-[90px] ${getStatusColor(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Date Label */}
                        <td className="border border-gray-400 p-1 font-bold bg-gray-50/80">
                          તારીખ
                        </td>

                        {/* Dates */}
                        {["a", "b", "c", "d", "e", "f", "g"].map((key) => (
                          <td
                            key={`date-${key}`}
                            className="border border-gray-400 p-2"
                          >
                            {formatDate(item.progress[key]?.date)}
                          </td>
                        ))}

                        {/* Remarks (Spans 2 rows) */}
                        <td
                          rowSpan="2"
                          className="border border-gray-400 p-2 align-middle whitespace-pre-wrap"
                        >
                          {item.remarks}
                        </td>

                        {/* Remarks (Spans 2 rows) */}
                        <td
                          rowSpan="2"
                          className="border border-gray-400 p-2 align-middle whitespace-pre-wrap"
                        >
                          <button
                            style={{
                              background: "yellow",
                              color: "black",
                              padding: "8px 16px",
                              borderRadius: "10px",
                            }}
                            onClick={() => {
                              navigate(
                                `/projects/update/${item?.caseNo || ""}`,
                              );
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>

                      {/* --- ITEM ROW 2 (STAFF) --- */}
                      <tr className="hover:bg-blue-50/50 transition-colors">
                        {/* Staff Label */}
                        <td className="border border-gray-400 p-1 font-bold bg-gray-50/80">
                          Staff
                        </td>

                        {/* Staff Names */}
                        {["a", "b", "c", "d", "e", "f", "g"].map((key) => (
                          <td
                            key={`staff-${key}`}
                            className="border border-gray-400 p-2 text-xs leading-tight"
                          >
                            {users?.find(
                              (user) => user._id === item.progress[key]?.id,
                            )?.name || "----"}
                          </td>
                        ))}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
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
