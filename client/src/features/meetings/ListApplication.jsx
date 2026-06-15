import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import Page1 from "./letter2/Page1";
import Page2 from "./letter2/Page2";
import Page3 from "./letter2/Page3";
import { fetchMeetingById } from "./meetingsApi";
import Page4 from "./letter2/Page4";
import Page5 from "./letter2/Page5";
import Page6 from "./letter2/Page6";
import Page7 from "./letter2/Page7";
import Page8 from "./letter2/Page8";

const ListApplication = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);

  const page1Ref = useRef();
  const page2Ref = useRef();
  const page3Ref = useRef();
  const page4Ref = useRef();
  const page5Ref = useRef();
  const page6Ref = useRef();
  const page7Ref = useRef();
  const page8Ref = useRef();

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

    const pages = [
      page1Ref,
      page2Ref,
      page3Ref,
      page4Ref,
      page5Ref,
      page6Ref,
      page7Ref,
      page8Ref,
    ];

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

        <div ref={page4Ref}>
          <Page4 data={meeting} />
        </div>

        <div ref={page5Ref}>
          <Page5 data={meeting} />
        </div>

        <div ref={page6Ref}>
          <Page6 data={meeting} />
        </div>

        <div ref={page7Ref}>
          <Page7 data={meeting} />
        </div>

        <div ref={page8Ref}>
          <Page8 data={meeting} />
        </div>
      </div>
    </div>
  );
};

export default ListApplication;
