import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import apiPath from "../../isProduction";
import "./IndexReport.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import toGujaratiNumber from "../../components/toGujaratiNumber";

import IndexIndex from "../../components/conver/IndexIndex";

// The main component for the analytics report
const IndexReport = () => {
  // Use state to manage all the report data
  const [records, setRecords] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState([]);
  const [pdfProgress, setPdfProgress] = useState({
    isGenerating: false,
    percentage: 0,
    completedPages: 0,
    totalPages: 0,
    isCancelled: false,
  });

  const village = project?.spot?.gaam;
  const taluka = project?.spot?.taluka;
  const district = project?.spot?.district;
  const background = "#007bff";

  const { projectId } = useParams();

  const fetchProject = async () => {
    try {
      const data = await axios.get(
        `${await apiPath()}/api/work/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(data);
      setProject(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    }
  };

  // Function to determine the Gujarati letter for a name
  const getGujaratiInitial = (name) => {
    if (!name) return "";
    const firstChar = name.charAt(0);
    const alphabetMap = {
      અ: ["અ", "આ", "ઇ", "ઈ", "ઉ", "ઊ", "ઋ", "એ", "ઐ", "ઓ", "ઔ"],
      ક: ["ક", "કા", "કી", "કુ", "કૂ", "કૃ", "કે", "કૈ", "કો", "કૌ", "ખ"], // Added ખ here since it is not being detected correctly
      ગ: ["ગ", "ગા", "ગી", "ગુ", "ગૂ", "ગૃ", "ગે", "ગૈ", "ગો", "ગૌ", "ઘ"], // Added ઘ here since it is not being detected correctly
      ચ: ["ચ", "ચા", "ચી", "ચુ", "ચૂ", "ચૃ", "ચે", "ચૈ", "ચો", "ચૌ", "છ"], // Added છ here since it is not being detected correctly
      જ: ["જ", "જા", "જી", "જુ", "જૂ", "જૃ", "જે", "જૈ", "જો", "જૌ", "ઝ"], // Added ઝ here since it is not being detected correctly
      ટ: [
        "ટ",
        "ટા",
        "ટી",
        "ટુ",
        "ટૂ",
        "ટૃ",
        "ટે",
        "ટૈ",
        "ટો",
        "ટૌ",
        "ઠ",
        "ડ",
        "ઢ",
      ], // Added ઠ, ડ, ઢ here since it is not being detected correctly
      ણ: ["ણ", "ણા", "ણી", "ણુ", "ણૂ", "ણૃ", "ણે", "ણૈ", "ણો", "ણૌ"],
      ત: [
        "ત",
        "તા",
        "તી",
        "તુ",
        "તૂ",
        "તૃ",
        "તે",
        "તૈ",
        "તો",
        "તૌ",
        "થ",
        "દ",
        "ધ",
      ], // Added થ, દ, ધ here since it is not being detected correctly
      ન: ["ન", "ના", "ની", "નુ", "નૂ", "નૃ", "ને", "નૈ", "નો", "નૌ"],
      પ: ["પ", "પા", "પી", "પુ", "પૂ", "પૃ", "પે", "પૈ", "પો", "પૌ", "ફ"], // Added ફ here since it is not being detected correctly
      બ: ["બ", "બા", "બી", "બુ", "બૂ", "બૃ", "બે", "બૈ", "બો", "બૌ", "ભ"], // Added ભ here since it is not being detected correctly
      મ: ["મ", "મા", "મી", "મુ", "મૂ", "મૃ", "મે", "મૈ", "મો", "મૌ"],
      ય: ["ય", "યા", "યી", "યુ", "યૂ", "યૃ", "યે", "યૈ", "યો", "યૌ"],
      ર: ["ર", "રા", "રી", "રુ", "રૂ", "રૃ", "રે", "રૈ", "રો", "રૌ"],
      લ: ["લ", "લા", "લી", "લુ", "લૂ", "લૃ", "લે", "લૈ", "લો", "લૌ"],
      વ: ["વ", "વા", "વી", "વુ", "વૂ", "વૃ", "વે", "વૈ", "વો", "વૌ"],
      શ: ["શ", "શા", "શી", "શુ", "શૂ", "શૃ", "શે", "શૈ", "શો", "શૌ", "ષ", "સ"], // Added ષ, સ here since it is not being detected correctly
      હ: ["હ", "હા", "હી", "હુ", "હૂ", "હૃ", "હે", "હૈ", "હો", "હૌ"],
      ળ: ["ળ", "ળા", "ળી", "ળુ", "ળૂ", "ળૃ", "ળે", "ળૈ", "ળો", "ળૌ"],
      ક્ષ: [
        "ક્ષ",
        "ક્ષા",
        "ક્ષિ",
        "ક્ષી",
        "ક્ષુ",
        "ક્ષૂ",
        "ક્ષૃ",
        "ક્ષે",
        "ક્ષૈ",
        "ક્ષો",
        "ક્ષૌ",
      ],
      જ્ઞ: [
        "જ્ઞ",
        "જ્ઞા",
        "જ્ઞિ",
        "જ્ઞી",
        "જ્ઞુ",
        "જ્ઞૂ",
        "જ્ઞૃ",
        "જ્ઞે",
        "જ્ઞૈ",
        "જ્ઞો",
        "જ્ઞૌ",
      ],
      ત્ર: [
        "ત્ર",
        "ત્રા",
        "ત્રિ",
        "ત્રી",
        "ત્રુ",
        "ત્રૂ",
        "ત્રૃ",
        "ત્રે",
        "ત્રૈ",
        "ત્રો",
        "ત્રૌ",
      ],
    };
    for (const key in alphabetMap) {
      if (alphabetMap[key].includes(firstChar)) {
        return key;
      }
    }
    return "";
  };

  // Group records by their Gujarati initial
  const groupedRecords = records.reduce((acc, record) => {
    const initial = getGujaratiInitial(record[3]); // Assuming name is at index 3
    if (initial) {
      if (!acc[initial]) {
        acc[initial] = [];
      }
      acc[initial].push(record);
    }
    return acc;
  }, {});

  const sortedKeys = Object.keys(groupedRecords).sort((a, b) =>
    a.localeCompare(b, "gu", { sensitivity: "base" })
  );

  // Function to fetch dynamic data from an API
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${await apiPath()}/api/sheet?workId=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const sortedRecords = [...result.data].sort((a, b) => {
        const nameA = a[3]?.toString().toLowerCase() || "";
        const nameB = b[3]?.toString().toLowerCase() || "";
        return nameA.localeCompare(nameB, "gu", { sensitivity: "base" });
      });
      setRecords(sortedRecords);
    } catch (err) {
      console.error("Error fetching records:", err);
      console.log("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    fetchProject();
  }, []);

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

  const handleDownloadPDF = async () => {
    const totalPages = finalRenderPages.length;
    let totalDuration = 0;

    setPdfProgress({
      isGenerating: true,
      isCancelled: false,
      completedPages: 0,
      totalPages: totalPages,
      percentage: 0,
      timeRemaining: null,
    });

    // 1. ફેરફાર: "landscape" ને બદલે "p" (portrait) અને "legal" ને બદલે "a4" કરો
    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < totalPages; i++) {
      const currentState = await new Promise((resolve) => {
        setPdfProgress((prev) => {
          resolve(prev);
          return prev;
        });
      });

      if (currentState.isCancelled) break;

      const pageStart = window.performance.now();
      const pageElement = document.getElementById(`report-page-${i}`);

      if (!pageElement) {
        console.error(`Page element with ID 'report-page-${i}' not found.`);
        continue;
      }

      if (i > 0) {
        pdf.addPage();
      }

      try {
        const canvas = await html2canvas(pageElement, {
          scale: 2, // સારી ક્વોલિટી માટે
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // 2. ફેરફાર: A4 સાઈઝ મુજબ પહોળાઈ અને ઊંચાઈ સેટ કરો
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // થોડી માર્જિન રાખવી હોય તો (દા.ત. 5mm બંને બાજુ)
        const margin = 5;
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // જો ઈમેજની ઊંચાઈ પેજ કરતા વધી જતી હોય તો તેને પેજમાં ફિટ કરો
        const finalImgHeight =
          imgHeight > pdfHeight - margin * 2
            ? pdfHeight - margin * 2
            : imgHeight;

        // 3. ફેરફાર: ઈમેજને પેજ પર સેન્ટર કરવા માટે (x, y) કોર્ડિનેટ્સ સેટ કરો
        pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, finalImgHeight);

        const pageEnd = window.performance.now();
        totalDuration += pageEnd - pageStart;

        const completedPages = i + 1;
        const percentage = Math.round((completedPages / totalPages) * 100);

        let timeRemaining = null;
        if (completedPages >= 2) {
          const averageTimePerPage = totalDuration / completedPages;
          timeRemaining = Math.round(
            (averageTimePerPage * (totalPages - completedPages)) / 1000
          );
        }

        setPdfProgress((prev) => ({
          ...prev,
          completedPages,
          percentage,
          timeRemaining,
        }));
      } catch (error) {
        console.error("Error generating PDF page:", error);
        break;
      }
    }

    if (!pdfProgress.isCancelled) {
      pdf.save(`Index_Report_${village || "Village"}.pdf`);
    }

    setPdfProgress((prev) => ({ ...prev, isGenerating: false }));

    // ⭐ CANCELLATION CHECK 2: Final state update based on whether it was cancelled or completed
    const finalState = await new Promise((resolve) => {
      setPdfProgress((prev) => {
        resolve(prev);
        // Determine final state message
        return {
          ...prev,
          isGenerating: false, // Stop loading spinner
          isCancelled: prev.isCancelled,
          // If cancelled, keep the current percentage; otherwise, set to 100%
          percentage: prev.isCancelled ? prev.percentage : 100,
          timeRemaining: null, // Clear ETA display
        };
      });
    });

    if (!finalState.isCancelled) {
      // 3. Finalize and Save PDF ONLY if not cancelled
      pdf.save("2. Akarni_Report.pdf");
      window.alert("PDF successfully saved.");
    } else {
      window.alert("PDF save operation skipped due to cancellation.");
    }
  };

  // const handleDownloadPDF = async () => {
  //   const pdf = new jsPDF("portrait", "mm", "legal");
  //   const totalPages = Math.ceil(records.length / 15);
  //   for (let i = 0; i < totalPages; i++) {
  //     const pageElement = document.getElementById(`report-page-${i}`);
  //     if (!pageElement) {
  //       console.error(`Page element with ID 'report-page-${i}' not found.`);
  //       continue;
  //     }

  //     if (i > 0) {
  //       pdf.addPage();
  //     }

  //     try {
  //       const canvas = await html2canvas(pageElement, {
  //         scale: 3, // was 2, bumping to 3 makes sharper + bigger text
  //         useCORS: true,
  //         allowTaint: true,
  //       });
  //       const imgData = canvas.toDataURL("image/jpeg", 1.0);

  //       // const imgWidth = 255.6; // Legal landscape width in mm

  //       // const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       // pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

  //       // const imgWidth = 50;
  //       const imgWidth = pdf.internal.pageSize.getWidth() - 5; // 10mm margin left & right
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width + 20;
  //       pdf.addImage(imgData, "JPEG", 2, 2, imgWidth, imgHeight);
  //     } catch (error) {
  //       console.error("Error generating PDF page:", error);
  //     }
  //   }
  //   pdf.save("3. Index_Report.pdf");
  // };

  // ===================

  // Paginate records into chunks of 15
  // const pages = [];
  // let currentPage = [];
  // let rowCount = 0;
  // const PROPERTIES_PER_PAGE = 21;

  // sortedKeys.forEach((key) => {
  //   // Add group header (takes 1 row)
  //   if (rowCount >= PROPERTIES_PER_PAGE) {
  //     pages.push(currentPage);
  //     currentPage = [];
  //     rowCount = 0;
  //   }
  //   currentPage.push({ type: "header", key });
  //   rowCount++;

  //   groupedRecords[key].forEach((record) => {
  //     if (rowCount >= PROPERTIES_PER_PAGE) {
  //       pages.push(currentPage);
  //       currentPage = [{ type: "header", key }]; // repeat header on new page
  //       rowCount = 1;
  //     }
  //     currentPage.push({ type: "record", data: record });
  //     rowCount++;
  //   });
  // });

  // Push last page
  // if (currentPage.length > 0) {
  //   pages.push(currentPage);
  // }

  // { for (let i = 0; i < records.length; i += PROPERTIES_PER_PAGE) {
  //   pages.push(records.slice(i, i + PROPERTIES_PER_PAGE));
  // }}

  // const BUNDLE_SIZE = 100;
  // const finalRenderPages = buildFinalPages(pages, BUNDLE_SIZE);

  // function buildFinalPages(pages, pagesPerBundle) {
  //   const final = [];
  //   const totalBundles = Math.ceil(pages.length / pagesPerBundle);

  //   for (let bundle = 1; bundle <= totalBundles; bundle++) {
  //     // 1. Cover page
  //     final.push({ type: "cover", bundle });

  //     // 2. Only bundle 1 gets benefits
  //     if (bundle === 1) {
  //       final.push({ type: "benefit", name: "panchayat" });
  //       final.push({ type: "benefit", name: "public" });
  //     }

  //     // 3. Main pages of this bundle
  //     const start = (bundle - 1) * pagesPerBundle;
  //     const end = start + pagesPerBundle;

  //     pages.slice(start, end).forEach((records, idx) => {
  //       final.push({
  //         type: "page",
  //         bundle,
  //         pageIndex: start + idx,
  //         pageRecords: records,
  //       });
  //     });
  //   }

  //   return final;
  // }

  const PROPERTIES_PER_PAGE = 21; // એક પેજ પર કેટલી લાઇન બતાવવી
  const BUNDLE_SIZE = 100; // કેટલા પેજ પછી કવર પેજ મૂકવું

  // 1. પહેલા ગ્રુપિંગના આધારે પેજીસ તૈયાર કરો
  const prepareDisplayPages = () => {
    const displayPages = [];
    let currentPage = [];
    let rowCount = 0;

    sortedKeys.forEach((key) => {
      // હેડર ચેક
      if (rowCount >= PROPERTIES_PER_PAGE) {
        displayPages.push(currentPage);
        currentPage = [];
        rowCount = 0;
      }
      currentPage.push({ type: "header", key });
      rowCount++;

      groupedRecords[key].forEach((record) => {
        if (rowCount >= PROPERTIES_PER_PAGE) {
          displayPages.push(currentPage);
          currentPage = [{ type: "header", key }]; // નવા પેજ પર હેડર રિપીટ
          rowCount = 1;
        }
        currentPage.push({ type: "record", data: record });
        rowCount++;
      });
    });

    if (currentPage.length > 0) displayPages.push(currentPage);
    return displayPages;
  };

  // 2. બંડલ અને કવર પેજ સાથે ફાઈનલ લિસ્ટ બનાવો
  const buildFinalPages = (allPages) => {
    const final = [];
    const totalBundles = Math.ceil(allPages.length / BUNDLE_SIZE);

    for (let b = 1; b <= totalBundles; b++) {
      // કવર પેજ (Index)
      final.push({ type: "cover", bundle: b });

      // મુખ્ય ડેટા પેજીસ
      const start = (b - 1) * BUNDLE_SIZE;
      const end = start + BUNDLE_SIZE;
      allPages.slice(start, end).forEach((pageRecords, idx) => {
        final.push({
          type: "data-page",
          bundle: b,
          actualPageIndex: start + idx,
          records: pageRecords,
        });
      });
    }
    return final;
  };

  const displayPages = prepareDisplayPages();
  const finalRenderPages = buildFinalPages(displayPages);
  console.log(finalRenderPages);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="text-2xl font-bold text-gray-700">
          લોડ થઈ રહ્યું છે...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gray-100 min-h-screen font-sans">
      {/* ડાઉનલોડ બટન */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleDownloadPDF}
          disabled={pdfProgress.isGenerating}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 disabled:opacity-50"
        >
          {pdfProgress.isGenerating
            ? "પ્રોસેસ ચાલુ છે..."
            : "Download Index PDF"}
        </button>
      </div>

      {pdfProgress.isGenerating && (
        // Progress Modal/Overlay
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="p-8 rounded-xl shadow-2xl w-full max-w-sm">
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

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  pdfProgress.isCancelled ? "bg-yellow-500" : "bg-green-600"
                }`}
                style={{ width: `${pdfProgress.percentage}%` }}
              ></div>
            </div>

            {/* Progress Details */}
            <p className="text-sm font-semibold text-gray-700 text-center mb-1">
              {pdfProgress.percentage}% Completed
            </p>
            <p className="text-xs text-gray-500 text-center mb-2">
              Page <b>{pdfProgress.completedPages}</b> of{" "}
              <b>{pdfProgress.totalPages}</b> done
            </p>

            {/* ETA Display */}
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

            {/* 🔴 CANCEL BUTTON */}
            <button
              onClick={handleCancel}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 disabled:bg-red-400"
              disabled={pdfProgress.isCancelled} // Disable if already signaled to cancel
            >
              {pdfProgress.isCancelled ? "Cancelling..." : "Cancel Generation"}
            </button>
          </div>
        </div>
      )}

      <br />
      <br />

      {/* Hidden container for PDF generation */}
      <div
        className="pdf-report-container"
        style={{ background: "#fff" }}
        // style={{ position: "absolute", left: "-9999px", maxWidth: "900px" }}
      >
        {finalRenderPages.map((item, idx) => {
          const pageId = `report-page-${idx}`;

          if (item.type === "cover") {
            return (
              <div
                key={idx}
                id={pageId}
                className="report-page legal-landscape-dimensions"
                style={{
                  // paddingLeft: "65px",
                  // paddingRight: "50px",
                  maxWidth: "800px",
                  // maxHeight: "800px",
                }}
              >
                <IndexIndex
                  part={item.bundle}
                  nop={PROPERTIES_PER_PAGE}
                  project={project}
                  totalHoouse={records?.length}
                />
              </div>
            );
          }

          return (
            <div
              className="watermark"
              style={{
                minHeight: "100%",
                position: "relative",
                // background: "red",
              }}
            >
              <div
                key={idx}
                id={pageId}
                className="report-page legal-landscape-dimensions"
                style={{
                  width: "100%",
                  position: "relative",
                  background: "transparent",
                }}
              >
                {/* Headers and Page Count */}
                <div
                  className="page-header-container"
                  style={{ position: "relative" }}
                >
                  <h1
                    className="heading"
                    style={{ fontSize: "16px", paddingTop: "25px" }}
                  >
                    Index Book - (પાનોત્રી બુક) ક, ખ, ગ, પ્રમાણે <br /> ગામનો
                    નમુના નંબર ૯/ડી - કરવેરા રજીસ્ટરની પાનોત્રીની યાદી{" "}
                  </h1>
                  <h2 className="subheading">સને {"2025/2026"}</h2>
                  <span
                    className="page-numberN"
                    style={{
                      fontSize: "20px",
                      // transform: "translateY(-20px)",
                      // position: "relative",
                    }}
                  >
                    પાના નં. {toGujaratiNumber(item.actualPageIndex + 1)}
                  </span>
                  <div
                    className="location-info"
                    style={{
                      paddingInline: "50px",
                      paddingBottom: 0,
                      marginBottom: 0,
                      paddingTop: "-25px",
                      marginTop: "-25px",
                    }}
                  >
                    <span>ગામ:- {village}</span>
                    <span>તાલુકો:- {taluka}</span>
                    <span>જિલ્લો:- {district}</span>
                  </div>
                </div>

                {/* Table Header using Divs */}
                <div
                  className="table-container"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    overflow: "hidden",
                    // paddingLeft: "30px",
                    paddingTop: 0,
                  }}
                >
                  <table className="divide-y" style={{ maxWidth: "100%" }}>
                    <thead className="sticky top-0 z-10">
                      <tr>
                        <th
                          className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                          style={{
                            color: "#000",
                            fontSize: "15px",
                            minWidth: "40px",
                            maxWidth: "40px",
                          }}
                          id="pdff"
                        >
                          <span
                            className="formatting"
                            style={{ textAlign: "center" }}
                          >
                            ક્રમ
                          </span>
                        </th>
                        <th
                          className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                          style={{
                            color: "#000",
                            fontSize: "15px",
                            maxWidth: "50px",
                          }}
                          id="pdff"
                        >
                          <span className="formatting">મિલ્ક્ત નંબર </span>
                        </th>
                        <th
                          className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                          style={{
                            color: "#000",
                            fontSize: "15px",
                            minWidth: "150px",
                          }}
                          id="pdff"
                        >
                          <span className="formatting">માલિકનું નામ </span>
                        </th>
                        <th
                          className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                          style={{
                            color: "#000",
                            fontSize: "15px",
                            minWidth: "150px",
                          }}
                          id="pdff"
                        >
                          <span className="formatting">વિસ્તારનું નામ </span>
                        </th>
                        <th
                          className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                          style={{
                            color: "#000",
                            fontSize: "15px",
                            maxWidth: "40px",
                          }}
                          id="pdff"
                        >
                          <span className="formatting">પાના નંબર </span>
                        </th>
                        <th
                          className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                          style={{
                            color: "#000",
                            fontSize: "15px",
                            maxWidth: "35px",
                          }}
                          id="pdff"
                        >
                          <span className="formatting">મોબાઈલ નંબર </span>
                        </th>
                      </tr>
                    </thead>
                    {/* Table Rows */}
                    <tbody>
                      {item?.records?.map((row, rIdx) =>
                        row.type === "header" ? (
                          <tr key={rIdx}>
                            <td
                              colSpan="6"
                              className="text-center font-bold"
                              id="pdff"
                              style={{ textWrap: "wrap" }}
                            >
                              <span className="formatting">{row.key}</span>
                            </td>
                          </tr>
                        ) : (
                          <tr key={rIdx}>
                            <td id="pdff" style={{ textWrap: "wrap" }}>
                              <span className="formatting">
                                {row.data[0] || ""}
                              </span>
                            </td>
                            <td id="pdff" style={{ textWrap: "wrap" }}>
                              <span className="formatting">
                                {row.data[2] || ""}
                              </span>
                            </td>
                            <td id="pdff" style={{ textWrap: "wrap" }}>
                              <span className="formatting">
                                {row.data[3] || ""}
                              </span>
                            </td>
                            <td id="pdff" style={{ textWrap: "wrap" }}>
                              <span className="formatting">
                                {row.data[1] || ""}
                              </span>
                            </td>
                            <td id="pdff" style={{ textWrap: "wrap" }}>
                              <span className="formatting">
                                {Math.ceil(row.data[0] / 15) || 0}
                              </span>
                            </td>
                            <td id="pdff" style={{ textWrap: "wrap" }}>
                              <span className="formatting">
                                {row.data[5] || ""}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* This is the visible, on-screen part */}
      <div
        id="report-content"
        className="w-full max-w-5xl rounded-xl shadow-lg p-6 sm:p-10 mb-8"
      >
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 leading-tight">
            Index Book - (પાનોત્રી બુક) ક, ખ, ગ, પ્રમાણે <br /> ગામનો નમુના નંબર
            ૯/ડી - કરવેરા રજીસ્ટરની પાનોત્રીની યાદી
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-600 mb-4">
            સને {"2025/2026"}
          </h2>
          <hr className="border-t-2 border-dashed border-gray-300 mx-auto w-full" />
        </header>

        {/* Village details section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-700 mb-8">
          <span className="p-3 rounded-lg shadow-sm">
            ગામ : <b className="font-semibold text-blue-800">{village}</b>
          </span>
          <span className="p-3 rounded-lg shadow-sm">
            તાલુકો : <b className="font-semibold text-blue-800">{taluka}</b>
          </span>
          <span className="p-3 rounded-lg shadow-sm">
            જીલ્લો : <b className="font-semibold text-blue-800">{district}</b>
          </span>
        </div>

        {/* Main analytics grid */}
        {records.length > 0 ? (
          <div className="table-container rounded-lg shadow-md border border-gray-200 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "white",
                      background: background,
                      fontSize: "15px",
                      maxWidth: "30px",
                    }}
                  >
                    ક્રમ નંબર
                  </th>
                  <th
                    className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "white",
                      background: background,
                      fontSize: "15px",
                      maxWidth: "30px",
                    }}
                  >
                    મિલ્ક્ત નંબર
                  </th>
                  <th
                    className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "white",
                      background: background,
                      fontSize: "15px",
                      minWidth: "150px",
                    }}
                  >
                    માલિકનું નામ
                  </th>
                  <th
                    className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "white",
                      background: background,
                      fontSize: "15px",
                      minWidth: "150px",
                    }}
                  >
                    વિસ્તારનું નામ
                  </th>
                  <th
                    className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "white",
                      background: background,
                      fontSize: "15px",
                      maxWidth: "40px",
                    }}
                  >
                    પાના નંબર
                  </th>
                  <th
                    className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                    style={{
                      color: "white",
                      background: background,
                      fontSize: "15px",
                      maxWidth: "20px",
                    }}
                  >
                    મોબાઈલ નંબર
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedKeys.map((key, index1) => (
                  <React.Fragment key={key}>
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center text-lg font-bold text-gray-700 bg-gray-200"
                        style={{ padding: "2px 2px" }}
                      >
                        {key}
                      </td>
                    </tr>
                    {groupedRecords[key].map((data, index) => (
                      <tr key={index}>
                        <td
                          className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                          style={{ padding: "3px 8px" }}
                        >
                          {data[0] || ""}
                        </td>
                        <td
                          className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                          style={{ padding: "3px 8px" }}
                        >
                          {data[2] || ""}
                        </td>
                        <td
                          className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                          style={{ padding: "3px 8px" }}
                        >
                          {data[3] || ""}
                        </td>
                        <td
                          className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                          style={{ padding: "3px 8px" }}
                        >
                          {data[1] || ""}
                        </td>
                        <td
                          className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                          style={{ padding: "3px 8px" }}
                        >
                          {Math.ceil(data[0] / 15)}
                        </td>
                        <td
                          className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                          style={{ padding: "3px 8px" }}
                        >
                          {data[5] || ""}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            કોઈ રેકોર્ડ મળ્યો નથી.
          </div>
        )}
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Download PDF
      </button>
    </div>
  );
};

export default IndexReport;
