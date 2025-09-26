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
  const [total, setTotal] = useState({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/sheet`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setRecords(result?.data);

      if (result?.data?.length > 0) {
        const totalValue = {
          houseTax: [
            {
              curr:
                result?.data?.reduce(
                  (sum, item) =>
                    sum + (JSON.parse(item[20] || "{}")[0]?.curr || 0),
                  0
                ) ?? 0,
              prev:
                result?.data?.reduce(
                  (sum, item) =>
                    sum + (JSON.parse(item[20] || "{}")[0]?.prev || 0),
                  0
                ) ?? 0,
            },
          ],
        };

        console.log(totalValue);
        setTotal(totalValue);
      }
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

  const generatePDF = () => {
    const input = document.getElementById("pdf-report-container");
    const content = document.getElementById("pdf-content-wrapper"); // A new wrapper div

    const filename = `5. Tarij_Report.pdf`;

    if (input) {
      // Temporarily set styles for print-specific formatting
      input.style.minWidth = "1024px";
      content.style.padding = "20px"; // Adjust this value as needed

      const thElements = input.querySelectorAll("th");
      thElements.forEach((th) => {
        th.style.background = "white";
        th.style.color = "black";
      });

      html2canvas(input, {
        scale: 1.5,
        logging: true,
        useCORS: true,
      }).then((canvas) => {
        // Legal size: 8.5 x 14 inches at 72dpi.
        // Convert inches to points (1 inch = 72 points)
        const legalWidth = 912; // 8.5 inches * 72 points/inch
        const legalHeight = 1500; // 14 inches * 72 points/inch

        const pdf = new jsPDF("l", "pt", [legalWidth, legalHeight]);
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const imgWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(filename);

        // Revert styles after PDF generation
        input.style.minWidth = "auto";
        thElements.forEach((th) => {
          th.style.backgroundColor = ""; // Revert to original CSS
          th.style.color = "";
        });
      });
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

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={generatePDF}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Download PDF
      </button>

      <br />
      <br />

      <div
        className="pdf-report-container"
        id="pdf-report-container"
        style={{ position: "absolute", left: "-9999px" }}
      >
        {" "}
        <div id="pdf-content-wrapper">
          <h1 className="text-xl font-bold text-center mb-0 text-gray-800">
            {/* મોજે: {(project?.spot?.gaam).trim()}, તા:{" "}
          {(project?.spot?.taluka).trim()}  */}
            કુલ મંગણાં તથા વસુલાતનો રિપોર્ટ (તારીજ)
          </h1>

          <h2 className="text-l text-center mb-2 text-gray-700">
            સન {project?.details?.akaraniYear || ""}
          </h2>

          <div
            className="location-info-visible"
            style={{ paddingInline: "50px" }}
          >
            <h3>ગામ: {project?.spot?.gaam}</h3>

            <h3>તાલુકો: {project?.spot?.taluka}</h3>

            <h3>જિલ્લો: {project?.spot?.district}</h3>
          </div>

          <div className="table-responsive">
            <table className="report-table">
              <thead className="thead">
                <tr style={{ background: "#fff" }}>
                  <th
                    className="th"
                    colSpan="2"
                    rowSpan="2"
                    style={{
                      minWidth: "70px",
                      background: "#fff",
                      color: "#000",
                    }}
                  >
                    <span className="formatting">વેરાઓનું નામ</span>
                  </th>

                  <th
                    className="th"
                    colSpan="3"
                    style={{
                      minWidth: "70px",
                      background: "#fff",
                      color: "#000",
                    }}
                  >
                    <span className="formatting">કુલ માંગણું</span>
                  </th>

                  <th
                    className="th"
                    colSpan="3"
                    style={{
                      minWidth: "130px",
                      background: "#fff",
                      color: "#000",
                    }}
                  >
                    <span className="formatting">માંગણા પ્રમાણે વસુલાત</span>
                  </th>

                  <th
                    className="th"
                    colSpan="3"
                    style={{
                      minWidth: "170px",
                      background: "#fff",
                      color: "#000",
                    }}
                  >
                    <span className="formatting">પહોંચ પ્રમાણે વસુલાત</span>
                  </th>

                  <th
                    className="th"
                    colSpan="3"
                    style={{
                      minWidth: "100px",
                      background: "#fff",
                      color: "#000",
                    }}
                  >
                    <span className="formatting">કુલ બાકી</span>
                  </th>

                  <th
                    className="th"
                    rowSpan="2"
                    style={{
                      minWidth: "100px",
                      background: "#fff",
                      color: "#000",
                    }}
                  >
                    <span className="formatting">કુલ જાદે</span>
                  </th>
                </tr>

                <tr>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <>
                      <th
                        className="th"
                        style={{ background: "#fff", color: "#000" }}
                      >
                        <span className="formatting">પા. બા</span>
                      </th>

                      <th
                        className="th"
                        style={{ background: "#fff", color: "#000" }}
                      >
                        <span className="formatting">ચાલુ</span>
                      </th>

                      <th
                        className="th"
                        style={{ background: "#fff", color: "#000" }}
                      >
                        <span className="formatting">કુલ</span>
                      </th>
                    </>
                  ))}
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
                      colSpan={index === 0 ? 2 : 1}
                    >
                      <span className="formatting">{index + 1}</span>
                    </th>
                  ))}
                </tr>
                {/* Index End */}
              </thead>

              <tbody className="tbody">
                {/* {records.map((record, index) => ( */}
                {/* <> */}

                {total?.houseTax && total.houseTax.length > 0 ? (
                  <>
                    <tr>
                      <td className="td">
                        <span className="formatting">{"1"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"ઘર વેરો"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">
                          {total?.houseTax[0]?.prev || 0}
                        </span>
                      </td>
                      <td className="td">
                        <span className="formatting">
                          {total?.houseTax[0]?.curr || 0}
                        </span>
                      </td>
                      <td className="td">
                        <span className="formatting">
                          {(total?.houseTax[0]?.prev || 0) +
                            (total?.houseTax[0]?.curr || 0)}
                        </span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                    </tr>

                    <tr>
                      <td className="td">
                        <span className="formatting">{"2"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">
                          {"સામાન્ય પાણી વેરો"}
                        </span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                    </tr>

                    <tr>
                      <td className="td">
                        <span className="formatting">{"3"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"ખાસ પાણી વેરો"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                    </tr>

                    <tr>
                      <td className="td">
                        <span className="formatting">{"4"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"લાઈટ વેરો"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                    </tr>

                    <tr>
                      <td className="td">
                        <span className="formatting">{"5"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"સફાઈ વેરો"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="td"
                        colSpan="14"
                        style={{ border: "none" }}
                      >
                        <span className="formatting">{""}</span>
                      </td>
                    </tr>

                    <tr>
                      <td className="td" colSpan="2">
                        <span className="formatting">{"એકંદર કુલ"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                      <td className="td">
                        <span className="formatting">{"00"}</span>
                      </td>
                    </tr>
                  </>
                ) : (
                  <p>Loading house tax data...</p> // Or some other placeholder
                )}
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

          <div
            className="location-info-visible"
            style={{ paddingInline: "50px", paddingTop: "10px" }}
          >
            <h3>કુલ મિલ્કતની સંખ્યા: {"0"}</h3>

            <h3>વેરો લેવા પાત્ર મિલ્કતની સંખ્યા: {"0"}</h3>

            <h3>અન્ય મિલ્કત વેરો ન લેવાની મિલકતની સંખ્યા: {"0"}</h3>
          </div>
        </div>
      </div>

      {/* This is the visible, on-screen part */}

      <div className="visible-report-container">
        <h1 className="text-xl font-bold text-center mb-0 text-gray-800">
          {/* મોજે: {(project?.spot?.gaam).trim()}, તા:{" "}
          {(project?.spot?.taluka).trim()}  */}
          કુલ મંગણાં તથા વસુલાતનો રિપોર્ટ
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
                  colSpan="2"
                  style={{
                    minWidth: "70px",
                    background: "rgb(59 130 246)",
                    color: "#fff",
                  }}
                >
                  વેરાઓનું નામ
                </th>

                <th
                  className="th"
                  colSpan="3"
                  style={{
                    minWidth: "70px",
                    background: "rgb(59 130 246)",
                    color: "#fff",
                  }}
                >
                  કુલ માંગણું
                </th>

                <th
                  className="th"
                  colSpan="3"
                  style={{
                    minWidth: "130px",
                    background: "rgb(59 130 246)",
                    color: "#fff",
                  }}
                >
                  માંગણા પ્રમાણે વસુલાત
                </th>

                <th
                  className="th"
                  colSpan="3"
                  style={{
                    minWidth: "170px",
                    background: "rgb(59 130 246)",
                    color: "#fff",
                  }}
                >
                  પહોંચ પ્રમાણે વસુલાત
                </th>

                <th
                  className="th"
                  colSpan="3"
                  style={{
                    minWidth: "100px",
                    background: "rgb(59 130 246)",
                    color: "#fff",
                  }}
                >
                  કુલ બાકી{" "}
                </th>

                <th
                  className="th"
                  rowSpan="2"
                  style={{
                    minWidth: "100px",
                    background: "rgb(59 130 246)",
                    color: "#fff",
                  }}
                >
                  કુલ જાદે
                </th>
              </tr>

              <tr>
                {Array.from({ length: 4 }).map((_, index) => (
                  <>
                    <th
                      className="th"
                      style={{ background: "rgb(59 130 246)", color: "#fff" }}
                    >
                      પા. બા
                    </th>

                    <th
                      className="th"
                      style={{ background: "rgb(59 130 246)", color: "#fff" }}
                    >
                      ચાલુ
                    </th>

                    <th
                      className="th"
                      style={{ background: "rgb(59 130 246)", color: "#fff" }}
                    >
                      કુલ
                    </th>
                  </>
                ))}
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
                    colSpan={index === 0 ? 2 : 1}
                  >
                    {index + 1}
                  </th>
                ))}
              </tr>
              {/* Index End */}
            </thead>

            <tbody className="tbody">
              {total?.houseTax && total.houseTax.length > 0 ? (
                <>
                  <tr>
                    <td className="td">{"1"}</td>
                    <td className="td">{"ઘર વેરો"}</td>
                    <td className="td">{total?.houseTax[0]?.prev || 0}</td>
                    <td className="td">{total?.houseTax[0]?.curr || 0}</td>
                    <td className="td">
                      {(total?.houseTax[0]?.prev || 0) +
                        (total?.houseTax[0]?.curr || 0)}
                    </td>
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
                    <td className="td">{"2"}</td>
                    <td className="td">{"સામાન્ય પાણી વેરો"}</td>
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
                    <td className="td">{"3"}</td>
                    <td className="td">{"ખાસ પાણી વેરો"}</td>
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
                    <td className="td">{"4"}</td>
                    <td className="td">{"લાઈટ વેરો"}</td>
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
                    <td className="td">{"5"}</td>
                    <td className="td">{"સફાઈ વેરો"}</td>
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
                    <td className="td" colSpan="2">
                      {"એકંદર કુલ"}
                    </td>
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
                </>
              ) : (
                <p>Loading house tax data...</p> // Or some other placeholder
              )}
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

        <div
          className="location-info-visible"
          style={{ paddingInline: "50px", paddingTop: "10px" }}
        >
          <h3>કુલ મિલ્કતની સંખ્યા: {"0"}</h3>

          <h3>વેરો લેવા પાત્ર મિલ્કતની સંખ્યા: {"0"}</h3>

          <h3>અન્ય મિલ્કત વેરો ન લેવાની મિલકતની સંખ્યા: {"0"}</h3>
        </div>
      </div>
    </div>
  );
};

export default TarijReport;
