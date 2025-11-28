import React, { useState, useEffect } from "react";

import "./SurvayReport.scss";

import apiPath from "../../isProduction";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import toGujaratiNumber from "../../components/toGujaratiNumber";

const SurvayReport = () => {
  const navigation = useNavigate();

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

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

  const handleDownloadPDF0 = async () => {
    const pdf = new jsPDF("landscape", "mm", "legal");

    const totalPages = Math.ceil(records.length / 15);

    for (let i = 0; i < totalPages; i++) {
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
          scale: 2,

          logging: true,

          useCORS: true,

          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        const imgWidth = 355.6; // Legal landscape width in mm

        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      } catch (error) {
        console.error("Error generating PDF page:", error);
      }
    }

    pdf.save("2. Akarni_Report.pdf");
  };

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
    const totalPages = Math.ceil(records.length / 15);
    // const totalPages = 2;
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

        // Calculate ETA after a few pages for a stable average (starting from page 2)
        if (completedPages >= 2) {
          const averageTimePerPage = totalDuration / completedPages; // ms
          const pagesRemaining = totalPages - completedPages;
          // Calculate remaining time in seconds, ensuring it's not negative
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
        break; // Stop generation on error
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
      pdf.save("2. Akarni_Report.pdf");
      window.alert("PDF successfully saved.");
    } else {
      window.alert("PDF save operation skipped due to cancellation.");
    }
  };

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

  const pages = [];

  for (let i = 0; i < records.length; i += 15) {
    pages.push(records.slice(i, i + 15));
  }

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

      <div
        className="pdf-report-container"
        style={{ position: "absolute", left: "-9999px" }}
      >
        {pages.map((pageRecords, pageIndex) => (
          <div
            key={pageIndex}
            id={`report-page-${pageIndex}`}
            className="report-page legal-landscape-dimensions"
            style={{ paddingLeft: "65px", paddingRight: "20px" }}
          >
            {/* Headers and Page Count */}

            <div className="page-header-container">
              <span
                className="page-number"
                style={{
                  position: "relative",
                  color: "black",
                  fontSize: "16px",
                  transform: "translate(-3px, 65px)",
                }}
              >
                પાના નં. {toGujaratiNumber(pageIndex + 1)}
              </span>

              <h1 className="heading" style={{ marginTop: "38px" }}>
                પંચાયત હિસાબ નમુનો નંબર - ૮ (આકારણી રજીસ્ટર)
              </h1>

              <h2 className="subheading">
                સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો
                આકારણી ની યાદી
              </h2>

              <div
                className="location-info"
                style={{
                  paddingInline: "50px",
                }}
              >
                <span>ગામ:- {project?.spot?.gaam}</span>

                <span>તાલુકો:- {project?.spot?.taluka}</span>

                <span>જિલ્લો:- {project?.spot?.district}</span>
              </div>
            </div>

            {/* Table Header using Divs */}

            <div className="table-row table-header-row">
              <div className="table-cell s-no">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  અનું ક્રમાંક
                </span>
              </div>

              <div className="table-cell area-name">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  વિસ્તારનું નામ
                </span>
              </div>

              <div className="table-cell prop-no">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  મિલ્કત ક્રમાંક
                </span>
              </div>

              <div className="table-cell description">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  મિલ્કતનું વર્ણન
                </span>
              </div>

              <div className="table-cell s-no">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  બી.પ.
                </span>
              </div>

              <div className="table-cell owner">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  માલિકનું નામ
                </span>
              </div>

              <div className="table-cell old-prop-no">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  જુનો મિ.નં.
                </span>
              </div>

              <div className="table-cell mobile">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  મોબાઈલ નંબર
                </span>
              </div>

              <div className="table-cell valuation">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  મિલ્કતની
                  <br />
                  કિંમત
                </span>
              </div>

              <div className="table-cell tax">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  આકારેલ વેરાની રકમ
                </span>
              </div>

              <div className="table-cell prop-name">
                <span
                  className="formatting"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  મિલ્કત પર લખેલ
                  <br />
                  નામ
                </span>
              </div>

              {/* <div className="table-cell type">
                <span className="formatting"> મકાન ટાઈપ </span>
              </div> */}

              <div className="table-cell facility">
                <div className="facility-inner">
                  <div className="facility-title">
                    <span className="formatting"> અન્ય સુવિધા </span>
                  </div>

                  <div
                    className="facility-sub-row"
                    style={{ borderTop: "1px solid black" }}
                  >
                    <div className="table-cell">
                      <span className="formatting">નળ</span>
                    </div>

                    <div className="table-cell">
                      <span className="formatting">શોચાલય</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="table-cell remarks"
                style={{
                  fontSize: "10px",
                }}
              >
                નોંધ / રીમાર્કસ
              </div>
            </div>

            <div className="table-row table-header-row">
              <div className="table-cell s-no">
                <span className="formatting">1</span>
              </div>

              <div className="table-cell area-name">
                <span className="formatting">2</span>
              </div>

              <div className="table-cell prop-no">
                <span className="formatting">3</span>
              </div>

              <div className="table-cell description">
                <span className="formatting">4</span>
              </div>

              <div className="table-cell s-no">
                <span className="formatting">5</span>
              </div>

              <div className="table-cell owner">
                <span className="formatting">6</span>
              </div>

              <div className="table-cell old-prop-no">
                <span className="formatting">7</span>
              </div>

              <div className="table-cell mobile">
                <span className="formatting">8</span>
              </div>

              <div className="table-cell valuation">
                <span className="formatting">9</span>
              </div>

              <div className="table-cell tax">
                <span className="formatting">10</span>
              </div>

              <div className="table-cell prop-name">
                <span className="formatting">11</span>
              </div>

              <div className="table-cell" style={{ width: "3%" }}>
                <span className="formatting">12</span>
              </div>

              <div className="table-cell" style={{ width: "3%" }}>
                <span className="formatting">13</span>
              </div>

              <div className="table-cell remarks">
                <span className="formatting">14</span>
              </div>
            </div>

            {/* Table Rows using Divs */}

            {pageRecords.map((record, index) => (
              <div key={index} className="table-row">
                <div
                  className="table-cell s-no"
                  style={{ textAlign: "center" }}
                >
                  <span className="formatting">{record[0]}</span>
                </div>

                <div className="table-cell area-name">
                  <span className="formatting">{record[1]}</span>
                </div>

                <div className="table-cell prop-no">
                  <span className="formatting">{record[2]}</span>
                </div>

                <div className="table-cell description">
                  <span className="formatting">{record[15]}</span>
                </div>

                <div className="table-cell s-no">
                  <span className="formatting">
                    {record[13]?.includes("બી.પ.") ? "બી.પ." : ""}
                  </span>
                </div>

                <div className="table-cell owner">
                  <span className="formatting">{record[3]}</span>
                </div>

                <div className="table-cell old-prop-no">
                  <span className="formatting">{record[4]}</span>
                </div>

                <div className="table-cell mobile">
                  <span className="formatting">{record[5]}</span>
                </div>

                <div className="table-cell valuation">
                  <span className="formatting">{record[18]}</span>
                </div>

                <div className="table-cell tax">
                  <span className="formatting">{record[19]}</span>
                </div>

                <div className="table-cell prop-name">
                  <span className="formatting">{record[6]}</span>
                </div>

                {/* <div className="table-cell type">
                  <span className="formatting">{record[7]}</span>
                </div> */}

                <div className="table-cell tap">
                  <span className="formatting">{record[11]}</span>
                </div>

                <div className="table-cell toilet">
                  <span className="formatting">{record[12]}</span>
                </div>

                <div className="table-cell remarks">
                  <span className="formatting">{record[13]}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* This is the visible, on-screen part */}

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

                <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  બી.પ.
                </th>

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

                <th className="th" rowSpan="2" style={{ minWidth: "130px" }}>
                  મિલ્કત પર લખેલ નામ
                </th>

                {/* <th className="th" rowSpan="2" style={{ minWidth: "120px" }}>
                  મકાન ટાઈપ
                </th> */}

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

              {/* Index Start */}
              <tr>
                {/* 1 to 14 th for index */}
                {Array.from({ length: 14 }).map((_, index) => (
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
              {/* Index End */}
            </thead>

            <tbody className="tbody">
              {records.map((record, index) => (
                <tr key={index}>
                  <td className="td">{record[0]}</td>

                  <td className="td">{record[1]}</td>

                  <td className="td">{record[2]}</td>

                  <td className="td">{record[15]}</td>

                  <td className="td">
                    {record[13]?.includes("બી.પ.") ? "બી.પ." : ""}
                  </td>

                  <td className="td">{record[3]}</td>

                  <td className="td">{record[4]}</td>

                  <td className="td">{record[5]}</td>

                  <td className="td">{record[18]}</td>

                  <td className="td">{record[19]}</td>

                  <td className="td">{record[6]}</td>

                  {/* <td className="td">{record[7]}</td> */}

                  <td className="td">{record[11]}</td>

                  <td className="td">{record[12]}</td>

                  <td className="td">{record[13]}</td>
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
