import React, { useState, useEffect } from "react";

import "./SurvayReport.scss";

import apiPath from "../../isProduction";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import toGujaratiNumber from "../../components/toGujaratiNumber";

const SurvayReportImage = () => {
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const getDriveImageUrl = (fileId) => {
    if (!fileId) return null;

    return `https://lh3.googleusercontent.com/u/0/d/${fileId}`;
  };

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/sheet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workId: projectId }),
      });

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

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("landscape", "mm", "legal");

    const totalPages = records.length;

    for (let i = 0; i < totalPages; i++) {
      const pageElement = document.getElementById(`report-page-${i}`);

      if (!pageElement) {
        console.error(`Page element with ID 'report-page-${i}' not found.`);

        continue;
      }

      // Add a page before adding content, except for the first page

      if (i > 0) {
        pdf.addPage();
      }

      try {
        const canvas = await html2canvas(pageElement, {
          scale: 2,

          logging: true,

          allowTaint: false, // Ise false rakhein agar useCORS true hai

          useCORS: true,
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
      <button
        onClick={handleDownloadPDF}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Download PDF
      </button>

      <br />
      <br />

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
        style={{ position: "relative", left: "0px" }}
      >
        {records.map((record, pageIndex) => (
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

              <div className="table-cell owner">
                <span className="formatting">5</span>
              </div>

              <div className="table-cell old-prop-no">
                <span className="formatting">6</span>
              </div>

              <div className="table-cell mobile">
                <span className="formatting">7</span>
              </div>

              <div className="table-cell valuation">
                <span className="formatting">8</span>
              </div>

              <div className="table-cell tax">
                <span className="formatting">9</span>
              </div>

              <div className="table-cell prop-name">
                <span className="formatting">10</span>
              </div>

              {/* <div className="table-cell type">
                <span className="formatting">11</span>
              </div> */}

              <div className="table-cell" style={{ width: "3%" }}>
                <span className="formatting">11</span>
              </div>

              <div className="table-cell" style={{ width: "3%" }}>
                <span className="formatting">12</span>
              </div>

              <div className="table-cell remarks">
                <span className="formatting">13</span>
              </div>

              {/* <div className="table-cell action">
                <span className="formatting">14</span>
              </div> */}
            </div>

            {/* Table Rows using Divs */}

            <div className="table-row">
              <div className="table-cell s-no" style={{ textAlign: "center" }}>
                <span className="formatting">{record[0]}</span>
              </div>

              <div className="table-cell area-name">
                <span className="formatting">{record[1]}</span>
              </div>

              <div className="table-cell prop-no">
                <span className="formatting">{record[2]}</span>
              </div>

              <div className="table-cell description">
                <span className="formatting">{record[16]}</span>
              </div>

              <div className="table-cell owner">
                <span className="formatting">{record[3]}</span>
              </div>

              <div className="table-cell old-prop-no">
                <span className="formatting">{record[5]}</span>
              </div>

              <div className="table-cell mobile">
                <span className="formatting">{record[6]}</span>
              </div>

              <div className="table-cell valuation">
                <span className="formatting">{record[19]}</span>
              </div>

              <div className="table-cell tax">
                <span className="formatting">{record[20]}</span>
              </div>

              <div className="table-cell prop-name">
                <span className="formatting">{record[7]}</span>
              </div>

              {/* <div className="table-cell type">
                  <span className="formatting">{record[7]}</span>
                </div> */}

              <div className="table-cell tap">
                <span className="formatting">{record[12]}</span>
              </div>

              <div className="table-cell toilet">
                <span className="formatting">{record[13]}</span>
              </div>

              <div className="table-cell remarks">
                <span className="formatting">{record[14]}</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                padding: "10px",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              {[record[26], record[27], record[28]].map((fileId, idx) => (
                <div key={idx} style={{ width: "30%", textAlign: "center" }}>
                  {fileId ? (
                    <img
                      src={getDriveImageUrl(fileId)}
                      alt={`Drive Image ${idx}`}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                      }}
                      crossOrigin="anonymous" // PDF generation ke liye zaroori hai
                      onError={(e) => {
                        e.target.style.display = "none"; // Agar image load na ho toh hide kar de
                        console.error("Image failed to load for ID:", fileId);
                      }}
                    />
                  ) : (
                    <h2 style={{ fontSize: "14px", color: "#666" }}>
                      No Image
                    </h2>
                  )}
                </div>
              ))}
            </div>
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
                  મિલ્કતની કિંમત
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  આકારેલ વેરાની રકમ
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
              {/* Index End */}
            </thead>

            <tbody className="tbody">
              {records.map((record, index) => (
                <tr key={index}>
                  <td className="td">{record[0]}</td>

                  <td className="td">{record[1]}</td>

                  <td className="td">{record[2]}</td>

                  <td className="td">{record[15]}</td>

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

export default SurvayReportImage;
