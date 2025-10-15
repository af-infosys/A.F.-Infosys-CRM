import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import apiPath from "../../isProduction";
import "./IndexReport.scss";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";

// The main component for the analytics report
const IndexReport = () => {
  // Use state to manage all the report data
  const [records, setRecords] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState([]);

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
      const response = await fetch(`${await apiPath()}/api/sheet`);
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

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("portrait", "mm", "legal");
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
          scale: 3, // was 2, bumping to 3 makes sharper + bigger text
          useCORS: true,
          allowTaint: true,
        });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        // const imgWidth = 255.6; // Legal landscape width in mm

        // const imgHeight = (canvas.height * imgWidth) / canvas.width;
        // pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

        // const imgWidth = 50;
        const imgWidth = pdf.internal.pageSize.getWidth() - 5; // 10mm margin left & right
        const imgHeight = (canvas.height * imgWidth) / canvas.width + 20;
        pdf.addImage(imgData, "JPEG", 2, 2, imgWidth, imgHeight);
      } catch (error) {
        console.error("Error generating PDF page:", error);
      }
    }
    pdf.save("3. Index_Report.pdf");
  };

  // Paginate records into chunks of 15
  const pages = [];
  let currentPage = [];
  let rowCount = 0;
  const pageRecordLimit = 21;

  sortedKeys.forEach((key) => {
    // Add group header (takes 1 row)
    if (rowCount >= pageRecordLimit) {
      pages.push(currentPage);
      currentPage = [];
      rowCount = 0;
    }
    currentPage.push({ type: "header", key });
    rowCount++;

    groupedRecords[key].forEach((record) => {
      if (rowCount >= pageRecordLimit) {
        pages.push(currentPage);
        currentPage = [{ type: "header", key }]; // repeat header on new page
        rowCount = 1;
      }
      currentPage.push({ type: "record", data: record });
      rowCount++;
    });
  });

  // Push last page
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

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
      <button
        onClick={handleDownloadPDF}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Download PDF
      </button>
      <br />
      <br />

      {/* Hidden container for PDF generation */}
      <div
        className="pdf-report-container"
        style={{ position: "absolute", left: "-9999px", maxWidth: "900px" }}
      >
        {pages.map((pageRecords, pageIndex) => (
          <div
            key={pageIndex}
            id={`report-page-${pageIndex}`}
            className="report-page legal-landscape-dimensions"
            style={{ width: "100%", position: "relative" }}
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
                Index Book - (પાનોત્રી બુક) ક, ખ, ગ, પ્રમાણે <br /> ગામનો નમુના
                નંબર ૯/ડી - કરવેરા રજીસ્ટરની પાનોત્રીની યાદી{" "}
              </h1>
              <h2 className="subheading">સને {"2025/2026"}</h2>
              <span className="page-numberN">પાના નં. {pageIndex + 1}</span>
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
                maxWidth: "900px",
                height: "auto",
                paddingLeft: "30px",
                paddingTop: 0,
              }}
            >
              <table className="divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th
                      className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                      style={{
                        color: "#000",
                        background: "#fff",
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
                        background: "#fff",
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
                        background: "#fff",
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
                        background: "#fff",
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
                        background: "#fff",
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
                        background: "#fff",
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
                  {pageRecords.map((row, idx) =>
                    row.type === "header" ? (
                      <tr key={idx}>
                        <td
                          colSpan="6"
                          className="text-center font-bold bg-gray-200"
                          id="pdff"
                        >
                          <span className="formatting">{row.key}</span>
                        </td>
                      </tr>
                    ) : (
                      <tr key={idx}>
                        <td id="pdff">
                          <span className="formatting">
                            {row.data[0] || ""}
                          </span>
                        </td>
                        <td id="pdff">
                          <span className="formatting">
                            {row.data[2] || ""}
                          </span>
                        </td>
                        <td id="pdff">
                          <span className="formatting">
                            {row.data[3] || ""}
                          </span>
                        </td>
                        <td id="pdff">
                          <span className="formatting">
                            {row.data[1] || ""}
                          </span>
                        </td>
                        <td id="pdff">
                          <span className="formatting">
                            {Math.ceil(row.data[0] / 15) || 0}
                          </span>
                        </td>
                        <td id="pdff">
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
        ))}
      </div>

      {/* This is the visible, on-screen part */}
      <div
        id="report-content"
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-10 mb-8"
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
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            ગામ : <b className="font-semibold text-blue-800">{village}</b>
          </span>
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            તાલુકો : <b className="font-semibold text-blue-800">{taluka}</b>
          </span>
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
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
