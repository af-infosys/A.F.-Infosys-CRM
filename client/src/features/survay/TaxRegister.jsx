import React, { useState, useEffect } from "react";

import "./SurvayReport.scss";
import toGujaratiNumber from "../../components/toGujaratiNumber";

import apiPath from "../../isProduction";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TaxRegister = () => {
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
  }, []);

  useEffect(() => {
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

        // const imgWidth = 355; // Legal landscape width in mm
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      } catch (error) {
        console.error("Error generating PDF page:", error);
      }
    }

    pdf.save("4. Tax_Register.pdf");
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
  const pageLimit = 6;

  for (let i = 0; i < records.length; i += pageLimit) {
    pages.push(records.slice(i, i + pageLimit));
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
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Download PDF
      </button>
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
        {pages.map((pageRecords, pageIndex) => {
          const pageTotals = calculatePageTotals(pageRecords);

          return (
            <div
              key={pageIndex}
              id={`report-page-${pageIndex}`}
              className="report-page legal-landscape-dimensions"
              style={{
                width: "1700px",
                paddingLeft: "65px",
                paddingRight: "20px",
                paddingTop: "10px",
              }}
            >
              {/* Headers and Page Count */}

              <div className="page-header-container">
                <span
                  className="page-number"
                  style={{
                    fontSize: "16px",
                    transform: "translate(80px, 45px)",
                    color: "#000",
                  }}
                >
                  પાના નં. {toGujaratiNumber(pageIndex + 1)}
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
              <table className="report-table" id="pdff">
                <thead className="thead">
                  <tr>
                    <th className="th" rowSpan="2" style={{ maxWidth: "45px" }}>
                      <span className="formatting">અનું ક્રમાંક</span>
                    </th>

                    <th className="th" rowSpan="2" style={{ maxWidth: "45px" }}>
                      <span className="formatting">મિલ્કત ક્રમાંક</span>
                    </th>

                    <th className="th" rowSpan="2" style={{ maxWidth: "90px" }}>
                      <span className="formatting">વિસ્તારનું નામ</span>
                    </th>

                    <th className="th" rowSpan="2" style={{ maxWidth: "90px" }}>
                      <span className="formatting">ખાતેદારનું નામ</span>
                    </th>

                    <th
                      className="th"
                      rowSpan="2"
                      style={{ minWidth: "70px", maxWidth: "70px" }}
                    >
                      <span className="formatting">પહોચ નંબર તારીખ રકમ</span>
                    </th>

                    <th className="th" rowSpan="2" style={{ maxWidth: "90px" }}>
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
                    {Array.from({ length: 24 }).map((_, index) => (
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

                {/* Table Rows using Divs */}

                {pageRecords.map((record, index) => (
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

                      <th rowSpan="3">{"XX"}</th>

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
                            (JSON.parse(record[21] || "{}")?.[0]?.prev || 0)) +
                          ((JSON.parse(record[22] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[22] || "{}")?.[0]?.prev || 0)) +
                          ((JSON.parse(record[23] || "{}")?.[0]?.curr || 0) +
                            (JSON.parse(record[23] || "{}")?.[0]?.prev || 0)) +
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

                <tr>
                  <td colSpan="24">{"--"}</td>
                </tr>

                <tr>
                  <th
                    colSpan="5"
                    rowSpan="3"
                    style={{ textAlign: "center", color: "#000" }}
                  >
                    પાનાનું કુલ
                  </th>
                  <td className="td">માંગણું</td>
                  {/* Iterate 6 times for the 6 tax categories and the final total column (Total = 6 categories * 3 columns = 18 data columns) */}
                  {Array.from({ length: 6 }).map((_, categoryIndex) => {
                    // Calculate the total for the current category's demand
                    // Demand is always at index [0]
                    const recordColumnIndex = 20 + categoryIndex; // 20 to 25
                    const totalForCategory = pageRecords.reduce(
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
                    const prevForCategory = pageRecords.reduce(
                      (sum, record) => {
                        const taxData = JSON.parse(
                          record[recordColumnIndex] || "{}"
                        );
                        return sum + (taxData?.[0]?.prev || 0);
                      },
                      0
                    );
                    const currForCategory = pageRecords.reduce(
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
                        <td className="td">{prevForCategory}</td> {/* પા.બા */}
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
                    const totalForCategory = pageRecords.reduce(
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
                    const prevForCategory = pageRecords.reduce(
                      (sum, record) => {
                        const taxData = JSON.parse(
                          record[recordColumnIndex] || "{}"
                        );
                        return sum + (taxData?.[1]?.prev || 0);
                      },
                      0
                    );
                    const currForCategory = pageRecords.reduce(
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
                        <td className="td">{prevForCategory}</td> {/* પા.બા */}
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
                    const totalForCategory = pageRecords.reduce(
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
                    const prevForCategory = pageRecords.reduce(
                      (sum, record) => {
                        const taxData = JSON.parse(
                          record[recordColumnIndex] || "{}"
                        );
                        return sum + (taxData?.[2]?.prev || 0);
                      },
                      0
                    );
                    const currForCategory = pageRecords.reduce(
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
                        <td className="td">{prevForCategory}</td> {/* પા.બા */}
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

                <th className="th">ગઈ સાલના જાદે</th>
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
