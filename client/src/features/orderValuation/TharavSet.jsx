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
import LOGOpng from "../../assets/logo.png";

const TharavSet = () => {
  const [margins, setMargins] = useState({
    letterA: 20,
    letterB: 30,
  });

  const handleMarginChange = (field, value) => {
    setMargins((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

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

  const [project, setProject] = useState([]);

  const fetchProject = async () => {
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
      setProject(result.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchData();
    fetchTaxes();
  }, []);

  const handleDownloadPdf = async () => {
    setIsPdfGenerating(true);
    const input1 = document.getElementById("legel-1");
    const input2 = document.getElementById("legel-2");

    if (!input1 || !input2) {
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
      // doc.addPage();
      // await addImageFitWidth(input3);

      doc.save(`Tharav_Set_${details?.akaraniYear} - (Legel 1,4).pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleDownloadPdf2 = async () => {
    setIsPdfGenerating(true);
    const input1 = document.getElementById("letter-1");
    const input2 = document.getElementById("letter-2");
    const input3 = document.getElementById("letter-3");
    const input4 = document.getElementById("letter-4");
    const input5 = document.getElementById("letter-5");

    if (!input1 || !input2 || !input3) {
      console.error("Could not find report elements.");
      setIsPdfGenerating(false);
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [680, 962],
      });

      // const pageWidth = doc.internal.pageSize.getWidth();
      // const pageHeight = doc.internal.pageSize.getHeight();

      const addImageFitWidth = async (element) => {
        const canvas = await html2canvas(element, { scale: 3 }); // sharpness
        const imgData = canvas.toDataURL("image/png");

        // const imgWidth = canvas.width;
        // const imgHeight = canvas.height;

        // const ratio = pageWidth / imgWidth;
        // const finalWidth = pageWidth;
        // const finalHeight = imgHeight * ratio;

        // const y = finalHeight > pageHeight ? 0 : (pageHeight - finalHeight) / 2;

        doc.addImage(imgData, "PNG", 0, 0, 680, 962);
      };

      // Add pages
      await addImageFitWidth(input1);
      doc.addPage();
      await addImageFitWidth(input2);
      doc.addPage();
      await addImageFitWidth(input3);
      doc.addPage();
      await addImageFitWidth(input4);
      doc.addPage();
      await addImageFitWidth(input5);

      doc.save(`${details?.akaraniYear} - Letter Pad.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
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
          disabled={isPdfGenerating || loading}
        >
          {isPdfGenerating ? "Generating PDF..." : "Download PDF (Legel)"}
        </button>

        <button
          onClick={handleDownloadPdf2}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-8 self-center"
          disabled={isPdfGenerating || loading}
        >
          {isPdfGenerating
            ? "Generating PDF..."
            : "Download PDF (Letter Pad - A4)"}
        </button>

        {/* Page - 1, Legel - 1 */}
        <h2 className="text-xl font-bold text-gray-800">ઠરાવ સેટ - 1</h2>
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
            id="legel-1"
            style={{
              width: "750px",
              minWidth: "750px",
              maxWidth: "750px",
              minHeight: "1235px",
              maxHeight: "1235px",

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
                    બેઠક નં.{" "}
                    <b>{Number(details?.meetingNumber) || "............"}</b>
                  </h3>

                  <h3 style={{ fontSize: "14px", textWrap: "nowrap" }}>
                    ઠરાવ નં.{" "}
                    <b>{Number(details?.resolutionNumber) || "............"}</b>
                  </h3>
                </div>

                <h3
                  style={{
                    fontSize: "14px",
                    textWrap: "nowrap",
                  }}
                >
                  તારીખ :–{" "}
                  <b>{formatDate(details?.date) || "..../..../........"}</b>
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
                {details?.akaraniYear || "............"}
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
                <span style={{ whiteSpace: "nowrap" }}>
                  ({toGujaratiNumber(valuation[0]?.per || "0")}% ટકા લેખે)
                </span>{" "}
                લઘુતમ મિલ્કતનો વેરો રૂ।.
                {toGujaratiNumber((10000 * valuation[0]?.per) / 100)}/– નિર્ણય
                કરેલ છે.{" "}
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
                      <td>{toGujaratiNumber(valuation[0]?.price, 1)}</td>
                      <td>{toGujaratiNumber(valuation[0]?.tax, 1)}</td>
                    </tr>

                    <tr>
                      <td>(૨) નળીયા, પતરા, પીઢીયા, પાકા</td>
                      <td>{toGujaratiNumber(valuation[1]?.price, 1)}</td>
                      <td>{toGujaratiNumber(valuation[1]?.tax, 1)}</td>{" "}
                    </tr>

                    <tr>
                      <td>(૩) પાકા સ્લેબવાળા</td>
                      <td>{toGujaratiNumber(valuation[2]?.price, 1)}</td>
                      <td>{toGujaratiNumber(valuation[2]?.tax, 1)}</td>{" "}
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
                      <td>{toGujaratiNumber(valuation[7]?.price, 1)}</td>
                      <td>{toGujaratiNumber(valuation[7]?.tax, 1)}</td>{" "}
                    </tr>

                    <tr>
                      <td>(૫) દુકાન પાકી મોટી</td>
                      <td>{toGujaratiNumber(valuation[8]?.price, 1)}</td>
                      <td>{toGujaratiNumber(valuation[8]?.tax, 1)}</td>{" "}
                    </tr>

                    <tr>
                      <td>(૬) ગોડાઉન નાના</td>
                      <td>{toGujaratiNumber(valuation[9]?.price, 1)}</td>
                      <td>{toGujaratiNumber(valuation[9]?.tax, 1)}</td>{" "}
                    </tr>

                    <tr>
                      <td>(૭) ગોડાઉન મોટા</td>
                      <td>{toGujaratiNumber(valuation[10]?.price, 1)}</td>
                      <td>{toGujaratiNumber(valuation[10]?.tax, 1)}</td>{" "}
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
                  {toGujaratiNumber(taxes[0]?.values?.residence) || "0"}
                </b>{" "}
                લેખે તથા{" "}
                <b>
                  દિવાબતિ (લાઈટ વેરો) રૂ।.
                  {toGujaratiNumber(taxes[2]?.values?.residence) || "0"}
                </b>{" "}
                લેખે તેમજ{" "}
                <b>
                  સફાઈ વેરો રૂ।.
                  {toGujaratiNumber(taxes[3]?.values?.residence) || "0"}
                </b>
                ,{" "}
                <b>
                  ખાસ પાણી વેરો નળ વેરો રૂ।.
                  {toGujaratiNumber(taxes[1]?.values?.residence) || "0"}{" "}
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
                        <td>{toGujaratiNumber(index + 1)}</td>
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
                  તારીખ :–{" "}
                  <b>{formatDate(details?.date) || "..../..../........"}</b>
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

        {/* Page - 4, Legel - 2 */}
        <h2 className="text-xl font-bold text-gray-800">ઠરાવ સેટ - 2</h2>
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
            id="legel-2"
            style={{
              width: "750px",
              minWidth: "750px",
              maxWidth: "750px",
              minHeight: "1235px",
              maxHeight: "1235px",

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

                  marginTop: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <h3 style={{ fontSize: "16px", textWrap: "nowrap" }}>
                    બેઠક નં.{" "}
                    <b>{Number(details?.meetingNumber2) || "............"}</b>
                  </h3>

                  <h3 style={{ fontSize: "16px", textWrap: "nowrap" }}>
                    ઠરાવ નં.{" "}
                    <b>
                      {Number(details?.resolutionNumber2) || "............"}
                    </b>
                  </h3>
                </div>

                <h3
                  style={{
                    fontSize: "16px",
                    textWrap: "nowrap",
                  }}
                >
                  તારીખ :–{" "}
                  <b>{formatDate(details?.date2) || "..../..../........"}</b>
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <h2 style={{ fontSize: "16px" }}>
                    <b style={{ textDecoration: "underline" }}>
                      {details?.gaam || "-"}
                    </b>{" "}
                    ગ્રામ પંચાયત કચેરી
                  </h2>

                  <h2
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    તાલુકો :– <b>{details?.taluka || "-"}</b>
                  </h2>

                  <h2
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    જિલ્લો :- <b>{details?.district || "-"}</b>
                  </h2>
                </div>
              </div>

              <h2
                style={{
                  textDecoration: "underline",
                  marginTop: "20px",
                  marginBottom: "10px",
                  textAlign: "center",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                કરવેરાની નવી આકારણી પ્રસિધ્ધ કરી આકારણી રજીસ્ટર મંજુર કરવા
                બાબત...
              </h2>
              <p
                style={{
                  textIndent: "20mm",
                  fontSize: "16px",
                  textAlign: "justify",
                }}
              >
                આથી ઠરાવવામાં આવે છે કે, આપણા ગામે કરવેરાની નવી આકારણી ગુજરાત
                પંચાયત અધિનિયમ ૧૯૯૩ કાયદાની કલમ ર૦૦ મુજબ ગ્રામ પંચાયતની બેઠક નં{" "}
                <b>{Number(details?.meetingNumber2) || "............"}</b> તા{" "}
                <b>{formatDate(details?.date2) || "..../..../........"}</b> ના
                ઠરાવ નં{" "}
                <b>{Number(details?.resolutionNumber2) || "............"}</b> થી
                ગામે મકાન કર, સામાન્ય પાણી કર, દિવાબતી કર, ખાસ પાણી કર, ગ્રામ
                સફાઈ કર ની આકારણી કરી નમુના નં. ૮ રજીસ્ટર આકારણી કમિટી ધ્વારા
                કરવામાં આવેલ છે જે રજીસ્ટર ગ્રામ પંચાયત કચેરીએ રજાના દિવસો સિવાય
                જોવા મુકેલ આ આકારણી સામે વાંધો તકકરાર સુચનો અરજદારના લેખીતમાં
                ધ્યાને લીધેલ જે આજની આકારણી કમિટીએ વંચાણે લીધે તેમજ વિવાદીત
                અરજીઓનો યોગ્ય રીતે નિકાલ કરી આકારણી કમિટીએ આકારણી રજીસ્ટર વંચાણે
                લઈ આજની સભામાં આકારણી રજીસ્ટર મંજુર કરેલ છે.
              </p>

              <p
                style={{
                  textIndent: "20mm",
                  fontSize: "16px",
                  textAlign: "justify",
                }}
              >
                મુદત બહાર આવેલા તકકરાર વાંધા સુચનો ધ્યાને લેવામાં આવશે નહિ અને
                નાણાકિય વર્ષ ૨૦ {details?.taxYear} થી {details?.taxYear} પંચાયત
                વેરા અમલ થશે જે આકરણી કમિટીએ મંજુર કરેલ છે.
              </p>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                આકારણી કમિટી
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "center",
                }}
              >
                <table className="comityTable border">
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
                        <td> </td>
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
                <b> પાના નં. {toGujaratiNumber(4)} </b>
              </div>
            </div>
          </div>
        </div>

        <br />

        {/* Report - 3 */}
        <h2 className="text-xl font-bold text-gray-800">
          વર્ક ઓર્ડર - Letter Pad
        </h2>
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <div
            id="letter-1"
            className="table-container shadow-md"
            style={{
              width: "680px",
              minWidth: "680px",
              maxWidth: "680px",
              height: "962px",
              minHeight: "962px",
              maxHeight: "962px",

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

                    marginTop: `${margins?.letterA}px`,
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

                  bottom: `${margins?.letterB}px`,

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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{margins?.letterA}</span>
              <input
                type="range"
                max={200}
                value={margins.letterA}
                onChange={(e) => {
                  handleMarginChange("letterA", e.target.value);
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{margins?.letterB}</span>
              <input
                type="range"
                value={margins.letterB}
                onChange={(e) => {
                  handleMarginChange("letterB", e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <br />

        {/* Report - 4 */}
        <h2 className="text-xl font-bold text-gray-800">
          ગામજનો માટે જાહેરાત - Letter Pad
        </h2>
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <div
            id="letter-2"
            className="table-container shadow-m"
            style={{
              width: "680px",
              minWidth: "680px",
              maxWidth: "680px",
              height: "962px",
              minHeight: "962px",
              maxHeight: "962px",

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

                    marginTop: `${margins?.letterC}px`,
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
                    fontSize: "16px",
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
                    fontSize: "14px",
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
                    fontSize: "14px",
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
                    fontSize: "14px",
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
                  bottom: `${margins?.letterD}px`,
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{margins?.letterC}</span>
              <input
                type="range"
                max={200}
                value={margins.letterC}
                onChange={(e) => {
                  handleMarginChange("letterC", e.target.value);
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{margins?.letterD}</span>
              <input
                type="range"
                value={margins.letterD}
                onChange={(e) => {
                  handleMarginChange("letterD", e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <br />

        {/* Report - 5 */}
        <h2 className="text-xl font-bold text-gray-800">
          GP પ્રમાણપત્ર - Letter Pad
        </h2>
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <div
            id="letter-3"
            className="table-container shadow-m"
            style={{
              width: "680px",
              minWidth: "680px",
              maxWidth: "680px",
              height: "962px",
              minHeight: "962px",
              maxHeight: "962px",

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

                    marginTop: `${margins?.letterE}px`,
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
                      fontSize: "20px",
                    }}
                  >
                    ** પ્રમાણપત્ર **
                  </span>
                </h2>

                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  આથી પ્રમાણપત્ર લખી આપવામાં આવે છે કે, એ.એફ.ઈન્ફોસીસ –
                  સાવરકુંડલા એ{" "}
                  <b style={{ whiteSpace: "nowrap" }}>
                    {details?.gaam || ".................."} ગ્રામ પંચાયત
                  </b>
                  {", "}
                  તાલુકો <b>{details?.taluka || ".................."}</b>,
                  જિલ્લો <b>{details?.district || ".................."}</b> ની
                  ગામની અંદર તમામ સમાવિષ્ટ થતી મિલ્કતો, ઘરો ની કુલ સંખ્યા{" "}
                  <b>{project?.length || "........."}</b> ની આકારણી સર્વે કરેલ
                  છે.
                </p>

                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  આ આકારણી સર્વે સને.ર૦ માં ગામના દરેક મકાનો, શોપીંગ સેન્ટર,
                  એપાર્ટમેન્ટ, કોમ્પલેક્ષ, સોસાઈટી, પરા, વિસ્તાર, ઔર્ધૌગીક
                  હેંતુના કારખાનાઓ અને તમામ ફેકટરીઓ મિલ્કતો રૂબરૂ સ્થળ તપાસ /
                  ચકાસણી કરીને આકારણી રજીસ્ટર તૈયાર કરી તેના આધારે કરવેરા
                  રજીસ્ટર કોમ્પ્યુટરાઈઝડ પ્રિન્ટ તથા સ્પાઈરલ બાઈડીંગ સાથે અધ્યતન
                  બનાવેલ છે તેમજ (જોબવર્ક) મજુરી થી આ કામગીરી ખુંબજ ખંતપુર્વક,
                  સારી રીતે તથા ઝડપી તેમજ કોઈ પણ જાતની ક્ષતિ વિના પુર્ણં કરેલ
                  છે.
                </p>

                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  અન્યથા અત્રેની ગ્રામ પંચાયતનું આકારણી રેકર્ડ સરપંચશ્રી તથા
                  તલાટી કમમંત્રીશ્રી ની રૂબરુમાં સોંપેલ છે. આ કામગીરી હકીકતલક્ષી
                  અને નિયમ / ધારા ધોરણ મુજબ કરેલ છે જેથી કામગીરી સંતોષ કારક છે.
                </p>
                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  આ કામના આધારે રેકર્ડ થી ચકાસતા/ખાતરી કરી આ પ્રમાણપત્ર લખી
                  આપવામાં આવે છે.
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
                  bottom: `${margins?.letterF}px`,
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
                <b> પાના નં. {toGujaratiNumber(5)} </b>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{margins?.letterE}</span>
              <input
                type="range"
                max={200}
                value={margins.letterE}
                onChange={(e) => {
                  handleMarginChange("letterE", e.target.value);
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>{margins?.letterF}</span>
              <input
                type="range"
                value={margins.letterF}
                onChange={(e) => {
                  handleMarginChange("letterF", e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        <br />

        {/* Report - 6 */}
        <h2 className="text-xl font-bold text-gray-800">કરાર - i</h2>
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <div
            id="letter-4"
            className="table-container shadow-m"
            style={{
              width: "680px",
              minWidth: "680px",
              maxWidth: "680px",
              height: "962px",
              minHeight: "962px",
              maxHeight: "962px",

              position: "relative",
              padding: "15px",
              paddtingTop: "23px",
              paddingRight: "23px",
              background: "#fff",
            }}
          >
            <br />
            <br /> <br />
            <div id="title">
              <div>
                <h2 className="text-5xl text-center font-extrabold mt-4">
                  {/* A.F. Infosys */}
                </h2>

                <p className="trans" style={{ fontSize: "13px" }}>
                  ગ્રામપંચાયત રેવન્યુ(જમાબંધી) વાર્ષીક હિસાબ, આકાણીસર્વે, કરવેરા
                  રજીસ્ટર, રોજમેળ, ગ્રામસુવિધા પોર્ટલ તથા ઓનલાઈન / ઓફલાઈન તમામ
                  પ્રકારની ડેટાએન્ટ્રી અને પ્રિન્ટીંગ, વેબસાઈટ, સોફ્ટવેર,
                  કોમ્પ્યુટર કામ માટે મળો
                </p>

                <p className="address trans" style={{ fontSize: "13px" }}>
                  બીજામાળે, સેન્ટ્રલપોઈન્ટ કોમ્પ્લેક્ષ, જુનાબસસ્ટેન્ડ સામે -
                  સાવરકુંડલા જિ.અમરેલી. સૌરાષ્ટ્ર (પશ્વિમગુજરાત)
                </p>
              </div>

              <img src={LOGOpng} alt="Logo" />
            </div>
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingInline: "20px",

                    fontSize: "18px",
                  }}
                >
                  <span>
                    તારીખ :-{" "}
                    <b>
                      {formatDate(details?.workOrderDate) || ".../.../......"}
                    </b>
                  </span>
                </div>

                <br />

                <p
                  style={{
                    fontSize: "18px",
                  }}
                >
                  પ્રતિ,
                </p>
                <p
                  style={{
                    fontSize: "18px",
                  }}
                >
                  સરપંચશ્રી / તલાટી કમ મંત્રી,
                </p>
                <p
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {details?.gaam || "____________"} ગ્રામ પંચાયત કચેરી,
                </p>
                <p
                  style={{
                    fontSize: "18px",
                  }}
                >
                  તાલુકો :- {details?.taluka || "____________"}{" "}
                </p>
                <p
                  style={{
                    fontSize: "18px",
                  }}
                >
                  જિલ્લો :- {details?.district || "____________"}{" "}
                </p>

                <b
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    marginTop: "23px",
                    marginBottom: "10px",
                  }}
                >
                  <u>વિષય : – આકારણી સર્વે કામ અંગે સમજુતી પત્ર બાબત</u>
                </b>

                <b
                  style={{
                    fontSize: "18px",
                  }}
                >
                  સવિનય,
                </b>
                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  ઉપરોક્ત વિષય અન્વયે જણાવવાનું કે, એ. એફ. ઈન્ફોસીસ અને{" "}
                  {details?.gaam || "____________"} ગ્રામપંચાયત કચેરી બન્ને
                  વચ્ચે થયેલા ચર્ચાયેલા નિયમો આકારણી સર્વે કામ કરવા બાબત સતાવાર
                  કરાર તરીકે કાર્ય કરે છે.
                </p>

                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  ગ્રામ પંચાયત બેઠકની તારીખ{" "}
                  <b>
                    {formatDate(details?.meetingDate) || "..../..../........"}
                  </b>{" "}
                  અને બેઠક નં. {details?.resolutionNumber || "........."} ઠરાવ
                  નં. {details?.meetingNumber || "........."} ના આધારે બન્ને
                  પક્ષ વચ્ચે ચર્ચા કરેલ જેમાં આકારણી સર્વે કામ સંબંધિત તમામ
                  પ્રકારની વિગતો, જરૂરીયાતો અને શરતો ચર્ચાઈ અને નક્કિ કરવામાં
                  આવ્યું હતુ.
                </p>

                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    textIndent: "20mm",
                  }}
                >
                  એ. એફ. ઈન્ફોસીસ અને __________ગ્રામપંચાયત કચેરી ધ્વારા બન્ને
                  વચ્ચે થયેલા ચર્ચાયેલા નીચે મુજબના મુદ્દાઑ ખાસ ધ્યાનમાં લેવામાં
                  આવશે
                </p>

                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    // textIndent: "20mm",
                  }}
                >
                  <ul>
                    <li style={{ display: "flex", gap: "10px" }}>
                      <span>(૧)</span>
                      મિલ્કતનું વર્ણન લખવું ગામની તમામ મિલ્કતનું આકારણી રજી.,
                      કરવેરા માંગણા રજી. તેમજ તારીજ અને કોમ્પ્યુટરાઈઝ્ર્ડ
                      પ્રિન્ટિંગ બાઈન્ડીંગ સાથે અધ્યતન બનાવી આપવાનું રહેશે તે
                      અંગેની તમામ કામગીરી એ. એફ. ઇન્ફૉસીસ ને કરી આપવાની રહેશે.
                    </li>

                    <li style={{ display: "flex", gap: "10px" }}>
                      <span>(૨)</span>
                      સ્ટેશનરી જેવી કે કાગળ, છાપકામ, બાઇન્ડિંગ, પ્લાસ્ટીક,
                      કોમ્પ્યુટરાઈઝ્ર્ડ ડેટા એન્ટ્રી મજુરી કામ સાથેના તમામ
                      પ્રકારના ભાવ એ. એફ. ઇન્ફૉસીસ કંપની એ આપવાના રહેશે{" "}
                    </li>
                  </ul>
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
                <b> પાના નં. {toGujaratiNumber(2)} </b>
              </div>
            </div>
          </div>
        </div>

        <br />

        {/* Report - 7 */}
        <h2 className="text-xl font-bold text-gray-800">કરાર - ii</h2>
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "start",
          }}
        >
          <div
            id="letter-5"
            className="table-container shadow-m"
            style={{
              width: "680px",
              minWidth: "680px",
              maxWidth: "680px",
              height: "962px",
              minHeight: "962px",
              maxHeight: "962px",

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
                <p
                  style={{
                    fontSize: "18px",
                    // lineHeight: "23px",
                    // textIndent: "20mm",
                  }}
                >
                  <ul>
                    <li style={{ display: "flex", gap: "10px" }}>
                      <span>(૩)</span>
                      આકારણી કમિટીના સભ્યો તથા તલાટી કમ મંત્રી સાહેબ અને
                      પંચાયતના ક્લાર્ક અને સરપંચશ્રી આકારણી સર્વે શરૂ કરવા માટે
                      ફરજીયાત હાજર હશે ત્યારબાદ જ એજન્સી આકારણી સર્વે કામ શરૂ
                      કરવાનું રહેશે.
                    </li>

                    <li style={{ display: "flex", gap: "10px" }}>
                      <span>(૪)</span>
                      જુના આકારણી રજી. નો જુનો મિલ્કત નંબર નવા આકારણી રજી. મા
                      તલાટી કમ મંત્રી સાહેબ પોતે ખરાઈ કરી લખવાના રહેશે.
                    </li>

                    <li style={{ display: "flex", gap: "10px" }}>
                      <span>(૫)</span>
                      પાછલી બાકી વેરા રકમ નવા કરવેરા માંગણા રજી. માં જુના કરવેરા
                      માંગણા રજી. તલાટી કમ મંત્રી સાહેબ પોતે ખરાઈ કરી ઉમેરવાની
                      રહેશે.
                    </li>

                    <li style={{ display: "flex", gap: "10px" }}>
                      <span>(૬)</span>
                      એ. એફ. ઇન્ફૉસીસ કંપની એ કોમ્પ્યુટરાઈઝ્ર્ડ આકારણીનું તમામ
                      પ્રકારનું રેકર્ડ બે વખત સુધારો કરી આપવાનો રહેશે ત્યાર બાદ
                      સુધારો કરી આપવામાં આવશે નહિ.
                    </li>

                    <li style={{ display: "flex", gap: "10px" }}>
                      <span>(૭)</span>
                      રહેવા માટેની રૂમની વ્યવસ્થા ગ્રામ પંચાયતે કરી આપવાની રહેશે
                      અથવા ગેસ્ટ હાઉસ ભાડુ ગ્રામપંચાયતને ચુકવવાનું રહેશે.
                    </li>
                  </ul>
                </p>

                <br />

                <b style={{ fontSize: "20px" }}>
                  <u>પેમેન્ટ વિગત :-</u>
                </b>
                <p
                  style={{
                    fontSize: "18px",
                  }}
                >
                  ……………………ગ્રામ પંચાયત ધ્વારા એડવાન્સ
                  રૂI..................ચુંકવણું કરવામાં આવ્યું છે. ચુંકવણી
                  દ્વારા કરવામાં આવ્યું છે તેના નં. મુજબ આધાર છે ચુંકવણું કર્યા
                  તારીખ :- ના રોજ કરેલ છે.
                </p>

                <br />

                <b style={{ fontSize: "20px" }}>
                  <u>ડિલેવરીની શરતો :-</u>
                </b>
                <p
                  style={{
                    fontSize: "18px",
                  }}
                >
                  સર્વે કામ પુર્ણ થાય તે સમય એ બાકીનું તમામ રકમનું ફુલ પેમેન્ટ
                  ગ્રામપંચાયત એ ચુંકવણું કરવાનું રહેશે ત્યાર બાદ જ એ. એફ.
                  ઇન્ફોસીસ ગ્રામ પંચાયતને આકારણી બાબતના રેકર્ડ મળશે
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

                  bottom: `70px`,

                  left: "0px",
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                {/* Owner */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <span>
                    <b
                      style={{
                        display: "block",
                        marginTop: "3px",
                        marginBottom: "10px",
                      }}
                    >
                      લી. આપનો વિશ્વાશું
                    </b>
                  </span>

                  <span id="sikko"> (A. F. Infosys) </span>

                  <span id="circle"></span>
                </div>

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
      </div>
    </>
  );
};

export default TharavSet;
