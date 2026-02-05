import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Page1 from "./letter/Page1";
import Page2 from "./letter/Page2";
import Page3 from "./letter/Page3";
import { fetchMeetingById } from "./meetingsApi";

const ArjiLetter = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);

  const page1Ref = useRef();
  const page2Ref = useRef();
  const page3Ref = useRef();

  useEffect(() => {
    const loadMeeting = async () => {
      const res = await fetchMeetingById(id);
      setMeeting(res.data);
    };

    loadMeeting();
  }, [id]);

  const downloadPDF = async () => {
    setLoading(true);

    const pdf = new jsPDF("p", "mm", "a4");

    const pages = [page1Ref, page2Ref, page3Ref];

    for (let i = 0; i < pages.length; i++) {
      const pageElement = pages[i].current;

      if (!pageElement) continue;

      if (i > 0) pdf.addPage();

      const canvas = await html2canvas(pageElement, {
        scale: 2, // perfect for clarity
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const imgWidth = 210;
      const imgHeight = 297;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    }

    pdf.save(`Meeting_Letter_${meeting?.taluka}.pdf`);

    setLoading(false);
  };

  if (!meeting) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      <div className="space-y-6">
        <div ref={page1Ref}>
          <Page1 data={meeting} />
        </div>

        <div ref={page2Ref}>
          <Page2 data={meeting} />
        </div>

        <div ref={page3Ref}>
          <Page3 data={meeting} />
        </div>
      </div>
    </div>
  );
};

export default ArjiLetter;
