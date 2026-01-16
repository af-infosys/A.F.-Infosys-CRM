import React, { useState, useEffect } from "react";

import "./SurvayReport.scss";
import toGujaratiNumber from "../../components/toGujaratiNumber";

import apiPath from "../../isProduction";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import TaxIndex from "../../components/conver/TaxIndex";
import PublicBenefit from "../../components/conver/PublicBenefit";
import PanchayatBenefit from "../../components/conver/PanchayatBenefit";

const TaxRegister = () => {
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchRecords = async () => {
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

      setRecords(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);

      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

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
        }
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
        }
      );

      console.log(data?.data?.data || []);
      setProject(data?.data?.data || []);

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

  const handleDownloadPDF = async () => {
    const totalPages = finalRenderPages.length;
    // const totalPages = Math.ceil(records.length / PROPERTIES_PER_PAGE) + 3;
    // const totalPages = 5;

    let totalDuration = 0; // Cumulative time taken (ms)

    const startTime = window.performance.now();

    setPdfProgress({
      isGenerating: true,
      isCancelled: false,
      completedPages: 0,
      totalPages: totalPages,
      percentage: 0,
      timeRemaining: null,
    });

    // jsPDF is now treated as a global variable
    const pdf = new jsPDF("landscape", "mm", "legal");

    for (let i = 0; i < totalPages; i++) {
      // Helper to reliably get the latest state (for checking the isCancelled flag)
      const currentState = await new Promise((resolve) => {
        setPdfProgress((prev) => {
          resolve(prev);
          return prev;
        });
      });

      if (currentState.isCancelled) {
        console.log("PDF generation cancelled by user.");
        break; // Exit the loop immediately
      }

      const pageStart = window.performance.now(); // Start timer for the current page

      const pageElement = document.getElementById(`report-page-${i}`);

      if (!pageElement) {
        console.error(`Page element with ID 'report-page-${i}' not found.`);
        continue;
      }

      if (i > 0) {
        pdf.addPage();
      }

      try {
        // html2canvas is now treated as a global variable
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          logging: false, // Set to false to reduce console clutter
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const imgWidth = 355.6;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

        const pageEnd = window.performance.now();
        const pageDuration = pageEnd - pageStart; // Time taken for this page (ms)
        totalDuration += pageDuration;

        const completedPages = i + 1;
        const percentage = Math.round((completedPages / totalPages) * 100);

        let timeRemaining = null;

        if (completedPages >= 2) {
          const averageTimePerPage = totalDuration / completedPages;
          const pagesRemaining = totalPages - completedPages;

          timeRemaining = Math.max(
            0,
            Math.round((averageTimePerPage * pagesRemaining) / 1000)
          );
        }

        // 2. Update Progress State with ETA
        setPdfProgress((prev) => ({
          ...prev,
          completedPages: completedPages,
          percentage: percentage,
          timeRemaining: timeRemaining,
        }));
      } catch (error) {
        console.error("Error generating PDF page:", error);
        break;
      }
    }

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
      pdf.save("3. Tax_Register.pdf");
      window.alert("PDF successfully saved.");
    } else {
      window.alert("PDF save operation skipped due to cancellation.");
    }
  };

  // const handleDownloadPDF = async () => {
  //   const pdf = new jsPDF("landscape", "mm", "legal");

  //   const totalPages = Math.ceil(records.length / 15);

  //   for (let i = 0; i < totalPages; i++) {
  //     const pageElement = document.getElementById(`report-page-${i}`);

  //     if (!pageElement) {
  //       console.error(`Page element with ID 'report-page-${i}' not found.`);

  //       continue;
  //     }

  //     // Add a page before adding content, except for the first page

  //     if (i > 0) {
  //       pdf.addPage();
  //     }

  //     try {
  //       const canvas = await html2canvas(pageElement, {
  //         scale: 2,

  //         logging: true,

  //         useCORS: true,

  //         allowTaint: true,
  //       });

  //       const imgData = canvas.toDataURL("image/jpeg", 1.0);

  //       // const imgWidth = 355; // Legal landscape width in mm
  //       const imgWidth = pdf.internal.pageSize.getWidth();
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
  //     } catch (error) {
  //       console.error("Error generating PDF page:", error);
  //     }
  //   }

  //   pdf.save("4. Tax_Register.pdf");
  // };

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

  // Paginate records into chunks of 15

  // const pages = [];
  // const pageLimit = 6;

  // for (let i = 0; i < records.length; i += pageLimit) {
  //   pages.push(records.slice(i, i + pageLimit));
  // }

  // Paginate records into chunks of 6
  const PROPERTIES_PER_PAGE = 6;

  const pages = [];
  for (let i = 0; i < records.length; i += PROPERTIES_PER_PAGE) {
    pages.push(records.slice(i, i + PROPERTIES_PER_PAGE));
  }

  const BUNDLE_SIZE = 100;
  const finalRenderPages = buildFinalPages(pages, BUNDLE_SIZE);

  function buildFinalPages(pages, pagesPerBundle) {
    const final = [];
    const totalBundles = Math.ceil(pages.length / pagesPerBundle);

    for (let bundle = 1; bundle <= totalBundles; bundle++) {
      // 1. Cover page
      final.push({ type: "cover", bundle });

      // 2. Only bundle 1 gets benefits
      // if (bundle === 1) {
      //   final.push({ type: "benefit", name: "panchayat" });
      //   final.push({ type: "benefit", name: "public" });
      // }

      // 3. Main pages of this bundle
      const start = (bundle - 1) * pagesPerBundle;
      const end = start + pagesPerBundle;

      pages.slice(start, end).forEach((records, idx) => {
        final.push({
          type: "page",
          bundle,
          pageIndex: start + idx,
          pageRecords: records,
        });
      });
    }

    return final;
  }

  const calculatePageTotals = (pageRecords) => {
    const totals = {
      demand: { prev: 0, curr: 0, total: 0 },
      collection: { prev: 0, curr: 0, total: 0 },
      outstanding: { prev: 0, curr: 0, total: 0 },
      // This array maps tax categories to their index in the record array (20 to 25)
      taxCategories: [20, 21, 22, 23, 24, 25],
    };

    pageRecords.forEach((record) => {
      totals.taxCategories.forEach((colIndex) => {
        const taxData = JSON.parse(record[colIndex] || "{}");

        // Demand (માંગણું) - Index 0
        totals.demand.prev += taxData?.[0]?.prev || 0;
        totals.demand.curr += taxData?.[0]?.curr || 0;

        // Collection (વસુલાત) - Index 1
        totals.collection.prev += taxData?.[1]?.prev || 0;
        totals.collection.curr += taxData?.[1]?.curr || 0;

        // Outstanding (બાકી) - Index 2
        totals.outstanding.prev += taxData?.[2]?.prev || 0;
        totals.outstanding.curr += taxData?.[2]?.curr || 0;
      });
    });

    // Calculate the 'total' columns (prev + curr) for all three rows
    totals.demand.total = totals.demand.prev + totals.demand.curr;
    totals.collection.total = totals.collection.prev + totals.collection.curr;
    totals.outstanding.total =
      totals.outstanding.prev + totals.outstanding.curr;

    return totals;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={handleDownloadPDF}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
        disabled={pdfProgress.isGenerating} // Disable button while generating
      >
        {pdfProgress.isGenerating ? "Generating..." : "Download PDF"}
      </button>
      {pdfProgress.isGenerating && (
        // Progress Modal/Overlay
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
      <br /> <br />
      <button
        onClick={calculateValue}
        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Calculate
      </button>
      <br />
      <br />
      <div
        className="pdf-report-container"
        // style={{ position: "absolute", left: "-9999px" }}
      >
        {finalRenderPages.map((item, idx) => {
          {
            /* const pageTotals = calculatePageTotals(pageRecords); */
          }

          const id = `report-page-${idx}`;

          if (item.type === "cover") {
            return (
              <div
                key={id}
                id={id}
                className="report-page legal-landscape-dimensions"
                style={{
                  paddingLeft: "65px",
                  paddingRight: "50px",
                  maxHeight: "800px",
                }}
              >
                <TaxIndex
                  part={item.bundle}
                  nop={PROPERTIES_PER_PAGE}
                  project={project}
                  totalHoouse={records?.length}
                />
              </div>
            );
          }

          {
            /* if (item.type === "benefit") {
            return (
              <div
                key={id}
                id={id}
                className="report-page legal-landscape-dimensions"
                style={{
                  paddingLeft: "65px",
                  paddingRight: "50px",
                  maxHeight: "800px",
                }}
              >
                {item.name === "panchayat" && <PanchayatBenefit />}
                {item.name === "public" && <PublicBenefit />}
              </div>
            );
          } */
          }

          return (
            <div
              key={id}
              id={id}
              className="report-page legal-landscape-dimensions"
              style={{
                width: "1700px",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "55px",
              }}
            >
              <div
                className="watermark"
                style={{ minHeight: "100%", position: "relative" }}
              >
                {/* Headers and Page Count */}

                <div className="page-header-container">
                  <span
                    className="page-number"
                    style={{
                      fontSize: "20px",
                      transform: "translate(80px, 45px)",
                      color: "#000",
                    }}
                  >
                    પાના નં. {toGujaratiNumber(item.pageIndex + 1)}
                  </span>

                  <h1 className="heading" style={{ marginTop: "35px" }}>
                    ગામનો નમુના નંબર ૯ ડી - કરવેરા રજીસ્ટર - સન ૨૦૨૫/૨૬
                  </h1>

                  <div
                    className="location-info"
                    style={{ fontSize: "19px", paddingInline: "50px" }}
                  >
                    <span>ગામ:- {project?.spot?.gaam}</span>

                    <span>તાલુકો:- {project?.spot?.taluka}</span>

                    <span>જિલ્લો:- {project?.spot?.district}</span>
                  </div>
                </div>

                {/* Table Header using Divs */}
                <table
                  className="report-table"
                  id="pdff"
                  style={{ background: "transparent" }}
                >
                  <thead className="thead">
                    <tr>
                      <th
                        className="th"
                        rowSpan="2"
                        style={{ maxWidth: "45px" }}
                      >
                        <span className="formatting">અનું ક્રમાંક</span>
                      </th>

                      <th
                        className="th"
                        rowSpan="2"
                        style={{ maxWidth: "45px" }}
                      >
                        <span className="formatting">મિલ્કત ક્રમાંક</span>
                      </th>

                      <th
                        className="th"
                        rowSpan="2"
                        style={{ maxWidth: "90px" }}
                      >
                        <span className="formatting">વિસ્તારનું નામ</span>
                      </th>

                      <th
                        className="th"
                        rowSpan="2"
                        style={{ maxWidth: "90px" }}
                      >
                        <span className="formatting">ખાતેદારનું નામ</span>
                      </th>

                      <th
                        className="th"
                        rowSpan="2"
                        style={{ minWidth: "70px", maxWidth: "70px" }}
                      >
                        <span className="formatting">પહોચ નંબર તારીખ રકમ</span>
                      </th>

                      <th
                        className="th"
                        rowSpan="2"
                        style={{ maxWidth: "90px" }}
                      >
                        <span className="formatting">વિગત</span>
                      </th>

                      <th
                        className="th"
                        colSpan="3"
                        style={{ minWidth: "130px" }}
                      >
                        <span className="formatting">ઘર વેરો</span>
                      </th>

                      <th
                        className="th"
                        colSpan="3"
                        style={{ minWidth: "130px" }}
                      >
                        <span className="formatting">સામાન્ય પાણી વેરો</span>
                      </th>

                      <th
                        className="th"
                        colSpan="3"
                        style={{ minWidth: "130px" }}
                      >
                        <span className="formatting">ખાસ પાણી નળ વેરો</span>
                      </th>

                      <th
                        className="th"
                        colSpan="3"
                        style={{ minWidth: "130px" }}
                      >
                        <span className="formatting">દિવાબતી લાઈટ વેરો</span>
                      </th>

                      <th
                        className="th"
                        colSpan="3"
                        style={{ minWidth: "130px" }}
                      >
                        <span className="formatting">સફાઈ વેરો</span>
                      </th>

                      <th
                        className="th"
                        colSpan="3"
                        style={{ minWidth: "130px" }}
                      >
                        <span className="formatting">કુલ એકંદર</span>
                      </th>

                      <th
                        className="th"
                        style={{ maxWidth: "40px" }}
                        rowSpan="2"
                      >
                        <span className="formatting">ગઈ સાલના જાદે</span>
                      </th>
                    </tr>

                    <tr>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <>
                          <th className="th">
                            <span className="formatting">પા.બા</span>
                          </th>

                          <th className="th">
                            <span className="formatting">ચાલુ</span>
                          </th>
                          <th className="th">
                            <span className="formatting">કુલ</span>
                          </th>
                        </>
                      ))}
                    </tr>

                    {/* Index Start */}
                    <tr>
                      {/* 1 to 18 th for index */}
                      {Array.from({ length: 25 }).map((_, index) => (
                        <th
                          className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                          style={{
                            textAlign: "center",
                            color: "black",
                            background: "transparent",
                          }}
                          key={index}
                        >
                          {index + 1}
                        </th>
                      ))}
                    </tr>
                    {/* Index End */}
                  </thead>

                  {/* Table Rows using Divs */}

                  {item.pageRecords.map((record, index) => (
                    <tbody>
                      <tr key={index}>
                        <th rowSpan="3" style={{ textAlign: "center" }}>
                          <span className="formatting">{record[0]}</span>
                        </th>

                        <th rowSpan="3">
                          <span className="formatting">{record[2]}</span>
                        </th>

                        <th rowSpan="3">
                          <span className="formatting">{record[1]}</span>
                        </th>

                        <th
                          rowSpan="3"
                          // style={{ maxWidth: "150px" }}
                        >
                          <span className="formatting">{record[3]}</span>
                        </th>

                        <th rowSpan="3">{"--"}</th>

                        <td className="td">માંગણું</td>

                        {/* ઘર વેરો */}
                        <td className="td">
                          {JSON.parse(record[20] || "{}")?.[0]?.prev || 0}
                        </td>

                        {/* [{ "curr": 20, "prev": 0 }, { "curr": 0, "prev": 0 }, { "curr": 0, "prev": 0 }] */}

                        <td className="td">
                          {JSON.parse(record[20] || "{}")?.[0]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[20] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[20] || "{}")?.[0]?.prev || 0)}
                        </td>

                        {/* સામાન્ય પાણી વેરો */}
                        <td className="td">
                          {JSON.parse(record[21] || "{}")?.[0]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[21] || "{}")?.[0]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[21] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[21] || "{}")?.[0]?.prev || 0)}
                        </td>

                        {/* ખાસ પાણી નળ વેરો */}
                        <td className="td">
                          {JSON.parse(record[22] || "{}")?.[0]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[22] || "{}")?.[0]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[22] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[22] || "{}")?.[0]?.prev || 0)}
                        </td>

                        {/* દિવાબતી લાઈટ વેરો */}
                        <td className="td">
                          {JSON.parse(record[23] || "{}")?.[0]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[23] || "{}")?.[0]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[23] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[23] || "{}")?.[0]?.prev || 0)}
                        </td>

                        {/* સફાઈ વેરો */}
                        <td className="td">
                          {JSON.parse(record[24] || "{}")?.[0]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[24] || "{}")?.[0]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[24] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[24] || "{}")?.[0]?.prev || 0)}
                        </td>

                        {/* કુલ એકંદર */}
                        <td className="td">
                          {(JSON.parse(record[20] || "{}")?.[0]?.prev || 0) +
                            (JSON.parse(record[21] || "{}")?.[0]?.prev || 0) +
                            (JSON.parse(record[22] || "{}")?.[0]?.prev || 0) +
                            (JSON.parse(record[23] || "{}")?.[0]?.prev || 0) +
                            (JSON.parse(record[24] || "{}")?.[0]?.prev || 0)}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[20] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[21] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[22] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[23] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[24] || "{}")?.[0]?.curr || 0)}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[20] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[20] || "{}")?.[0]?.prev || 0) +
                            ((JSON.parse(record[21] || "{}")?.[0]?.curr || 0) +
                              (JSON.parse(record[21] || "{}")?.[0]?.prev ||
                                0)) +
                            ((JSON.parse(record[22] || "{}")?.[0]?.curr || 0) +
                              (JSON.parse(record[22] || "{}")?.[0]?.prev ||
                                0)) +
                            ((JSON.parse(record[23] || "{}")?.[0]?.curr || 0) +
                              (JSON.parse(record[23] || "{}")?.[0]?.prev ||
                                0)) +
                            ((JSON.parse(record[24] || "{}")?.[0]?.curr || 0) +
                              (JSON.parse(record[24] || "{}")?.[0]?.prev || 0))}
                        </td>

                        {/* ગઈ સાલના જાદે */}
                        <td className="td"></td>
                      </tr>

                      <tr>
                        <td className="td">વસુલાત</td>

                        {/* ઘર વેરો */}
                        <td className="td">
                          {JSON.parse(record[20] || "{}")?.[1]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[20] || "{}")?.[1]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[20] || "{}")?.[1]?.curr || 0) +
                            (JSON.parse(record[20] || "{}")?.[1]?.prev || 0)}
                        </td>

                        {/* સામાન્ય પાણી વેરો */}
                        <td className="td">
                          {JSON.parse(record[21] || "{}")?.[1]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[21] || "{}")?.[1]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[21] || "{}")?.[1]?.curr || 0) +
                            (JSON.parse(record[21] || "{}")?.[1]?.prev || 0)}
                        </td>

                        {/* ખાસ પાણી નળ વેરો */}
                        <td className="td">
                          {JSON.parse(record[22] || "{}")?.[1]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[22] || "{}")?.[1]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[22] || "{}")?.[1]?.curr || 0) +
                            (JSON.parse(record[22] || "{}")?.[1]?.prev || 0)}
                        </td>

                        {/* દિવાબતી લાઈટ વેરો */}
                        <td className="td">
                          {JSON.parse(record[23] || "{}")?.[1]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[23] || "{}")?.[1]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[23] || "{}")?.[1]?.curr || 0) +
                            (JSON.parse(record[23] || "{}")?.[1]?.prev || 0)}
                        </td>

                        {/* સફાઈ વેરો */}
                        <td className="td">
                          {JSON.parse(record[24] || "{}")?.[1]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[24] || "{}")?.[1]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[24] || "{}")?.[1]?.curr || 0) +
                            (JSON.parse(record[24] || "{}")?.[1]?.prev || 0)}
                        </td>

                        {/* કુલ એકંદર */}
                        <td className="td">
                          {JSON.parse(record[25] || "{}")?.[1]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[25] || "{}")?.[1]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[25] || "{}")?.[1]?.curr || 0) +
                            (JSON.parse(record[25] || "{}")?.[1]?.prev || 0)}
                        </td>

                        {/* ગઈ સાલના જાદે */}
                        <td className="td"></td>
                      </tr>

                      <tr>
                        <td className="td">બાકી</td>

                        {/* ઘર વેરો */}
                        <td className="td">
                          {JSON.parse(record[20] || "{}")?.[2]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[20] || "{}")?.[2]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[20] || "{}")?.[2]?.curr || 0) +
                            (JSON.parse(record[20] || "{}")?.[2]?.prev || 0)}
                        </td>

                        {/* સામાન્ય પાણી વેરો */}
                        <td className="td">
                          {JSON.parse(record[21] || "{}")?.[2]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[21] || "{}")?.[2]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[21] || "{}")?.[2]?.curr || 0) +
                            (JSON.parse(record[21] || "{}")?.[2]?.prev || 0)}
                        </td>

                        {/* ખાસ પાણી નળ વેરો */}
                        <td className="td">
                          {JSON.parse(record[22] || "{}")?.[2]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[22] || "{}")?.[2]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[22] || "{}")?.[2]?.curr || 0) +
                            (JSON.parse(record[22] || "{}")?.[2]?.prev || 0)}
                        </td>

                        {/* દિવાબતી લાઈટ વેરો */}
                        <td className="td">
                          {JSON.parse(record[23] || "{}")?.[2]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[23] || "{}")?.[2]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[23] || "{}")?.[2]?.curr || 0) +
                            (JSON.parse(record[23] || "{}")?.[2]?.prev || 0)}
                        </td>

                        {/* સફાઈ વેરો */}
                        <td className="td">
                          {JSON.parse(record[24] || "{}")?.[2]?.prev || 0}
                        </td>

                        <td className="td">
                          {JSON.parse(record[24] || "{}")?.[2]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[24] || "{}")?.[2]?.curr || 0) +
                            (JSON.parse(record[24] || "{}")?.[2]?.prev || 0)}
                        </td>

                        {/* કુલ એકંદર */}
                        <td className="td">
                          {(JSON.parse(record[20] || "{}")?.[2]?.prev || 0) +
                            (JSON.parse(record[21] || "{}")?.[2]?.prev || 0) +
                            (JSON.parse(record[22] || "{}")?.[2]?.prev || 0) +
                            (JSON.parse(record[23] || "{}")?.[2]?.prev || 0) +
                            (JSON.parse(record[24] || "{}")?.[2]?.prev || 0)}
                        </td>

                        <td className="td">
                          {JSON.parse(record[25] || "{}")?.[2]?.curr || 0}
                        </td>

                        <td className="td">
                          {(JSON.parse(record[25] || "{}")?.[2]?.curr || 0) +
                            (JSON.parse(record[25] || "{}")?.[2]?.prev || 0)}
                        </td>

                        {/* ગઈ સાલના જાદે */}
                        <td className="td"></td>
                      </tr>
                    </tbody>
                  ))}

                  {/* <tr>
                  <td colSpan="24">{"--"}</td>
                </tr> */}

                  <tr>
                    <th
                      colSpan="5"
                      rowSpan="3"
                      style={{
                        textAlign: "center",
                        color: "#000",
                        background: "transparent",
                      }}
                    >
                      પાનાનું કુલ
                    </th>
                    <td className="td">માંગણું</td>
                    {/* Iterate 6 times for the 6 tax categories and the final total column (Total = 6 categories * 3 columns = 18 data columns) */}
                    {Array.from({ length: 6 }).map((_, categoryIndex) => {
                      // Calculate the total for the current category's demand
                      // Demand is always at index [0]
                      const recordColumnIndex = 20 + categoryIndex; // 20 to 25
                      const totalForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return (
                            sum +
                            (taxData?.[0]?.prev || 0) +
                            (taxData?.[0]?.curr || 0)
                          );
                        },
                        0
                      );

                      // Need to calculate the Prev and Curr separately for each category as well, for consistency
                      const prevForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return sum + (taxData?.[0]?.prev || 0);
                        },
                        0
                      );
                      const currForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return sum + (taxData?.[0]?.curr || 0);
                        },
                        0
                      );

                      return (
                        <React.Fragment key={categoryIndex}>
                          <td className="td">{prevForCategory}</td>{" "}
                          {/* પા.બા */}
                          <td className="td">{currForCategory}</td> {/* ચાલુ */}
                          <td className="td">{totalForCategory}</td> {/* કુલ */}
                        </React.Fragment>
                      );
                    })}
                    {/* The last 'કુલ એકંદર' Demand totals (already calculated in pageTotals.demand) */}
                    {/* <td className="td">{pageTotals.demand.prev}</td> 
                  <td className="td">{pageTotals.demand.curr}</td>  
                  <td className="td">{pageTotals.demand.total}</td>  */}
                  </tr>

                  <tr>
                    <td className="td">વસુલાત</td>
                    {Array.from({ length: 6 }).map((_, categoryIndex) => {
                      const recordColumnIndex = 20 + categoryIndex;
                      const totalForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return (
                            sum +
                            (taxData?.[1]?.prev || 0) +
                            (taxData?.[1]?.curr || 0)
                          );
                        },
                        0
                      );
                      const prevForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return sum + (taxData?.[1]?.prev || 0);
                        },
                        0
                      );
                      const currForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return sum + (taxData?.[1]?.curr || 0);
                        },
                        0
                      );

                      return (
                        <React.Fragment key={categoryIndex}>
                          <td className="td">{prevForCategory}</td>{" "}
                          {/* પા.બા */}
                          <td className="td">{currForCategory}</td> {/* ચાલુ */}
                          <td className="td">{totalForCategory}</td> {/* કુલ */}
                        </React.Fragment>
                      );
                    })}
                    {/* 'કુલ એકંદર' Collection totals */}
                    {/* <td className="td">{pageTotals.collection.prev}</td>
                  <td className="td">{pageTotals.collection.curr}</td>
                  <td className="td">{pageTotals.collection.total}</td> */}
                  </tr>

                  {/* Outstanding Row: બાકી */}
                  <tr>
                    <td className="td">બાકી</td>
                    {Array.from({ length: 6 }).map((_, categoryIndex) => {
                      const recordColumnIndex = 20 + categoryIndex;
                      const totalForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return (
                            sum +
                            (taxData?.[2]?.prev || 0) +
                            (taxData?.[2]?.curr || 0)
                          );
                        },
                        0
                      );
                      const prevForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return sum + (taxData?.[2]?.prev || 0);
                        },
                        0
                      );
                      const currForCategory = item.pageRecords.reduce(
                        (sum, record) => {
                          const taxData = JSON.parse(
                            record[recordColumnIndex] || "{}"
                          );
                          return sum + (taxData?.[2]?.curr || 0);
                        },
                        0
                      );

                      return (
                        <React.Fragment key={categoryIndex}>
                          <td className="td">{prevForCategory}</td>{" "}
                          {/* પા.બા */}
                          <td className="td">{currForCategory}</td> {/* ચાલુ */}
                          <td className="td">{totalForCategory}</td> {/* કુલ */}
                        </React.Fragment>
                      );
                    })}
                    {/* 'કુલ એકંદર' Outstanding totals */}
                    {/* <td className="td">{pageTotals.outstanding.prev}</td> 
                  <td className="td">{pageTotals.outstanding.curr}</td> 
                  <td className="td">{pageTotals.outstanding.total}</td> */}
                  </tr>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      {/* This is the visible, on-screen part */}
      <div className="visible-report-container">
        <h1 className="text-xl font-bold text-center mb-0 text-gray-800">
          ગામનો નમુના નંબર ૯ ડી - કરવેરા રજીસ્ટર - સન ૨૦૨૫/૨૬
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

                <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  મિલ્કત ક્રમાંક
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "130px" }}>
                  વિસ્તારનું નામ
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "170px" }}>
                  ખાતેદારનું નામ
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "100px" }}>
                  પહોચ નંબર તારીખ રકમ
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "100px" }}>
                  વિગત
                </th>

                <th className="th" colSpan="3" style={{ minWidth: "70px" }}>
                  ઘર વેરો
                </th>

                <th className="th" colSpan="3" style={{ minWidth: "130px" }}>
                  સામાન્ય પાણી વેરો
                </th>

                <th className="th" colSpan="3" style={{ minWidth: "120px" }}>
                  ખાસ પાણી નળ વેરો
                </th>

                <th className="th" colSpan="3">
                  દિવાબતી લાઈટ વેરો
                </th>

                <th className="th" colSpan="3" style={{ minWidth: "130px" }}>
                  સફાઈ વેરો
                </th>

                <th className="th" colSpan="3" style={{ minWidth: "130px" }}>
                  કુલ એકંદર
                </th>

                <th className="th" rowSpan="2">
                  ગઈ સાલના જાદે
                </th>
              </tr>

              <tr>
                {Array.from({ length: 6 }).map((_, index) => (
                  <>
                    <th className="th">પા.બા</th>

                    <th className="th">ચાલુ</th>

                    <th className="th">કુલ</th>
                  </>
                ))}
              </tr>

              {/* Index Start */}
              <tr>
                {/* 1 to 18 th for index */}
                {Array.from({ length: 25 }).map((_, index) => (
                  <th
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      textAlign: "center",
                      color: "black",
                      background: "transparent",
                    }}
                    key={index}
                  >
                    {index + 1}
                  </th>
                ))}
              </tr>
              {/* Index End */}
            </thead>

            <tbody className="tbody">
              {records.map((record, index) => (
                <>
                  <tr key={index}>
                    <td className="td" rowSpan="3">
                      {record[0]}
                    </td>

                    <td className="td" rowSpan="3">
                      {record[2]}
                    </td>

                    <td className="td" rowSpan="3">
                      {record[1]}
                    </td>

                    <td className="td" rowSpan="3">
                      {record[3]}
                    </td>

                    <td className="td" rowSpan="3">
                      {"XX"}
                    </td>

                    <td className="td">માંગણું</td>

                    {/* ઘર વેરો */}
                    <td className="td">
                      {JSON.parse(record[20] || "{}")?.[0]?.prev || 0}
                    </td>

                    {/* [{ "curr": 20, "prev": 0 }, { "curr": 0, "prev": 0 }, { "curr": 0, "prev": 0 }] */}

                    <td className="td">
                      {JSON.parse(record[20] || "{}")?.[0]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[20] || "{}")?.[0]?.curr || 0) +
                        (JSON.parse(record[20] || "{}")?.[0]?.prev || 0)}
                    </td>

                    {/* સામાન્ય પાણી વેરો */}
                    <td className="td">
                      {JSON.parse(record[21] || "{}")?.[0]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[21] || "{}")?.[0]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[21] || "{}")?.[0]?.curr || 0) +
                        (JSON.parse(record[21] || "{}")?.[0]?.prev || 0)}
                    </td>

                    {/* ખાસ પાણી નળ વેરો */}
                    <td className="td">
                      {JSON.parse(record[22] || "{}")?.[0]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[22] || "{}")?.[0]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[22] || "{}")?.[0]?.curr || 0) +
                        (JSON.parse(record[22] || "{}")?.[0]?.prev || 0)}
                    </td>

                    {/* દિવાબતી લાઈટ વેરો */}
                    <td className="td">
                      {JSON.parse(record[23] || "{}")?.[0]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[23] || "{}")?.[0]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[23] || "{}")?.[0]?.curr || 0) +
                        (JSON.parse(record[23] || "{}")?.[0]?.prev || 0)}
                    </td>

                    {/* સફાઈ વેરો */}
                    <td className="td">
                      {JSON.parse(record[24] || "{}")?.[0]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[24] || "{}")?.[0]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[24] || "{}")?.[0]?.curr || 0) +
                        (JSON.parse(record[24] || "{}")?.[0]?.prev || 0)}
                    </td>

                    {/* કુલ એકંદર */}
                    <td className="td">
                      {JSON.parse(record[25] || "{}")?.[0]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[25] || "{}")?.[0]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[25] || "{}")?.[0]?.curr || 0) +
                        (JSON.parse(record[25] || "{}")?.[0]?.prev || 0)}
                    </td>

                    {/* ગઈ સાલના જાદે */}
                    <td className="td"></td>
                  </tr>

                  <tr>
                    <td className="td">વસુલાત</td>

                    {/* ઘર વેરો */}
                    <td className="td">
                      {JSON.parse(record[20] || "{}")?.[1]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[20] || "{}")?.[1]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[20] || "{}")?.[1]?.curr || 0) +
                        (JSON.parse(record[20] || "{}")?.[1]?.prev || 0)}
                    </td>

                    {/* સામાન્ય પાણી વેરો */}
                    <td className="td">
                      {JSON.parse(record[21] || "{}")?.[1]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[21] || "{}")?.[1]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[21] || "{}")?.[1]?.curr || 0) +
                        (JSON.parse(record[21] || "{}")?.[1]?.prev || 0)}
                    </td>

                    {/* ખાસ પાણી નળ વેરો */}
                    <td className="td">
                      {JSON.parse(record[22] || "{}")?.[1]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[22] || "{}")?.[1]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[22] || "{}")?.[1]?.curr || 0) +
                        (JSON.parse(record[22] || "{}")?.[1]?.prev || 0)}
                    </td>

                    {/* દિવાબતી લાઈટ વેરો */}
                    <td className="td">
                      {JSON.parse(record[23] || "{}")?.[1]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[23] || "{}")?.[1]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[23] || "{}")?.[1]?.curr || 0) +
                        (JSON.parse(record[23] || "{}")?.[1]?.prev || 0)}
                    </td>

                    {/* સફાઈ વેરો */}
                    <td className="td">
                      {JSON.parse(record[24] || "{}")?.[1]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[24] || "{}")?.[1]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[24] || "{}")?.[1]?.curr || 0) +
                        (JSON.parse(record[24] || "{}")?.[1]?.prev || 0)}
                    </td>

                    {/* કુલ એકંદર */}
                    <td className="td">
                      {JSON.parse(record[25] || "{}")?.[1]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[25] || "{}")?.[1]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[25] || "{}")?.[1]?.curr || 0) +
                        (JSON.parse(record[25] || "{}")?.[1]?.prev || 0)}
                    </td>

                    {/* ગઈ સાલના જાદે */}
                    <td className="td"></td>
                  </tr>

                  <tr>
                    <td className="td">બાકી</td>

                    {/* ઘર વેરો */}
                    <td className="td">
                      {JSON.parse(record[20] || "{}")?.[2]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[20] || "{}")?.[2]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[20] || "{}")?.[2]?.curr || 0) +
                        (JSON.parse(record[20] || "{}")?.[2]?.prev || 0)}
                    </td>

                    {/* સામાન્ય પાણી વેરો */}
                    <td className="td">
                      {JSON.parse(record[21] || "{}")?.[2]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[21] || "{}")?.[2]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[21] || "{}")?.[2]?.curr || 0) +
                        (JSON.parse(record[21] || "{}")?.[2]?.prev || 0)}
                    </td>

                    {/* ખાસ પાણી નળ વેરો */}
                    <td className="td">
                      {JSON.parse(record[22] || "{}")?.[2]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[22] || "{}")?.[2]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[22] || "{}")?.[2]?.curr || 0) +
                        (JSON.parse(record[22] || "{}")?.[2]?.prev || 0)}
                    </td>

                    {/* દિવાબતી લાઈટ વેરો */}
                    <td className="td">
                      {JSON.parse(record[23] || "{}")?.[2]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[23] || "{}")?.[2]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[23] || "{}")?.[2]?.curr || 0) +
                        (JSON.parse(record[23] || "{}")?.[2]?.prev || 0)}
                    </td>

                    {/* સફાઈ વેરો */}
                    <td className="td">
                      {JSON.parse(record[24] || "{}")?.[2]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[24] || "{}")?.[2]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[24] || "{}")?.[2]?.curr || 0) +
                        (JSON.parse(record[24] || "{}")?.[2]?.prev || 0)}
                    </td>

                    {/* કુલ એકંદર */}
                    <td className="td">
                      {JSON.parse(record[25] || "{}")?.[2]?.prev || 0}
                    </td>

                    <td className="td">
                      {JSON.parse(record[25] || "{}")?.[2]?.curr || 0}
                    </td>

                    <td className="td">
                      {(JSON.parse(record[25] || "{}")?.[2]?.curr || 0) +
                        (JSON.parse(record[25] || "{}")?.[2]?.prev || 0)}
                    </td>

                    {/* ગઈ સાલના જાદે */}
                    <td className="td"></td>
                  </tr>
                </>
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

export default TaxRegister;
