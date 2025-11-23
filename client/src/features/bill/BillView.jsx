import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./bill.scss";
import apiPath from "../../isProduction";
import { Search, Edit, Save, FileText, Download } from "lucide-react";
import numberToGujaratiWords from "../../components/ToGujarati";

import LOGOpng from "../../assets/logo.png";

function BillView() {
  const reportRef = useRef(null);

  const [billData, setBillData] = useState({
    gaam: "loading...",
    taluka: "",
    district: "",
    year: "",

    invoiceNo: 0,
    date: "",
    description:
      "x ગામની મકાન આકારણી સર્વે, વર્ષ:- 2025/26 નું ગામ નમુના નં. ૮ આકારણી રજીસ્ટર ઘેર ઘેર જઇને બનાવી અને ગા.ન.ન.- ૯/ડી કરવેરા રજીસ્ટર બનાવિ કોમ્પ્યુટરાઈઝડ પ્રિન્ટ સાથે સ્પાઇરલ બાઈન્ડિંગ સાથે ઓનલાઈન ગ્રામ સુવિધા પોર્ટલમાં ડેટાએન્ટ્રી સાથે જોબવર્ક/મજુરીથી કમ્પલેટ અદ્યતન બનાવેલ",
    houseCount: 0,
    price: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBillData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const fetchWithBackoff = async (url, options, maxRetries = 5) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          // Read error message from body if available
          const errorBody = await response
            .json()
            .catch(() => ({ error: `HTTP error! Status: ${response.status}` }));
          throw new Error(
            errorBody.error || `HTTP error! Status: ${response.status}`
          );
        }
        return response; // Return the raw response for parsing outside
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Maximum retry attempts reached.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const id = "6882180eab7cc70564b9fb4b";
    const endpoint = `${await apiPath()}/api/valuation/bill/${id}`;

    // Payload structure must match the backend controller's expectation
    const payload = {
      invoiceNo: billData.invoiceNo,
      description: billData.description,
      price: billData.price,
      date: billData.date,
    };

    try {
      // 1. Send the request
      const response = await fetchWithBackoff(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(payload),
      });

      // 2. CRITICAL FIX: Parse the JSON body from the response object
      const result = await response.json();

      console.log("Update result:", result);

      if (result.bill) {
        // Update the main bill data state using the data returned from the backend
        // The backend returns price (total), houseCount, invoiceNo, etc.

        setBillData(result.bill || {});
        console.log("Bill data updated from server response:", result.bill);
        alert(result.message || "Bill details updated successfully!");
      } else {
        // Handle unexpected response structure
        throw new Error(
          "Update successful, but missing 'bill' data in response."
        );
      }
    } catch (error) {
      console.error("Failed to update bill details:", error);
      alert(
        `Failed to update bill: ${
          error.message || "Server communication failed."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBillDetails = async () => {
      const id = "6882180eab7cc70564b9fb4b";

      fetch(`${await apiPath()}/api/valuation/bill/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Bill Details: ", data?.bill);
          setBillData(data?.bill || {});
        });
    };

    fetchBillDetails();
  }, []);

  const handleDownloadPdf = () => {
    const input = reportRef.current;
    if (!input) return;

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("A.F.Infosys-Bill.pdf");
    });
  };

  const totalAmount = (billData?.houseCount * billData?.price).toFixed(2) || 0;

  return (
    // The main container for the bill view. We use Tailwind CSS for styling.
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="container mx-auto p-2 sm:p-6 lg:p-8 rounded-2xl max-w-4xl w-full">
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 sticky lg:top-24">
            <h2 className="text-xl font-semibold mb-4 text-purple-600 flex items-center">
              <Edit className="w-5 h-5 mr-2" />
              બિલ વિગતો એડિટ કરો (Edit Bill Details)
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Read-only fields */}
              <div className="p-2 border border-blue-100 bg-blue-50 rounded-lg text-sm text-gray-700">
                <p>
                  <strong>ગામ (Gaam):</strong> {billData.gaam}
                </p>
                <p>
                  <strong>વર્ષ (Year):</strong> {billData.year}
                </p>
              </div>

              {/* Editable Fields */}
              <div>
                <label
                  htmlFor="invoiceNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  ઇન્વોઇસ નંબર (Invoice No.)
                </label>
                <input
                  type="text"
                  id="invoiceNo"
                  name="invoiceNo"
                  value={billData.invoiceNo}
                  onChange={handleFormChange}
                  className="mt-1 w-full input-field"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  તારીખ (Date)
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={billData.date}
                  onChange={handleFormChange}
                  className="mt-1 w-full input-field"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="houseCount"
                  className="block text-sm font-medium text-gray-700"
                >
                  ઘરની સંખ્યા (House Count)
                </label>
                <input
                  type="number"
                  id="houseCount"
                  name="houseCount"
                  value={billData.houseCount}
                  className="mt-1 w-full input-field"
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  પ્રતિ ઘર ભાવ (Price Per House - ₹)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={billData.price}
                  onChange={handleFormChange}
                  className="mt-1 w-full input-field"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  વિગત (Description)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={billData.description}
                  onChange={handleFormChange}
                  rows="4"
                  className="mt-1 w-full input-field"
                  required
                />
              </div>

              <div className="text-lg font-bold pt-2 text-center text-purple-700">
                નવું કુલ: ₹{(billData.houseCount * billData.price).toFixed(2)}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? (
                  "સેવ થઈ રહ્યું છે..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> ફેરફારો સેવ કરો (Save
                    Changes)
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Download PDF button */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleDownloadPdf}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Download PDF
          </button>
        </div>

        {/* Header Section */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Bill/Reciept
        </h1>
        <h2 className="text-xl text-center text-gray-600">Owner & Sales</h2>
        <h2 className="text-xl text-center mb-8 text-gray-600">
          by - A.F. Infosys
        </h2>

        {/* Report - 1 */}
        <div
          className="flex justify-start md:justify-center"
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          <div
            ref={reportRef}
            className="table-container letterpad rounded-lg shadow-md border border-gray-200"
            style={{
              width: "735px",
              padding: "1rem",
              background: "#fff",
              minWidth: "735px",
              height: "1040px",
            }}
          >
            <div className="flex justify-between items-center mb-4 w-full">
              <div className="flex flex-col items-end w-full">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <h3 className="text-base font-grey-700">
                    Shahid Kalva - <span>93764 43146</span>
                  </h3>
                  <h3 className="text-base font-grey-700">
                    Sarfaraz Kalva - <span>99247 82732</span>
                  </h3>
                  <h3 className="text-base font-grey-700">
                    E-Mail :-{" "}
                    <span className="underline">af.infosys146@gmail.com</span>
                  </h3>
                  <h3 className="text-base font-grey-700">
                    Website :- <span className="underline">afinfosys.com</span>
                  </h3>
                </div>
              </div>
            </div>

            {/* Business Name and Logo */}
            <div id="title">
              <div>
                <h2 className="text-5xl text-center font-extrabold mt-4">
                  {/* A.F. Infosys */}
                </h2>

                <p className="trans">
                  ગ્રામપંચાયત રેવન્યુ(જમાબંધી) વાર્ષીક હિસાબ, આકાણીસર્વે, કરવેરા
                  રજીસ્ટર, રોજમેળ, ગ્રામસુવિધા પોર્ટલ તથા ઓનલાઈન / ઓફલાઈન તમામ
                  પ્રકારની ડેટાએન્ટ્રી અને પ્રિન્ટીંગ, વેબસાઈટ, સોફ્ટવેર,
                  કોમ્પ્યુટર કામ માટે મળો
                </p>

                <p className="address trans">
                  બીજામાળે, સેન્ટ્રલપોઈન્ટ કોમ્પ્લેક્ષ, જુનાબસસ્ટેન્ડ સામે -
                  સાવરકુંડલા જિ.અમરેલી. સૌરાષ્ટ્ર (પશ્વિમગુજરાત)
                </p>
              </div>

              <img src={LOGOpng} alt="Logo" />
            </div>

            {/* Check info */}
            <div className="w-full flex justify-center">
              <span
                className="text-xs text-center"
                style={{
                  marginTop: "7px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                આ કામ અંગેનો ચેક <b>( એ. એફ. ઇન્ફોસીસ )</b> નામનો લખવા વિનંતી.
              </span>
            </div>

            <br />

            {/* Invoice Details */}
            <div className="flex flex-col w-full p-2">
              <div className="flex justify-between">
                <span>
                  Invois No.{" "}
                  <b className="text-red-700">{billData.invoiceNo}</b>
                </span>
                <span>
                  Date <b className="text-gray-500">{billData.year}</b>
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex flex-col">
                  <span>પ્રતિ, {billData?.gaam} ગ્રામ પંચાયત,</span>
                  <span>સરપંચશ્રી/તલાટી કમ મંત્રીશ્રી</span>
                  <span>
                    તા. {billData?.taluka}, જિ. {billData?.district}
                  </span>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="font-semibold">Invoice / Bill</span>
                  <span className="font-semibold">DEBIT MEMO</span>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <table className="min-w-full mt-2">
              <thead>
                <tr>
                  <th
                    className="text-xs font-medium text-gray-800 uppercase tracking-wider"
                    colSpan="6"
                    style={{ textAlign: "center", padding: "7px" }}
                  >
                    <span className="trans">
                      આકારણી રજીસ્ટર કોમ્પ્યુટરાઇઝડ પિન્ટ જોબ વર્કનું બિલ
                      સને.2024/25
                    </span>
                  </th>
                </tr>
                <tr>
                  <th
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      maxWidth: "5px",
                      textAlign: "center",
                      padding: "2px",
                    }}
                  >
                    <span className="trans">ક્રમ</span>
                  </th>
                  <th
                    className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      maxWidth: "38px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">તારીખ</span>
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      maxWidth: "35px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">વિગત</span>
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      maxWidth: "20px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">ઘર</span>
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      maxWidth: "20px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">ભાવ</span>
                  </th>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      maxWidth: "35px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">રૂપિયા</span>
                  </th>
                </tr>
                <tr>
                  {/* Index row */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <th
                      className="text-xs font-light text-gray-600 text-center"
                      key={index}
                      style={{ padding: "3px", textAlign: "center" }}
                    >
                      <span className="trans">{index + 1}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Bill record row */}
                <tr>
                  <td
                    className="text-sm font-medium text-gray-900 text-center"
                    style={{
                      maxWidth: "10px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">1</span>
                  </td>
                  <td
                    className="text-sm text-gray-800 text-center"
                    style={{
                      maxWidth: "38px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">{billData?.date}</span>
                  </td>
                  <td
                    className="text-sm text-gray-800 text-center max-w-[150px]"
                    style={{
                      fontSize: "0.9rem",
                    }}
                  >
                    <span className="trans">{billData?.description}</span>
                  </td>
                  <td
                    className="text-sm text-gray-800 text-center"
                    style={{
                      maxWidth: "28px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">{billData?.houseCount}</span>
                  </td>
                  <td
                    className="text-sm text-gray-800 text-center"
                    style={{
                      maxWidth: "20px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    <span className="trans">{billData?.price}</span>
                  </td>
                  <td className="text-sm text-gray-800 text-center max-w-[65px]">
                    <span className="trans">{totalAmount}</span>
                  </td>
                </tr>
                {/* Total row */}
                <tr>
                  <td
                    className="py-2 text-sm text-gray-600 pr-4 font-bold"
                    colSpan="5"
                    style={{ textAlign: "right" }}
                  >
                    <span className="trans">
                      શબ્દોમાં અંકે રૂપિયા{" "}
                      <span className="text-gray-700">
                        {numberToGujaratiWords(
                          billData?.houseCount * billData?.price
                        )}
                      </span>{" "}
                      /-
                    </span>
                  </td>
                  <td className="py-2 text-sm text-gray-600 text-center font-bold max-w-[50px]">
                    <span className="trans">{totalAmount}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer Section */}
            <div className="w-full mt-2">
              <span>આભાર</span>
              <h2 className="text-right pr-12 mt-4 mb-8 text-xl font-semibold text-gray-700">
                A.F. Infosys
              </h2>
            </div>

            <div className="watermark-logo"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the App component as default
export default BillView;
