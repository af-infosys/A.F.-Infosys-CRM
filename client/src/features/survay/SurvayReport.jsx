import React, { useState, useEffect } from "react";

import "./SurvayReport.scss";

import apiPath from "../../isProduction";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

const SurvayReport = () => {
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
                પંચાયત હિસાબ નમુનો નંબર - ૮ (આકારણી રજીસ્ટર)
              </h1>

              <h2 className="subheading">
                સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો
                આકારણી ની યાદી
              </h2>

              <div className="location-info">
                <span>ગામ: {"મેઘરાજ"}</span>

                <span>તાલુકો: {"મેઘરાજ"}</span>

                <span>જિલ્લો: {"અરવલ્લી"}</span>
              </div>
            </div>

            {/* Table Header using Divs */}

            <div className="table-row table-header-row">
              <div className="table-cell s-no">
                <span className="formatting">અનું ક્રમાંક</span>
              </div>

              <div className="table-cell area-name">
                <span className="formatting">વિસ્તારનું નામ</span>
              </div>

              <div className="table-cell prop-no">
                <span className="formatting">મિલ્કત ક્રમાંક</span>
              </div>

              <div className="table-cell description">
                <span className="formatting">મિલકતનું વર્ણન</span>
              </div>

              <div className="table-cell owner">
                <span className="formatting">માલિકનું નામ</span>
              </div>

              <div className="table-cell old-prop-no">
                <span className="formatting">જુનો મિ.નં.</span>
              </div>

              <div className="table-cell mobile">
                <span className="formatting">મોબાઈલ નંબર</span>
              </div>

              <div className="table-cell valuation">
                <span className="formatting">મિલકતની કિંમત</span>
              </div>

              <div className="table-cell tax">
                <span className="formatting">આકારેલ વેરાની રકમ</span>
              </div>

              <div className="table-cell prop-name">
                <span className="formatting">મિલ્ક્ત પર લખેલ નામ</span>
              </div>

              <div className="table-cell type">
                <span className="formatting">મકાન ટાઈપ</span>
              </div>

              <div className="table-cell facility">
                <div className="facility-inner">
                  <div className="facility-title">
                    <span className="formatting">સુવિધા</span>
                  </div>

                  <div className="facility-sub-row">
                    <div className="table-cell">
                      <span className="formatting">નળ</span>
                    </div>

                    <div className="table-cell">
                      <span className="formatting">શોચાલ્ય</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-cell remarks">રીમાર્કસ</div>
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

                <div className="table-cell valuation">{"00.00"}</div>

                <div className="table-cell tax">{"00.00"}</div>

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
          પંચાયત હિસાબ નમુનો નંબર - ૮ (આકારણી રજીસ્ટર)
        </h1>

        <h2 className="text-l text-center mb-2 text-gray-600">
          સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની
          યાદી
        </h2>

        <div className="location-info-visible">
          <h3>ગામ: {"મેઘરાજ"}</h3>

          <h3>તાલુકો: {"મેઘરાજ"}</h3>

          <h3>જિલ્લો: {"અરવલ્લી"}</h3>
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
                  મિલકતનું વર્ણન
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
                  મિલકતની કિંમત
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "70px" }}>
                  આકારેલ વેરાની રકમ
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "130px" }}>
                  મિલ્કત પર લખેલ નામ
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "120px" }}>
                  મકાન ટાઈપ
                </th>

                <th className="th" colSpan="2">
                  સુવિધા
                </th>

                <th className="th" rowSpan="2" style={{ minWidth: "130px" }}>
                  રીમાર્કસ
                </th>
              </tr>

              <tr>
                <th className="th">નળ</th>

                <th className="th">શોચાલય</th>
              </tr>
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

                  <td className="td">{"00.00"}</td>

                  <td className="td">{"00.00"}</td>

                  <td className="td">{record[6]}</td>

                  <td className="td">{record[7]}</td>

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
