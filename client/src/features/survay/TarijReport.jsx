import React, { useState, useEffect } from "react";
import "./SurvayReport.scss";
import apiPath from "../../isProduction";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TarijFormat from "../../components/TarijFormat";

const commercialCategories = [
  "દુકાન",
  "પ્રાઈવેટ - સંસ્થાઓ",
  "કારખાના - ઇન્ડસ્ટ્રીજ",
  "ટ્રસ્ટ મિલ્કત / NGO",
  "મંડળી - સેવા સહકારી મંડળી",
  "બેંક - સરકારી",
  "બેંક - અર્ધ સરકારી બેંક",
  "બેંક - પ્રાઇટ બેંક",
  "કોમ્પપ્લેક્ષ",
  "હિરાના કારખાના નાના",
  "હિરાના કારખાના મોટા",
  "મોબાઈલ ટાવર",
  "પેટ્રોલ પંપ, ગેસ પંપ",
];

/* ---------- helper ---------- */
function isCommercialProperty(row) {
  const category = row[7] ? row[7].trim() : "";

  // 1️⃣ Category based
  if (commercialCategories.includes(category)) {
    return true;
  }

  // 2️⃣ Room details based ("દુકાન")
  if (row[14]) {
    try {
      const floors = JSON.parse(row[14]);

      return floors.some(
        (floor) =>
          Array.isArray(floor.roomDetails) &&
          floor.roomDetails.some((room) =>
            room?.roomHallShopGodown?.includes("દુકાન"),
          ),
      );
    } catch {
      return false;
    }
  }

  return false;
}

const calculateTotal = (data = []) => {
  return {
    houseTax: {
      curr: data.reduce((s, i) => s + Number(i[19] || 0), 0),
      prev: 0,
    },
    waterTax: {
      curr: data.reduce(
        (s, i) =>
          s + Number(JSON.parse(i[20] || "{}")?.normal_water?.curr || 0),
        0,
      ),
      prev: data.reduce(
        (s, i) =>
          s + Number(JSON.parse(i[20] || "{}")?.normal_water?.prev || 0),
        0,
      ),
    },
    specialTax: {
      curr: data.reduce(
        (s, i) =>
          s + Number(JSON.parse(i[20] || "{}")?.special_water?.curr || 0),
        0,
      ),
      prev: data.reduce(
        (s, i) =>
          s + Number(JSON.parse(i[20] || "{}")?.special_water?.prev || 0),
        0,
      ),
    },
    lightTax: {
      curr: data.reduce(
        (s, i) => s + Number(JSON.parse(i[20] || "{}")?.light?.curr || 0),
        0,
      ),
      prev: data.reduce(
        (s, i) => s + Number(JSON.parse(i[20] || "{}")?.light?.prev || 0),
        0,
      ),
    },
    cleanTax: {
      curr: data.reduce(
        (s, i) => s + Number(JSON.parse(i[20] || "{}")?.cleaning?.curr || 0),
        0,
      ),
      prev: data.reduce(
        (s, i) => s + Number(JSON.parse(i[20] || "{}")?.cleaning?.prev || 0),
        0,
      ),
    },
    totalCount: data.length,
    countTax: data.reduce(
      (s, i) =>
        s +
        ([
          "ધાર્મિક સ્થળ",
          "સરકારી મિલ્ક્ત",
          "બેંક - સરકારી",
          "પ્લોટ સરકારી - કોમનપ્લોટ",
          "પ્લોટ (ફરતી દિવાલ) સરકારી",
        ].includes(i[7])
          ? 0
          : 1),
      0,
    ),
  };
};

const TarijReport = () => {
  const { projectId } = useParams();

  const [records, setRecords] = useState([]);
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      const res = await fetch(
        `${await apiPath()}/api/sheet?workId=${projectId}`,
      );
      const json = await res.json();
      setRecords(json?.data || []);
    } catch (e) {
      setError("ડેટા લાવવામાં નિષ્ફળ.");
    }
  };

  const fetchProject = async () => {
    try {
      const res = await axios.get(
        `${await apiPath()}/api/work/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setProject(res?.data?.data || {});
    } catch (e) {
      toast.error("Project load error");
    }
  };

  useEffect(() => {
    Promise.all([fetchProject(), fetchRecords()]).finally(() =>
      setLoading(false),
    );
  }, []);

  const normalRecords = records.filter((r) => !isCommercialProperty(r));
  const commercialRecords = records.filter((r) => isCommercialProperty(r));

  const totalAll = calculateTotal(records);
  const totalNormal = calculateTotal(normalRecords);
  const totalCommercial = calculateTotal(commercialRecords);

  const addSectionToPDF = async (pdf, elementId, addNewPage = false) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 1.5 });
    const imgData = canvas.toDataURL("image/jpeg", 1);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    if (addNewPage) pdf.addPage();

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
  };

  const generatePDF = async () => {
    const pdf = new jsPDF("l", "pt", [912, 1500]);

    if (project?.details?.seperatecommercial) {
      await addSectionToPDF(pdf, "pdf-normal");
      await addSectionToPDF(pdf, "pdf-commercial", true);
      await addSectionToPDF(pdf, "pdf-total", true);
    } else {
      await addSectionToPDF(pdf, "pdf-single");
    }

    pdf.save("5. Tarij_Report.pdf");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={generatePDF}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>

      <br />
      <br />

      {project?.details?.seperatecommercial ? (
        <span className="text-green-600 font-bold">
          COMMERCIAL SEPARATION ACTIVE
        </span>
      ) : (
        <span className="text-gray-500">Standard Sort</span>
      )}

      <br />
      <br />

      <div
        id="pdf-report-container"
        className="bg-white"
        // style={{ width: "1300px", padding: "20px", paddingLeft: "70px" }}
      >
        {project?.details?.seperatecommercial ? (
          <>
            <div
              id="pdf-normal"
              style={{
                width: "1300px",
                padding: "20px",
                paddingLeft: "60px",
                paddingTop: "80px",
              }}
            >
              <TarijFormat
                project={project}
                total={totalNormal}
                length={normalRecords.length}
                name="રહેણાંક મિલકત"
              />
            </div>

            <div
              id="pdf-commercial"
              style={{
                width: "1300px",
                padding: "20px",
                paddingLeft: "60px",
                paddingTop: "80px",
              }}
            >
              <TarijFormat
                project={project}
                total={totalCommercial}
                length={commercialRecords.length}
                name="કોમર્શિયલ મિલકત"
              />
            </div>

            <div
              id="pdf-total"
              style={{
                width: "1300px",
                padding: "20px",
                paddingLeft: "60px",
                paddingTop: "80px",
              }}
            >
              <TarijFormat
                project={project}
                total={totalAll}
                length={records.length}
                name="કુલ"
              />
            </div>
          </>
        ) : (
          <div
            id="pdf-single"
            style={{
              width: "1300px",
              padding: "20px",
              paddingLeft: "60px",
              paddingTop: "80px",
            }}
          >
            <TarijFormat
              project={project}
              total={totalAll}
              length={records.length}
              name=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TarijReport;
