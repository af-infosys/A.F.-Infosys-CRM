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

  const records = [
    "કાચા ગાર માટી રૂમ ૧ ની કિંમત",
    "નળીયા, પતરા, પીઢીયા, પાકા રૂમ ૧ ની કિંમત",
    "પાકા સ્લેબવાળા રૂમ ૧ ની કિંમત",
    "માલ ઢોર નું ઢાળીયુ પતરા નું ત્થા વાહન રાખવાની જગ્‍યા",
    "કાચા જર્જરીત બંધ પડતર રૂમ ૧ ની કિંમત",
    "પાકા જર્જરીત બંધ પડતર રૂમ ૧ ની કિંમત",
    "કેબીન, પાલા, કાચી દુકાન, ૧ ની કિંમત",
    "પાકી દુકાન ૧ ની કિંમત",
    "ગોડાઉન ૧ ની કિંમત",
    "હોલ ૧ ની કિંમત",
    "શેડ ૧ ની કિંમત",
    "ખુલ્લો પ્લોટ ની કિંમત",
    "હિરાના કારખાના નાના",
    "હિરાના કારખાના મોટા",
    "મોબાઇલ ટાવર",
    "પેટ્રોલ પંપ, ગેસ પંપ",
    "હોટલ, રેસ્‍ટોરેન્‍ટ, લોજ હાઇવે પર",
    "કોટન કપાસ નું જીનીંગ",
    "તેલ ની ઘાણી ઓઇલ મીલ",
    "કારખાના, ફેકટરી, કંપ્‍ની, ઇન્‍ડસ્‍ટીજ",
    "કોલ્‍ડ સ્‍ટોરેજ",
    "લાતી / બેન્‍સો લાકડાનો",
    "વે બ્રિજ તોલ માપ કાટો વાહન માટેનો",
    "",
    "",
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const background = "#fff";

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

  const fetchData = async () => {
    try {
      // In a real application, you would pass a token for authentication
      const response = await axios.get(
        `${await apiPath()}/api/valuation/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      console.log(data);

      setDetails(data.details || details);
      setValuation(
        Array.isArray(data?.valuation) && data?.valuation.length
          ? data.valuation
          : valuation
      );

      console.log(`Fetching data for project ID: ${projectId}`);
    } catch (error) {
      console.error("Error fetching data:", error);

      console.log("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  const [taxes, setTaxes] = useState([]);

  // Function to fetch data based on projectId
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
        }
      );

      fetchedData = fetchedData?.data?.taxes;
      console.log(fetchedData);

      if (fetchedData && fetchedData.length > 0) {
        setTaxes(fetchedData);
        toast.success("Tax Data Fetched Successfully.");
      } else {
        toast.info("No Tax Data Found! try adding new Data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error Fetching Taxes Data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTaxes();
  }, []);

  const handleDownloadPdf = async () => {
    setIsPdfGenerating(true);
    const input1 = document.getElementById("report-1");
    const input2 = document.getElementById("report-2");
    const input3 = document.getElementById("report-3");

    if (!input1 || !input2 || !input3) {
      console.error("Could not find report elements.");
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
      const pageHeight = doc.internal.pageSize.getHeight();

      const addImageFitWidth = async (element) => {
        const canvas = await html2canvas(element, { scale: 3 }); // sharpness
        const imgData = canvas.toDataURL("image/png");

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = pageWidth / imgWidth;
        const finalWidth = pageWidth;
        const finalHeight = imgHeight * ratio;

        const y = finalHeight > pageHeight ? 0 : (pageHeight - finalHeight) / 2;

        doc.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);
      };

      // Add pages
      await addImageFitWidth(input1);
      doc.addPage();
      await addImageFitWidth(input2);
      doc.addPage();
      await addImageFitWidth(input3);

      doc.save(`1. Order_Valuation_Report_${details?.akaraniYear}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
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
          Order Valuation Report{" "}
        </h1>

        <h2 className="text-xl text-center text-gray-600">Owner & Sales</h2>
        <h2 className="text-xl text-center mb-8 text-gray-600">
          by - A.F. Infosys
        </h2>

        <button
          onClick={handleDownloadPdf}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-8 self-center"
          disabled={isPdfGenerating}
        >
          {isPdfGenerating ? "Generating PDF..." : "Download as PDF"}
        </button>

        {/* Report - 1 */}
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <div
            className="table-container shadow-md"
            id="report-1"
            style={{
              width: "680px",
              minWidth: "680px",
              minHeight: "1050px",
              position: "relative",
              padding: "5px",
              background: "#fff",
            }}
          >
            <div
              className="rounded-lg border border-black"
              style={{
                width: "100%",
                height: "100%",
                padding: "13px",
              }}
            >
              <div
                className="flex justify-between items-center"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingInline: "0px",
                  }}
                >
                  <h3 style={{ fontSize: "16px" }}>
                    નં./જા/{details?.javak || ""}
                  </h3>

                  <h3 style={{ fontSize: "16px" }}>
                    અંદાજીત ઘર ની સંખ્યા :– <b>{details?.totalHouses || 0}</b>
                  </h3>

                  <h3
                    style={{
                      fontSize: "16px",
                      position: "relative",
                      transform: "translateX(-35px)",
                    }}
                  >
                    TB<b>{details?.tbr}</b>R
                  </h3>

                  <h2 style={{ fontSize: "16px", color: "transparent" }}>
                    <b style={{ textDecoration: "underline" }}>
                      {details?.gaam || ""}
                    </b>{" "}
                    ગ્રામ પંચાયત કચેરી
                  </h2>
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
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    flexDirection: "column",
                    paddingRight: "30px",
                    position: "relative",
                    transform: "translateY(-25px)",
                  }}
                >
                  <h2 style={{ fontSize: "16px" }}>
                    <b style={{ textDecoration: "underline" }}>
                      {details?.gaam || ""}
                    </b>{" "}
                    ગ્રામ પંચાયત કચેરી
                  </h2>

                  <h2
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    તાલુકો :– <b>{details?.taluka || ""}</b>
                  </h2>

                  <h2
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    જિલ્લો :- <b>{details?.district || ""}</b>
                  </h2>

                  <h2
                    style={{
                      fontSize: "16px",
                    }}
                  >
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
                    </b>{" "}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: "18px",
                    textAlign: "right",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    paddingRight: "10px",
                    alignItems: "end",

                    marginTop: "-20px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      gap: "10px",
                    }}
                  >
                    ગામના નામ:
                    <b>
                      {!details?.panchayat?.includes("નહિ") &&
                        details?.panchayat
                          .split(/\d+\./) // split at "1.", "2.", etc.
                          .filter(Boolean) // remove empty strings
                          .map((village, index) => (
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
                  <h2
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    આકારણીનું વર્ષ :– <b>{details?.akaraniYear || ""}</b>
                  </h2>

                  <h2
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    વેરા રજીસ્ટરનું વર્ષ :– <b>{details?.taxYear || ""}</b>
                  </h2>
                </div>
              </div>
              {/* Info End */}

              {/* Names Start */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "3px" }}
              >
                <h2
                  style={{
                    fontSize: "16px",
                  }}
                >
                  સરપંચશ્રીનું પુરૂ નામ તથા મો.નં.{" "}
                  <b>
                    {details?.sarpanchName || ""} :-{" "}
                    {details?.sarpanchNumber || ""}{" "}
                  </b>
                </h2>

                <h2
                  style={{
                    fontSize: "16px",
                  }}
                >
                  તલાટી કમ મંત્રીશ્રીનું પુરૂ નામ તથા મો.નં.{" "}
                  <b>
                    {details?.tcmName || ""} :- {details?.tcmNumber || ""}
                  </b>
                </h2>

                <h2
                  style={{
                    fontSize: "16px",
                  }}
                >
                  સાથે રહેનાર વ્યકિતનું પુરૂ નામ તથા મો.નં.{" "}
                  <b>
                    {details?.assistantName || ""}
                    {" :- "}
                    {details?.assistantNumber || ""}
                  </b>
                </h2>
                <h2
                  style={{
                    fontSize: "16px",
                    marginTop: "-10px",
                  }}
                >
                  {details?.assistantHoddo || ""}
                </h2>
              </div>
              {/* Names End */}

              <h2
                style={{
                  fontSize: "18px",
                  width: "100%",
                  maxWidth: "fit-content",
                  textAlign: "center",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  marginBottom: "8px",
                  marginTop: "10px",
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
                  Order Report – : : ઑર્ડર રીપોર્ટ આકાર (વેલ્યુએશન) રીપોર્ટ : :
                  –
                </span>
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "140px",
                  justifyContent: "center",
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
                  marginTop: "10px",
                }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        color: "black",
                        // background: background,
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
                      style={{
                        color: "black",
                        // background: background,
                        textAlign: "center",
                        padding: "2px 3px",
                      }}
                    >
                      <span id="format">
                        મિલ્કતનું વર્ણન / બાંધકામનો પ્રકાર
                      </span>
                    </th>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        color: "black",
                        // background: background,
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
                        color: "black",
                        // background: background,
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
                  {valuation.slice(0, 20).map((record, index) => {
                    return (
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
                        </td>{" "}
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
                    );
                  })}

                  {valuation.length === 0 && !loading && !error && (
                    <tr>
                      <td
                        colSpan="25"
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
                  bottom: "16px",
                  right: "23px",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                પાના નં. {toGujaratiNumber(1)}
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
            justifyContent: "start",
          }}
        >
          <div
            id="report-2"
            className="table-container shadow-md"
            style={{
              width: "680px",
              minWidth: "680px",
              minHeight: "1050px",
              position: "relative",
              padding: "5px",
              background: "#fff",
            }}
          >
            <div
              className="rounded-lg border border-black"
              style={{
                width: "100%",
                height: "100%",
                padding: "13px",
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
                  Order Report – : : ઑર્ડર રીપોર્ટ આકાર (વેલ્યુએશન) રીપોર્ટ : :
                  –
                </span>
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "140px",
                  justifyContent: "center",
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
                  marginTop: "10px",
                }}
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        color: "black",
                        // background: background,
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
                      style={{
                        color: "black",
                        // background: background,
                        textAlign: "center",
                        padding: "2px 3px",
                      }}
                    >
                      <span id="format">
                        મિલ્કતનું વર્ણન / બાંધકામનો પ્રકાર
                      </span>
                    </th>
                    <th
                      className="px-1 py-1 text-xs font-medium text-black uppercase tracking-wider"
                      style={{
                        color: "black",
                        // background: background,
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
                        color: "black",
                        // background: background,
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
                  {valuation.slice(20).map((record, index) => {
                    return (
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
                        </td>{" "}
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
                    );
                  })}

                  {valuation.length === 0 && !loading && !error && (
                    <tr>
                      <td
                        colSpan="25"
                        className="px-6 py-4 text-center text-black"
                      >
                        No Data Found!
                      </td>
                    </tr>
                  )}
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
                  <tabe className="divide-y divide-gray-200">
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
                    {taxes
                      ?.filter((item) => {
                        return (
                          item.values.residence ||
                          item.values.nonResidence ||
                          item.values.plot ||
                          item.values.commonPlot
                        );
                      })
                      .map((tax, index) => {
                        return (
                          <tr>
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
                              </span>{" "}
                            </td>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">
                                {tax?.format === "rs" ? "રૂ|." : ""}{" "}
                                {tax?.values?.nonResidence}
                                {tax?.format === "rs" ? "/-" : "%"}
                              </span>{" "}
                            </td>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">
                                {tax?.format === "rs" ? "રૂ|." : ""}{" "}
                                {tax?.values?.plot}
                                {tax?.format === "rs" ? "/-" : "%"}
                              </span>{" "}
                            </td>
                            <td style={{ padding: "3px 5px" }}>
                              <span id="format">
                                {tax?.format === "rs" ? "રૂ|." : ""}{" "}
                                {tax?.values?.commonPlot}
                                {tax?.format === "rs" ? "/-" : "%"}
                              </span>{" "}
                            </td>
                          </tr>
                        );
                      })}
                  </tabe>
                </div>
              </div>

              {/* Order Report */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  padding: "8px",

                  marginTop: "20px",

                  borderRadius: "10px",
                  background: "#ffffffff",
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
                      fontSize: "18px",
                    }}
                  >
                    ઠરાવ અંગેની માહિતી
                  </span>
                </h2>
                <p
                  style={{
                    fontSize: "18px",
                    lineHeight: "23px",
                  }}
                >
                  ગુજરાત પંચાયત ધારા ની કલમ ૨૦૦ મુજબ ગ્રામ પંચાયતને દર ચાર વર્ષે
                  આકારણી સર્વે કરવું ફરજીયાત છે. આપણા ગામપંચાયતની આકારણી મુદત
                  પૂર્ણ થઇ ગઈ હોય તો આજની ગ્રામ પંચાયત ની સામાન્ય બેઠક ની{" "}
                  <span>
                    તારીખ{" "}
                    <b>
                      {details?.meetingDate
                        ? new Date(details.meetingDate).toLocaleDateString(
                            "en-GB"
                          )
                        : " "}
                    </b>{" "}
                  </span>
                  ના રોજ બેઠક નંબર{" "}
                  <b>{details?.meetingNumber || ".................."}</b>
                  {", "}
                  મુદ્દા નં. <b>{details?.agendaNumber || ".............."}</b>
                  {", "}
                  ઠરાવ નં. <b>
                    {details?.resolutionNumber || "............."}
                  </b>{" "}
                  થી મિલ્કત આકારણી સર્વેની કામગીરી કરી આપવા 'એ.એફ. ઇન્ફોસીસ -
                  સાવરકુંડલા' પાટીને નક્કી માં આવ્યું.
                </p>
              </div>

              <br />

              {/* Footer & Signature */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "32px",
                  paddingInline: "42px",
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                {/* TCM */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    સહિ. <b>........</b>
                  </span>

                  <span>
                    ત.ક.મ.નું પુરૂ નામ
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                      }}
                    >
                      {details?.tcmName || "......................."}
                    </b>
                  </span>

                  <br />
                  <br />
                  <br />
                  <br />

                  <span>ત.ક.મ.નો સિક્કો</span>
                </div>

                {/* Sarpanch */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    સહિ. <b>........</b>
                  </span>

                  <span>
                    સરપંચનું પુરૂ નામ
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                      }}
                    >
                      {details?.sarpanchName || "......................."}
                    </b>
                  </span>

                  <br />
                  <br />
                  <br />
                  <br />
                  <span>સરપંચ નો સિક્કો</span>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "23px",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                પાના નં. {toGujaratiNumber(2)}
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
            justifyContent: "start",
          }}
        >
          <div
            id="report-3"
            className="table-container shadow-m"
            style={{
              width: "680px",
              minWidth: "680px",
              minHeight: "1050px",
              position: "relative",
              padding: "5px",
              background: "#fff",
            }}
          >
            <div
              className="rounded-lg border border-black"
              style={{
                width: "100%",
                height: "100%",
                padding: "13px",
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
              {/* 
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                padding: "8px",
                borderRadius: "10px",
                background: "#f4f4f4ff",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  width: "100%",
                  textAlign: "center",
                  border: "1px solid #000",
                  borderRadius: "5px",
                  marginBottom: "8px",
                }}
              >
                અન્ય વેરા
              </h2>

              <div style={{ displa  y: "flex", flexWrap: "wrap", gap: "16px" }}>
                {taxes?.map((tax, index) => {
                  return (
                    <span>
                      ({index + 1}) {tax?.description} રૂ।. <b>{tax?.amount}</b>
                    </span>
                  );
                })}
              </div>
            </div> */}

              {/* Order Report */}
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
                    fontSize: "22px",
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
                    મિલ્કત આકારણી સર્વેની અન્ય વિગત
                  </span>
                </h2>

                {/* <p>
                ગુજરાત પંચાયત ધારા ની કલમ ૨૦૦ મુજબ ગ્રામ પંચાયતને દર ચાર વર્ષે
                આકારણી સર્વે કરવું ફરજીયાત છે. આપણા ગામની પંચાયતની આકારણી મુદત
                પૂર્ણ થઇ ગઈ હોય તો આજની ગ્રામ પંચાયત ની સામાન્ય બેઠક ની તા.{" "}
                <b>{details?.meetingDate || " "} </b> ના રોજ બેઠક નંબર{" "}
                <b>{details?.meetingNumber || ".................."}</b>
                {", "}
                મુદ્દા નં. <b>{details?.agendaNumber || ".............."}</b>
                {", "}
                ઠરાવ નં. <b>
                  {details?.resolutionNumber || "............."}
                </b>{" "}
                થી મિલ્કત આકારણી સર્વેની કામગીરી કરી આપવા પાટીને નક્કી માં
                આવ્યું.
              </p> */}

                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "18px",
                    paddingLeft: "15px",
                  }}
                >
                  આ આકારણી સર્વેનું કામ શરૂ કરતા પહેલા ગ્રામપંચાયતના ત.ક.મ. તથા
                  સરપંચશ્રી અને આકારણી કમિટીના સભ્યો, પટટાવાળા, વાલમેન સાથે
                  રહિને સર્વે કરનાર એજન્સી ને કામ શરૂ કરવાનું રહેશે આકારણી સર્વે
                  ગામની તમામ મિલ્કતને રૂબરૂ માં સ્થળ તપાસ કરી આકારણી રજીસ્ટર તથા
                  કરવેરા માંગણા રજિ. અને કરવેરા તારીજ પત્રક તેમજ પાનોતરી તથા
                  આકારણી ને લગત તમામ પ્રકાર નું રેકડ કોમ્પ્યુટરાઇઝડ બાઇનડીંગ
                  સાથે અધ્યતન તેયાર કરી આપવાનું રહેશે.
                </p>

                <p
                  style={{
                    marginTop: "16px",
                    lineHeight: "23px",
                    paddingLeft: "15px",
                  }}
                >
                  સબબ કામગીરી એ.એફ. ઇન્ફોસીસ - સાવરકુંડલા ના ભાવ - એક મિલ્કત દિઠ
                  ₹
                  <b style={{ textDecoration: "underline" }}>
                    {details?.surveyHouseRate || "......."}
                  </b>
                  {"/- "}
                  શબ્દોમાં અંકે રૂપીયા{" "}
                  <b
                    style={{
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {details?.approvedAmountWords ||
                      "........................."}
                  </b>{" "}
                  ભાવ મંજુર કરેલ છે જે આજની ગ્રામપંચાયત ની સામાન્ય બેઠક માં
                  બહાલી આપી.
                </p>
              </div>

              <br />

              {/* Vigat Start */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3px",
                  paddingLeft: "20px",
                }}
              >
                {/* Section 1 */}

                <h2 style={{ fontSize: "16px", textDecoration: "underline" }}>
                  વિસ્તારની વિગત : : -
                </h2>

                <h2
                  style={{
                    fontSize: "16px",
                  }}
                >
                  પહેલા વિસ્તાર/શેરી મહોલ્લો કયા થી શરૂ કરવો :-{" "}
                  <b>{details?.startArea || ""}</b>
                </h2>

                <h2
                  style={{
                    fontSize: "16px",
                    marginTop: "-10px",
                  }}
                >
                  આકારણી સર્વે કામ પહેલી મિલ્કત/ઘર કોની લખવી : -{" "}
                  <b style={{ whiteSpace: "nowrap" }}>
                    {details?.firstPropertyOwner || ""}
                  </b>
                </h2>

                {/* Section 2 */}
                <h2
                  style={{
                    fontSize: "16px",
                    textDecoration: "underline",
                    marginTop: "12px",
                  }}
                >
                  પાણી ની વિગત : : -
                </h2>
                <h2
                  style={{
                    fontSize: "16px",
                  }}
                >
                  જે મિલ્‍કત માં નળ હોય તેમા સામાન્‍ય પાણી વેરો લેવો કે નહી ?{" "}
                  <b>
                    {details?.generalWaterTaxApplicable === "yes"
                      ? "હા"
                      : details?.generalWaterTaxApplicable === "no"
                      ? "ના"
                      : ""}
                  </b>
                </h2>

                <h2
                  style={{
                    fontSize: "16px",
                    marginTop: "-10px",
                  }}
                >
                  ખાસ પાણી નળ વેરો ત્થા સા.પાણી વેરો બન્‍ને વેરા મુકવા વેરો
                  લેવો. <b>{details?.specialAndGeneralWaterTax || ""}</b>
                </h2>
              </div>
              {/* Vigat End */}

              <div style={{ padding: "16px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    textDecoration: "underline",
                    marginBottom: "8px",
                  }}
                >
                  <b>નોધ ::- </b>
                </h2>
                <ol style={{ marginTop: "-10px", listStyleType: "none" }}>
                  {details?.notes?.map((item, index) => {
                    return (
                      <li
                        key={index}
                        style={{
                          fontSize: "18px",
                          lineHeight: "1.2",
                          marginLeft: "0",
                        }}
                      >
                        <span>{index + 1}.</span> {item}
                      </li>
                    );
                  })}
                </ol>
              </div>

              <br />

              {/* Footer & Signature */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "32px",
                  paddingInline: "42px",
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                {/* TCM */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    સહિ. <b>........</b>
                  </span>

                  <span>
                    ત.ક.મ.નું પુરૂ નામ
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                      }}
                    >
                      {details?.tcmName || "......................."}
                    </b>
                  </span>

                  <br />
                  <br />
                  <br />
                  <br />

                  <span>ત.ક.મ.નો સિક્કો</span>
                </div>

                {/* Sarpanch */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    સહિ. <b>........</b>
                  </span>

                  <span>
                    સરપંચનું પુરૂ નામ
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                      }}
                    >
                      {details?.sarpanchName || "......................."}
                    </b>
                  </span>

                  <br />
                  <br />
                  <br />
                  <br />
                  <span>સરપંચ નો સિક્કો</span>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "23px",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                પાના નં. {toGujaratiNumber(3)}
              </div>
            </div>
          </div>
        </div>

        <br />
      </div>
    </>
  );
};

export default OrderValuationReport;
