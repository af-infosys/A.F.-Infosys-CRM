import React, { useEffect, useState } from "react";
import apiPath from "../../isProduction";

import TotalHouseIcon from "../../assets/icon/analytics/Total.png";
import HouseIcon from "../../assets/icon/analytics/House.png";
import PakaMakanIcon from "../../assets/icon/analytics/PakaMakan.png";
import KachaMakanIcon from "../../assets/icon/analytics/KachaMakan.png";
import StoreIcon from "../../assets/icon/analytics/Store.png";

import FactoryIcon from "../../assets/icon/analytics/Factory.png";
// import ShopIcon from "../../assets/icon/analytics/Shop.png";
// import AgricultureIcon from "../../assets/icon/analytics/Agriculture.png";
// import Agriculture2Icon from "../../assets/icon/analytics/Agriculture2.png";
// import Agriculture3Icon from "../../assets/icon/analytics/Agriculture3.png";
// import Agriculture4Icon from "../../assets/icon/analytics/Agriculture4.png";
import PhoneUserIcon from "../../assets/icon/analytics/PhoneUser.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // ગ્રાફ માટે
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// The main component for the analytics report

const AnalyticsReport = () => {
  const { projectId } = useParams();

  // Use state to manage all the report data
  const [reportData, setReportData] = useState({
    village: "મેઘરજ",
    taluka: "મેઘરજ",
    district: "અરવલ્લી",
    year: "૨૦૨૫/૨૬",
    metrics: [
      {
        id: 1,
        description: "ગામની કુલ મિલ્કતોની સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 2,
        description: "કુલ રહેણાંક વાળા મકાનો",
        count: 0,
        icon: HouseIcon,
      },
      {
        id: 3,
        description: "કુલ રહેણાંક વાળા પાકા મકાનો",
        count: 0,
        icon: PakaMakanIcon,
      },
      {
        id: 4,
        description: "ગામના કુલ રહેણાંક વાળા કાચા મકાનો",
        count: 0,
        icon: KachaMakanIcon,
      },
      {
        id: 5,
        description: "ગામની કુલ દુકાનો",
        count: 0,
        icon: StoreIcon,
      },
      {
        id: 6,
        description: "કારખાનાઓ / ફેક્ટરી પ્રાઈવેટ-ખાનગી કુલ",
        count: 0,
        icon: FactoryIcon,
      },
      {
        id: 7,
        description: "પ્લોટ ખાનગી - ખુલ્લી જગ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },

      {
        id: 8,
        description: "પ્લોટ સરકારી - કોમનપ્લોટ કુલ",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 9,
        description: "સરકારી મિલ્કતો કુલ",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 10,
        description: "ધાર્મિક સ્થળો કુલ",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 11,
        description: "નળની કુલ સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 12,
        description: "શૌચાલયની કુલ સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 13,
        description: "મોબાઈલ ટાવરની કુલ સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 14,
        description: "વિસ્તાર - ગામના કુલ એરીયાની સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 15,
        description: "૧-મિલ્કતથી વધારે મિલ્કતો ધરાવતા હોય તેવા માલીકની સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 16,
        description: "ફક્ત ૧ જ મિલ્કત હોય તેવા મિલ્કત માલીકની સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 17,
        description: "મોબાઇલ ફોન ઉપયોગ કરતા વ્યકિતઓની નંબરની કુલ સંખ્યા",
        count: 0,
        icon: PhoneUserIcon,
      },
      {
        id: 18,
        description: "બિન-પરવાનગી",
        count: 0,
        icon: PhoneUserIcon,
      },
    ],
  });

  const [records, setRecords] = useState([]);
  const [areaData, setAreaData] = useState([]); // પેજ 2 માટે

  const [project, setProject] = useState([]);

  const fetchProject = async () => {
    try {
      const data = await axios.get(
        `${await apiPath()}/api/work/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(data);
      setProject(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch(
        `${await apiPath()}/api/sheet?workId=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRecords(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      alert("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  const [societies, setSocieties] = useState([]);
  const fetchAreas = async () => {
    try {
      const response = await fetch(
        `${await apiPath()}/api/sheet/areas?workId=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setSocieties(result.data); // Set the fetched areas to state
    } catch (err) {
      console.error("Error fetching areas:", err);
      alert("વિસ્તારો લાવવામાં નિષ્ફળ.");
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchAreas();
    fetchProject();
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [records]);

  function calculateMetrics() {
    const areaCounts = records.reduce((acc, r) => {
      const area = r[1] || "અન્ય";
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {});

    setAreaData(
      Object.entries(areaCounts).map(([name, count]) => ({ name, count })),
    );

    const TotalCount = records.length;

    const RahenankCount = records.filter(
      (record) => record[7] === "રહેણાંક - મકાન",
    ).length;

    const RahenankPakaCount = records.filter(
      (record) =>
        record[7]?.trim() === "રહેણાંક - મકાન" &&
        record[15]?.includes("પાકા") &&
        !record[15]?.includes("કાચા"),
    ).length;

    const RahenankKachaCount = records.filter(
      (record) =>
        record[7]?.trim() === "રહેણાંક - મકાન" && record[15]?.includes("કાચા"),
    ).length;

    const DukanCount = records.filter(
      (record) =>
        record[7]?.trim() === "દુકાન" || record[15]?.includes("દુકાન"),
    ).length;

    const FactoryCount = records.filter(
      (record) => record[7]?.trim() === "કારખાના - ઇન્ડસ્ટ્રીજ઼",
    ).length;

    const PlotCount = records.filter(
      (record) => record[7]?.trim() === "પ્લોટ ખાનગી - ખુલ્લી જગ્યા",
    ).length;

    const GovnPlotCount = records.filter(
      (record) => record[7]?.trim() === "પ્લોટ સરકારી - કોમનપ્લોટ",
    ).length;

    const GovnOwnedCount = records.filter(
      (record) =>
        record[7]?.trim() === "ધાર્મિક સ્થળ" ||
        record[7]?.trim() === "સરકારી મિલ્ક્ત" ||
        record[7]?.trim() === "બેંક - સરકારી" ||
        record[7]?.trim() === "પ્લોટ સરકારી - કોમનપ્લોટ" ||
        record[7]?.trim() === "પ્લોટ (ફરતી દિવાલ) સરકારી",
    ).length;

    const DharmikCount = records.filter(
      (record) => record[7]?.trim() === "ધાર્મિક સ્થળ",
    ).length;

    let TapCount = 0;
    records.forEach((record) => {
      TapCount += Number(record[11]);
    });

    let ToiletCount = 0;
    records.forEach((record) => {
      ToiletCount += Number(record[12]) || 0;
    });

    const MobileTowerCount = records.filter(
      (record) =>
        record[6]?.includes("મોબાઈલ ટાવર") ||
        record[13]?.includes("મોબાઈલ ટાવર"),
    ).length;

    const TotalAreaCount = societies?.length;

    const AreaWiseCount = TotalAreaCount; // fix

    const counts = records.reduce((acc, record) => {
      const name = record[3];
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});
    // Duplicate & Unique Counts
    const DuplicateCount = Object.values(counts).filter((c) => c > 1).length;
    const UniqueCount = Object.values(counts).filter((c) => c === 1).length;

    // count not null on 5th index
    const usePhoneCount = records.filter((record) => record[5] !== "").length;

    const bpCount = records.filter((record) =>
      record[13]?.includes("બી.પ."),
    )?.length;

    setReportData((prev) => {
      return {
        ...prev,
        metrics: [
          { ...prev.metrics[0], count: TotalCount },
          { ...prev.metrics[1], count: RahenankCount },
          { ...prev.metrics[2], count: RahenankPakaCount },
          { ...prev.metrics[3], count: RahenankKachaCount },
          { ...prev.metrics[4], count: DukanCount },
          { ...prev.metrics[5], count: FactoryCount },
          { ...prev.metrics[6], count: PlotCount },
          { ...prev.metrics[7], count: GovnPlotCount },
          { ...prev.metrics[8], count: GovnOwnedCount },
          { ...prev.metrics[9], count: DharmikCount },
          { ...prev.metrics[10], count: TapCount },
          { ...prev.metrics[11], count: ToiletCount },
          { ...prev.metrics[12], count: MobileTowerCount },
          { ...prev.metrics[13], count: TotalAreaCount },
          { ...prev.metrics[14], count: DuplicateCount },
          { ...prev.metrics[15], count: UniqueCount },
          { ...prev.metrics[16], count: usePhoneCount },
          { ...prev.metrics[17], count: bpCount },
        ],
      };
    });
  }

  // Function to generate and download the PDF
  // const generatePDF = () => {
  //   const input = document.getElementById("report-content");

  //   input.style.minWidth = "1024px";

  //   const today = new Date();
  //   const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
  //     today.getMonth() + 1
  //   )
  //     .toString()
  //     .padStart(2, "0")}-${today.getFullYear()}`;
  //   const filename = `Aakarni_Analysis_Report_${reportData.village}_${formattedDate}.pdf`;

  //   if (input) {
  //     // Use html2canvas to render the HTML as a canvas image
  //     html2canvas(input, {
  //       scale: 2, // Higher scale for better quality
  //       logging: true,
  //       useCORS: true,
  //     }).then((canvas) => {
  //       // Create a new jsPDF document
  //       // Legal size: 8.5 x 14 inches
  //       // Landscape orientation: 'l'
  //       const pdf = new jsPDF("p", "pt", "legal");
  //       const imgData = canvas.toDataURL("image/jpeg", 1.0);
  //       const imgWidth = pdf.internal.pageSize.getWidth();
  //       const pageHeight = pdf.internal.pageSize.getHeight();
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       let heightLeft = imgHeight;
  //       let position = 0;

  //       // Add the image to the PDF
  //       pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;

  //       // Handle multi-page reports if needed
  //       while (heightLeft >= 0) {
  //         position = heightLeft - imgHeight;
  //         pdf.addPage();
  //         pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  //         heightLeft -= pageHeight;
  //       }

  //       // Save the PDF
  //       pdf.save(filename);
  //     });
  //   }

  //   input.style.minWidth = "auto";
  // };

  // PDF જનરેશન લોજિક
  const generatePDF = async () => {
    alert("PDF જનરેટ થઈ રહી છે, કૃપા કરીને થોડી રાહ જુઓ...");

    // PDF સેટિંગ્સ: Portrait, unit: mm, format: a4
    // (તમે 'legal' પણ રાખી શકો છો, પણ A4 સ્ટાન્ડર્ડ છે)
    const pdf = new jsPDF("p", "mm", "a4");
    const pageIds = ["page-1", "page-2", "page-3"];

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pageIds.length; i++) {
      const input = document.getElementById(pageIds[i]);

      if (input) {
        // html2canvas દ્વારા દરેક વિભાગનો અલગ ફોટો પાડો
        const canvas = await html2canvas(input, {
          scale: 2, // સારી ક્વોલિટી માટે
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // ઈમેજની ઊંચાઈ ગણતરી (પેજની પહોળાઈ મુજબ એડજસ્ટ)
        const imgHeight = (canvas.height * pageWidth) / canvas.width;

        // જો આ પહેલું પેજ નથી, તો નવું પેજ ઉમેરો
        if (i > 0) {
          pdf.addPage();
        }

        // ઈમેજને PDF માં ઉમેરો (x, y, width, height)
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
      }
    }

    const today = new Date().toLocaleDateString("gu-IN").replace(/\//g, "-");
    pdf.save(`Aakarni_Analysis_Report_${reportData.village}_${today}.pdf`);
  };

  // ગ્રાફ માટે ડેટા
  const pieData = [
    {
      name: "રહેણાંક",
      value: records.filter((r) => r[7] === "રહેણાંક - મકાન").length,
    },
    {
      name: "વ્યાવસાયિક",
      value: records.filter((r) => {
        // 1️⃣ Direct category match
        if (
          r[7] === "દુકાન" ||
          r[7] === "પ્રાઈવેટ - સંસ્થાઓ" ||
          r[7] === "કારખાના - ઇન્ડસ્ટ્રીજ઼" ||
          r[7] === "ટ્રસ્ટ મિલ્કત / NGO" ||
          r[7] === "મંડળી - સેવા સહકારી મંડળી" ||
          r[7] === "બેંક - અર્ધ સરકારી બેંક" ||
          r[7] === "બેંક - પ્રાઇટ બેંક" ||
          r[7] === "સરકારી સહાય આવાસ" ||
          r[7] === "કોમ્પપ્લેક્ષ" ||
          r[7] === "હિરાના કારખાના નાના" ||
          r[7] === "હિરાના કારખાના મોટા" ||
          r[7] === "મોબાઈલ ટાવર" ||
          r[7] === "પેટ્રોલ પંપ, ગેસ પંપ"
        ) {
          return true;
        }

        // 2️⃣ r[14] JSON અંદર "દુકાન" શોધવું
        try {
          const floors = JSON.parse(r[14]);

          return (
            Array.isArray(floors) &&
            floors.some(
              (floor) =>
                Array.isArray(floor.roomDetails) &&
                floor.roomDetails.some((room) =>
                  room?.roomHallShopGodown?.includes("દુકાન"),
                ),
            )
          );
        } catch (e) {
          return false;
        }
      }).length,
    },
    {
      name: "પ્લોટ",
      value: records.filter(
        (r) =>
          r[7] === "પ્લોટ ખાનગી - ખુલ્લી જગ્યા" ||
          r[7] === "પ્લોટ (ફરતી દિવાલ) ખાનગી",
      ).length,
    },

    {
      name: "કોમનપ્લોટ",
      value: records.filter(
        (r) =>
          r[7] === "પ્લોટ સરકારી - કોમનપ્લોટ" ||
          r[7] === "પ્લોટ (ફરતી દિવાલ) સરકારી",
      ).length,
    },

    {
      name: "સરકારી",
      value: records.filter(
        (r) =>
          r[7] === "ધાર્મિક સ્થળ" ||
          r[7] === "સરકારી મિલ્ક્ત" ||
          r[7] === "બેંક - સરકારી" ||
          r[7] === "પ્લોટ સરકારી - કોમનપ્લોટ" ||
          r[7] === "પ્લોટ (ફરતી દિવાલ) સરકારી",
      ).length,
    },
  ];

  const rahenankPieData = [
    { name: "કાચા મકાનો", value: reportData?.metrics[2]?.count },
    { name: "પાકા મકાનો", value: reportData?.metrics[3]?.count },
  ];

  // records.filter(
  //       (r) =>
  //         r[7] === "ધાર્મિક સ્થળ" ||
  //         r[7] === "સરકારી મિલ્ક્ત" ||
  //         r[7] === "બેંક - સરકારી" ||
  //         r[7] === "પ્લોટ સરકારી - કોમનપ્લોટ" ||
  //         r[7] === "પ્લોટ (ફરતી દિવાલ) સરકારી",
  //     ).length,

  const govPieData = [
    {
      name: "ધાર્મિક સ્થળ",
      value: records.filter((r) => r[7] === "ધાર્મિક સ્થળ").length,
    },
    {
      name: "બેંક",
      value: records.filter((r) => r[7] === "બેંક - સરકારી").length,
    },
    {
      name: "કોમનપ્લોટ",
      value: records.filter(
        (r) =>
          r[7] === "પ્લોટ સરકારી - કોમનપ્લોટ" ||
          r[7] === "પ્લોટ (ફરતી દિવાલ) સરકારી",
      ).length,
    },
    {
      name: "અન્ય",
      value: records.filter((r) => r[7] === "સરકારી મિલ્ક્ત").length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <div className="flex flex-col items-center min-h-screen">
        <div id="report-content" className="w-[1024px] bg-white shadow-2xl">
          {/* --- PAGE 1: મુખ્ય વિશ્લેષણ --- */}
          <div
            // className="watermark"
            style={{
              minHeight: "100%",
              position: "relative",
              // background: "red",
            }}
          >
            <div
              id="page-1"
              className="min-h-[1350px]"
              style={{ padding: "20px" }}
            >
              <div
                className="watermark"
                style={{
                  marginLeft: "145px",
                }}
              >
                <header className="text-center mb-8">
                  <h1
                    className="text-3xl font-bold text-blue-900"
                    style={{ position: "relative" }}
                  >
                    Aakarni Analysis Report -{" "}
                    {project?.details?.akaraniYear || "2025/26"}
                    <span
                      style={{
                        position: "absolute",
                        fontSize: "14px",
                        right: "0px",
                        top: "0px",
                        color: "#000",
                      }}
                    >
                      Page - A
                    </span>
                  </h1>

                  <div
                    className="flex justify-around text-lg font-semibold rounded-lg pt-2"
                    style={{ fontSize: "22px" }}
                  >
                    <span>ગામ: {project?.spot?.gaam}</span>
                    <span>તાલુકો: {project?.spot?.taluka}</span>
                    <span>જીલ્લો: {project?.spot?.district}</span>
                  </div>
                </header>
                <div className="grid grid-cols-2 gap-6">
                  {reportData.metrics.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center p-4 border rounded-xl shadow-sm"
                    >
                      <img src={m.icon} className="w-12 h-12 mr-4" alt="icon" />
                      <div>
                        <p className="text-gray-600">{m.description}</p>
                        <p className="text-2xl font-bold text-blue-600">
                          સંખ્યા: {m.count}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            // className="watermark"
            style={{
              minHeight: "100%",
              position: "relative",
              // background: "red",
            }}
          >
            {/* --- PAGE 2: એરીયા વાઇઝ વિગત --- */}
            <div
              id="page-2"
              className="p-10 min-h-[1350px]"
              style={{ padding: "20px" }}
            >
              <div
                className="watermark"
                style={{
                  marginLeft: "145px",
                }}
              >
                <header className="text-center mb-8">
                  <h1
                    className="text-3xl font-bold text-blue-900"
                    style={{ position: "relative" }}
                  >
                    એરીયા/વિસ્તાર વાઇઝ મિલ્કતની સંખ્યા -{" "}
                    {project?.details?.akaraniYear || "2025/26"}
                    <span
                      style={{
                        position: "absolute",
                        fontSize: "14px",
                        right: "0px",
                        top: "0px",
                        color: "#000",
                      }}
                    >
                      Page - B
                    </span>
                  </h1>{" "}
                  <div
                    className="flex justify-around text-lg font-semibold rounded-lg pt-2"
                    style={{ fontSize: "22px" }}
                  >
                    <span>ગામ: {project?.spot?.gaam}</span>
                    <span>તાલુકો: {project?.spot?.taluka}</span>
                    <span>જીલ્લો: {project?.spot?.district}</span>
                  </div>
                </header>
                <table className="w-full text-left border-collapse mytable">
                  <thead>
                    <tr>
                      <th
                        className="p-4"
                        style={{
                          maxWidth: "15px",
                          fontSize: "18px",
                          paddingLeft: "10px",
                        }}
                      >
                        ક્રમ
                      </th>
                      <th
                        className="p-4"
                        style={{
                          maxWidth: "90px",

                          fontSize: "18px",
                          paddingLeft: "10px",
                        }}
                      >
                        એરીયા / વિસ્તારનું નામ
                      </th>
                      <th
                        className="p-4"
                        style={{
                          maxWidth: "30px",

                          fontSize: "18px",
                          paddingLeft: "10px",
                        }}
                      >
                        કુલ મિલ્કતો
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {areaData.map((area, idx) => (
                      <tr key={idx}>
                        <td
                          className="p-2"
                          style={{
                            maxWidth: "15px",

                            paddingLeft: "10px",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          className="p-2"
                          style={{
                            maxWidth: "90px",

                            fontSize: "18px",
                            paddingLeft: "10px",
                          }}
                        >
                          {area.name}
                        </td>
                        <td
                          className="p-2 font-bold"
                          style={{
                            maxWidth: "30px",

                            fontSize: "18px",
                            paddingLeft: "10px",
                          }}
                        >
                          {area.count}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          textAlign: "center",
                          fontSize: "20px",
                        }}
                      >
                        <b>કુલ</b>
                      </td>
                      <td
                        style={{
                          paddingLeft: "10px",
                        }}
                      >
                        <b>
                          {areaData.reduce(
                            (total, area) => total + area.count,
                            0,
                          )}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            // className="watermark"
            style={{
              minHeight: "100%",
              position: "relative",
              // background: "red",
            }}
          >
            {/* --- PAGE 3: ગ્રાફ્સ અને ચાર્ટ્સ --- */}
            <div
              id="page-3"
              className="p-10 min-h-[1350px]"
              style={{ padding: "20px" }}
            >
              <div
                className="watermark1"
                style={{
                  marginLeft: "145px",
                }}
              >
                <header className="text-center mb-8">
                  <h1
                    className="text-3xl font-bold text-blue-900"
                    style={{ position: "relative" }}
                  >
                    ગ્રાફિકલ વિશ્લેષણ (Charts & Graphs) -{" "}
                    {project?.details?.akaraniYear || "2025/26"}
                    <span
                      style={{
                        position: "absolute",
                        fontSize: "14px",
                        right: "0px",
                        top: "0px",
                        color: "#000",
                      }}
                    >
                      Page - C
                    </span>
                  </h1>{" "}
                  <div
                    className="flex justify-around text-lg font-semibold rounded-lg pt-2"
                    style={{ fontSize: "22px" }}
                  >
                    <span>ગામ: {project?.spot?.gaam}</span>
                    <span>તાલુકો: {project?.spot?.taluka}</span>
                    <span>જીલ્લો: {project?.spot?.district}</span>{" "}
                  </div>
                </header>

                <div className="grid grid-cols-1 gap-12">
                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
                  >
                    {/* Pie Chart */}
                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold">
                        1. મિલ્કત પ્રકારનું વિતરણ -{" "}
                        {reportData?.metrics[0]?.count || "0"}
                      </h3>
                      <PieChart width={400} height={350}>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </div>

                    <div className="flex flex-col items-center">
                      <h3 className="text-xl font-semibold">
                        2. કુલ રહેણાંક વાળા મકાનો -{" "}
                        {reportData?.metrics[1]?.count || "0"}
                      </h3>
                      <PieChart width={300} height={350}>
                        <Pie
                          data={rahenankPieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {rahenankPieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold">
                      3. સરકારી મિલકત - {reportData?.metrics[8]?.count || "0"}
                    </h3>
                    <PieChart width={500} height={350}>
                      <Pie
                        data={govPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {govPieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </div>

                  {/* Bar Chart */}
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl font-semibold mb-4">
                      4. સુવિધાઓનું વિશ્લેષણ
                    </h3>
                    <BarChart
                      width={800}
                      height={350}
                      data={[
                        {
                          name: `નળ કનેક્શન - ${
                            reportData.metrics.find((m) => m.id === 11)
                              ?.count || 0
                          }`,
                          count:
                            reportData.metrics.find((m) => m.id === 11)
                              ?.count || 0,
                        },
                        {
                          name: `શૌચાલય - ${
                            reportData.metrics.find((m) => m.id === 12)
                              ?.count || 0
                          }`,
                          count:
                            reportData.metrics.find((m) => m.id === 12)
                              ?.count || 0,
                        },
                        {
                          name: `મોબાઈલ ટાવર - ${
                            reportData.metrics.find((m) => m.id === 13)
                              ?.count || 0
                          }`,
                          count:
                            reportData.metrics.find((m) => m.id === 13)
                              ?.count || 0,
                        },
                        {
                          name: `ફોન ઉપયોગ કરનાર - ${
                            reportData.metrics.find((m) => m.id === 17)
                              ?.count || 0
                          }`,
                          count:
                            reportData.metrics.find((m) => m.id === 17)
                              ?.count || 0,
                        },
                        {
                          name: `બિન-પરવાનગી - ${
                            reportData.metrics.find((m) => m.id === 18)
                              ?.count || 0
                          }`,
                          count:
                            reportData.metrics.find((m) => m.id === 18)
                              ?.count || 0,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d" barSize={60} />
                    </BarChart>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={generatePDF}
          className="mt-8 bg-green-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-700"
        >
          Download 3-Page Report (PDF)
        </button>
      </div>
    </>
  );
};

export default AnalyticsReport;
