import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Report.scss";
import apiPath from "../../isProduction";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import toGujaratiNumber from "../../components/toGujaratiNumber";

const OrderValuationReport = () => {
  const { projectId } = useParams();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [details, setDetails] = useState({
    totalHouses: 0,
    gaam: "",
    taluka: "",
    district: "",
    date: "",
    panchayat: "",
    akaraniYear: "",
    taxYear: "",
    sarpanchName: "",
    sarpanchNumber: "",
    tcmName: "",
    tcmNumber: "",
    assistantName: "",
    assistantNumber: "",
    assistantHoddo: "",
    valuationType: "",
    meetingDate: "",
    meetingNumber: "",
    agendaNumber: "",
    resolutionNumber: "",
    surveyHouseRate: "",
    approvedAmountWords: "",
    startArea: "",
    firstPropertyOwner: "",
    generalWaterTaxApplicable: "",
    specialAndGeneralWaterTax: "",
    notes: [],
  });

  const [valuation, setValuation] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [sheetRecords, setSheetRecords] = useState([]);

  const fetchSheetRecords = async () => {
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
      setSheetRecords(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      toast.error("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${await apiPath()}/api/valuation/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = response.data;
      setDetails(data.details || details);
      setValuation(
        Array.isArray(data?.valuation) && data?.valuation.length
          ? data.valuation
          : valuation,
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchTaxes = async () => {
    setLoading(true);
    try {
      let fetchedData = await axios.get(
        `${await apiPath()}/api/valuation/tax/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      fetchedData = fetchedData?.data?.taxes;
      if (fetchedData && fetchedData.length > 0) {
        setTaxes(fetchedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTaxes();
    fetchSheetRecords();
  }, []);

  const handleDownloadPdf = async () => {
    setIsPdfGenerating(true);
    const input1 = document.getElementById("report-1");
    const input2 = document.getElementById("report-2");
    const input3 = document.getElementById("report-3");

    if (!input1 || !input2 || !input3) {
      setIsPdfGenerating(false);
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "legal",
      });
      const pageWidth = doc.internal.pageSize.getWidth();

      const addImageFitWidth = async (element) => {
        const canvas = await html2canvas(element, { scale: 3 });
        const imgData = canvas.toDataURL("image/png");
        const ratio = pageWidth / canvas.width;
        const finalWidth = pageWidth;
        const finalHeight = canvas.height * ratio;
        doc.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);
      };

      await addImageFitWidth(input1);
      doc.addPage();
      await addImageFitWidth(input2);
      doc.addPage();
      await addImageFitWidth(input3);

      doc.save(`Order_Valuation_Report_${details?.akaraniYear}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadSummaryPdf = async () => {
    setIsPdfGenerating(true);
    const summaryInput = document.getElementById("report-summary");

    if (!summaryInput) {
      setIsPdfGenerating(false);
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = doc.internal.pageSize.getWidth();

      const canvas = await html2canvas(summaryInput, {
        scale: 3,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const ratio = pageWidth / canvas.width;
      const finalHeight = canvas.height * ratio;

      doc.addImage(imgData, "PNG", 0, 0, pageWidth, finalHeight);
      doc.save(`Valuation_Summary_${details?.akaraniYear}.pdf`);
    } catch (error) {
      console.error("Error generating Summary PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const getAlphabeticalIndex = (index) => {
    let result = "";
    let temp = index;
    while (temp >= 0) {
      result = alphabets[temp % 26] + result;
      temp = Math.floor(temp / 26) - 1;
    }
    return result;
  };

  function formatDate(dateString) {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return "";
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // --- Filtering Logic for Zero/Empty Values ---
  const isValidValue = (val) => {
    if (!val) return false;
    const str = String(val).trim();
    return str !== "" && str !== "0" && str !== "-" && str !== "0.00";
  };

  const filteredValuation = valuation.filter(
    (record) => isValidValue(record?.price) || isValidValue(record?.tax),
  );

  const getTaxValue = (taxNameKeyword) => {
    const tax = taxes.find((t) => t.name && t.name.includes(taxNameKeyword));
    if (!tax || !tax.values || !tax.values.residence) return 0;
    return Number(tax.values.residence) || 0;
  };

  const filteredOtherTaxes = [
    { label: "સામાન્ય પાણી વેરો", val: getTaxValue("સા.પાણી") },
    {
      label: "દીવાબત્તી વેરો",
      val: getTaxValue("લાઈટ"),
    },
    { label: "સફાઈ વેરો", val: getTaxValue("સફાઈ") },
    { label: "ખાસ પાણી નળ વેરો", val: getTaxValue("ખા.પાણી") },
  ].filter((tax) => tax.val > 0);

  return (
    <>
      <div
        className="container mx-auto p-2 sm:p-6 lg:p-8"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Order Valuation Report
        </h1>
        <h2 className="text-xl text-center text-gray-600">Owner & Sales</h2>
        <h2 className="text-xl text-center mb-8 text-gray-600">
          by - A.F. Infosys
        </h2>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleDownloadPdf}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
            disabled={isPdfGenerating}
          >
            {isPdfGenerating ? "Generating Full PDF..." : "Download Full PDF"}
          </button>
          <button
            onClick={handleDownloadSummaryPdf}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded-full"
            disabled={isPdfGenerating}
          >
            {isPdfGenerating
              ? "Generating Summary PDF..."
              : "Download Summary PDF"}
          </button>
        </div>

        {/* --- EXISTING REPORT START (Unchanged) --- */}
        {/* Report - 1 */}
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            id="report-1"
            className="table-container shadow-md"
            style={{
              width: "680px",
              minWidth: "680px",
              minHeight: "1080px",
              position: "relative",
              padding: "15px",
              paddingTop: "23px",
              paddingRight: "23px",
              background: "#fff",
            }}
          >
            <div
              className="rounded-lg border border-black"
              style={{
                border: "2px solid black",
                width: "100%",
                height: "100%",
                padding: "8px",
              }}
            >
              <div
                className="flex justify-between items-center"
                style={{ width: "100%", paddingRight: "0px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingInline: "5px",
                  }}
                >
                  <h3 style={{ fontSize: "16px", textWrap: "nowrap" }}>
                    ગ્રા.પં./વશી/જા.નં./{details?.javak || ""}
                  </h3>
                  <h3
                    style={{
                      fontSize: "16px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        border: "1px solid black",
                        borderRadius: "5px",
                        padding: "5px",
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          translateY: "-8px",
                          textWrap: "nowrap",
                        }}
                      >
                        અંદાજીત ઘર :– <b>{details?.totalHouses || 0}</b>
                      </span>
                    </span>
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingLeft: "5px",
                      }}
                    >
                      <span>TB{details?.tbr}R</span>
                      <span style={{ marginTop: "-2px" }}>
                        જુના રજી.ના ઘર <b>{details?.oldregi || ""}</b>
                      </span>
                      {details?.imageAkarni ? (
                        <span style={{ marginTop: "-2px" }}>
                          ફોટા વાળી આકારણી{": "}
                          <b>
                            {Number(details?.imageAkarni) !== 0 ? "હા" : "ના"}
                          </b>
                        </span>
                      ) : null}
                    </span>
                  </h3>
                  <h3 style={{ fontSize: "16px", color: "transparent" }}>
                    <b style={{ textDecoration: "underline" }}>
                      {details?.gaam || ""}
                    </b>{" "}
                    ગ્રામ પંચાયત કચેરી
                  </h3>
                </div>
              </div>

              {/* Info Start */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  alignItems: "end",
                  paddingRight: "0px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    flexDirection: "column",
                    paddingRight: "5px",
                    position: "relative",
                    transform: `translateY(-${details?.imageAkarni ? 100 : 80}px)`,
                    paddingLeft: "3px",
                  }}
                >
                  <h2 style={{ fontSize: "16px" }}>
                    <b style={{ textDecoration: "underline" }}>
                      {details?.gaam || ""}
                    </b>{" "}
                    ગ્રામ પંચાયત કચેરી
                  </h2>
                  <h2 style={{ fontSize: "16px" }}>
                    તાલુકો :– <b>{details?.taluka || ""}</b>
                  </h2>
                  <h2 style={{ fontSize: "16px" }}>
                    જિલ્લો :- <b>{details?.district || ""}</b>
                  </h2>
                  <h2 style={{ fontSize: "16px" }}>
                    તારીખ :– <b>{formatDate(details?.date)}</b>
                  </h2>
                  <span>
                    જુથ પંચાયત છે (હા/ના){" "}
                    <b>
                      {details?.panchayat?.includes("નહિ")
                        ? "નહિ"
                        : details?.panchayat === ""
                          ? ""
                          : "હા"}
                    </b>
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      textAlign: "left",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      paddingRight: "10px",
                      alignItems: "start",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        gap: "10px",
                      }}
                    >
                      ગામના નામ:
                      <b>
                        {!details?.panchayat?.includes("નહિ") &&
                          details?.panchayat
                            ?.split(/\d+\./)
                            ?.filter(Boolean)
                            ?.map((village, index) => (
                              <div
                                key={index}
                                style={{ textAlign: "left", fontSize: "15px" }}
                              >
                                {index + 1}. {village.trim()}
                              </div>
                            ))}
                      </b>
                    </span>
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      flexDirection: "column",
                    }}
                  >
                    <h2 style={{ fontSize: "16px" }}>
                      આકારણીનું વર્ષ :– <b>{details?.akaraniYear || ""}</b>
                    </h2>
                    <h2 style={{ fontSize: "16px" }}>
                      વેરા રજીસ્ટરનું વર્ષ :– <b>{details?.taxYear || ""}</b>
                    </h2>
                  </div>
                </div>
              </div>

              {/* Names Start */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  marginTop: "-65px",
                }}
              >
                <h2 style={{ fontSize: "15px" }}>
                  સરપંચશ્રીનું પુરૂ નામ તથા મો.નં.{" "}
                  <b>
                    {details?.sarpanchName || ""}
                    {", "}
                    {details?.sarpanchNumber || ""}{" "}
                  </b>
                </h2>
                <h2 style={{ fontSize: "15px" }}>
                  તલાટી કમ મંત્રીશ્રીનું પુરૂ નામ તથા મો.નં.{" "}
                  <b>
                    {details?.tcmName || ""}, {details?.tcmNumber || ""}
                  </b>
                </h2>
                {details?.s2Name !== "" && (
                  <h2 style={{ fontSize: "15px" }}>
                    વહિવટ કર્તા વ્યક્તિનું પુરૂ નામ તથા મો.નં.{" "}
                    <b>
                      {details?.s2Name || ""}, {details?.s2Number || ""}
                    </b>
                  </h2>
                )}
                {details?.assistantName && (
                  <h2 style={{ fontSize: "15px" }}>
                    સાથે રહેનાર વ્યકિતનું પુરૂ નામ તથા મો.નં.{" "}
                    <b>
                      {details?.assistantName || ""}
                      {", "}
                      {details?.assistantNumber || ""}
                    </b>
                  </h2>
                )}
                <h2 style={{ fontSize: "15px", marginTop: "-10px" }}>
                  {details?.assistantHoddo || ""}
                </h2>
              </div>

              <h2
                style={{
                  fontSize: "18px",
                  width: "100%",
                  maxWidth: "fit-content",
                  textAlign: "center",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  marginBottom: "8px",
                  marginTop: "20px",
                  paddingBottom: "3px",
                  paddingInline: "15px",
                  position: "relative",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    transform: "translateY(-8px)",
                  }}
                  className="formatting"
                >
                  - : : Order Report – ઑર્ડર રીપોર્ટ આકારણી (વેલ્યુએશન) રીપોર્ટ
                  : : –
                </span>
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "140px",
                  justifyContent: "center",
                  marginTop: "-3px",
                }}
                className="formatting"
              >
                <span>
                  {details?.valuationType === "room" ? (
                    <span>&#10004;</span>
                  ) : (
                    ""
                  )}{" "}
                  રૂમ દિઠ કિમત મુકવી{" "}
                  {details?.valuationType === "room" ? (
                    <span>&#10004;</span>
                  ) : (
                    ""
                  )}
                </span>
                <span>
                  {details?.valuationType === "house" ? (
                    <span>&#10004;</span>
                  ) : (
                    ""
                  )}{" "}
                  મકાન દિઠ કિમત લેવી{" "}
                  {details?.valuationType === "house" ? (
                    <span>&#10004;</span>
                  ) : (
                    ""
                  )}
                </span>
              </div>

              <table
                className="divide-y divide-gray-200"
                style={{
                  marginTop: "4px",
                  border: "2px solid black",
                  width: "100%",
                }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        textAlign: "center",
                        padding: "2px 3px",
                        paddingBottom: "10px",
                        minWidth: "60px",
                      }}
                      colSpan="2"
                    >
                      <span id="format">ક્રમ</span>
                    </th>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{ textAlign: "center", padding: "2px 3px" }}
                    >
                      <span id="format">
                        મિલ્કતનું વર્ણન / બાંધકામનો પ્રકાર
                      </span>
                    </th>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        textAlign: "center",
                        padding: "2px 3px",
                        maxWidth: "70px",
                      }}
                    >
                      <span id="format">મિલ્કતની કિંમત</span>
                    </th>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        textAlign: "center",
                        padding: "2px 3px",
                        minWidth: "50px",
                      }}
                    >
                      <span id="format">મિ. વેરો</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {valuation.slice(0, 20).map((record, index) => (
                    <tr key={index}>
                      <td
                        className="whitespace-nowrap text-sm font-medium text-gray-900"
                        style={{
                          maxWidth: "10px",
                          padding: "3px 10px",
                          textAlign: "center",
                        }}
                      >
                        <span id="format">{index + 1}</span>
                      </td>
                      <td
                        className="whitespace-normal text-sm text-black"
                        style={{
                          maxWidth: "10px",
                          padding: "3px 10px",
                          textAlign: "center",
                        }}
                      >
                        <span id="format">{getAlphabeticalIndex(index)}</span>
                      </td>
                      <td
                        className="whitespace-normal text-sm text-black"
                        style={{
                          maxWidth: "200px",
                          padding: "3px 10px",
                          textAlign: "left",
                        }}
                      >
                        <span id="format">{record?.name}</span>
                      </td>
                      <td
                        className="whitespace-normal text-sm text-black"
                        style={{
                          maxWidth: "70px",
                          padding: "3px 10px",
                          textAlign: "center",
                        }}
                      >
                        <span id="format">{record?.price}</span>
                      </td>
                      <td
                        className="whitespace-normal text-sm text-black"
                        style={{
                          maxWidth: "30px",
                          padding: "3px 10px",
                          textAlign: "center",
                        }}
                      >
                        <span id="format">{record?.tax}</span>
                      </td>
                    </tr>
                  ))}
                  {valuation.length === 0 && !loading && !error && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-black"
                      >
                        No Data Found!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div
                style={{
                  position: "absolute",
                  bottom: "18px",
                  right: "30px",
                  fontSize: "14px",
                  color: "#000",
                }}
              >
                <b> પાના નં. {toGujaratiNumber(1)} </b>
              </div>
            </div>
          </div>
        </div>
        <br />

        {/* Report - 2 */}
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            id="report-2"
            className="table-container shadow-md"
            style={{
              width: "680px",
              minWidth: "680px",
              minHeight: "1080px",
              position: "relative",
              padding: "15px",
              paddingTop: "23px",
              paddingRight: "23px",
              background: "#fff",
            }}
          >
            <div
              className="rounded-lg border border-black"
              style={{
                border: "2px solid black",
                width: "100%",
                height: "100%",
                padding: "5px",
              }}
            >
              <div
                className="flex justify-between items-center mb-4"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingInline: "16px",
                  }}
                >
                  <h3 style={{ fontSize: "16px" }}>
                    ગામ :- <b>{details?.gaam || ""}</b>
                  </h3>
                  <h3 style={{ fontSize: "16px" }}>
                    તાલુકો :- <b>{details?.taluka || ""}</b>
                  </h3>
                  <h3 style={{ fontSize: "16px" }}>
                    જિલ્લો :- <b>{details?.district || ""}</b>
                  </h3>
                </div>
              </div>
              <h2
                style={{
                  fontSize: "18px",
                  width: "100%",
                  maxWidth: "fit-content",
                  textAlign: "center",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  marginBottom: "8px",
                  paddingBottom: "3px",
                  paddingInline: "15px",
                  position: "relative",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    transform: "translateY(-8px)",
                  }}
                  className="formatting"
                >
                  - : : Order Report – ઑર્ડર રીપોર્ટ આકારણી (વેલ્યુએશન) રીપોર્ટ
                  : : –
                </span>
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: "140px",
                  justifyContent: "center",
                  marginTop: "-3px",
                }}
                className="formatting"
              >
                <span>
                  {details?.valuationType === "room" ? (
                    <span>&#10004;</span>
                  ) : (
                    ""
                  )}{" "}
                  રૂમ દિઠ કિમત મુકવી{" "}
                  {details?.valuationType === "room" ? (
                    <span>&#10004;</span>
                  ) : (
                    ""
                  )}
                </span>
                <span>
                  {details?.valuationType === "house" ? (
                    <span>&#10004;</span>
                  ) : (
                    ""
                  )}{" "}
                  મકાન દિઠ કિમત લેવી{" "}
                  {details?.valuationType === "house" ? (
                    <span>&#10004;</span>
                  ) : (
                    ""
                  )}
                </span>
              </div>

              <table
                className="divide-y divide-gray-200"
                style={{ marginTop: "5px", width: "100%" }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        textAlign: "center",
                        padding: "2px 3px",
                        paddingBottom: "10px",
                        minWidth: "60px",
                      }}
                      colSpan="2"
                    >
                      <span id="format">ક્રમ</span>
                    </th>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{ textAlign: "center", padding: "2px 3px" }}
                    >
                      <span id="format">
                        મિલ્કતનું વર્ણન / બાંધકામનો પ્રકાર
                      </span>
                    </th>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        textAlign: "center",
                        padding: "2px 3px",
                        minWidth: "70px",
                      }}
                    >
                      <span id="format">મિલ્કતની કિંમત</span>
                    </th>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        textAlign: "center",
                        padding: "2px 3px",
                        minWidth: "50px",
                      }}
                    >
                      <span id="format">મિ. વેરો</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {valuation.slice(20).map((record, index) => (
                    <tr key={index + 20}>
                      <td
                        className="whitespace-nowrap text-sm font-medium text-gray-900"
                        style={{
                          maxWidth: "10px",
                          padding: "3px 10px",
                          textAlign: "center",
                        }}
                      >
                        <span id="format">{index + 21}</span>
                      </td>
                      <td
                        className="whitespace-normal text-sm text-black"
                        style={{
                          maxWidth: "10px",
                          padding: "3px 10px",
                          textAlign: "center",
                        }}
                      >
                        <span id="format">
                          {getAlphabeticalIndex(index + 20)}
                        </span>
                      </td>
                      <td
                        className="whitespace-normal text-sm text-black"
                        style={{
                          maxWidth: "200px",
                          padding: "3px 10px",
                          textAlign: "left",
                        }}
                      >
                        <span id="format">{record?.name}</span>
                      </td>
                      <td
                        className="whitespace-normal text-sm text-black"
                        style={{
                          maxWidth: "30px",
                          padding: "3px 10px",
                          textAlign: "center",
                        }}
                      >
                        <span id="format">{record?.price}</span>
                      </td>
                      <td
                        className="whitespace-normal text-sm text-black"
                        style={{
                          maxWidth: "30px",
                          padding: "3px 10px",
                          textAlign: "center",
                        }}
                      >
                        <span id="format">{record?.tax}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  padding: "8px",
                  borderRadius: "10px",
                  background: "#fff",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    width: "100%",
                    maxWidth: "fit-content",
                    textAlign: "center",
                    border: "1px solid #000",
                    borderRadius: "5px",
                    marginBottom: "8px",
                    paddingBottom: "3px",
                    paddingInline: "15px",
                    position: "relative",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      transform: "translateY(-8px)",
                    }}
                  >
                    અન્ય વેરા
                  </span>
                </h2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    width: "100%",
                  }}
                >
                  <table className="divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th style={{ padding: "5px 10px" }}>
                          <span id="format">ક્રમ</span>
                        </th>
                        <th style={{ padding: "5px 10px" }}>
                          <span id="format">વેરો</span>
                        </th>
                        <th style={{ padding: "5px 10px" }}>
                          <span id="format">રહેઠાણ</span>
                        </th>
                        <th style={{ padding: "5px 10px" }}>
                          <span id="format">બિન-રહેઠાણ</span>
                        </th>
                        <th style={{ padding: "5px 10px" }}>
                          <span id="format">પ્લોટ</span>
                        </th>
                        <th style={{ padding: "5px 10px" }}>
                          <span id="format">કોમન પ્લોટ</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxes
                        ?.filter((item, index) => {
                          if (index < 4) return true;
                          return (
                            item.values.residence ||
                            item.values.nonResidence ||
                            item.values.plot ||
                            item.values.commonPlot
                          );
                        })
                        .map((tax, index) => (
                          <tr key={index}>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">{index + 1}</span>
                            </td>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">{tax?.name}</span>
                            </td>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">
                                {tax?.format === "rs" ? "રૂ|." : ""}{" "}
                                {tax?.values?.residence}
                                {tax?.format === "rs" ? "/-" : "%"}
                              </span>
                            </td>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">
                                {tax?.format === "rs" ? "રૂ|." : ""}{" "}
                                {tax?.values?.nonResidence}
                                {tax?.format === "rs" ? "/-" : "%"}
                              </span>
                            </td>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">
                                {tax?.format === "rs" ? "રૂ|." : ""}{" "}
                                {tax?.values?.plot}
                                {tax?.format === "rs" ? "/-" : "%"}
                              </span>
                            </td>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">
                                {tax?.format === "rs" ? "રૂ|." : ""}{" "}
                                {tax?.values?.commonPlot}
                                {tax?.format === "rs" ? "/-" : "%"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  padding: "8px",
                  marginTop: "20px",
                  borderRadius: "10px",
                  background: "#fff",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                    width: "100%",
                    maxWidth: "fit-content",
                    textAlign: "center",
                    border: "1px solid #000",
                    borderRadius: "5px",
                    marginBottom: "8px",
                    paddingBottom: "3px",
                    marginTop: "-15px",
                    paddingInline: "15px",
                    position: "relative",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      transform: "translateY(-8px)",
                      fontSize: "18px",
                    }}
                  >
                    - ઠરાવ અંગેની માહિતી -
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: "18px",
                    lineHeight: "23px",
                    marginTop: "-8px",
                  }}
                >
                  ગુજરાત પંચાયત ધારા ની કલમ ૨૦૦ મુજબ ગ્રામ પંચાયતને દર ચાર વર્ષે
                  આકારણી સર્વે કરવું ફરજીયાત છે. આપણા ગામપંચાયતની આકારણી મુદત
                  પૂર્ણ થઇ ગઈ હોય તો આજની ગ્રામ પંચાયત ની સામાન્ય બેઠક ની
                  <span>
                    {" "}
                    તારીખ{" "}
                    <b>
                      {details?.meetingDate
                        ? new Date(details.meetingDate).toLocaleDateString(
                            "en-GB",
                          )
                        : " "}
                    </b>{" "}
                  </span>
                  ના રોજ બેઠક નંબર{" "}
                  <b>{details?.meetingNumber || ".................."}</b>
                  {", "}
                  ઠરાવ નં. <b>
                    {details?.resolutionNumber || "............."}
                  </b>{" "}
                  થી મિલ્કત આકારણી સર્વેની કામગીરી કરી આપવા
                  <b>
                    <u>" એ.એફ. ઇન્ફોસીસ - સાવરકુંડલા "</u>
                  </b>{" "}
                  પાટીને નક્કી માં આવ્યું.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "40px",
                  paddingInline: "42px",
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    તલાટી કમ મંત્રી
                    <b style={{ display: "block", marginTop: "3px" }}>
                      {details?.tcmName || "......................."}
                    </b>
                  </span>
                  <span> {details?.gaam || ""} ગ્રામ પંચાયત કચેરી </span>
                  <span>
                    તા. {details?.taluka || ""}, જિ. {details?.district || ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    સરપંચ
                    <b style={{ display: "block", marginTop: "3px" }}>
                      {details?.sarpanchName || "......................."}
                    </b>
                  </span>
                  <span> {details?.gaam || ""} ગ્રામ પંચાયત કચેરી </span>
                  <span>
                    તા. {details?.taluka || ""}, જિ. {details?.district || ""}
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "18px",
                  right: "30px",
                  fontSize: "14px",
                  color: "#000",
                }}
              >
                <b> પાના નં. {toGujaratiNumber(2)} </b>
              </div>
            </div>
          </div>
        </div>
        <br />

        {/* Report - 3 */}
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            id="report-3"
            className="table-container shadow-m"
            style={{
              width: "680px",
              minWidth: "680px",
              minHeight: "1080px",
              position: "relative",
              padding: "15px",
              paddingTop: "23px",
              paddingRight: "23px",
              background: "#fff",
            }}
          >
            <div
              className="rounded-lg border border-black"
              style={{
                border: "2px solid black",
                width: "100%",
                height: "100%",
                padding: "5px",
                paddingBottom: "15px",
              }}
            >
              <div
                className="flex justify-between items-center mb-4"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingInline: "16px",
                  }}
                >
                  <h3 style={{ fontSize: "16px" }}>
                    ગામ :- <b>{details?.gaam || ""}</b>
                  </h3>
                  <h3 style={{ fontSize: "16px" }}>
                    તાલુકો :- <b>{details?.taluka || ""}</b>
                  </h3>
                  <h3 style={{ fontSize: "16px" }}>
                    જિલ્લો :- <b>{details?.district || ""}</b>
                  </h3>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  padding: "8px",
                  borderRadius: "10px",
                  background: "#ffffffff",
                }}
              >
                <h2
                  style={{
                    fontSize: "17px",
                    width: "100%",
                    maxWidth: "fit-content",
                    textAlign: "center",
                    border: "1px solid #000",
                    borderRadius: "5px",
                    marginBottom: "5px",
                    paddingBottom: "3px",
                    marginTop: "-15px",
                    paddingInline: "15px",
                    position: "relative",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <span
                    style={{
                      position: "relative",
                      transform: "translateY(-8px)",
                    }}
                  >
                    * મિલ્કત આકારણી સર્વેની અન્ય વિગત *
                  </span>
                </h2>
                <p
                  style={{
                    marginTop: "-8px",
                    fontSize: "14px",
                    paddingLeft: "15px",
                    lineHeight: "20px",
                  }}
                >
                  આ આકારણી સર્વેનું કામ શરૂ કરતા પહેલા ગ્રામપંચાયતના ત.ક.મ. તથા
                  સરપંચશ્રી અને આકારણી કમિટીના સભ્યો, પટ્ટાવાળા, વાલમેન સાથે
                  રહિને સર્વે કરનાર એજન્સી ને કામ શરૂ કરવાનું રહેશે આકારણી સર્વે
                  ગામની તમામ મિલ્કતને રૂબરૂ માં સ્થળ તપાસ કરી આકારણી રજીસ્ટર તથા
                  કરવેરા માંગણા રજિ. અને કરવેરા તારીજ પત્રક તેમજ પાનોતરી તથા
                  આકારણી ને લગત તમામ પ્રકાર નું રેકડ કોમ્પ્યુટરાઇઝડ બાઇનડીંગ
                  સાથે અધ્યતન તેયાર કરી આપવાનું રહેશે.
                </p>
                <p
                  style={{
                    marginTop: "2px",
                    lineHeight: "20px",
                    paddingLeft: "15px",
                  }}
                >
                  સબબ કામગીરી{" "}
                  <b>
                    <u>એ. એફ. ઇન્ફોસીસ - સાવરકુંડલા</u>
                  </b>{" "}
                  ના ભાવ - એક મિલ્કત દિઠ ₹
                  <b style={{ textDecoration: "underline" }}>
                    {details?.surveyHouseRate || "......."}
                  </b>
                  {"/- "} શબ્દોમાં અંકે રૂપીયા{" "}
                  <b
                    style={{
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {details?.approvedAmountWords ||
                      "........................."}
                  </b>
                  {"/- "} ભાવ મંજુર કરેલ છે જે આજની ગ્રામપંચાયત ની સામાન્ય બેઠક
                  માં બહાલી આપી.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  paddingLeft: "20px",
                  paddingTop: "3px",
                }}
              >
                <h2 style={{ fontSize: "16px", textDecoration: "underline" }}>
                  વિસ્તારની વિગત : : -
                </h2>
                <h2 style={{ fontSize: "16px", marginTop: "-5px" }}>
                  પહેલા વિસ્તાર/શેરી મહોલ્લો કયા થી શરૂ કરવો :-{" "}
                  <b>{details?.startArea || ""}</b>
                </h2>
                <h2 style={{ fontSize: "16px", marginTop: "-6px" }}>
                  આકારણી સર્વે કામ પહેલી મિલ્કત/ઘર કોની લખવી : -{" "}
                  <b style={{ whiteSpace: "nowrap" }}>
                    {details?.firstPropertyOwner || ""}
                  </b>
                </h2>

                <h2
                  style={{
                    fontSize: "16px",
                    textDecoration: "underline",
                    marginTop: "3px",
                  }}
                >
                  પાણી ની વિગત : : -
                </h2>
                <h2 style={{ fontSize: "16px", marginTop: "-5px" }}>
                  જે મિલ્‍કત માં નળ હોય તેમા સામાન્‍ય પાણી વેરો લેવો કે નહી ?{" "}
                  <b>
                    {details?.generalWaterTaxApplicable === "yes"
                      ? "હા"
                      : details?.generalWaterTaxApplicable === "no"
                        ? "ના"
                        : ""}
                  </b>
                </h2>
                <h2 style={{ fontSize: "16px", marginTop: "-6px" }}>
                  ખાસ પાણી નળ વેરો ત્થા સા.પાણી વેરો બન્‍ને વેરા મુકવા વેરો
                  લેવો. <b>{details?.specialAndGeneralWaterTax || ""}</b>
                </h2>
              </div>
              <div style={{ padding: "16px", paddingTop: "5px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    textDecoration: "underline",
                    marginBottom: "8px",
                  }}
                >
                  <b>
                    <u>નોધ ::-</u>
                  </b>
                </h2>
                <ol style={{ marginTop: "-10px", listStyleType: "none" }}>
                  {details?.notes?.map((item, index) => (
                    <li
                      key={index}
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.3",
                        marginLeft: "0",
                      }}
                    >
                      <span>{toGujaratiNumber(index + 1)}.</span> {item}
                    </li>
                  ))}
                </ol>
              </div>
              <div
                style={{
                  padding: "0px 20px",
                  fontSize: "15px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <table style={{ maxWidth: "fit-content" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "2px 8px", textAlign: "center" }}>
                        <span id="format"> ક્રમ </span>
                      </th>
                      <th style={{ padding: "0px", textAlign: "center" }}>
                        <span id="format"> આયોજન </span>
                      </th>
                      <th style={{ padding: "0px", textAlign: "center" }}>
                        <span id="format"> તારીખ </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "2px 5px", textAlign: "right" }}>
                        <span id="format">1</span>
                      </td>
                      <td style={{ padding: "2px 10px" }}>
                        <span id="format">વર્ક ઓર્ડર આપ્યા તારીખ</span>
                      </td>
                      <td style={{ padding: "0px", textAlign: "center" }}>
                        <span id="format">
                          <b>{formatDate(details?.workOrderDate)}</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "2px 5px", textAlign: "right" }}>
                        <span id="format">2</span>
                      </td>
                      <td style={{ padding: "2px 10px" }}>
                        <span id="format">ગામજનો માટે જાહેરાત તારીખ</span>
                      </td>
                      <td style={{ padding: "2px 10px", textAlign: "center" }}>
                        <span id="format">
                          <b>{formatDate(details?.jaheratDate)}</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "2px 5px", textAlign: "right" }}>
                        <span id="format">3</span>
                      </td>
                      <td style={{ padding: "2px 10px" }}>
                        <span id="format">
                          આકારણી સર્વે કામ શરૂ કર્યા તારીખ
                        </span>
                      </td>
                      <td style={{ padding: "0px", textAlign: "center" }}>
                        <span id="format">
                          <b>{formatDate(details?.akaraniStartDate)}</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "2px 5px", textAlign: "right" }}>
                        <span id="format">4</span>
                      </td>
                      <td style={{ padding: "2px 10px" }}>
                        <span id="format">સર્વે કામ પુર્ણ કર્યા તારીખ</span>
                      </td>
                      <td style={{ padding: "0px", textAlign: "center" }}>
                        <span id="format">
                          <b>{formatDate(details?.akaraniEndDate)}</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "2px 5px", textAlign: "right" }}>
                        <span id="format">5</span>
                      </td>
                      <td style={{ padding: "2px 10px" }}>
                        <span id="format">
                          રફ સર્વે રજી. PDF આકારણી મોકલ્યા તારીખ
                        </span>
                      </td>
                      <td style={{ padding: "0px", textAlign: "center" }}>
                        <span id="format">
                          <b>{formatDate(details?.submitionDate)}</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "2px 5px", textAlign: "right" }}>
                        <span id="format">6</span>
                      </td>
                      <td style={{ padding: "2px 10px" }}>
                        <span id="format">
                          ફાઇનલ સુધારો કરેલ સમય અને ૧૫ દિવસ તારીખ
                        </span>
                      </td>
                      <td style={{ padding: "0px", textAlign: "center" }}>
                        <span id="format">
                          <b>{formatDate(details?.updationDate)}</b>
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "2px 5px", textAlign: "right" }}>
                        <span id="format">7</span>
                      </td>
                      <td style={{ padding: "2px 10px" }}>
                        <span id="format">
                          પોર્ટલમાં ડેટા એન્ટ્રી કરવાની 4 મહિના બાદ તારીખ
                        </span>
                      </td>
                      <td style={{ padding: "0px", textAlign: "center" }}>
                        <span id="format">
                          <b>{formatDate(details?.entryDate)}</b>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "40px",
                  paddingInline: "42px",
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    તલાટી કમ મંત્રી
                    <b style={{ display: "block", marginTop: "3px" }}>
                      {details?.tcmName || "......................."}
                    </b>
                  </span>
                  <span> {details?.gaam || ""} ગ્રામ પંચાયત કચેરી </span>
                  <span>
                    તા. {details?.taluka || ""}, જિ. {details?.district || ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    સરપંચ
                    <b style={{ display: "block", marginTop: "3px" }}>
                      {details?.sarpanchName || "......................."}
                    </b>
                  </span>
                  <span> {details?.gaam || ""} ગ્રામ પંચાયત કચેરી </span>
                  <span>
                    તા. {details?.taluka || ""}, જિ. {details?.district || ""}
                  </span>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "18px",
                  right: "30px",
                  fontSize: "14px",
                  color: "#000",
                }}
              >
                <b> પાના નં. {toGujaratiNumber(3)} </b>
              </div>
            </div>
          </div>
        </div>
        <br />

        {/* --- NEW REPORT SUMMARY START --- */}
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            id="report-summary"
            className="shadow-md"
            style={{
              width: "794px",
              minWidth: "794px",
              background: "#fff",
              padding: "40px",
              boxSizing: "border-box",
              fontFamily: "sans-serif",
            }}
          >
            {/* 1. Updated Title */}
            <h1
              style={{
                textAlign: "center",
                fontSize: "28px",
                textDecoration: "underline",
                marginBottom: "16px",
                fontWeight: "bold",
              }}
            >
              આકારણી વેલ્યુએશન માહિતી
            </h1>

            <div style={{ fontSize: "18px", lineHeight: "1.8" }}>
              {/* 6. Increased size, 100% width, centered Gaam / Taluka / District */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "30px",
                  fontSize: "22px",
                  marginBottom: "14px",
                  flexWrap: "wrap",
                }}
              >
                <span>
                  ગામ:- <b>{details?.gaam || "......................"}</b>
                </span>
                <span>
                  તાલુકો:- <b>{details?.taluka || "......................"}</b>
                </span>
                <span>
                  જિલ્લો:-{" "}
                  <b>{details?.district || "......................"}</b>
                </span>
              </div>

              <p>
                કુલ મિલકત ની સંખ્યા:-{" "}
                <b>
                  {sheetRecords.length > 0
                    ? toGujaratiNumber(sheetRecords.length)
                    : "......................"}
                </b>
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "-30px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p>
                    જુથ પંચાયત છે{" "}
                    <b>
                      {details?.panchayat?.includes("નહિ")
                        ? "ના"
                        : details?.panchayat === ""
                          ? "હા / ના"
                          : "હા"}
                    </b>
                  </p>

                  <p>
                    આકારણી વર્ષ:-{" "}
                    <b>{details?.akaraniYear || "......................"}</b>
                  </p>

                  <p>
                    વેરા રજીસ્ટર નું વર્ષ:-{" "}
                    <b>{details?.taxYear || "......................"}</b>
                  </p>

                  <p>
                    તારીખ:-{" "}
                    <b>
                      {formatDate(details?.date) || "......................"}
                    </b>
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <p>
                  સરપંચશ્રી નું નામ:-{" "}
                  <b>
                    {details?.sarpanchName ||
                      "................................................"}
                  </b>
                </p>
                <p>
                  તલાટી કમ મંત્રી નું નામ:-{" "}
                  <b>
                    {details?.tcmName ||
                      "................................................"}
                  </b>
                </p>
                <p>
                  સાથે રહેનાર નું નામ:-{" "}
                  <b>
                    {details?.assistantName ||
                      "................................................"}
                  </b>
                </p>
              </div>

              {/* 5. Show ONLY the selected option (no tick marks) */}
              {details?.valuationType && (
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "8px",
                    fontWeight: "bold",
                    fontSize: "19px",
                  }}
                >
                  {details.valuationType === "room"
                    ? "રૂમ દિઠ કિમત મુકવી"
                    : details.valuationType === "house"
                      ? "મકાન દિઠ કિમત લેવી"
                      : ""}
                </div>
              )}

              {/* 3. Squeezed 3rd & 4th columns + 4th column renamed to "વેરો" */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "30px",
                  fontSize: "18px",
                  textAlign: "left",
                  border: "2px solid black",
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid black" }}>
                    <th
                      style={{
                        padding: "5px 8px",
                        width: "1%",
                        whiteSpace: "nowrap",
                        borderRight: "1px solid black",
                        textAlign: "center",
                      }}
                      colSpan="2"
                    >
                      ક્રમ
                    </th>
                    <th
                      style={{
                        padding: "5px 10px",
                        borderRight: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      મિલ્કતનું વર્ણન / બાંધકામનો પ્રકાર
                    </th>
                    <th
                      style={{
                        padding: "5px 8px",
                        width: "1%",
                        whiteSpace: "nowrap",
                        borderRight: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      મિલ્કતની કિંમત
                    </th>
                    <th
                      style={{
                        padding: "5px 8px",
                        width: "1%",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      વેરો
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredValuation.map((record, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid black" }}>
                      <td
                        style={{
                          padding: "5px 8px",
                          borderRight: "1px solid black",
                          textAlign: "center",
                          width: "1%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          padding: "5px 8px",
                          borderRight: "1px solid black",
                          textAlign: "center",
                          width: "1%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {getAlphabeticalIndex(index)}
                      </td>
                      <td
                        style={{
                          padding: "5px 10px",
                          borderRight: "1px solid black",
                        }}
                      >
                        {record?.name}
                      </td>
                      <td
                        style={{
                          padding: "5px 8px",
                          borderRight: "1px solid black",
                          textAlign: "center",
                          width: "1%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {record?.price}
                      </td>
                      <td
                        style={{
                          padding: "5px 8px",
                          textAlign: "center",
                          width: "1%",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {record?.tax}
                      </td>
                    </tr>
                  ))}

                  {filteredValuation.length === 0 &&
                    [1, 2, 3, 4].map((_, index) => (
                      <tr
                        key={`blank-${index}`}
                        style={{ borderBottom: "1px solid black" }}
                      >
                        <td
                          style={{
                            padding: "5px 8px",
                            borderRight: "1px solid black",
                            textAlign: "center",
                            width: "1%",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            padding: "5px 8px",
                            borderRight: "1px solid black",
                            textAlign: "center",
                            width: "1%",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getAlphabeticalIndex(index)}
                        </td>
                        <td
                          style={{
                            padding: "5px 10px",
                            borderRight: "1px solid black",
                          }}
                        >
                          ..........................................
                        </td>
                        <td
                          style={{
                            padding: "5px 8px",
                            borderRight: "1px solid black",
                            textAlign: "center",
                            width: "1%",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ......
                        </td>
                        <td
                          style={{
                            padding: "5px 8px",
                            textAlign: "center",
                            width: "1%",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ......
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* 4. Flex wrap layout for Other Taxes */}
              <div style={{ marginBottom: "30px" }}>
                <h3
                  style={{
                    textDecoration: "underline",
                    marginBottom: "12px",
                    fontSize: "20px",
                  }}
                >
                  અન્ય વેરાઓ
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px 28px",
                    paddingLeft: "15px",
                  }}
                >
                  {filteredOtherTaxes.length > 0 ? (
                    filteredOtherTaxes.map((tax, idx) => (
                      <p key={idx} style={{ margin: 0, whiteSpace: "nowrap" }}>
                        {toGujaratiNumber(idx + 1)}. {tax.label}{" "}
                        <b> રૂ|.{toGujaratiNumber(tax.val)}/-</b>
                      </p>
                    ))
                  ) : (
                    <p style={{ margin: 0 }}>કોઈ અન્ય વેરા નથી.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>
                  નોંધ:-
                </h3>
                <p style={{ paddingLeft: "15px" }}>
                  ખાસ જરૂરી:- જો આકારણી રેકર્ડ માં ૯/ડી બન્નેમાં વેરાઓ નક્કી
                  કરેલ છે તે ખાસ તપાસ કરી લેવા ત્યાર બાદ જ પ્રિન્ટીંગ થશે.
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        {/* --- NEW REPORT SUMMARY END --- */}
      </div>
    </>
  );
};

export default OrderValuationReport;
