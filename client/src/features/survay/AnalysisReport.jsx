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

// The main component for the analytics report
const AnalyticsReport = () => {
  // Use state to manage all the report data
  const [reportData, setReportData] = useState({
    village: "મેઘરજ",
    taluka: "મેઘરજ",
    district: "અરવલ્લી",
    year: "૨૦૨૫/૨૬",
    metrics: [
      {
        id: 1,
        description: "ગામની કુલ ટોટલ મિલ્કતોની સંખ્યા",
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
        description: "એરીયા/વિસ્તાર વાઇઝ મિલ્કતની સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 16,
        description: "૧-મિલ્કતથી વધારે મિલ્કતો ધરાવતા હોય તેવા માલીકની સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 17,
        description: "ફક્ત ૧ જ મિલ્કત હોય તેવા મિલ્કત માલીકની સંખ્યા",
        count: 0,
        icon: TotalHouseIcon,
      },
      {
        id: 18,
        description: "મોબાઇલ ફોન ઉપયોગ કરતા વ્યકિતઓની નંબરની કુલ સંખ્યા",
        count: 0,
        icon: PhoneUserIcon,
      },
      {
        id: 19,
        description: "બિન-પરવાનગી",
        count: 0,
        icon: PhoneUserIcon,
      },
    ],
  });

  const [records, setRecords] = useState([]);
  const [areaData, setAreaData] = useState([]); // પેજ 2 માટે

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/sheet`);
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
      const response = await fetch(`${await apiPath()}/api/sheet/areas`);
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
      Object.entries(areaCounts).map(([name, count]) => ({ name, count }))
    );

    const TotalCount = records.length;

    const RahenankCount = records.filter(
      (record) => record[7]?.trim() === "રહેણાંક"
    ).length;

    const RahenankPakaCount = records.filter(
      (record) =>
        record[7]?.trim() === "રહેણાંક" &&
        record[15]?.includes("પાકા") &&
        !record[15]?.includes("કાચા")
    ).length;

    const RahenankKachaCount = records.filter(
      (record) =>
        record[7]?.trim() === "રહેણાંક" && record[15]?.includes("કાચા")
    ).length;

    const DukanCount = records.filter(
      (record) => record[7]?.trim() === "દુકાન" || record[15]?.includes("દુકાન")
    ).length;

    const FactoryCount = records.filter(
      (record) => record[7]?.trim() === "કારખાના - ઇન્ડસ્ટ્રીજ઼"
    ).length;

    const PlotCount = records.filter(
      (record) => record[7]?.trim() === "પ્લોટ ખાનગી - ખુલ્લી જગ્યા"
    ).length;

    const GovnPlotCount = records.filter(
      (record) => record[7]?.trim() === "પ્લોટ સરકારી - કોમનપ્લોટ"
    ).length;

    const GovnOwnedCount = records.filter((record) =>
      record[7]?.includes("સરકારી મિલ્ક્ત")
    ).length;

    const DharmikCount = records.filter(
      (record) => record[7]?.trim() === "ધાર્મિક સ્થળ"
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
        record[13]?.includes("મોબાઈલ ટાવર")
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
      record[13]?.includes("બી.પ.")
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
          { ...prev.metrics[14], count: AreaWiseCount },
          { ...prev.metrics[15], count: DuplicateCount },
          { ...prev.metrics[16], count: UniqueCount },
          { ...prev.metrics[17], count: usePhoneCount },
          { ...prev.metrics[18], count: bpCount },
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
  const generatePDF = () => {
    const input = document.getElementById("report-content");
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const pdf = new jsPDF("p", "pt", "legal");
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // ત્રણેય પેજ માટે લૂપ અથવા મેન્યુઅલ કટિંગ કરી શકાય, અહીં સરળતા માટે આખું કેનવાસ એડ થશે
      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pageWidth,
        (canvas.height * pageWidth) / canvas.width
      );
      pdf.save(`Aakarni_Report_${reportData.village}.pdf`);
    });
  };

  // ગ્રાફ માટે ડેટા
  const pieData = [
    {
      name: "રહેણાંક",
      value: records.filter((r) => r[7]?.trim() === "રહેણાંક").length,
    },
    {
      name: "પ્લોટ",
      value: records.filter(
        (r) => r[7]?.trim() === "પ્લોટ ખાનગી - ખુલ્લી જગ્યા"
      ).length,
    },
    {
      name: "સરકારી",
      value: records.filter((r) => r[7]?.includes("સરકારી")).length,
    },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <div className="flex flex-col items-center p-4 bg-gray-200 min-h-screen">
        <div id="report-content" className="w-[1024px] bg-white shadow-2xl">
          {/* --- PAGE 1: મુખ્ય વિશ્લેષણ --- */}
          <div className="p-10 min-h-[1350px] border-b-2 border-gray-300">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-900">
                Aakarni Analysis Report - ૨૦૨૫/૨૬
              </h1>{" "}
              <div className="flex justify-around mt-6 text-lg font-semibold bg-blue-50 p-4 rounded-lg">
                <span>ગામ: {reportData.village}</span>
                <span>તાલુકો: {reportData.taluka}</span>
                <span>જીલ્લો: {reportData.district}</span>
              </div>
            </header>
            <div className="grid grid-cols-2 gap-6">
              {reportData.metrics.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center p-6 border rounded-xl bg-white shadow-sm"
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

          {/* --- PAGE 2: એરીયા વાઇઝ વિગત --- */}
          <div className="p-10 min-h-[1350px] border-b-2 border-gray-300 bg-gray-50">
            <h2 className="text-2xl font-bold text-center mb-8 underline">
              એરીયા/વિસ્તાર વાઇઝ મિલ્કતની સંખ્યા
            </h2>
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-4 border">ક્રમ</th>
                  <th className="p-4 border">એરીયા / વિસ્તારનું નામ</th>
                  <th className="p-4 border">કુલ મિલ્કતો</th>
                </tr>
              </thead>
              <tbody>
                {areaData.map((area, idx) => (
                  <tr key={idx} className="hover:bg-blue-50">
                    <td className="p-4 border">{idx + 1}</td>
                    <td className="p-4 border">{area.name}</td>
                    <td className="p-4 border font-bold">{area.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- PAGE 3: ગ્રાફ્સ અને ચાર્ટ્સ --- */}
          <div className="p-10 min-h-[1350px]">
            <h2 className="text-2xl font-bold text-center mb-10 underline">
              ગ્રાફિકલ વિશ્લેષણ (Charts & Graphs)
            </h2>

            <div className="grid grid-cols-1 gap-12">
              {/* Pie Chart */}
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-4">
                  મિલ્કત પ્રકારનું વિતરણ
                </h3>
                <PieChart width={500} height={350}>
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

              {/* Bar Chart */}
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-semibold mb-4">
                  સુવિધાઓનું વિશ્લેષણ (નળ અને શૌચાલય)
                </h3>
                <BarChart
                  width={600}
                  height={350}
                  data={[
                    {
                      name: "નળ કનેક્શન",
                      count:
                        reportData.metrics.find((m) => m.id === 11)?.count || 0,
                    },
                    {
                      name: "શૌચાલય",
                      count:
                        reportData.metrics.find((m) => m.id === 12)?.count || 0,
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
