import React, { useState, useEffect } from "react";

import "./SurvayReport.scss";

import apiPath from "../../isProduction";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TarijReport = () => {
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
    fetchRecords();
  }, []);

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("landscape", "mm", "legal");

    const totalPages = Math.ceil(records.length / 15);

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

    pdf.save("SurveyReport.pdf");
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

  console.log(project?.details?.akaraniYear);

  // Paginate records into chunks of 15

  const pages = [];

  for (let i = 0; i < records.length; i += 15) {
    pages.push(records.slice(i, i + 15));
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
        style={{ position: "absolute", left: "-9999px" }}
      >
        {pages.map((pageRecords, pageIndex) => (
          <div
            key={pageIndex}
            id={`report-page-${pageIndex}`}
            className="report-page legal-landscape-dimensions"
          >
            {/* Headers and Page Count */}

            <div className="page-header-container">
              <span className="page-number">
                Page {pageIndex + 1} of {pages.length}
              </span>

              <h1 className="heading">
                Moje: {project?.spot?.gaam}, Ta: {project?.spot?.taluka} kul
                mangna tatha vasulatno report
              </h1>

              <h2 className="subheading">સન ૨૦૨૫/૨૬</h2>

              <div className="location-info">
                <span>ગામ: {project?.spot?.gaam}</span>

                <span>તાલુકો: {project?.spot?.taluka}</span>

                <span>જિલ્લો: {project?.spot?.district}</span>
              </div>
            </div>

            {/* Table Header using Divs */}

            <div className="table-row table-header-row">
              <div className="table-cell s-no">
                <span className="formatting">અનું ક્રમાંક</span>
              </div>

              <div className="table-cell prop-no">
                <span className="formatting">મિલ્કત ક્રમાંક</span>
              </div>

              <div className="table-cell area-name">
                <span className="formatting">વિસ્તારનું નામ</span>
              </div>

              <div className="table-cell owner">
                <span className="formatting">મિલ્કત માલિકનું નામ</span>
              </div>

              <div className="table-cell new-prop-no">
                <span className="formatting">પહોચ નંબર તારીખ રકમ</span>
              </div>

              <div className="table-cell vigat">
                <span className="formatting">Vigat</span>
              </div>

              <div className="table-cell tax">
                <div className="facility-inner">
                  <div className="facility-title">
                    <span className="formatting">ઘર વેરો</span>
                  </div>

                  <div className="facility-sub-row">
                    <div className="table-cell">
                      <span className="formatting">પા.બા</span>
                    </div>

                    <div className="table-cell">
                      <span className="formatting">ચાલુ</span>
                    </div>

                    <div className="table-cell">
                      <span className="formatting">કુલ</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-cell remarks">રીમાર્કસ</div>
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

              <div className="table-cell type">
                <span className="formatting">11</span>
              </div>

              <div className="table-cell facility">
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

            {pageRecords.map((record, index) => (
              <div key={index} className="table-row">
                <div className="table-cell s-no">
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

                <div className="table-cell owner">
                  <span className="formatting">{record[3]}</span>
                </div>

                <div className="table-cell old-prop-no">
                  <span className="formatting">{record[4]}</span>
                </div>

                <div className="table-cell mobile">
                  <span className="formatting">{record[5]}</span>
                </div>

                <div className="table-cell valuation">{record[18]}</div>

                <div className="table-cell tax">{record[19]}</div>

                <div className="table-cell prop-name">
                  <span className="formatting">{record[6]}</span>
                </div>

                <div className="table-cell type">
                  <span className="formatting">{record[7]}</span>
                </div>

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
          Moje: {project?.spot?.gaam}, Ta: {project?.spot?.taluka} kul mangna
          tatha vasulatno report{" "}
        </h1>

        <h2 className="text-l text-center mb-2 text-gray-600">
          સન {project?.details?.akaraniYear || ""}
        </h2>

        <div className="location-info-visible">
          <h3>ગામ: {project?.spot?.gaam}</h3>

          <h3>તાલુકો: {project?.spot?.taluka}</h3>

          <h3>જિલ્લો: {project?.spot?.district}</h3>
        </div>

        <div className="table-responsive">
          <table className="report-table">
            <thead className="thead">
              <tr>
                <th
                  className="th"
                  rowSpan="2"
                  style={{ minWidth: "70px" }}
                ></th>

                <th className="th" colSpan="3" style={{ minWidth: "70px" }}>
                  Kul Mangnu
                </th>

                <th className="th" colSpan="3" style={{ minWidth: "130px" }}>
                  MAnga pramane vasulat
                </th>

                <th className="th" colSpan="3" style={{ minWidth: "170px" }}>
                  Pahoch Pramane Vasulat{" "}
                </th>

                <th className="th" colSpan="3" style={{ minWidth: "100px" }}>
                  Kul Baki
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "100px" }}>
                  Kul Jade
                </th>
              </tr>

              <tr>
                {Array.from({ length: 4 }).map((_, index) => (
                  <>
                    <th className="th">પા. બા</th>

                    <th className="th">ચાલુ</th>

                    <th className="th">કુલ</th>
                  </>
                ))}
              </tr>
            </thead>

            <tbody className="tbody">
              {/* {records.map((record, index) => ( */}
              {/* <> */}
              <tr>
                <td className="td">{"Ghar Vero"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
              </tr>

              <tr>
                <td className="td">{"Samanya Pani Vero"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
              </tr>

              <tr>
                <td className="td">{"Khas Pani Vero"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
              </tr>

              <tr>
                <td className="td">{"Light Vero"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
              </tr>

              <tr>
                <td className="td">{"Safai Vero"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
              </tr>

              <tr>
                <td className="td" colSpan="14" style={{ border: "none" }}>
                  {""}
                </td>
              </tr>

              <tr>
                <td className="td">{"Ekandar Kul"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
                <td className="td">{"00"}</td>
              </tr>
              {/* </>
              ))} */}

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

export default TarijReport;
