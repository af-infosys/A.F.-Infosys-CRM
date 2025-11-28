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
  const generatePDF = () => {
    const input = document.getElementById("report-content");

    input.style.minWidth = "1024px";

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;
    const filename = `Aakarni_Analysis_Report_${reportData.village}_${formattedDate}.pdf`;

    if (input) {
      // Use html2canvas to render the HTML as a canvas image
      html2canvas(input, {
        scale: 2, // Higher scale for better quality
        logging: true,
        useCORS: true,
      }).then((canvas) => {
        // Create a new jsPDF document
        // Legal size: 8.5 x 14 inches
        // Landscape orientation: 'l'
        const pdf = new jsPDF("p", "pt", "legal");
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const imgWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add the image to the PDF
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Handle multi-page reports if needed
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save(filename);
      });
    }

    input.style.minWidth = "auto";
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gray-100 min-h-screen font-sans">
      {/* Report container for PDF generation */}
      <div
        id="report-content"
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-10 mb-8"
      >
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 leading-tight">
            Aakarni Analysis Report - વિશ્લેષણ ગામનો સર્વે અહેવાલ
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-600 mb-4">
            સને {reportData.year}
          </h2>
          <hr className="border-t-2 border-dashed border-gray-300 mx-auto w-full" />
        </header>

        {/* Village details section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-700 mb-8">
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            ગામ :{" "}
            <b className="font-semibold text-blue-800">{reportData.village}</b>
          </span>
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            તાલુકો :{" "}
            <b className="font-semibold text-blue-800">{reportData.taluka}</b>
          </span>
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            જીલ્લો :{" "}
            <b className="font-semibold text-blue-800">{reportData.district}</b>
          </span>
        </div>

        {/* Main analytics grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportData.metrics.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="p-2 bg-gray-100 rounded-full">
                  <img
                    src={metric.icon}
                    alt="Metric Icon"
                    style={{ width: "40px", height: "40px" }}
                  />
                </span>
                <span className="text-sm text-gray-500">
                  ક્રમ: <b>{metric.id}</b>
                </span>
              </div>
              <h3 className="text-base sm:text-lg text-gray-800 mb-1">
                વર્ણન: <b>{metric.description}</b>
              </h3>
              <p className="text-lg sm:text-xl text-blue-600">
                સંખ્યા: <b>{metric.count}</b>
              </p>
            </div>
          ))}
        </section>
      </div>

      {/* PDF Download Button */}
      <div className="mt-4">
        <button
          onClick={generatePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-300 flex items-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default AnalyticsReport;
