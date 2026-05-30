import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DownloadSticker = ({ item }) => {
  const [donwload, setDonwload] = useState(false);

  const handleDownload = async (item) => {
    setDonwload(true);

    setTimeout(async () => {
      const element = document.getElementById(`pdf-slip-${item?.sheetId}`);

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [50, 120],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 120, 50);

      pdf.save(`work-slip-${item?.sheetId}-${item?.spot?.gaam}.pdf`);

      setDonwload(false);
    }, 2000);
  };

  return (
    <div>
      <div
        id={`pdf-slip-${item?.sheetId}`}
        className="bg-white border border-black text-[12px] w-[400px]"
        style={{ display: `${donwload ? "block" : "none"}` }}
      >
        <div className="grid grid-cols-2">
          <div className="border-r border-b p-2">
            <b>ગામ:-</b> {item?.spot?.gaam}
          </div>

          <div className="border-b p-2">
            <b>કામ:-</b> આકારણી સર્વે
          </div>

          <div className="border-r border-b p-2">
            <b>તા:-</b> {item?.spot?.taluka}
          </div>

          <div className="border-b p-2">
            <b>જી:-</b> {item?.spot?.district}
          </div>

          <div className="border-r border-b p-2">
            <b>કેસ નં.:-</b> {item?.sheetId}
          </div>

          <div className="border-b p-2">
            <b>મો.નં.:-</b> {item?.details?.sarpanchNumber}
          </div>

          <div className="border-r p-2">
            <b>રેકર્ડ મળ્યા તારીખ:-</b> {item?.recordDate}
          </div>

          <div className="p-2">
            <b>નામ:-</b> {item?.details?.sarpanchName}
          </div>
        </div>
      </div>

      <button
        onClick={() => handleDownload(item)}
        className="text-green-600 hover:text-green-800 transition-colors bg-green-50 hover:bg-green-100 p-2 rounded-md w-full flex justify-center"
        title="ડાઉનલોડ કરો"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </button>
    </div>
  );
};

export default DownloadSticker;
