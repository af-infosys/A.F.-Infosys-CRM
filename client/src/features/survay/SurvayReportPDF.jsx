import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SurvayReport.scss";
import apiPath from "../../isProduction";
import { useAuth } from "../../config/AuthContext";
import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// import "../../assets/fonts/shruti-normal";
import html2canvas from "html2canvas";

const SurvayReport = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { projectId } = useParams();

  const { user } = useAuth();

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
      setRecords(result.data); // result.data માંથી રેકોર્ડ્સ સેટ કરો
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []); // કમ્પોનન્ટ માઉન્ટ થાય ત્યારે ફક્ત એક જ વાર ચલાવો

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

  const handleDelete = async (id) => {
    try {
      await fetch(`${await apiPath()}/api/sheet/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ workId: projectId }),
      });
      setRecords(records.filter((record) => record.id !== id));

      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const background = "rgb(59 130 246)";

  // ⬇️ Generate PDF
  // const handleDownloadPDF = () => {
  //   const pdf = new jsPDF("landscape", "pt", "legal");
  //   pdf.setFont("shruti");

  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const pageHeight = pdf.internal.pageSize.getHeight();

  //   // 🔹 Header text (repeat every page)
  //   const header = () => {
  //     pdf.setFont("shruti");
  //     pdf.setFontSize(14);
  //     pdf.text(
  //       "પંચાયત હિસાબ નમુનો નંબર - ૮ (આકારણી રજીસ્ટર)",
  //       pageWidth / 2,
  //       40,
  //       { align: "center" }
  //     );

  //     pdf.setFontSize(12);
  //     pdf.text(
  //       "સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની યાદી",
  //       pageWidth / 2,
  //       60,
  //       { align: "center" }
  //     );

  //     pdf.setFontSize(10);
  //     pdf.text("ગામ: મેઘરાજ", 60, 80);
  //     pdf.text("તાલુકો: મેઘરાજ", pageWidth / 2 - 20, 80);
  //     pdf.text("જિલ્લો: અરવલ્લી", pageWidth - 150, 80);
  //   };

  //   // 🔹 Table headings (as first row of body itself)
  //   const tableHeaders = [
  //     "અનું ક્રમાંક",
  //     "વિસ્તારનું નામ",
  //     "મિલ્કત ક્રમાંક",
  //     "મિલકતનું વર્ણન",
  //     "માલિકનું નામ",
  //     "જુનો મિ.નં.",
  //     "મોબાઈલ નંબર",
  //     "વાર્ષિક ભાડાની કિંમત / બીજી કિંમત",
  //     "આકારેલ વેરાની રકમ",
  //     "મિલ્ક્ત પર લખેલ નામ",
  //     "મકાન ટાઈપ",
  //     "નળ",
  //     "શોચાલ્ય",
  //     "રીમાર્કસ",
  //   ];

  //   // 🔹 Split records in chunks of 15
  //   const chunkSize = 15;
  //   const chunks = [];
  //   for (let i = 0; i < records.length; i += chunkSize) {
  //     chunks.push(records.slice(i, i + chunkSize));
  //   }

  //   chunks.forEach((chunk, chunkIndex) => {
  //     // Body rows for this page
  //     const body = [];

  //     // Insert headings as first row
  //     body.push(tableHeaders);

  //     // Insert 15 records
  //     chunk.forEach((record) => {
  //       body.push([
  //         record[0],
  //         record[1],
  //         record[2],
  //         record[15],
  //         record[3],
  //         record[4],
  //         record[5],
  //         "00.00",
  //         "00.00",
  //         record[6],
  //         record[7],
  //         record[11],
  //         record[12],
  //         record[13],
  //       ]);
  //     });

  //     autoTable(pdf, {
  //       body,
  //       startY: 100,
  //       theme: "grid",
  //       styles: {
  //         font: "shruti",
  //         fontSize: 8,
  //         cellPadding: 3,
  //         valign: "middle",
  //       },
  //       didDrawPage: () => {
  //         header();

  //         // Footer page numbers
  //         let str = "Page " + pdf.internal.getNumberOfPages();
  //         pdf.setFont("shruti");
  //         pdf.setFontSize(10);
  //         pdf.text(
  //           str,
  //           pdf.internal.pageSize.getWidth() - 80,
  //           pdf.internal.pageSize.getHeight() - 20
  //         );
  //       },
  //       showHead: "never", // ✅ no auto header
  //     });

  //     // Add new page except after last chunk
  //     if (chunkIndex < chunks.length - 1) {
  //       pdf.addPage();
  //     }
  //   });

  //   pdf.save("SurveyReport.pdf");
  // };

  const handleDownloadPDF = async () => {
    const input = document.getElementById("reportTable");

    if (!input) {
      console.error("The element with ID 'reportTable' was not found.");
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2, // Higher scale for better resolution
        logging: true,
        useCORS: true,
        allowTaint: true, // Allows cross-origin images to be rendered
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Use JPEG for smaller file size
      const pdf = new jsPDF("landscape", "mm", "legal");
      const imgWidth = 297; // A4 landscape width in mm
      const pageHeight = 210; // A4 landscape height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages for long tables
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("SurveyReport.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
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
      {/* ઇનલાઇન CSS */}
      <style>
        {`
          body {
            font-family: "Inter", sans-serif;
            background-color: #f0f2f5;
          }
          .container {
            max-width: 1200px;  
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .table-container {
            overflow-x: auto; /* કોષ્ટકને રિસ્પોન્સિવ બનાવવા માટે */
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #4b5563;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }
        
          tbody tr:nth-child(even) {
            background-color: #f3f4f6; /* વૈકલ્પિક પંક્તિઓ માટે શેડિંગ */
          }
          tbody tr:hover {
            background-color: #e5e7eb; /* હોવર ઇફેક્ટ */
          }
          .rounded-tl-lg { border-top-left-radius: 0.5rem; }
          .rounded-tr-lg { border-top-right-radius: 0.5rem; }
          .rounded-bl-lg { border-bottom-left-radius: 0.5rem; }
          .rounded-br-lg { border-bottom-right-radius: 0.5rem; }
        `}
      </style>

      <button
        onClick={handleDownloadPDF}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Download PDF
      </button>

      <h1 className="text-xl font-bold text-center mb-0 text-gray-800">
        પંચાયત હિસાબ નમુનો નંબર - ૮ (આકારણી રજીસ્ટર)
      </h1>
      <h2 className="text-l text-center mb-2 text-gray-600">
        સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની
        યાદી
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingInline: "20px",
          marginBottom: "5px",
        }}
      >
        <h3>Gaam: {"Meghraj"}</h3>

        <h3>Taluko: {"Meghraj"}</h3>

        <h3>Jillo: {"Aravalli"}</h3>
      </div>

      <div
        className="table-container rounded-lg shadow-md border border-gray-200"
        id="reportTable"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                id="thead"
                rowSpan="2"
              >
                અનું ક્રમાંક
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                id="thead"
                rowSpan="2"
                style={{ minWidth: "100px" }}
              >
                વિસ્તારનું નામ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
              >
                મિલ્કત ક્રમાંક
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
                style={{ minWidth: "300px" }}
              >
                મિલકતનું વર્ણન
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
                style={{ minWidth: "150px" }}
              >
                માલિકનું નામ
              </th>
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
              >
                જુનો મિ.નં.
              </th>
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
              >
                મોબાઈલ નંબર
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
                style={{ minWidth: "150px" }}
              >
                વાર્ષિક ભાડાની કિંમત અથવા બીજી કિંમત આકારણી
              </th>
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
                style={{ minWidth: "92px" }}
              >
                આકારેલ વેરાની રકમ
              </th>
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
                style={{ minWidth: "150px" }}
              >
                મિલ્ક્ત પર લખેલ નામ મકાન/દુકાન/ કારખાના/ કંપનીનું નામ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
              >
                મકાન ટાઈપ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                colSpan="2"
              >
                સુવિધા
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                rowSpan="2"
                style={{ minWidth: "100px" }}
              >
                રીમાર્કસ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                id="thead"
                rowSpan="2"
              >
                Action
              </th>
            </tr>

            <tr>
              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                // style={{ rotate: "90deg", transform: "translateY(10px)" }}
              >
                નળ
              </th>

              <th
                className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                id="thead"
                // style={{ rotate: "90deg", transform: "translateY(10px)" }}
              >
                શોચાલ્ય
              </th>
            </tr>
          </thead>

          {/* Index Start */}
          <tr>
            {/* 1 to 18 th for index */}
            {Array.from({ length: 15 }).map((_, index) => (
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

          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record, index) => {
              let survayorData = record[16];

              if (typeof survayorData === "string") {
                try {
                  survayorData = JSON.parse(survayorData);
                } catch (error) {
                  console.error("Error parsing survayor data:", error);
                  survayorData = null;
                }
              }

              return (
                <tr key={index}>
                  {/* અહીં Google Sheet માંથી આવતા ડેટાને કૉલમમાં મેપ કરો */}
                  {/* મિલ્કત ક્રમાંક (propertyNumber) */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record[0]}
                  </td>

                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[1]}
                  </td>

                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[2]}
                  </td>

                  {/* મિલકતનું વર્ણન (description) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[16]}
                  </td>

                  {/* માલિકનું નામ (ownerName) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[3]}
                  </td>

                  {/* જુનો મિલકત નંબર (OldNumber) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[5]}
                  </td>

                  {/* મોબાઈલ નંબર (MobileNumber) */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record[6]}
                  </td>

                  {/* Valuation/Price */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {/* {record[2]} */}
                    {"00.00"}
                  </td>

                  {/* Tax Amount */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {/* {record[2]} */}
                    {"00.00"}
                  </td>

                  {/* મિલ્ક્ત પર લખેલ નામ મકાન/દુકાન/ કારખાના/ કંપનીનું નામ */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record[7]}
                  </td>

                  {/* મકાન category */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record[8]}
                  </td>

                  {/* પાણી નો નળ (tapCount) */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record[12]}
                  </td>

                  {/* શૌચાલય (toiletCount) */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record[13]}
                  </td>

                  {/* રીમાર્કસ/નોંધ (remarks) */}
                  <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                    {record[14]}
                  </td>

                  {user.id === survayorData?.id ? (
                    <td
                      className="px-2 py-4 whitespace-normal text-sm text-gray-500"
                      style={{
                        display: "flex",
                        gap: ".5rem",
                        height: "100%",
                      }}
                    >
                      <button
                        onClick={() => navigate(`/form/${record[0]}`)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record[0])}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  ) : (
                    <td className="px-2 py-4 whitespace-normal text-sm text-gray-500">
                      Added by <br /> {survayorData?.name || "Unknown"}
                    </td>
                  )}
                </tr>
              );
            })}

            {records.length === 0 && !loading && !error && (
              <tr>
                <td
                  colSpan="11"
                  className="px-6 py-4 text-center text-gray-500"
                >
                  કોઈ રેકોર્ડ ઉપલબ્ધ નથી.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurvayReport;
