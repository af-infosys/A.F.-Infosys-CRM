import React, { useState, useEffect } from "react";
import "./SurvayReport.scss";
import apiPath from "../../isProduction";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import AkarniPage from "../../components/conver/AkarniPage";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toGujaratiNumber from "../../components/toGujaratiNumber";

const KachaReport = () => {
  const navigation = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const [showCommercial, setShowCommercial] = useState(false);

  const [count, setCount] = useState({
    totalPhoneNumber: 0,
    totalTapConnection: 0,
    totalToilet: 0,
  });

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
      setRecords(
        result?.data?.filter((data) => {
          return data[16].includes("કાચા");
        }),
      );
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // count tap connection
    let tapConnections = 0;
    let phoneNumbers = 0;
    let toilets = 0;

    records.forEach((record) => {
      phoneNumbers += Number(record[6] || 0) > 0 ? 1 : 0;
      tapConnections += Number(record[12] || 0);
      toilets += Number(record[13] || 0);
    });

    setCount({
      totalPhoneNumber: phoneNumbers,
      totalTapConnection: tapConnections,
      totalToilet: toilets,
    });
  }, [records]);

  const [project, setProject] = useState([]);
  const { projectId } = useParams();

  const fetchProject = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchRecords();
  }, []);

  const [pdfProgress, setPdfProgress] = useState({
    isGenerating: false,
    isCancelled: false,
    completedPages: 0,
    totalPages: 0,
    percentage: 0,
  });

  const formatTime = (seconds) => {
    if (seconds >= 60) {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return `${min}m ${sec}s`;
    }
    return `${seconds} seconds`;
  };

  const handleCancel = () => {
    setPdfProgress((prev) => ({
      ...prev,
      isCancelled: true,
    }));
  };

  const handleDownloadPDF = async (mode) => {
    const residentialIndexes = [];
    const commercialIndexes = [];

    finalRenderPages.forEach((item, idx) => {
      console.log(item.commercial, item.type, idx);
      if (mode === "res") {
        if (!item.commercial) {
          residentialIndexes.push(idx);
        }
      }

      if (mode === "com") {
        if (item.commercial) {
          commercialIndexes.push(idx);
        }
      }
    });

    const generatePDF = async (pageIndexes, fileName) => {
      const totalPages = pageIndexes.length;
      let totalDuration = 0;

      const pdf = new jsPDF("landscape", "mm", "legal");

      for (let i = 0; i < totalPages; i++) {
        const currentState = await new Promise((resolve) => {
          setPdfProgress((prev) => {
            resolve(prev);
            return prev;
          });
        });

        if (currentState.isCancelled) {
          console.log("PDF generation cancelled by user.");
          break;
        }

        const pageIndex = pageIndexes[i];
        const pageStart = window.performance.now();
        const pageElement = document.getElementById(`report-page-${pageIndex}`);

        if (!pageElement) {
          console.error(
            `Page element with ID 'report-page-${pageIndex}' not found.`,
          );
          continue;
        }

        if (i > 0) {
          pdf.addPage();
        }

        try {
          const canvas = await html2canvas(pageElement, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
          });

          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const imgWidth = 355.6;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

          const pageEnd = window.performance.now();
          const pageDuration = pageEnd - pageStart;
          totalDuration += pageDuration;

          const completedPages = i + 1;
          const percentage = Math.round((completedPages / totalPages) * 100);

          let timeRemaining = null;

          if (completedPages >= 2) {
            const avgTime = totalDuration / completedPages;
            const remaining = totalPages - completedPages;
            timeRemaining = Math.max(
              0,
              Math.round((avgTime * remaining) / 1000),
            );
          }

          setPdfProgress((prev) => ({
            ...prev,
            completedPages,
            totalPages,
            percentage,
            timeRemaining,
          }));
        } catch (error) {
          console.error("Error generating PDF page:", error);
          break;
        }
      }

      const finalState = await new Promise((resolve) => {
        setPdfProgress((prev) => {
          resolve(prev);
          return {
            ...prev,
            isGenerating: false,
            isCancelled: prev.isCancelled,
            percentage: prev.isCancelled ? prev.percentage : 100,
            timeRemaining: null,
          };
        });
      });

      if (!finalState.isCancelled) {
        pdf.save(fileName);
      }
    };

    // Default single PDF
    const allIndexes = finalRenderPages.map((_, idx) => idx);

    setPdfProgress({
      isGenerating: true,
      isCancelled: false,
      completedPages: 0,
      totalPages: allIndexes.length + 2,
      percentage: 0,
      timeRemaining: null,
    });

    await generatePDF(
      allIndexes,
      `8. કાચા મકાન રજિસ્ટર - ${project?.spot?.gaam}.pdf`,
    );

    window.alert("PDF successfully saved.");
  };

  const handleDownloadExcel = () => {
    const locationRow = [
      [
        "મોજે : - થોરડી",
        "",
        "",
        "",

        "તાલુકો : - સાવર કુંડલા",
        "",
        "",
        "",
        "",

        "જીલ્લો : - અમરેલી",
      ],
    ];

    const title = [["ગામના નમુના નંબર (૮) આકારણી રજીસ્ટર"]];

    const headers = [
      [
        "અનુંક્રમાંક",
        "વિસ્તારનું નામ",
        "મિલ્કત ક્રમાંક",
        "મિલ્કતનું વર્ણન",
        "category",
        "માલિકનું નામ",
        "કબ્જેદારનું નામ",
        "જુનો મિ.નં.",
        "મોબાઈલ નંબર",
        "મિલ્કતની કિંમત",
        "આકારેલ વેરાની રકમ",
        "નળ",
        "શૌચા.",
        "નોંધ / રીમાર્કસ",
      ],
    ];

    const headerNumbers = [
      [
        toGujaratiNumber("1"),
        toGujaratiNumber("2"),
        toGujaratiNumber("3"),
        toGujaratiNumber("4"),
        toGujaratiNumber("5"),
        toGujaratiNumber("6"),
        toGujaratiNumber("7"),
        toGujaratiNumber("8"),
        toGujaratiNumber("9"),
        toGujaratiNumber("10"),
        toGujaratiNumber("11"),
        toGujaratiNumber("12"),
        toGujaratiNumber("13"),
        toGujaratiNumber("14"),
      ],
    ];

    const data = records?.map((record) => [
      toGujaratiNumber(record[0] || 0),
      record[1] || "",
      toGujaratiNumber(record[2] || 0),
      `${record[16] || ""}${record[7] ? `, '${record[7]}'` : ""}`,
      record[8] || "",
      record[3] || "",
      record[4] || "",
      record[5] || "",
      record[6] || "",
      toGujaratiNumber(record[19] || 0),
      toGujaratiNumber(record[20] || 0),
      Number(record[12] || 0) !== 0 ? "હા" : "ના",
      Number(record[13] || 0) !== 0 ? "હા" : "ના",
      record[14] || "",
    ]);

    const footer = [
      [],
      [
        `કુલ ઘર : ${records?.length}`,
        `કુલ મોબાઈલ નં. : ${count?.totalPhoneNumber || 0}`,
        `કુલ નળ : ${count?.totalTapConnection || 0}`,
        `કુલ શૌચાલય : ${count?.totalToilet || 0}`,
      ],
    ];

    const worksheetData = [
      ...locationRow,
      ...title,
      ...headers,
      ...headerNumbers,
      ...data,
      ...footer,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // મોજે
      { s: { r: 0, c: 4 }, e: { r: 0, c: 8 } }, // તાલુકો
      { s: { r: 0, c: 9 }, e: { r: 0, c: 13 } }, // જીલ્લો
      { s: { r: 1, c: 0 }, e: { r: 1, c: 13 } }, // title
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Akarni Register");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, "Analysis Milkat.xlsx");
  };

  const PROPERTIES_PER_PAGE = 7;
  const BUNDLE_SIZE = 100;

  const finalRenderPages = buildFinalPages(
    records,
    BUNDLE_SIZE,
    PROPERTIES_PER_PAGE,
  );

  function buildFinalPages(allRecords, pagesPerBundle, recordsPerPage) {
    if (!allRecords || allRecords.length === 0) return [];

    const final = [];

    // 🔢 Global page counter (1-based)
    let globalPageNumber = 1;

    // Helper: Split array into chunks (Create Pages)
    const chunkArray = (arr, size) => {
      const results = [];
      for (let i = 0; i < arr.length; i += size) {
        results.push(arr.slice(i, i + size));
      }
      return results;
    };

    // ==========================================
    // MIXED MODE
    // ==========================================

    const pages = chunkArray(allRecords, recordsPerPage);
    const totalBundles = Math.ceil(pages.length / pagesPerBundle);

    for (let bundle = 1; bundle <= totalBundles; bundle++) {
      const start = (bundle - 1) * pagesPerBundle;
      const end = start + pagesPerBundle;
      const pagesForThisBundle = pages.slice(start, end);

      pagesForThisBundle.forEach((records) => {
        final.push({
          type: "page",
          bundle,
          pageIndex: globalPageNumber - 1,
          pageRecords: records,
        });
        globalPageNumber++;
      });
    }

    return final;
  }

  // --- LOGIC ENDS HERE ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        ડેટા લોડ થઈ રહ્યો છે...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div style={{ display: "flex", gap: "20px" }}>
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          disabled={pdfProgress.isGenerating}
        >
          {pdfProgress.isGenerating ? "Generating..." : "Download PDF"}
        </button>

        {/* <button
          onClick={handleDownloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
        >
          Download Excel
        </button> */}
      </div>

      {pdfProgress.isGenerating && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
            <h3 className="text-xl font-bold mb-2 text-center text-gray-800">
              {pdfProgress.isCancelled
                ? "❌ Canceled"
                : "📄 Generating Report PDF"}
            </h3>
            <p
              className={`text-sm mb-4 text-center ${
                pdfProgress.isCancelled ? "text-red-500" : "text-gray-500"
              }`}
            >
              Please wait, this is a CPU-intensive task.
            </p>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  pdfProgress.isCancelled ? "bg-yellow-500" : "bg-green-600"
                }`}
                style={{ width: `${pdfProgress.percentage}%` }}
              ></div>
            </div>

            <p className="text-sm font-semibold text-gray-700 text-center mb-1">
              {pdfProgress.percentage}% Completed
            </p>
            <p className="text-xs text-gray-500 text-center mb-2">
              Page <b>{pdfProgress.completedPages}</b> of{" "}
              <b>{pdfProgress.totalPages}</b> done
            </p>

            {pdfProgress.timeRemaining !== null && !pdfProgress.isCancelled ? (
              <p className="text-sm font-bold text-blue-600 text-center mb-4">
                {formatTime(pdfProgress.timeRemaining)} remaining
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-400 text-center mb-4">
                {pdfProgress.isCancelled
                  ? "Cancelling process..."
                  : "Calculating ETA..."}
              </p>
            )}

            <button
              onClick={handleCancel}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 disabled:bg-red-400"
              disabled={pdfProgress.isCancelled}
            >
              {pdfProgress.isCancelled ? "Cancelling..." : "Cancel Generation"}
            </button>
          </div>
        </div>
      )}

      <br />
      <br />

      {/*     ?.filter((item) => {
            if (project?.details?.seperatecommercial) {
              return showCommercial
                ? item.commercial === true
                : item.commercial !== true;
            } else {
              return true;
            }
          }) */}
      <div className="pdf-report-container">
        {finalRenderPages?.map((item, idx) => {
          const id = `report-page-${idx}`;

          return (
            <div
              key={idx}
              id={id}
              className="report-page legal-landscape-dimensions"
              style={{
                paddingLeft: "60px",
                paddingRight: "20px",
                maxHeight: "800px",
              }}
            >
              <AkarniPage
                project={project}
                pageIndex={item.pageIndex}
                pageRecords={item.pageRecords}
                totalHoouse={records?.length}
                current={idx + 1}
                totalPages={finalRenderPages?.length}
                count={count}
                isCommercial={false}
                kacha={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KachaReport;
