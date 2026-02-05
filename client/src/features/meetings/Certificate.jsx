import { useParams } from "react-router-dom";
import "./Certificate.scss";
import { useEffect, useRef, useState } from "react";
import { fetchMeetingById } from "./meetingsApi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import toGujaratiNumber from "../../components/toGujaratiNumber";

function formatDate(date) {
  // dd/mm/yyyy

  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${toGujaratiNumber(day)}/${toGujaratiNumber(month)}/${toGujaratiNumber(year)}`;
}

const Certificate = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMeeting = async () => {
      const res = await fetchMeetingById(id);
      setMeeting(res.data);
    };

    loadMeeting();
  }, [id]);

  const pageRef = useRef();

  const downloadPDF = async () => {
    setLoading(true);

    const pdf = new jsPDF("p", "mm", "a4");
    const pages = [pageRef];

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

    pdf.save(`Certificate_${meeting?.taluka}.pdf`);

    setLoading(false);
  };

  if (!meeting) return <div className="p-6">Loading...</div>;

  return (
    <div
      // className="bg-gray-300"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        margin: "0px",
        padding: "10px",
        alignItems: "start",
      }}
    >
      <button
        onClick={downloadPDF}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Downloading..." : "Download PDF"}
      </button>

      <div
        id="certificate-page"
        style={{
          width: "794px",
          height: "1123px",

          padding: "0",
          boxSizing: "border-box",
          fontFamily: "Noto Serif Gujarati, serif",

          // fontSize: "12pt",
          // lineHeight: 1.6,

          background: "#fff",
          color: "#000",

          position: "relative",
        }}
        ref={pageRef}
      >
        <div className="wrapper">
          {/* Heading */}
          <h1>પ્રમાણ પત્ર</h1>

          <div className="icon"></div>
          <div className="roundseal">
            <svg viewBox="15 0 270 70">
              <path
                id="sealCurve"
                // d="M 30,60 Q 150,140 270,60"

                // d="M 30,60 Q 150,155 270,60"

                // d="M 30,60 Q 150,175 270,60"

                // d="M 30,60 Q 150,200 270,60"

                d="M 30,60 Q 150,230 270,60"
                // d="M 30,60 C 60,260 240,260 270,60"
                // d="M 30,60 C 40,300 260,300 270,60"
                fill="transparent"
              />

              <text width="300">
                <textPath
                  href="#sealCurve"
                  startOffset="50%"
                  textAnchor="middle"
                  className="seal-text"
                  side="left"
                >
                  {`${meeting?.taluka || "Taluka"} જી. ${meeting?.district || "District"}`}
                </textPath>
              </text>
            </svg>
          </div>

          {/* Body */}
          <p
            style={{
              textIndent: "30mm",
              textAlign: "justify",
              fontSize: "27px",
            }}
          >
            આથી પ્રમાણ પત્ર આપવામાં આવે છે કે, એ.એફ.ઈન્ફોસીસ સાવરકુંડલા
            જિ.અમરેલી દ્વારા અત્રેની તાલુકા પંચાયત કચેરી સપ્તાહિક / માસીક તલાટી
            કમ મંત્રી મીટીંગમાં પંચાયત નમુના અને રેવન્યુ રેકર્ડ અધતન કરવા બાબતે
            વિસ્તૃત સમજણ આપવામાં આવેલ છે.
          </p>

          <p
            style={{
              textIndent: "30mm",
              textAlign: "justify",
              fontSize: "27px",
            }}
          >
            ગ્રામ પંચાયત દફતર અધતન કરવા માટે અમારી જાણકારી પ્રમાણે તલાટી કમ
            મંત્રીને લગત કામગીરીમાં મદદરૂપ થઈ શકે તેવુ માર્ગદર્શન આપેલ છે અને
            પ્રેજેન્ટેશન થી તાલુકાના તલાટી કમ મત્રીને કામગીરી સરળ અને જડપી બને
            તે હેતુ માટે આ મીટીંગનું આયોજન કરેલ છે. આ પ્રેજેન્ટેશન સતોષકારક રીતે
            નિવડેલ છે.
          </p>

          <p
            style={{
              textIndent: "30mm",
              textAlign: "justify",
              fontSize: "27px",
            }}
          >
            જે બદલ આ પ્રમાણ પત્ર લખી આપવામાં આવે છે.
          </p>

          <div className="icon2"></div>

          {/* Footer */}
          <div
            style={{
              marginTop: "5mm",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ textAlign: "center" }} className="taluka-section">
              <p>તાલુકા વિકાસ અધિકારી</p>
              <p>{meeting?.taluka || "_____"}</p>
            </div>
          </div>

          <div
            style={{
              marginTop: "2mm",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ textAlign: "left" }} className="spot-section">
              <p>
                સ્થળ : તાલુકા પંચાયત કચેરી - {meeting?.taluka || "____"}{" "}
                <span style={{ paddingLeft: "10px", whiteSpace: "nowrap" }}>
                  જિ. {meeting?.district || "____"}.
                </span>
              </p>
              <p>તા. {formatDate(meeting?.date || "")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
