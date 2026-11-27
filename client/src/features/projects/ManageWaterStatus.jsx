import {
  Search,
  Pencil,
  X,
  MapPin,
  Hash,
  ArrowUpDown,
  ExternalLink,
  Plus,
  Trash2,
  Link2,
  Droplets,
} from "lucide-react";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import apiPath from "../../isProduction";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

const STATE_STORAGE_KEY = "manageNalOrdersState_v1";

const nalQuicklinks = [
  { label: "3.2. Water Tax Register", path: "/survay/waterTaxRegister" },
  {
    label: "6.5. Water Index Report (પાનોત્રી બુક)",
    path: "/survay/waterIndexReport",
  },
  { label: "7.5. Water Tarij Report", path: "/survay/waterTarij" },
  { label: "Water Tax Bill / Quotation", path: "/survay/waterBill" },
  { label: "1.1 Order Valuation Report", path: "/orderValuation/report" },
  { label: "1.2 Order Valuation Form", path: "/orderValuation/form" },
  { label: "0. Tharaav Set", path: "/orderValuation/tharav" },
  { label: "Bulk Upload", path: "/survay/bulk" },
  { label: "5. Vasulat Register", path: "/survay/vasulatRegister" },
];

const STATUS_PRIORITY = {
  final: 1,
  current: 2,
  completed: 3,
  canceled: 4,
};

const VALID_STATUSES = ["all", "final", "current", "completed", "canceled"];

const normalizeStatus = (status) => {
  const s = (status || "").trim().toLowerCase();
  if (s === "cancelled" || s === "canceled") return "canceled";
  return s;
};

const parseDetailsSafe = (details) => {
  if (!details) return {};
  if (typeof details === "object") return details;
  if (typeof details === "string") {
    try {
      return JSON.parse(details);
    } catch {
      return {};
    }
  }
  return {};
};

