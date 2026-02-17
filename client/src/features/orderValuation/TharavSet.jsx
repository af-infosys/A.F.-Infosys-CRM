import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Report.scss";
import apiPath from "../../isProduction";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import toGujaratiNumber from "../../components/toGujaratiNumber";
import "./tharav.scss";

const TharavSet = () => {
  const { projectId } = useParams();

  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

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
        },
      );

      const data = response.data;
      console.log(data);

      setDetails(data.details || details);
      setValuation(
        Array.isArray(data?.valuation) && data?.valuation.length
          ? data.valuation
          : valuation,
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
        },
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

      doc.save(`Tharav_Set_${details?.akaraniYear}.pdf`);
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
          Tharav Set
        </h1>

        {/* <h2 className="text-xl text-center text-gray-600">Owner & Sales</h2> */}
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
              minHeight: "1080px",
              position: "relative",
              padding: "15px",
              paddtingTop: "23px",
              paddingRight: "23px",
              background: "#fff",
            }}
          >
            <div
            // className="rounded-lg border border-black"
            // style={{
            //   border: "2px solid black",
            //   width: "100%",
            //   height: "100%",
            //   padding: "8px",
            // }}
            >
              {/* <div
                className="flex justify-between items-center"
                style={{ width: "100%", paddingRight: "0px" }}
              > */}
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingInline: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <h3 style={{ fontSize: "14px", textWrap: "nowrap" }}>
                    બેઠક નં. <b>{Number(details?.meetingNumber) || "--"}</b>
                  </h3>

                  <h3 style={{ fontSize: "14px", textWrap: "nowrap" }}>
                    ઠરાવ નં. <b>{Number(details?.resolutionNumber) || "--"}</b>
                  </h3>
                </div>

                <h3
                  style={{
                    fontSize: "14px",
                    textWrap: "nowrap",
                  }}
                >
                  તારીખ :– <b>{formatDate(details?.date) || "--/--/----"}</b>
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <h2 style={{ fontSize: "14px" }}>
                    <b style={{ textDecoration: "underline" }}>
                      {details?.gaam || "-"}
                    </b>{" "}
                    ગ્રામ પંચાયત કચેરી
                  </h2>

                  <h2
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    તાલુકો :– <b>{details?.taluka || "-"}</b>
                  </h2>

                  <h2
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    જિલ્લો :- <b>{details?.district || "-"}</b>
                  </h2>
                </div>
              </div>
              <h2
                style={{
                  textDecoration: "underline",
                  marginTop: "8px",
                  marginBottom: "3px",
                  textAlign: "center",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                મિલ્કત આકારણી સર્વે કરવા અગેં ઠરાવ આકારણી વર્ષ :-{" "}
                {details?.akaraniYear || "--"}
              </h2>
              <p
                style={{
                  textIndent: "20mm",
                  // fontSize: "16px",
                  textAlign: "justify",
                }}
              >
                આથી ઠરાવવામાં આવે છે કે, આપણા ગામે નિયમ મુજબ ગુજરાત પંચાયત
                અધિનિયમ ૧૯૯૩ ની કલમ ર૦૦ મુજબ ગ્રામ પંચાયતએ દર (૪ – ચાર વર્ષે)
                જમીન અને મકાન પરના વેરાની નવેસરથી આકારણી કરવાની થાય છે જે આપણા
                ગામે થયેલ નથી જેથી પંચાયતની આવક વધારવા તથા કરવેરા રજીસ્ટર અધ્યતન
                બનાવવા આજની સભામાં નકકી કરવામાં આવે છે આ આકારણી મિલ્કતની
                મુડીરૂપી કિંમત રૂ।.૧૦,૦૦૦/–{" "}
                <span style={{ whiteSpace: "nowrap" }}>(૦.પ% ટકા લેખે)</span>{" "}
                લઘુતમ મિલ્કતનો વેરો રૂ।.પ૦/– નિર્ણય કરેલ છે.{" "}
                <b>
                  મિલ્કતને {details?.valuationType === "room" ? "રૂમ" : "મકાન"}{" "}
                  દિઠ કિમત
                </b>{" "}
                ગણવાની થશે.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "15px",
                  alignItems: "start",
                }}
              >
                <table
                  className="tharavTable"
                  style={{
                    borderRight: "1px solid black",
                  }}
                >
                  <thead>
                    <tr>
                      <th>રહેણાક મિલ્કતનું વર્ણન</th>

                      <th>કિંમત</th>

                      <th>વેરો</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>(૧) કાચા ગાર માટી</td>
                      <td>{valuation[0]?.price}</td>
                      <td>{valuation[0]?.tax}</td>
                    </tr>

                    <tr>
                      <td>(૨) નળીયા, પતરા, પીઢીયા, પાકા</td>
                      <td>{valuation[1]?.price}</td>
                      <td>{valuation[1]?.tax}</td>{" "}
                    </tr>

                    <tr>
                      <td>(૩) પાકા સ્લેબવાળા</td>
                      <td>{valuation[2]?.price}</td>
                      <td>{valuation[2]?.tax}</td>{" "}
                    </tr>
                  </tbody>
                </table>

                <table className="tharavTable">
                  <thead>
                    <tr>
                      <th>કોમર્શિયલ મિલ્કતનું વર્ણન</th>

                      <th>કિંમત</th>

                      <th>વેરો</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>(૪) દુકાન પાકી નાની </td>
                      <td>{valuation[7]?.price}</td>
                      <td>{valuation[7]?.tax}</td>{" "}
                    </tr>

                    <tr>
                      <td>(૫) દુકાન પાકી મોટી</td>
                      <td>{valuation[8]?.price}</td>
                      <td>{valuation[8]?.tax}</td>{" "}
                    </tr>

                    <tr>
                      <td>(૬) ગોડાઉન નાના</td>
                      <td>{valuation[9]?.price}</td>
                      <td>{valuation[9]?.tax}</td>{" "}
                    </tr>

                    <tr>
                      <td>(૭) ગોડાઉન મોટા</td>
                      <td>{valuation[10]?.price}</td>
                      <td>{valuation[10]?.tax}</td>{" "}
                    </tr>
                  </tbody>
                </table>
              </div>
              <h2
                style={{
                  marginTop: "-5px",
                  marginBottom: "3px",
                  textAlign: "center",
                  fontSize: "15px",
                }}
              >
                (અન્ય વેરા)
              </h2>
              <p
                style={{
                  // textIndent: "20mm",
                  // fontSize: "16px",
                  textAlign: "justify",
                }}
              >
                મકાન કર ઉપરાંત મકાન દિઠ{" "}
                <b>
                  સામાન્ય પાણી વેરો રૂ।.
                  {taxes[0]?.values?.residence || "0"}
                </b>{" "}
                લેખે તથા{" "}
                <b>
                  દિવાબતિ (લાઈટ વેરો) રૂ।.{taxes[2]?.values?.residence || "0"}
                </b>{" "}
                લેખે તેમજ{" "}
                <b>
                  સફાઈ વેરો રૂ।.
                  {taxes[3]?.values?.residence || "0"}
                </b>
                ,{" "}
                <b>
                  ખાસ પાણી વેરો નળ વેરો રૂ।.
                  {taxes[1]?.values?.residence || "0"}{" "}
                </b>{" "}
                વાર્ષિક લેખે આકાર નકિક કરવામાં છે તેમજ કિંમત અને વેરો બેસાડવાનો
                નિર્ણય કરેલ છે.
              </p>
              <p
                style={{
                  textIndent: "20mm",
                  // fontSize: "16px",
                  textAlign: "justify",
                }}
              >
                આ કામગીરી ગામની તમામ મિલ્કત ઘેર ઘેર ફરી સ્થળ તપાસ કરવાની રહેશે
                ત્યાર બાદ{" "}
                <b style={{ whiteSpace: "nowrap" }}>
                  તા.૧/૪/ર૦
                  {`${details?.taxYear?.charAt(5) || "-"}${details?.taxYear?.charAt(6) || "-"}`}
                </b>{" "}
                થી નાણાકિય વર્ષ મુજબ આકારણી દરે લાગુ થશે તે પ્રમાણે સર્વાનુમતે /
                બહુમતીથી ઠરાવવામાં આવવા માં આવ્યું.{" "}
              </p>
              <p
                style={{
                  textIndent: "20mm",
                  // fontSize: "16px",
                  textAlign: "justify",
                }}
              >
                આ અંગેની આકારણી કમિટીના નિચે મુજબના પંસદ કરેલ સભ્યોને નકકી
                કરવામાં આવે છે. આ આકારણી કમિટીના અધ્યક્ષ તરીકે સરપંચશ્રી રહેશે
                નવી આકારણી યાદી તૈયાર થયે ગ્રામ પંચાયતના જાહેર નોટીસ બોડ ઉપર
                પ્રસિધ્ધ કરી તેના વાંધા / સુંચનો માંગવાનું નિયમ મુજબ કરવાનું
                રહેશે જે આજની સભામાં સર્વાનુમતે / બહુમતીથી ઠરાવવામાં આવ્યું.
              </p>

              <p style={{ textAlign: "center" }}>આકારણી કમિટી</p>

              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "center",
                }}
              >
                <table className="comityTable">
                  <thead>
                    <tr>
                      <th>ક્રમ</th>

                      <th>આકરણી કમિટીના નામ</th>

                      <th>હોદો</th>

                      <th>સહી</th>
                    </tr>
                  </thead>

                  <tbody>
                    {details?.comity?.map((comity, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{comity?.name || "________"}</td>
                        <td>{comity?.designation || "______"}</td>
                        <td>__________________</td>
                      </tr>
                    ))}
                    {!details?.comity && (
                      <tr>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p
                style={{
                  textIndent: "20mm",
                  // fontSize: "16px",
                  textAlign: "justify",
                }}
              >
                સદરહુ કામગીરી આકારણી સર્વેનું કામ એ.એફ.ઈન્ફોસીસ – સાવરકુંડલાને
                (૧) મિલ્કત દિઠ અંકે રૂ।
                <b style={{ textDecoration: "underline" }}>
                  {details?.surveyHouseRate || "......."}
                </b>
                {"/- શબ્દોમાં "}
                <b
                  style={{
                    textDecoration: "underline",
                    whiteSpace: "nowrap",
                  }}
                >
                  {details?.approvedAmountWords || "........................."}
                </b>{" "}
                ભાવ મંજુર કરવામાં આવે છે તેમજ આ અંગેના આકારણી રજીસ્ટર અને કરવેરા
                રજીસ્ટર કોમ્પ્યુટરાઈઝડ થી તૈયાર બનાવી આપવાના થશે આ કામ (જોબવર્ક)
                મજુરી થી કરી આપવાનું રહેશે જે આજની ગ્રા.પં.મીટીંગમાં ઠરાવવામાં
                આવે છે અને આ અંગેનો ખર્ચ ગ્રામ પંચાયતના સ્વભંડોળ માંથી કરવાનો
                રહેશે.
              </p>
              <p> દરખાસ્ત મુકનાર </p>
              <p> ટેકો આપનાર </p>
              <p> ઠરાવ સર્વાનુમતે મંજુર</p>
              <p
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "40px",
                }}
              >
                <b>અસલ ઉપરથી નકલ</b>
                <span style={{ whiteSpace: "nowrap" }}>
                  તારીખ :– <b>{formatDate(details?.date) || "--/--/----"}</b>
                </span>
              </p>

              <div
                style={{
                  position: "absolute",
                  bottom: "120px",
                  right: "100px",
                  fontSize: "14px",
                  color: "#000",
                }}
              >
                <p
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>સરપંચ</span>

                  <span>
                    <b>{details?.gaam || "-"}</b> ગ્રામ પંચાયત
                  </span>
                </p>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "60px",
                  right: "280px",
                  fontSize: "14px",
                  color: "#000",
                }}
              >
                <p
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>તલાટી કમ મંત્રી</span>

                  <span>
                    <b>{details?.gaam || "-"}</b> ગ્રામ પંચાયત
                  </span>
                </p>
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
            justifyContent: "start",
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
              paddtingTop: "23px",
              paddingRight: "23px",
              background: "#fff",
            }}
          >
            <div
            // className="rounded-lg border border-black"
            // style={{
            //   border: "2px solid black",
            //   width: "100%",
            //   height: "100%",
            //   padding: "5px",
            // }}
            >
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

                    marginTop: "80px",
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
                    - વર્ક ઓર્ડર -
                  </span>
                </h2>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingInline: "20px",
                  }}
                >
                  <span>
                    બેઠક નં.{" "}
                    <b>{Number(details?.meetingNumber) || "........"}</b>
                  </span>

                  <span>
                    ઠરાવ નં.{" "}
                    <b>{Number(details?.resolutionNumber) || "........"}</b>
                  </span>

                  <span>
                    તારીખ :-{" "}
                    <b>
                      {formatDate(details?.workOrderDate) || ".../.../......"}
                    </b>
                  </span>
                </div>

                <br />

                <p>પ્રતિ,</p>
                <p>શ્રી એ.એફ.ઈન્ફોસીસ</p>
                <p>મું.સાવરકુંડલા.</p>
                <p>જિલ્લો : – અમરેલી.</p>

                <b
                  style={{
                    fontSize: "18px",
                    textAlign: "center",
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <u>
                    વિષય : – મિલ્કત આકારણી સર્વે કામગીરી કરવા માટે નો વર્ક
                    ઓર્ડર...
                  </u>
                </b>

                <p
                  style={{
                    fontSize: "16px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  સવિનય સાથ જણાવવાનું કે, ગુજરાત પંચાયત ધારાની–૧૯૯૩ કલમ નં.ર૦૦
                  મુજબ ગ્રામ પંચાયતએ દર ૪ ચાર વર્ષે રિ – આકારણી સર્વે કરવાની
                  ફરજીયાત હોય ગ્રા.પં. આકારણી ઠરાવ આધારે બેઠકમાં મંજુર કરેલ છે.
                  તેમજ અત્રેની ગ્રામ પંચાયતની તારીખની બેઠકના ઠરાવ નં{" "}
                  <b>{details?.resolutionNumber || "........."}</b> થી મિલ્કત
                  આકારણી ગામની તમામ મિલ્કતોને ઘેર–ઘેર જઈને સ્થળ તપાસ કરી મિલ્કત
                  આકારણી સર્વેની કામગીરી કરવા માટે એ.એફ.ઈન્ફોસીસ – સાવરકુંડલાને
                  આ કામગીરી (જોબવર્ક) મજુરી થી ૧ – ઘર મકાન મિલ્કત દિઠ રૂ।
                  <b style={{ textDecoration: "underline" }}>
                    {details?.surveyHouseRate || "......."}
                  </b>
                  {"/- "}
                  શબ્દોમાં{" "}
                  <b
                    style={{
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {details?.approvedAmountWords ||
                      "........................."}
                  </b>{" "}
                  ભાવ મંજુર કરવામાં આવે છે.
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  સદરહુ આકારણી સર્વેની કામગીરી કોમ્પ્યુટરાઈઝડ આકારણી રજીસ્ટર
                  તેમજ કરવેરા રજીસ્ટર બનાવી (જોબવર્ક) મજુરી થી કરી આપવાનું રહેશે
                  અત્રેની ગ્રામ પંચાયત તારીખ :–{" "}
                  <b>
                    {formatDate(details?.workOrderDate) || ".../.../......"}
                  </b>{" "}
                  થી બેઠકના ઠરાવ નં{" "}
                  <b>{details?.resolutionNumber || "........."}</b> થી મંજુર
                  કરેલ છે.
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  આ વહીવટી કામગીરી અંગેનો તમામ ખર્ચ ગ્રામ પંચાયતના સ્વભંડોળ
                  માંથી ચુકવવાનો રહેશે.
                </p>
              </div>

              <br />

              {/* Footer & Signature */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "130px",
                  paddingInline: "42px",
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                {/* TCM */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    તલાટી કમ મંત્રી
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                      }}
                    >
                      {details?.tcmName || "......................."}
                    </b>
                  </span>

                  <span> {details?.gaam || ""} ગ્રામ પંચાયત કચેરી </span>

                  <span>
                    તા. {details?.taluka || ""}, જિ. {details?.district || ""}
                  </span>
                </div>

                {/* Sarpanch */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    સરપંચ
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                      }}
                    >
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
            justifyContent: "start",
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
              paddtingTop: "23px",
              paddingRight: "23px",
              background: "#fff",
            }}
          >
            <div
            // className="rounded-lg border border-black"
            // style={{
            //   border: "2px solid black",
            //   width: "100%",
            //   height: "100%",
            //   padding: "5px",
            // }}
            >
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

                    marginTop: "25px",
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
                    - ગામજનો માટે જાહેરાત -
                  </span>
                </h2>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingInline: "20px",
                  }}
                >
                  <span>
                    બેઠક નં.{" "}
                    <b>{Number(details?.meetingNumber) || "........"}</b>
                  </span>

                  <span>
                    ઠરાવ નં.{" "}
                    <b>{Number(details?.resolutionNumber) || "........"}</b>
                  </span>

                  <span>
                    તારીખ :-{" "}
                    <b>
                      {formatDate(details?.jaheratDate) || ".../.../......"}
                    </b>
                  </span>
                </div>

                <br />

                <p>પ્રતિ,</p>
                <p>
                  શ્રી <b>{details?.gaam || "................"}</b>, તમામ ગામ
                  જનો
                </p>

                <b
                  style={{
                    fontSize: "18px",
                    textAlign: "center",
                    marginTop: "20px",
                    marginBottom: "10px",
                    paddingInline: "100px",
                  }}
                >
                  <u>
                    વિષય : :– ગામના તમામ ઘેર – ઘેર જઈને મિલ્કત આકારણી સર્વે કરવા
                    માટે જાહેર જનતાને સહકાર આપવા બાબત...
                  </u>
                </b>

                <p
                  style={{
                    fontSize: "16px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  જય ભારત સાથ જણાવવાનું કે, ગુજરાત પંચાયત ધારાની – ૧૯૯૩ કલમ
                  નં.ર૦૦ મુજબ ગ્રામપંચાયતએ દર ૪ ચાર વર્ષે રિ – આકારણી સર્વે
                  કરવાની ફરજીયાત હોય તેના આધારે અત્રેની ગ્રામ પંચાયતની મિલ્કત
                  આકારણી ગામની તમામ મિલ્કતોને ઘેર – ઘેર જઈને મિલ્કત આકારણીની
                  સર્વે કામગીરી કરવા માટે આવેલ પ્રતિનીધીને આ કામગીરી કરવા માટે
                  મંજુરી આપવામાં છે.
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  આ કામગીરીથી મિલ્કત ધારકને થતા મહત્વના ફાયદાઓ (૧)કુદરતી આફતોમા
                  અતિ ભારે વરસાદમાં મકાન પાણીમાં ડુબી જવું, વાવાઝોડામાં પડી જવુ
                  વિજળી પડવી વિગેરે (ર) ભુંકપ થવાથી મકાન ધરાશાઈ થવું તેના આધાર
                  પુરાવા સહાય માટે(૩) રહેણાંકના પુરાવા માટે જરૂરી (૪) મિલ્કત
                  વેચાણ ત્થા વારસાઈ માટે (પ) લોન લેવા માટે આધાર પુરાવા ત્થા સહાય
                  માટે (૬) વિજ કનેકશન (મીટર) લેવા માટે (૭) નળ કનેકશન માટે (૮)
                  પ્રધાન મંત્રી આવાસ યોજના માટે (૯) શૌચાલય બનાવવા માટ માટે (૧૦)
                  વ્યવસાય વેરા, ટીન નંબર, જી.એસ.ટી.(૧૧) પંચાયતના તમામ દાખલાઓ
                  કાઢવા માટે ખાસ જરૂરી (૧ર) સરકારશ્રીની વિવિધ યોજનાઓ માટે અતી
                  જરૂરી તેમજ મિલ્કત ધારકને ર૪ પ્રકારના વિવિધ ફાયદાઓ થાય છે અને
                  ખાસ અગત્યનું છે. વિશેષ મિલ્કત માલીક ને પોતાની મિલ્કત અંગે કોઈ
                  પણ જાતનો અંસતોષ, વિવાદ, વાંધા /તકરાર પ્રશ્ન ઉપસ્થિત હોય તો
                  ગ્રામ પંચાયતને દિન – ૧૦ માં લેખીતમાં પત્રથી જાણ કરવાની રહેશે
                  સમય મર્યાદા મુદત બહાર આવેલ અરજી માન્ય રાખવામાં આવશે નહિ.
                </p>

                <p
                  style={{
                    fontSize: "16px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  આ કામગીરી કાયદાને ધ્યાને રાખી ગામજનો માટે હિત હોય કામગીરી
                  સમયમર્યાદામા પુર્ણ કરવાની હોય આવનાર પ્રતિનિધીને મિલ્કત ને લગતા
                  આધાર પુરાવાઓ આપવા તેમજ મિલ્કત ધારકને અચુક હાજર રહેવુ અન્યથા
                  સર્વે કરનારને સહકાર આપવો.
                </p>
              </div>

              <br />

              {/* Footer & Signature */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "90px",
                  paddingInline: "42px",
                  position: "absolute",
                  bottom: "0px",
                  left: "0px",
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                {/* TCM */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    તલાટી કમ મંત્રી
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                      }}
                    >
                      {details?.tcmName || "......................."}
                    </b>
                  </span>

                  <span> {details?.gaam || ""} ગ્રામ પંચાયત કચેરી </span>

                  <span>
                    તા. {details?.taluka || ""}, જિ. {details?.district || ""}
                  </span>
                </div>

                {/* Sarpanch */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    સરપંચ
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                      }}
                    >
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
      </div>
    </>
  );
};

export default TharavSet;
