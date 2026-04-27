import React, { useState, useEffect } from "react";
import "./SurvayReport.scss";
import apiPath from "../../isProduction";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import AkarniIndex from "../../components/conver/AkarniIndex";
import PanchayatBenefit from "../../components/conver/PanchayatBenefit";
import PublicBenefit from "../../components/conver/PublicBenefit";
import AkarniPage from "../../components/conver/AkarniPage";
import AkarniIndexRaw from "../../components/conver/AkarniIndexRaw";
import TharavPage1 from "../../components/conver/TharavPage1";
import TharavPage2 from "../../components/conver/TharavPage2";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toGujaratiNumber from "../../components/toGujaratiNumber";
import AkarniPageBlank from "../../components/conver/AkarniPageBlank";

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

const SurvayReport = () => {
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
      setRecords(result.data);
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
      phoneNumbers += Number(record[5] || 0) > 0 ? 1 : 0;
      tapConnections += Number(record[11] || 0);
      toilets += Number(record[12] || 0);
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

  const calculateValue = async () => {
    try {
      setLoading(true);
      toast.info("Calucating Values...");
      const data = await axios.put(
        `${await apiPath()}/api/sheet/ordervaluation/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setProject([]);
      fetchRecords();
      toast.success("Calculation Completed.");
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
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

  // const handleDownloadPDF = async () => {
  //   const totalPages = finalRenderPages.length;
  //   let totalDuration = 0;
  //   const startTime = window.performance.now();

  //   setPdfProgress({
  //     isGenerating: true,
  //     isCancelled: false,
  //     completedPages: 0,
  //     totalPages: totalPages,
  //     percentage: 0,
  //     timeRemaining: null,
  //   });

  //   const pdf = new jsPDF("landscape", "mm", "legal");

  //   for (let i = 0; i < totalPages; i++) {
  //     const currentState = await new Promise((resolve) => {
  //       setPdfProgress((prev) => {
  //         resolve(prev);
  //         return prev;
  //       });
  //     });

  //     if (currentState.isCancelled) {
  //       console.log("PDF generation cancelled by user.");
  //       break;
  //     }

  //     const pageStart = window.performance.now();
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
  //         scale: 2,
  //         logging: false,
  //         useCORS: true,
  //         allowTaint: true,
  //       });

  //       const imgData = canvas.toDataURL("image/jpeg", 1.0);
  //       const imgWidth = 355.6;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

  //       const pageEnd = window.performance.now();
  //       const pageDuration = pageEnd - pageStart;
  //       totalDuration += pageDuration;

  //       const completedPages = i + 1;
  //       const percentage = Math.round((completedPages / totalPages) * 100);

  //       let timeRemaining = null;

  //       if (completedPages >= 2) {
  //         const averageTimePerPage = totalDuration / completedPages;
  //         const pagesRemaining = totalPages - completedPages;
  //         timeRemaining = Math.max(
  //           0,
  //           Math.round((averageTimePerPage * pagesRemaining) / 1000),
  //         );
  //       }

  //       setPdfProgress((prev) => ({
  //         ...prev,
  //         completedPages: completedPages,
  //         percentage: percentage,
  //         timeRemaining: timeRemaining,
  //       }));
  //     } catch (error) {
  //       console.error("Error generating PDF page:", error);
  //       break;
  //     }
  //   }

  //   const finalState = await new Promise((resolve) => {
  //     setPdfProgress((prev) => {
  //       resolve(prev);
  //       return {
  //         ...prev,
  //         isGenerating: false,
  //         isCancelled: prev.isCancelled,
  //         percentage: prev.isCancelled ? prev.percentage : 100,
  //         timeRemaining: null,
  //       };
  //     });
  //   });

  //   if (!finalState.isCancelled) {
  //     pdf.save(`2. આકારણી રજીસ્ટર - ${project?.spot?.gaam}.pdf`);
  //     window.alert("PDF successfully saved.");
  //   } else {
  //     window.alert("PDF save operation skipped due to cancellation.");
  //   }
  // };

  const handleDownloadPDF = async (mode) => {
    const isSeparate = project?.details?.seperatecommercial === true;

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

    if (isSeparate) {
      // Residential PDF
      if (residentialIndexes.length > 0) {
        setPdfProgress({
          isGenerating: true,
          isCancelled: false,
          completedPages: 0,
          totalPages: residentialIndexes.length,
          percentage: 0,
          timeRemaining: null,
        });

        await generatePDF(
          residentialIndexes,
          `Residential - આકારણી રજીસ્ટર - ${project?.spot?.gaam}.pdf`,
        );
      }

      // Commercial PDF
      if (commercialIndexes.length > 0) {
        setPdfProgress({
          isGenerating: true,
          isCancelled: false,
          completedPages: 0,
          totalPages: commercialIndexes.length,
          percentage: 0,
          timeRemaining: null,
        });

        await generatePDF(
          commercialIndexes,
          `Commercial - આકારણી રજીસ્ટર - ${project?.spot?.gaam}.pdf`,
        );
      }

      window.alert("Residential & Commercial PDFs generated successfully.");
    } else {
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
        `2. આકારણી રજીસ્ટર - ${project?.spot?.gaam}.pdf`,
      );

      window.alert("PDF successfully saved.");
    }
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

    saveAs(file, "Akarni_Register.xlsx");
  };

  const SeparateCommercialProperties = async () => {
    if (
      !window.confirm(
        "Are you sure you want to separate Commercial Properties?",
      )
    )
      return;

    try {
      setLoading(true);
      toast.info("Seperating Commercial Properties...");

      const data = await axios.post(
        `${await apiPath()}/api/sheet/seperatecommercial/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(data);
      setProject([]);
      setRecords([]);
      fetchRecords();
      fetchProject();
      toast.success("Commercial Properties Separated.");
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    } finally {
      setLoading(false);
    }
  }; // --- LOGIC STARTS HERE ---
  const PROPERTIES_PER_PAGE = 7;
  const BUNDLE_SIZE = 100;

  const finalRenderPages = buildFinalPages(
    records,
    BUNDLE_SIZE,
    PROPERTIES_PER_PAGE,
  );

  function isCommercialProperty(row) {
    const category = row[8] ? row[8].trim() : "";

    // 1️⃣ Category based
    if (commercialCategories.includes(category)) {
      return true;
    }

    // 2️⃣ Room details based ("દુકાન")
    if (row[15]) {
      try {
        const floors = JSON.parse(row[15]);

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

  function buildFinalPages(allRecords, pagesPerBundle, recordsPerPage) {
    if (!allRecords || allRecords.length === 0) return [];

    const final = [];
    const isSeparate = project?.details?.seperatecommercial === true;
    const isRaw = project?.other?.status === "completed" || false;

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

    if (isSeparate) {
      // ==========================================
      // SEPARATE MODE (RESIDENTIAL + COMMERCIAL)
      // ==========================================

      const normalRecords = allRecords.filter((r) => !isCommercialProperty(r));

      const commercialRecords = allRecords.filter((r) =>
        isCommercialProperty(r),
      );

      const normalPages = chunkArray(normalRecords, recordsPerPage);
      const commercialPages = chunkArray(commercialRecords, recordsPerPage);

      let currentBundle = 1;

      // ---------- RESIDENTIAL ----------
      const totalNormalBundles =
        Math.ceil(normalPages.length / pagesPerBundle) || 1;

      for (let b = 1; b <= totalNormalBundles; b++) {
        const start = (b - 1) * pagesPerBundle;
        const end = start + pagesPerBundle;
        const pagesForThisBundle = normalPages.slice(start, end);

        const coverProperties = pagesForThisBundle.reduce(
          (sum, p) => sum + p.length,
          0,
        );

        const pageFrom = globalPageNumber;
        const pageTo = globalPageNumber + pagesForThisBundle.length - 1;

        final.push({
          type: "cover",
          bundle: currentBundle,
          name: "રહેણાંક મિલકત",
          commercial: false,

          section: "residential",
          part: b,
          totalParts: totalNormalBundles,

          // 👇 NEW
          coverProperties,
          pageFrom,
          pageTo,
        });

        if (currentBundle === 1 && isRaw) {
          final.push({ type: "benefit", name: "panchayat" });
          final.push({ type: "benefit", name: "public" });

          final.push({ type: "tharav", name: "committee" });
        }

        pagesForThisBundle.forEach((pageRecs) => {
          final.push({
            type: "page",
            bundle: currentBundle,
            pageIndex: globalPageNumber - 1,
            pageRecords: pageRecs,
            isCommercial: false,
            commercial: false,
          });
          globalPageNumber++;
        });

        currentBundle++;
      }

      if (isRaw) {
        final.push({
          type: "blank",
          name: "register",
          pageIndex: globalPageNumber - 1,
        });
        globalPageNumber++;
        final.push({
          type: "blank",
          name: "register",
          pageIndex: globalPageNumber - 1,
        });
        globalPageNumber++;

        final.push({ type: "tharav", name: "certificate" });
      }

      // ---------- COMMERCIAL ----------
      if (commercialPages.length > 0) {
        const totalCommBundles = Math.ceil(
          commercialPages.length / pagesPerBundle,
        );

        for (let b = 1; b <= totalCommBundles; b++) {
          const start = (b - 1) * pagesPerBundle;
          const end = start + pagesPerBundle;
          const pagesForThisBundle = commercialPages.slice(start, end);

          const coverProperties = pagesForThisBundle.reduce(
            (sum, p) => sum + p.length,
            0,
          );

          const pageFrom = globalPageNumber;
          const pageTo = globalPageNumber + pagesForThisBundle.length - 1;

          final.push({
            type: "cover",
            bundle: currentBundle,
            name: "કોમર્શિયલ મિલકત",
            commercial: true,
            totalNormalBundles: totalNormalBundles,

            section: "commercial",
            part: b,
            totalParts: totalCommBundles,

            // 👇 NEW
            coverProperties,
            pageFrom,
            pageTo,
          });

          pagesForThisBundle.forEach((pageRecs) => {
            final.push({
              type: "page",
              bundle: currentBundle,
              pageIndex: globalPageNumber - 1,
              pageRecords: pageRecs,
              isCommercial: true,
              commercial: true,
            });

            globalPageNumber++;
          });

          currentBundle++;
        }

        final.push({
          type: "blank",
          name: "register",
          pageIndex: globalPageNumber - 1,
        });
        globalPageNumber++;
        final.push({
          type: "blank",
          name: "register",
          pageIndex: globalPageNumber - 1,
        });
        globalPageNumber++;
      }
    } else {
      // ==========================================
      // MIXED MODE
      // ==========================================

      const pages = chunkArray(allRecords, recordsPerPage);
      const totalBundles = Math.ceil(pages.length / pagesPerBundle);

      for (let bundle = 1; bundle <= totalBundles; bundle++) {
        const start = (bundle - 1) * pagesPerBundle;
        const end = start + pagesPerBundle;
        const pagesForThisBundle = pages.slice(start, end);

        const coverProperties = pagesForThisBundle.reduce(
          (sum, p) => sum + p.length,
          0,
        );

        const pageFrom = globalPageNumber;
        const pageTo = globalPageNumber + pagesForThisBundle.length - 1;

        final.push({
          type: "cover",
          bundle,
          name: "",
          part: bundle,
          totalParts: totalBundles,

          // 👇 NEW
          coverProperties,
          pageFrom,
          pageTo,
        });

        if (bundle === 1 && isRaw) {
          final.push({ type: "benefit", name: "panchayat" });
          final.push({ type: "benefit", name: "public" });

          final.push({ type: "tharav", name: "committee" });
        }

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

      if (isRaw) {
        final.push({
          type: "blank",
          name: "register",
          pageIndex: globalPageNumber - 1,
        });
        globalPageNumber++;
        final.push({
          type: "blank",
          name: "register",
          pageIndex: globalPageNumber - 1,
        });
        globalPageNumber++;

        final.push({ type: "tharav", name: "certificate" });
      }
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
        {project?.details?.seperatecommercial ? (
          <>
            <button
              onClick={() => handleDownloadPDF("res")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
              disabled={pdfProgress.isGenerating}
            >
              {pdfProgress.isGenerating
                ? "Generating..."
                : "Download PDF (Residencial)"}
            </button>

            <button
              onClick={() => handleDownloadPDF("com")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
              disabled={pdfProgress.isGenerating}
            >
              {pdfProgress.isGenerating
                ? "Generating..."
                : "Download PDF (Commercial)"}
            </button>
          </>
        ) : (
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
            disabled={pdfProgress.isGenerating}
          >
            {pdfProgress.isGenerating ? "Generating..." : "Download PDF"}
          </button>
        )}

        <button
          onClick={handleDownloadExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
        >
          Download Excel
        </button>
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

      <button
        onClick={calculateValue}
        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        Calculate Property Value & Tax
      </button>

      <br />
      <br />

      <button
        onClick={() => navigation(`/excel/akarni/${projectId}`)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
      >
        Edit with Excel Style
      </button>

      <br />
      <br />
      <br />

      <button
        onClick={SeparateCommercialProperties}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
      >
        Separate Commercial Properties!
      </button>

      <br />
      <br />
      <br />
      <br />
      <br />

      {project?.details?.seperatecommercial ? (
        <span className="text-green-600 font-bold">
          COMMERCIAL SEPARATION ACTIVE
          {/* <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
            onClick={() => {
              setShowCommercial((prev) => !prev);
            }}
          >
            {showCommercial ? "Show Residencial" : "Show Commercial"}
          </button> */}
        </span>
      ) : (
        <span className="text-gray-500">Normal Mode</span>
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

          if (item.type === "cover") {
            return (
              <div
                key={idx}
                id={id}
                className={`report-page legal-landscape-dimensions ${project?.other?.status === "completed" && "cover-bg"}`}
                style={{
                  paddingLeft: "80px",
                  paddingRight: "50px",
                  maxHeight: "800px",
                }}
              >
                {project?.other?.status === "completed" ? (
                  <AkarniIndex
                    key={idx}
                    title={item?.name} // Pass the dynamic title (Residential/Commercial)
                    part={item.bundle}
                    project={project}
                    totalHoouse={records?.length}
                    commercial={item.commercial}
                    coverProperties={item.coverProperties}
                    pageFrom={item.pageFrom}
                    pageTo={item.pageTo}
                    totalNormalBundles={item.totalNormalBundles || 0}
                  />
                ) : (
                  <AkarniIndexRaw
                    key={idx}
                    title={item?.name} // Pass the dynamic title (Residential/Commercial)
                    part={item.bundle}
                    project={project}
                    totalHoouse={records?.length}
                    commercial={item.commercial}
                    coverProperties={item.coverProperties}
                    pageFrom={item.pageFrom}
                    pageTo={item.pageTo}
                    totalNormalBundles={item.totalNormalBundles || 0}
                  />
                )}
              </div>
            );
          }

          if (item.type === "benefit") {
            return (
              <div
                key={idx}
                id={id}
                className="report-page legal-landscape-dimensions"
                style={{
                  paddingLeft: "65px",
                  paddingRight: "40px",
                  maxHeight: "800px",
                }}
              >
                {item.name === "panchayat" && <PanchayatBenefit />}
                {item.name === "public" && <PublicBenefit />}
              </div>
            );
          }

          if (item.type === "tharav") {
            return (
              <div
                key={idx}
                id={id}
                className="report-page legal-landscape-dimensions"
                style={{
                  paddingLeft: "65px",
                  paddingRight: "40px",
                  maxHeight: "800px",
                }}
              >
                {item.name === "committee" && <TharavPage1 project={project} />}
                {item.name === "certificate" && (
                  <TharavPage2 project={project} />
                )}
              </div>
            );
          }

          if (item.type === "blank") {
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
                <AkarniPageBlank
                  project={project}
                  pageIndex={item?.pageIndex}
                  pageRecords={PROPERTIES_PER_PAGE}
                  totalHoouse={records?.length}
                  current={finalRenderPages.length + idx + 1}
                  totalPages={finalRenderPages?.length}
                  count={count}
                  isCommercial={false}
                />
              </div>
            );
          }

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
                isCommercial={item?.isCommercial}
              />
            </div>
          );
        })}
      </div>

      <div className="visible-report-container">
        <h1 className="text-xl font-bold text-center mb-0 text-gray-800">
          પંચાયત હિસાબ નમુનો નંબર - ૮ (આકારણી રજીસ્ટર)
        </h1>
        <h2 className="text-l text-center mb-2 text-gray-600">
          સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની
          યાદી
        </h2>

        <div className="location-info-visible">
          <h3>ગામ:- {project?.spot?.gaam}</h3>
          <h3>તાલુકો:- {project?.spot?.taluka}</h3>
          <h3>જિલ્લો:- {project?.spot?.district}</h3>
        </div>

        <div className="table-responsive">
          <table className="report-table">
            <thead className="thead">
              <tr>
                <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  અનું ક્રમાંક
                </th>
                <th className="th" rowSpan="2" style={{ minWidth: "130px" }}>
                  વિસ્તારનું નામ
                </th>
                <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  મિલ્કત ક્રમાંક
                </th>
                <th className="th" rowSpan="2" style={{ minWidth: "250px" }}>
                  મિલ્કતનું વર્ણન
                </th>
                {/* <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  બી.પ.
                </th> */}
                <th className="th" rowSpan="2" style={{ minWidth: "170px" }}>
                  માલિકનું નામ
                </th>
                <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  જુનો મિ.નં.
                </th>
                <th className="th" rowSpan="2" style={{ minWidth: "100px" }}>
                  મોબાઈલ નંબર
                </th>
                <th className="th" rowSpan="2" style={{ minWidth: "100px" }}>
                  મિલ્કતની કિંમત (₹)
                </th>
                <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  આકારેલ વેરાની રકમ (₹)
                </th>

                <th className="th" colSpan="2">
                  અન્ય સુવિધા
                </th>
                <th className="th" rowSpan="2" style={{ minWidth: "130px" }}>
                  નોંધ / રીમાર્કસ
                </th>
              </tr>
              <tr>
                <th className="th">નળ</th>
                <th className="th">શોચાલય</th>
              </tr>
              <tr>
                {Array.from({ length: 13 }).map((_, index) => (
                  <th
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      textAlign: "center",
                      color: "black",
                      background: "#fff",
                    }}
                    key={index}
                  >
                    {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tbody">
              {records.map((record, index) => (
                <tr key={index}>
                  <td className="td">{record[0]}</td>
                  <td className="td">{record[1]}</td>
                  <td className="td">{record[2]}</td>
                  <td className="td">
                    {record[16]} {record[7] && `, '${record[7]}'`}{" "}
                  </td>
                  {/* <td className="td">
                    {record[13]?.includes("બી.પ.") ? "બી.પ." : ""}
                  </td> */}
                  <td className="td">{record[3]}</td>
                  <td className="td">{record[5]}</td>
                  <td className="td">{record[6]}</td>
                  <td className="td">{record[19]}</td>
                  <td className="td">{record[20]}</td>
                  {/* <td className="td">{record[6]}</td> */}
                  <td className="td">{record[12]}</td>
                  <td className="td">{record[13]}</td>
                  <td className="td">{record[14]}</td>
                </tr>
              ))}

              {records.length === 0 && !loading && !error && (
                <tr>
                  <td colSpan="14" className="td text-center">
                    કોઈ રેકોર્ડ ઉપલબ્ધ નથી.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SurvayReport;

// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   PDFDownloadLink,
// } from "@react-pdf/renderer";

// // --- 1. DUMMY DATA (Simulating your records) ---
// const dummyData = [
//   { id: 1, name: "Jatin Patel", city: "Ahmedabad", amount: 5000 },
//   { id: 2, name: "Rahul Sharma", city: "Surat", amount: 2000 },
//   { id: 3, name: "Sneha Gupta", city: "Vadodara", amount: 1500 },
//   { id: 4, name: "Amit Shah", city: "Rajkot", amount: 9000 },
//   { id: 5, name: "Priya Desai", city: "Gandhinagar", amount: 3500 },
//   { id: 6, name: "Vikram Singh", city: "Bhavnagar", amount: 1200 },
//   { id: 7, name: "Anjali Mehta", city: "Jamnagar", amount: 4800 },
//   { id: 8, name: "Karan Johar", city: "Mumbai", amount: 7000 },
// ];

// // --- 2. STYLES (Simple CSS for PDF) ---
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     backgroundColor: "#ffffff",
//     fontFamily: "Helvetica", // Default font (English Only for Demo to ensure it works)
//   },
//   header: {
//     fontSize: 20,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "blue",
//     fontWeight: "bold",
//   },
//   table: {
//     display: "table",
//     width: "auto",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//   },
//   tableRow: {
//     margin: "auto",
//     flexDirection: "row",
//   },
//   tableCol: {
//     width: "25%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//   },
//   tableCell: {
//     margin: 5,
//     fontSize: 10,
//   },
// });

// // --- 3. THE PDF DOCUMENT DESIGN ---
// const MyDocument = () => (
//   <Document>
//     {/* PAGE 1 */}
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.header}>Demo Report - Page 1</Text>
//       <Text style={{ marginBottom: 10 }}>
//         This is a test PDF to check if the library works.
//       </Text>

//       {/* Simple Table */}
//       <View style={styles.table}>
//         {/* Table Header */}
//         <View style={{ ...styles.tableRow, backgroundColor: "#eee" }}>
//           <View style={styles.tableCol}>
//             <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>ID</Text>
//           </View>
//           <View style={styles.tableCol}>
//             <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
//               Name
//             </Text>
//           </View>
//           <View style={styles.tableCol}>
//             <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
//               City
//             </Text>
//           </View>
//           <View style={styles.tableCol}>
//             <Text style={{ ...styles.tableCell, fontWeight: "bold" }}>
//               Amount
//             </Text>
//           </View>
//         </View>

//         {/* First 4 Rows */}
//         {dummyData.slice(0, 4).map((item) => (
//           <View style={styles.tableRow} key={item.id}>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{item.id}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{item.name}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{item.city}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{item.amount}</Text>
//             </View>
//           </View>
//         ))}
//       </View>
//       <Text
//         style={{ position: "absolute", bottom: 30, right: 30, fontSize: 10 }}
//       >
//         Page 1
//       </Text>
//     </Page>

//     {/* PAGE 2 (Showing that multi-page works) */}
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.header}>Demo Report - Page 2</Text>
//       <Text style={{ marginBottom: 10 }}>Continued Data...</Text>

//       <View style={styles.table}>
//         {/* Remaining Rows */}
//         {dummyData.slice(4, 8).map((item) => (
//           <View style={styles.tableRow} key={item.id}>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{item.id}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{item.name}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{item.city}</Text>
//             </View>
//             <View style={styles.tableCol}>
//               <Text style={styles.tableCell}>{item.amount}</Text>
//             </View>
//           </View>
//         ))}
//       </View>
//       <Text
//         style={{ position: "absolute", bottom: 30, right: 30, fontSize: 10 }}
//       >
//         Page 2
//       </Text>
//     </Page>
//   </Document>
// );

// // --- 4. THE BUTTON COMPONENT ---
// const SurvayReport = () => (
//   <div
//     style={{
//       padding: "50px",
//       textAlign: "center",
//       border: "2px dashed gray",
//       margin: "20px",
//     }}
//   >
//     <h2>PDF Generator Prototype</h2>
//     <p>Click below to test basic PDF generation</p>

//     <br />

//     <PDFDownloadLink document={<MyDocument />} fileName="test_demo.pdf">
//       {({ blob, url, loading, error }) =>
//         loading ? (
//           <button
//             style={{ padding: "10px 20px", background: "gray", color: "white" }}
//           >
//             Loading...
//           </button>
//         ) : (
//           <button
//             style={{
//               padding: "10px 20px",
//               background: "blue",
//               color: "white",
//               cursor: "pointer",
//             }}
//           >
//             Download Demo PDF
//           </button>
//         )
//       }
//     </PDFDownloadLink>
//   </div>
// );

// export default SurvayReport;
