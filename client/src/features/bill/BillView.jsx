import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function BillView() {
  const reportRef = useRef(null);

  const [billData, setBillData] = useState({
    invoiceNo: "167",
    date: "2024/25",
    description:
      "નાના ઝીંઝુડા ગામની મકાન આકારણી સર્વે, વર્ષ:- 2025/26 નું ગામ નમુના નં. ૮ આકારણી રજીસ્ટર ઘેર ઘેર જઇને બનાવી અને ગા.ન.ન.- ૯/ડી કરવેરા રજીસ્ટર બનાવિ કોમ્પ્યુટરાઈઝડ પ્રિન્ટ સાથે સ્પાઇરલ બાઈન્ડિંગ સાથે ઓનલાઈન ગ્રામ સુવિધા પોર્ટલમાં ડેટાએન્ટ્રી સાથે જોબવર્ક/મજુરીથી કમ્પલેટ અદ્યતન બનાવેલ",
    houseCount: 397,
    pricePerHouse: 55.0,
    totalInWords: "એકવીસહઝાર આઠસો વિસ પુરા",
  });

  useEffect(() => {
    // You can fetch API data here if needed in future
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
        format: [215.9, 355.6], // Legal size: 8.5 x 14 inches
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("A.F.Infosys-Bill.pdf");
    });
  };

  const totalAmount = (billData.houseCount * billData.pricePerHouse).toFixed(2);
  const logoUrl = "https://afinfosys.netlify.app/logo.png";
  const placeholderImageUrl =
    "https://placehold.co/512x512/d1d5db/374151?text=A.F.Infosys";

  return (
    // The main container for the bill view. We use Tailwind CSS for styling.
    <div className="bg-gray-100 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="container mx-auto p-2 sm:p-6 lg:p-8 rounded-2xl max-w-4xl w-full">
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
          }}
        >
          <div
            ref={reportRef}
            className="table-container rounded-lg shadow-md border border-gray-200"
            style={{
              width: "600px",
              padding: "1rem",
              background: "#fff",

              minWidth: "620px",
            }}
          >
            <div className="flex justify-between items-center mb-4 w-full">
              <div className="flex flex-col items-end w-full px-4">
                <div className="flex flex-col items-start">
                  <h3 className="text-base">
                    SHAHID KALVA | <span>93764 43146</span>
                  </h3>
                  <h3 className="text-base">
                    E-MAIL :-{" "}
                    <b className="underline">af.infosys146@gmail.com</b>
                  </h3>
                </div>
              </div>
            </div>

            {/* Business Name and Logo */}
            <div className="flex flex-col relative">
              <h2 className="text-5xl text-center font-extrabold mt-4">
                A.F. Infosys
              </h2>
              <img
                src={logoUrl}
                alt="Logo"
                className="absolute bottom-0 left-3 w-32 rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImageUrl;
                }}
              />
            </div>

            {/* Description Section */}
            <div className="flex flex-col gap-1 p-4">
              <h3 className="text-xl text-center font-extrabold">
                ગ્રામપંચાયત રેવન્યુ (જમા બંધી) વાર્ષીક હિસાબ, આકારહણી સર્વે
              </h3>
              <h3 className="text-sm text-center px-20">
                પંચાયત કરવેરા ( ૯ / ડી ) રજીસ્ટર, રોજ મેળ, તથા તમામ પ્રકારના
                કોમ્પ્યુટરાઈઝડ તથા પ્રિન્ટીગ કામ માટે માળો
              </h3>
              <h3 className="text-sm text-center mt-2">
                જુના બસ સ્ટેન્ડ, સેન્ટર પોઈન્ટ કોમ્પ્લેક્ષ, સાવરકુંડલા.
              </h3>
              <h3 className="text-sm text-center">
                પિન કોડ નં. ૩૬૪૫૧૫ જિ. અમરેલી, (પશ્ચિમ ગુજરાત)
              </h3>
            </div>

            {/* Check info */}
            <div className="w-full flex justify-end pr-4">
              <span className="text-xs text-right">
                આ કામ અંગેનો ચેક એ. એફ. ઇન્ફોસીસ નામનો લખવા વિનંતી.
              </span>
            </div>

            {/* Invoice Details */}
            <div className="flex flex-col w-full p-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span>
                  Invois No.{" "}
                  <b className="text-red-700">{billData.invoiceNo}</b>
                </span>
                <span>
                  Date <b className="text-gray-500">{billData.date}</b>
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex flex-col">
                  <span>પ્રતિ, નાના ઝીંઝુડા ગ્રામ પંચાયત,</span>
                  <span>સરપંચશ્રી/તલાટી કમ મંત્રીશ્રી</span>
                  <span>તા.સાવરકુંડલા જિ.અમરેલી.</span>
                </div>
                <div className="flex flex-col pt-2">
                  <span className="font-semibold">Invoice / Bill</span>
                  <span className="font-semibold">DEBIT MEMO</span>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <table className="min-w-full divide-y divide-gray-200 mt-2">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-800 uppercase tracking-wider text-center bg-gray-100"
                    colSpan="6"
                  >
                    આકારણી રજીસ્ટર કોમ્પ્યુટરાઇઝડ પિન્ટ જોબ વર્કનું બિલ
                    સને.2024/25
                  </th>
                </tr>
                <tr>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                    style={{ maxWidth: "10px" }}
                  >
                    ક્રમ
                  </th>
                  <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    તારીખ
                  </th>
                  <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    વિગત
                  </th>
                  <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center max-w-[30px]">
                    ઘર
                  </th>
                  <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center max-w-[20px]">
                    ભાવ
                  </th>
                  <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center max-w-[50px]">
                    રૂપિયા
                  </th>
                </tr>
                <tr>
                  {/* Index row */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <th
                      className="text-xs font-light text-gray-600 text-center bg-gray-100"
                      key={index}
                      style={{ padding: "2px", textAlign: "center" }}
                    >
                      {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Bill record row */}
                <tr>
                  <td
                    className="px-1 py-1 text-sm font-medium text-gray-900 text-center"
                    style={{ maxWidth: "10px" }}
                  >
                    1
                  </td>
                  <td className="px-1 py-1 text-sm text-gray-500 text-center">
                    3/3/2025
                  </td>
                  <td className="px-1 py-1 text-sm text-gray-500 text-center max-w-[150px]">
                    {billData.description}
                  </td>
                  <td className="px-1 py-1 text-sm text-gray-500 text-center max-w-[20px]">
                    {billData.houseCount}
                  </td>
                  <td className="px-1 py-1 text-sm text-gray-500 text-center max-w-[10px]">
                    {billData.pricePerHouse}
                  </td>
                  <td className="px-1 py-1 text-sm text-gray-500 text-center max-w-[30px]">
                    {totalAmount}
                  </td>
                </tr>
                {/* Total row */}
                <tr>
                  <td
                    className="py-2 text-sm text-gray-600 text-right pr-4 font-bold"
                    colSpan="5"
                  >
                    શબ્દોમાં અંકે રૂપિયા <b>{billData.totalInWords} પુરા /-</b>
                  </td>
                  <td className="py-2 text-sm text-gray-600 text-center font-bold max-w-[50px]">
                    {totalAmount}
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the App component as default
export default BillView;