const readSavedState = () => {
  try {
    const raw = sessionStorage.getItem(STATE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Generate guaranteed unique Nal Order ID: "{009}-TR-{MM}-{YYYY}"
const generateUniqueNalOrderId = (tapregiCount, allExistingWorks = []) => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const existingIds = new Set(
    allExistingWorks
      .map((w) =>
        String(w?.sheetId || w?.orderNo || w?._id || "")
          .trim()
          .toLowerCase(),
      )
      .filter(Boolean),
  );

  let counter = tapregiCount + 1;
  let candidateId = `${String(counter).padStart(3, "0")}-TR-${month}-${year}`;

  while (existingIds.has(candidateId.toLowerCase())) {
    counter += 1;
    candidateId = `${String(counter).padStart(3, "0")}-TR-${month}-${year}`;
  }

  return candidateId;
};

export default function ManageWaterStatus() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tableContainerRef = useRef(null);
  const hasRestoredScrollRef = useRef(false);

  const savedState = useMemo(() => readSavedState(), []);
  const urlStatusParam = normalizeStatus(searchParams.get("status"));

  // ---------------------------------------------------------
  // State Management
  // ---------------------------------------------------------
  const [allWorksRaw, setAllWorksRaw] = useState([]);
  const [reportData, setReportData] = useState(
    () => savedState?.reportData || [],
  );
  const [users, setUsers] = useState(() => savedState?.users || []);
  const [loading, setLoading] = useState(
    () => !(savedState?.reportData && savedState.reportData.length > 0),
  );
  const [searchTerm, setSearchTerm] = useState(
    () => savedState?.searchTerm || "",
  );
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(
    () => savedState?.selectedOrder || null,
  );
  const [isNewestFirst, setIsNewestFirst] = useState(() =>
    typeof savedState?.isNewestFirst === "boolean"
      ? savedState.isNewestFirst
      : true,
  );

  // Add Order Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [formData, setFormData] = useState({
    sheetId: "",
    spot: { gaam: "", taluka: "", district: "" },
  });

  const [statusFilter, setStatusFilter] = useState(() => {
    if (VALID_STATUSES.includes(urlStatusParam)) return urlStatusParam;
    if (VALID_STATUSES.includes(savedState?.statusFilter)) {
      return savedState.statusFilter;
    }
    return "all";
  });

  // Sync URL ?status=all | final | current | completed | canceled
  useEffect(() => {
    const currentParam = normalizeStatus(searchParams.get("status"));
    if (VALID_STATUSES.includes(currentParam)) {
      if (currentParam !== statusFilter) {
        setStatusFilter(currentParam);
      }
    } else {
      setSearchParams({ status: statusFilter }, { replace: true });
    }
  }, [searchParams]);

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setSearchParams({ status: newStatus });
  };

  // ---------------------------------------------------------
  // Persist State & Scroll Position to sessionStorage
  // ---------------------------------------------------------
  const persistCurrentState = (overrides = {}) => {
    try {
      const current = readSavedState() || {};
      const nextState = {
        ...current,
        reportData,
        users,
        searchTerm,
        statusFilter,
        isNewestFirst,
        selectedOrder,
        tableScrollTop:
          tableContainerRef.current?.scrollTop ?? current.tableScrollTop ?? 0,
        tableScrollLeft:
          tableContainerRef.current?.scrollLeft ?? current.tableScrollLeft ?? 0,
        windowScrollY: window.scrollY ?? current.windowScrollY ?? 0,
        ...overrides,
      };
      sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.warn("Could not persist screen state:", e);
    }
  };

  useEffect(() => {
    persistCurrentState();
  }, [
    reportData,
    users,
    searchTerm,
    statusFilter,
    isNewestFirst,
    selectedOrder,
  ]);

  useEffect(() => {
    const handleWindowScroll = () => {
      persistCurrentState({ windowScrollY: window.scrollY });
    };
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [
    reportData,
    users,
    searchTerm,
    statusFilter,
    isNewestFirst,
    selectedOrder,
  ]);

  useLayoutEffect(() => {
    if (hasRestoredScrollRef.current || loading || reportData.length === 0) {
      return;
    }
    hasRestoredScrollRef.current = true;

    if (tableContainerRef.current) {
      if (savedState?.tableScrollTop) {
        tableContainerRef.current.scrollTop = savedState.tableScrollTop;
      }
      if (savedState?.tableScrollLeft) {
        tableContainerRef.current.scrollLeft = savedState.tableScrollLeft;
      }
    }
    if (savedState?.windowScrollY) {
      window.scrollTo(0, savedState.windowScrollY);
    }
  }, [loading, reportData, savedState]);

  const handleTableScroll = (e) => {
    persistCurrentState({
      tableScrollTop: e.target.scrollTop,
      tableScrollLeft: e.target.scrollLeft,
    });
  };

  // ---------------------------------------------------------
  // Fetch Data on Mount
  // ---------------------------------------------------------
  useEffect(() => {
    fetchReportData();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
      if (users.length === 0) {
        toast.error("સ્ટાફ ડેટા લાવવામાં નિષ્ફળ.");
      }
    }
  };

  // Map standalone "tapregi" works + "akarni" works with seperateWaterRegister: true
  const mapNalWorks = (rawWorks) =>
    rawWorks
      .filter((item) => {
        const type = (item?.spot?.type || "").trim().toLowerCase();
        if (type === "tapregi") return true;

        if (type === "akarni") {
          const detailsObj = parseDetailsSafe(item?.details);
          return (
            detailsObj?.seperateWaterRegister === true ||
            detailsObj?.seperateWaterRegister === "true"
          );
        }
        return false;
      })
      .map((item, index) => {
        const type = (item?.spot?.type || "").trim().toLowerCase();
        const detailsObj = parseDetailsSafe(item?.details);

        return {
          originalIndex: index,
          projectId: item?._id || item?.sheetId || "",
          orderNo: item?.sheetId || item?._id || "",
          gam: item?.spot?.gaam || "",
          taluko: item?.spot?.taluka || "",
          jillo: item?.spot?.district || "",
          status: item?.other?.status || "",
          isInheritedFromAkarni: type === "akarni",
          progress: {
            a: {
              date: detailsObj?.date || "",
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
        };
      });

  const fetchReportData = async () => {
    if (reportData.length === 0) {
      setLoading(true);
    }
    setError("");
    try {
      const data = await axios.get(`${await apiPath()}/api/work`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const rawWorks = data?.data?.data || [];
      setAllWorksRaw(rawWorks);

      const nalWorks = mapNalWorks(rawWorks);
      setReportData(nalWorks);

      setSelectedOrder((prevSelected) => {
        if (!prevSelected) return null;
        const updated = nalWorks.find(
          (w) =>
            w.projectId === prevSelected.projectId ||
            w.orderNo === prevSelected.orderNo,
        );
        return updated || prevSelected;
      });

      return rawWorks;
    } catch (err) {
      console.error("Error fetching nal report:", err);
      if (reportData.length === 0) {
        setError("ડેટા લોડ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Add Order Modal Controls (Standalone tapregi orders)
  // ---------------------------------------------------------
  const openAddModal = () => {
    const standaloneCount =
      allWorksRaw.length > 0
        ? allWorksRaw.filter(
            (w) => (w?.spot?.type || "").trim().toLowerCase() === "tapregi",
          ).length
        : reportData.filter((r) => !r.isInheritedFromAkarni).length;

    const uniqueOrderId = generateUniqueNalOrderId(
      standaloneCount,
      allWorksRaw.length > 0 ? allWorksRaw : reportData,
    );

    setFormData({
      sheetId: uniqueOrderId,
      spot: { gaam: "", taluka: "", district: "" },
    });
    setActionMessage("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setActionMessage("");
    setFormData({
      sheetId: "",
      spot: { gaam: "", taluka: "", district: "" },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["gaam", "taluka", "district"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        spot: {
          ...prev.spot,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmittingOrder(true);
    setActionMessage("");

    if (
      !formData.spot.gaam.trim() ||
      !formData.spot.taluka.trim() ||
      !formData.spot.district.trim()
    ) {
      setActionMessage("કૃપા કરીને બધા ફરજિયાત ક્ષેત્રો ભરો.");
      setSubmittingOrder(false);
      return;
    }

    try {
      const baseUrl = await apiPath();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      // Re-fetch latest works to guarantee unique Order ID
      let latestRawWorks = allWorksRaw;
      try {
        const checkRes = await axios.get(`${baseUrl}/api/work`, { headers });
        if (Array.isArray(checkRes?.data?.data)) {
          latestRawWorks = checkRes.data.data;
          setAllWorksRaw(latestRawWorks);
        }
      } catch {
        // Proceed with cached list if check call fails
      }

      const latestTapregiCount = latestRawWorks.filter(
        (item) => (item?.spot?.type || "").trim().toLowerCase() === "tapregi",
      ).length;

      const existingIds = new Set(
        latestRawWorks
          .map((w) =>
            String(w?.sheetId || w?._id || "")
              .trim()
              .toLowerCase(),
          )
          .filter(Boolean),
      );

      let finalSheetId = formData.sheetId.trim();
      if (!finalSheetId || existingIds.has(finalSheetId.toLowerCase())) {
        finalSheetId = generateUniqueNalOrderId(
          latestTapregiCount,
          latestRawWorks,
        );
        setFormData((prev) => ({ ...prev, sheetId: finalSheetId }));
      }

      const payload = {
        sheetId: finalSheetId,
        spot: {
          gaam: formData.spot.gaam.trim(),
          taluka: formData.spot.taluka.trim(),
          district: formData.spot.district.trim(),
          type: "tapregi",
        },
      };

      const response = await fetch(`${baseUrl}/api/work`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();
      toast.success(
        `નવો નળ રજીસ્ટર ઓર્ડર (${finalSheetId}) સફળતાપૂર્વક ઉમેરવામાં આવ્યો!`,
      );
      setActionMessage(
        `કાર્ય સફળતાપૂર્વક ઉમેરવામાં આવ્યું: ${result.message || finalSheetId}`,
      );
      closeAddModal();
      await fetchReportData();
    } catch (err) {
      console.error("Error adding nal work:", err);
      setActionMessage(`કાર્ય ઉમેરવામાં નિષ્ફળ: ${err.message}`);
      toast.error(`કાર્ય ઉમેરવામાં નિષ્ફળ: ${err.message}`);
    } finally {
      setSubmittingOrder(false);
    }
  };

  // --- Delete Standalone Nal Work Entry ---
  const handleDeleteWork = async (item) => {
    if (item?.isInheritedFromAkarni) {
      toast.info(
        "આ ઓર્ડર Akarni માંથી લિંક થયેલ છે. તેને દૂર કરવા માટે Akarni ઓર્ડરમાંથી seperateWaterRegister બંધ કરો.",
      );
      return;
    }

    const sheetId = item?.orderNo;
    const gaamName = item?.gam;

    if (
      !window.confirm(
        `શું તમે ખરેખર નળ રજીસ્ટર ઓર્ડર "${sheetId}" ${gaamName ? `(${gaamName})` : ""} દૂર કરવા માંગો છો?`,
      )
    ) {
      return;
    }

    setDeletingOrderId(sheetId);
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
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();
      toast.success(`ઓર્ડર (${sheetId}) સફળતાપૂર્વક દૂર થયો.`);
      setActionMessage(`કાર્ય સફળતાપૂર્વક દૂર થયું: ${result.message || ""}`);

      if (selectedOrder?.orderNo === sheetId) {
        setSelectedOrder(null);
      }

      await fetchReportData();
    } catch (err) {
      console.error("Error deleting nal work:", err);
      toast.error(`કાર્ય દૂર કરવામાં નિષ્ફળ: ${err.message}`);
      setActionMessage(`કાર્ય દૂર કરવામાં નિષ્ફળ: ${err.message}`);
    } finally {
      setDeletingOrderId(null);
    }
  };

  // ---------------------------------------------------------
  // Status Counts for Radio Buttons
  // ---------------------------------------------------------
  const statusCounts = useMemo(() => {
    const counts = {
      all: reportData.length,
      final: 0,
      current: 0,
      completed: 0,
      canceled: 0,
    };
    reportData.forEach((item) => {
      const norm = normalizeStatus(item.status);
      if (counts[norm] !== undefined) {
        counts[norm] += 1;
      }
    });
    return counts;
  }, [reportData]);

  // ---------------------------------------------------------
  // Filtering & Sorting Logic
  // ---------------------------------------------------------
  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return reportData
      .filter((item) => {
        const matchesSearch =
          !query ||
          item?.gam?.toLowerCase().includes(query) ||
          item?.taluko?.toLowerCase().includes(query) ||
          item?.jillo?.toLowerCase().includes(query) ||
          String(item?.orderNo || "")
            .toLowerCase()
            .includes(query);

        if (!matchesSearch) return false;

        if (statusFilter === "all") return true;
        return normalizeStatus(item.status) === statusFilter;
      })
      .sort((a, b) => {
        if (statusFilter === "all") {
          const prioA = STATUS_PRIORITY[normalizeStatus(a.status)] || 99;
          const prioB = STATUS_PRIORITY[normalizeStatus(b.status)] || 99;
          if (prioA !== prioB) return prioA - prioB;
        }

        return isNewestFirst
          ? b.originalIndex - a.originalIndex
          : a.originalIndex - b.originalIndex;
      });
  }, [reportData, searchTerm, statusFilter, isNewestFirst]);

  const getStatusColor = (status) => {
    switch (normalizeStatus(status)) {
      case "final":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "current":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "canceled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (date) => {
    if (!date) return " ";
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const radioOptions = [
    {
      value: "all",
      label: "All",
      sub: "",
      activeClass: "border-gray-800 bg-gray-900 text-white shadow-sm",
      badgeClass: "bg-gray-700 text-white",
    },
    {
      value: "final",
      label: "Final",
      sub: "ફાઈનલ",
      activeClass: "border-purple-600 bg-purple-600 text-white shadow-sm",
      badgeClass: "bg-purple-800 text-white",
    },
    {
      value: "current",
      label: "Current",
      sub: "ચાલુ",
      activeClass: "border-blue-600 bg-blue-600 text-white shadow-sm",
      badgeClass: "bg-blue-800 text-white",
    },
    {
      value: "completed",
      label: "Completed",
      sub: "પૂર્ણ",
      activeClass: "border-green-600 bg-green-600 text-white shadow-sm",
      badgeClass: "bg-green-800 text-white",
    },
    {
      value: "canceled",
      label: "Canceled",
      sub: "રદ",
      activeClass: "border-red-600 bg-red-600 text-white shadow-sm",
      badgeClass: "bg-red-800 text-white",
    },
  ];

  const handleSafeNavigate = (targetUrl) => {
    persistCurrentState();
    navigate(targetUrl);
  };

  const inheritedCount = useMemo(
    () => reportData.filter((item) => item.isInheritedFromAkarni).length,
    [reportData],
  );

  // ---------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-6 font-sans">
      <div className="w-full mx-auto" style={{ maxWidth: "1600px" }}>
        {/* Header Section */}
        <div className="mb-3 sm:mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Droplets className="h-6 w-6 text-cyan-600 shrink-0" />
              <span>Manage Nal Register Work Orders</span>
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mt-0.5 flex flex-wrap items-center gap-2">
              <span>નળ રજીસ્ટર વર્ક ઓર્ડર્સ અને સ્ટાફ પ્રોગ્રેસ રિપોર્ટ</span>
              {inheritedCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-100 text-cyan-800 border border-cyan-300">
                  <Link2 className="h-3 w-3" />
                  {inheritedCount} Akarni Linked
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* + Add Nal Order Button */}
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Nal Order</span>
            </button>

            {/* Reverse / Newest-Oldest Sort Toggle */}
            <button
              type="button"
              onClick={() => setIsNewestFirst((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 shadow-xs transition"
              title="Toggle Newest / Oldest Order"
            >
              <ArrowUpDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
              <span>{isNewestFirst ? "Newest First" : "Oldest First"}</span>
            </button>

            {/* Search Bar */}
            <div className="relative flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="ગામ, તાલુકો અથવા Order No..."
                className="pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg w-full sm:w-72 md:w-80 focus:ring-2 focus:ring-blue-500 outline-none shadow-xs bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 text-gray-400">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Compact Responsive Status Filter Radio Buttons */}
        <div className="mb-3 sm:mb-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {radioOptions.map((opt) => {
            const isSelected = statusFilter === opt.value;
            return (
              <label
                key={opt.value}
                className={`cursor-pointer rounded-lg border px-2.5 py-2 sm:px-3 sm:py-2.5 flex items-center justify-between gap-2 transition-all select-none ${
                  isSelected
                    ? opt.activeClass
                    : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="radio"
                    name="nalWorkStatusFilter"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => handleStatusFilterChange(opt.value)}
                    className="h-4 w-4 accent-blue-600 cursor-pointer shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold text-xs sm:text-sm leading-tight truncate">
                      {opt.label}
                    </div>
                    {opt.sub && (
                      <div
                        className={`text-[11px] leading-tight mt-0.5 truncate ${
                          isSelected ? "text-gray-200" : "text-gray-500"
                        }`}
                      >
                        {opt.sub}
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold shrink-0 ${
                    isSelected
                      ? opt.badgeClass
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {statusCounts[opt.value] ?? 0}
                </span>
              </label>
            );
          })}
        </div>

        {/* Action Feedback Banner */}
        {actionMessage && (
          <div className="mb-3 px-3.5 py-2.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs sm:text-sm flex items-center justify-between">
            <span>{actionMessage}</span>
            <button
              type="button"
              onClick={() => setActionMessage("")}
              className="text-blue-600 hover:text-blue-900 ml-3"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-xs sm:text-sm shadow-xs">
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow border border-gray-300 overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center items-center flex-col">
              <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-gray-500 text-sm font-medium">
                ડેટા લોડ થઈ રહ્યો છે...
              </p>
            </div>
          ) : (
            <div
              ref={tableContainerRef}
              onScroll={handleTableScroll}
              className="overflow-auto w-full max-h-[75vh]"
            >
              <table className="w-full text-left border-collapse border border-gray-800 min-w-[1140px] sm:min-w-[1420px]">
                {/* Sticky Table Head */}
                <thead className="bg-white text-gray-900 sticky top-0 z-20 shadow-xs">
                  <tr className="text-center text-xs sm:text-sm font-semibold bg-gray-100">
                    <th className="border border-gray-800 px-1.5 py-1.5 sm:p-2 w-[95px] sm:w-[125px] bg-gray-100">
                      Order No
                    </th>
                    <th className="border border-gray-800 px-1.5 py-1.5 sm:p-2 w-[100px] sm:w-[125px] bg-gray-100">
                      Gam
                    </th>
                    <th className="border border-gray-800 px-1.5 py-1.5 sm:p-2 w-[80px] sm:w-[100px] bg-gray-100">
                      Taluko
                    </th>
                    <th className="border border-gray-800 px-1.5 py-1.5 sm:p-2 w-[80px] sm:w-[100px] bg-gray-100">
                      Jillo
                    </th>
                    <th className="border border-gray-800 px-1.5 py-1.5 sm:p-2 w-[100px] sm:w-[120px] bg-gray-100">
                      Action
                    </th>
                    <th className="border border-gray-800 px-1.5 py-1.5 sm:p-2 w-[110px] sm:w-[135px] bg-gray-100">
                      Status
                    </th>
                    <th
                      colSpan="8"
                      className="border border-gray-800 px-1.5 py-1.5 sm:p-2 font-bold bg-gray-100"
                    >
                      Work Progress / નળ રજીસ્ટર કામની સ્થિતિ
                    </th>
                    <th className="border border-gray-800 px-1.5 py-1.5 sm:p-2 w-[110px] sm:w-[140px] bg-gray-100">
                      Remarks
                    </th>
                  </tr>

                  <tr className="text-center text-[11px] sm:text-xs font-semibold bg-gray-50">
                    <th className="border border-gray-800 p-1 text-center bg-gray-50">
                      1
                    </th>
                    <th className="border border-gray-800 p-1 text-center bg-gray-50">
                      2
                    </th>
                    <th className="border border-gray-800 p-1 text-center bg-gray-50">
                      3
                    </th>
                    <th className="border border-gray-800 p-1 text-center bg-gray-50">
                      4
                    </th>
                    <th className="border border-gray-800 p-1 text-center bg-gray-50">
                      5
                    </th>
                    <th className="border border-gray-800 p-1 text-center bg-gray-50">
                      6
                    </th>
                    <th className="border border-gray-800 p-1 text-center w-[48px] sm:w-[60px] bg-gray-50">
                      7
                    </th>
                    <th className="border border-gray-800 px-1 py-1 sm:p-2 text-center w-[95px] sm:w-[120px] bg-gray-50">
                      <div className="font-bold text-xs sm:text-sm mb-0.5">
                        8
                      </div>
                      <div>ઓડર વેલ્યુએશન ભર્યું</div>
                    </th>
                    <th className="border border-gray-800 px-1 py-1 sm:p-2 text-center w-[95px] sm:w-[120px] bg-gray-50">
                      <div className="font-bold text-xs sm:text-sm mb-0.5">
                        9
                      </div>
                      <div>સર્વે કામ શરૂ કર્યું</div>
                    </th>
                    <th className="border border-gray-800 px-1 py-1 sm:p-2 text-center w-[95px] sm:w-[120px] bg-gray-50">
                      <div className="font-bold text-xs sm:text-sm mb-0.5">
                        10
                      </div>
                      <div>સર્વેયર કામ પુર્ણ કર્યું</div>
                    </th>
                    <th className="border border-gray-800 px-1 py-1 sm:p-2 text-center w-[95px] sm:w-[120px] bg-gray-50">
                      <div className="font-bold text-xs sm:text-sm mb-0.5">
                        11
                      </div>
                      <div>કાચી યાદિ રેકર્ડ બનાવ્યા</div>
                    </th>
                    <th className="border border-gray-800 px-1 py-1 sm:p-2 text-center w-[95px] sm:w-[120px] bg-gray-50">
                      <div className="font-bold text-xs sm:text-sm mb-0.5">
                        12
                      </div>
                      <div>મંત્રીને કાચી યાદિ રેકર્ડ મોકલ્યા</div>
                    </th>
                    <th className="border border-gray-800 px-1 py-1 sm:p-2 text-center w-[95px] sm:w-[120px] bg-gray-50">
                      <div className="font-bold text-xs sm:text-sm mb-0.5">
                        13
                      </div>
                      <div>સુધારો પાકી યાદિ રેકર્ડ બનાવ્યા</div>
                    </th>
                    <th className="border border-gray-800 px-1 py-1 sm:p-2 text-center w-[95px] sm:w-[120px] bg-gray-50">
                      <div className="font-bold text-xs sm:text-sm mb-0.5">
                        14
                      </div>
                      <div>રેકર્ડ પરત મંત્રીને સોપ્યા/ આપ્યા</div>
                    </th>
                    <th className="border border-gray-800 p-1 text-center bg-gray-50">
                      15
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-xs sm:text-sm text-gray-800 font-medium">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const isInherited = item.isInheritedFromAkarni;
                      const rowBgClass = isInherited
                        ? "bg-cyan-50/75 hover:bg-cyan-100/70"
                        : "hover:bg-blue-50/50";

                      return (
                        <React.Fragment
                          key={item.orderNo || item.originalIndex}
                        >
                          {/* --- ITEM ROW 1 (DATES) --- */}
                          <tr className={`${rowBgClass} transition-colors`}>
                            {/* 1. Order No + Inherited Badge if from Akarni */}
                            <td
                              rowSpan="2"
                              className={`border border-gray-400 px-1.5 py-1 sm:p-2 align-middle font-bold text-gray-900 text-center whitespace-nowrap ${
                                isInherited
                                  ? "border-l-4 border-l-cyan-600"
                                  : ""
                              }`}
                            >
                              <div>{item.orderNo}</div>
                              {isInherited && (
                                <span
                                  title="Inherited from Akarni Order (seperateWaterRegister)"
                                  className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-600 text-white text-[10px] font-bold tracking-tight"
                                >
                                  <Link2 className="h-2.5 w-2.5" />
                                  Akarni Linked
                                </span>
                              )}
                            </td>

                            {/* 2. Gam */}
                            <td
                              rowSpan="2"
                              className="border border-gray-400 px-1.5 py-1 sm:p-2 align-middle font-semibold"
                            >
                              <div>{item.gam}</div>
                              {isInherited && (
                                <div className="text-[10px] text-cyan-800 font-semibold mt-0.5">
                                  (આકારણી માંથી)
                                </div>
                              )}
                            </td>

                            {/* 3. Taluko */}
                            <td
                              rowSpan="2"
                              className="border border-gray-400 px-1.5 py-1 sm:p-2 align-middle"
                            >
                              {item.taluko}
                            </td>

                            {/* 4. Jillo */}
                            <td
                              rowSpan="2"
                              className="border border-gray-400 px-1.5 py-1 sm:p-2 align-middle"
                            >
                              {item.jillo}
                            </td>

                            {/* 5. Action: View Details */}
                            <td
                              rowSpan="2"
                              className="border border-gray-400 px-1.5 py-1 sm:p-2 align-middle text-center"
                            >
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(item)}
                                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 text-white text-[11px] sm:text-xs font-semibold rounded-md shadow-2xs transition whitespace-nowrap ${
                                  isInherited
                                    ? "bg-cyan-700 hover:bg-cyan-800"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              >
                                View Details
                              </button>
                            </td>

                            {/* 6. Status + Compact Pencil Edit Icon Button */}
                            <td
                              rowSpan="2"
                              className="border border-gray-400 px-1.5 py-1 sm:p-2 align-middle"
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span
                                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[11px] sm:text-xs font-bold inline-block text-center capitalize ${getStatusColor(
                                    item.status,
                                  )}`}
                                >
                                  {item.status || "—"}
                                </span>
                                <button
                                  type="button"
                                  title="Edit Status"
                                  onClick={() =>
                                    handleSafeNavigate(
                                      `/projects/update/${item?.orderNo || ""}`,
                                    )
                                  }
                                  className="p-1 sm:p-1.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 transition shrink-0"
                                >
                                  <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </button>
                              </div>
                            </td>

                            {/* 7. Date Label */}
                            <td className="border border-gray-400 px-1 py-1 font-bold bg-gray-50/80 text-center">
                              તારીખ
                            </td>

                            {/* 8-14. Progress Dates */}
                            {["a", "b", "c", "d", "e", "f", "g"].map((key) => (
                              <td
                                key={`date-${key}`}
                                className="border border-gray-400 px-1.5 py-1 sm:p-2 whitespace-nowrap"
                              >
                                {formatDate(item.progress[key]?.date)}
                              </td>
                            ))}

                            {/* 15. Remarks */}
                            <td
                              rowSpan="2"
                              className="border border-gray-400 px-1.5 py-1 sm:p-2 align-middle whitespace-pre-wrap"
                            >
                              {item.remarks}
                            </td>
                          </tr>

                          {/* --- ITEM ROW 2 (STAFF) --- */}
                          <tr className={`${rowBgClass} transition-colors`}>
                            <td className="border border-gray-400 px-1 py-1 font-bold bg-gray-50/80 text-center">
                              Staff
                            </td>

                            {["a", "b", "c", "d", "e", "f", "g"].map((key) => (
                              <td
                                key={`staff-${key}`}
                                className="border border-gray-400 px-1.5 py-1 sm:p-2 text-[11px] sm:text-xs leading-tight"
                              >
                                {users?.find(
                                  (user) => user._id === item.progress[key]?.id,
                                )?.name || "----"}
                              </td>
                            ))}
                          </tr>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="15"
                        className="py-8 text-center text-gray-500 font-medium"
                      >
                        કોઈ Nal Register Work Order મળ્યો નથી.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filteredData.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-300 px-3 sm:px-6 py-2.5 text-xs sm:text-sm text-gray-700 flex flex-wrap justify-between items-center gap-2 font-medium">
              <span>કુલ રેકર્ડ્સ: {filteredData.length}</span>
              {inheritedCount > 0 && (
                <span className="text-xs text-cyan-800 flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-xs bg-cyan-100 border-l-4 border-cyan-600"></span>
                  <span>હાઈલાઈટ કરેલ ઓર્ડર્સ Akarni માંથી inherit થયેલ છે</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* Add New Nal Register Work Order Modal                     */}
      {/* --------------------------------------------------------- */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={closeAddModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus className="h-5 w-5" />
                <span>Add New Nal Register Order</span>
              </h2>
              <button
                type="button"
                onClick={closeAddModal}
                className="p-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Add Form */}
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Order ID (Auto-Verified Unique) *
                </label>
                <input
                  type="text"
                  name="sheetId"
                  value={formData.sheetId}
                  readOnly
                  className="w-full px-3.5 py-2 bg-gray-100 border border-gray-300 rounded-lg font-mono font-bold text-gray-900 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ગામ (Gaam) *
                </label>
                <input
                  type="text"
                  name="gaam"
                  value={formData.spot.gaam}
                  onChange={handleInputChange}
                  placeholder="ગામનું નામ દાખલ કરો"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  તાલુકો (Taluka) *
                </label>
                <input
                  type="text"
                  name="taluka"
                  value={formData.spot.taluka}
                  onChange={handleInputChange}
                  placeholder="તાલુકાનું નામ દાખલ કરો"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  જિલ્લો (District) *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.spot.district}
                  onChange={handleInputChange}
                  placeholder="જિલ્લાનું નામ દાખલ કરો"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  required
                />
              </div>

              {actionMessage && (
                <p className="text-xs text-red-600 font-medium">
                  {actionMessage}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {submittingOrder ? "Verifying & Saving..." : "Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* Quicklinks Popup Modal ("View Details")                   */}
      {/* --------------------------------------------------------- */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`text-white px-4 py-3 sm:px-6 sm:py-4 flex items-start justify-between gap-3 ${
                selectedOrder.isInheritedFromAkarni
                  ? "bg-gradient-to-r from-cyan-700 to-teal-700"
                  : "bg-gradient-to-r from-blue-700 to-indigo-700"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <Hash className="h-3.5 w-3.5" />
                    Order ID: {selectedOrder.orderNo}
                  </span>
                  {selectedOrder.status && (
                    <span className="bg-white text-blue-900 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize">
                      {selectedOrder.status}
                    </span>
                  )}
                  {selectedOrder.isInheritedFromAkarni && (
                    <span className="inline-flex items-center gap-1 bg-amber-300 text-gray-900 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                      <Link2 className="h-3.5 w-3.5" />
                      Inherited from Akarni
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300 shrink-0" />
                  <span>ગામ: {selectedOrder.gam || "—"}</span>
                </h2>

                <div className="text-xs sm:text-sm text-blue-100 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                  <span>
                    તાલુકો:{" "}
                    <b className="text-white">{selectedOrder.taluko || "—"}</b>
                  </span>
                  <span>|</span>
                  <span>
                    જિલ્લો:{" "}
                    <b className="text-white">{selectedOrder.jillo || "—"}</b>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition"
                aria-label="Close popup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Inherited Akarni Info Notice */}
            {selectedOrder.isInheritedFromAkarni && (
              <div className="bg-cyan-50 border-b border-cyan-200 px-4 py-2.5 sm:px-6 text-xs sm:text-sm text-cyan-900 flex items-center gap-2 font-medium">
                <Link2 className="h-4 w-4 text-cyan-700 shrink-0" />
                <span>
                  આ નળ રજીસ્ટર ઓર્ડરનો ડેટા <b>Akarni Order</b> માંથી inherit
                  થાય છે (Separate Water Register).
                </span>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-3.5 sm:p-5 overflow-y-auto bg-gray-50">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                View & Manage Nal Register Reports / Forms
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {nalQuicklinks.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      const targetId =
                        selectedOrder.projectId || selectedOrder.orderNo;
                      handleSafeNavigate(`${item.path}/${targetId}`);
                    }}
                    className="group flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-white hover:bg-blue-600 text-gray-800 hover:text-white border border-gray-200 hover:border-blue-600 rounded-xl text-left text-xs sm:text-sm font-semibold shadow-2xs transition-all"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-white shrink-0 transition" />
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 px-4 py-2.5 sm:px-6 sm:py-3 flex justify-between items-center gap-3">
              {selectedOrder.isInheritedFromAkarni ? (
                <span className="text-xs text-gray-500 italic">
                  * Akarni લિંક ઓર્ડર અહીંથી Delete નહીં થાય.
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDeleteWork(selectedOrder)}
                  disabled={deletingOrderId === selectedOrder.orderNo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Order</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs sm:text-sm font-semibold rounded-lg transition ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
