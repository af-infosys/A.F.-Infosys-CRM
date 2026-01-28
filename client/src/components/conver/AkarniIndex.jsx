import React from "react";
import LogoImage from "../../assets/logo.png";
import WaleImage from "../../assets/wale.png";
import WaleImage2 from "../../assets/wale2.png";
import toGujaratiNumber from "../toGujaratiNumber";

// Utility component for the main text blocks
const TextBlock = ({ children }) => (
  <p
    className="text-m text-gray-800 leading-relaxed mt-2"
    style={{ fontSize: "19px" }}
  >
    {children}
  </p>
);

const AkarniIndex = ({
  title,
  part, // Current Bundle Number (e.g., 1, 2, 3)
  project,
  totalHoouse, // Grand Total of ALL houses (Res + Comm mixed or total context)
  commercial, // If commercial cover: contains count of Residential records. If residential: false/undefined.

  coverProperties,
  pageFrom,
  pageTo,
}) => {
  // --- FIXED CALCULATIONS ---

  // const PAGES_PER_BUNDLE = 100;
  // const MAX_RECORDS_PER_BUNDLE = PAGES_PER_BUNDLE * nop; // e.g., 700 records

  // // 1. Calculate Records in THIS specific Register/Bundle
  // // Logic: (Part - 1) * 700 se start karo.
  // const startRecordIndex = (part - 1) * MAX_RECORDS_PER_BUNDLE;
  // const remainingRecords = total - startRecordIndex;

  // // Agar remaining 700 se jyada hai to 700 lo, nahi to remaining lo.
  // const recordsInThisBundle =
  //   remainingRecords >= MAX_RECORDS_PER_BUNDLE
  //     ? MAX_RECORDS_PER_BUNDLE
  //     : Math.max(remainingRecords, 0);

  // console.log(recordsInThisBundle);

  // 2. Calculate Page Range (Start - End)

  // Step A: Find previous section offset (Pages used by Residential if this is Commercial)
  // Note: 'commercial' prop holds the count of previous residential records if this is a commercial cover
  // const previousSectionPages = commercial ? Math.ceil(commercial / nop) : 0;

  // // Step B: Find pages skipped by previous bundles in THIS section
  // const previousBundlePages = (part - 1) * PAGES_PER_BUNDLE;

  // // Step C: Pages consumed by current bundle records
  // const pagesUsedCurrently = Math.ceil(recordsInThisBundle / nop);

  // // Final Page Numbers
  // const startPage = previousSectionPages + previousBundlePages + 1;
  // const endPage = startPage + pagesUsedCurrently - 1;

  // // Formatting Range string
  // const pageRangeString = `${toGujaratiNumber(startPage)} થી ${toGujaratiNumber(endPage)}`;

  return (
    <div
      style={{
        position: "relative",
        paddingInline: "20px",
        margin: 0,
        paddingLeft: "20px",
      }}
    >
      {/* -------------------- IMAGES / DESIGN -------------------- */}
      <img
        src={WaleImage}
        style={{
          position: "absolute",
          top: "-50px",
          right: "-40px",
          height: "calc(100% + 20px + 100px)",
        }}
      />
      <img
        src={WaleImage}
        style={{
          position: "absolute",
          top: "-50px",
          left: "-35px",
          height: "calc(100% + 20px + 100px)",
          transform: "scaleX(-1)",
        }}
      />
      <img
        src={WaleImage2}
        style={{
          position: "absolute",
          top: "-50px",
          left: "10px",
          width: "calc(100% - 20px)",
        }}
      />
      <img
        src={WaleImage2}
        style={{
          position: "absolute",
          bottom: "-70px",
          left: "10px",
          width: "calc(100% - 20px)",
        }}
      />

      {/* -------------------- HEADER -------------------- */}
      <header
        className="grid grid-cols-3 font-bold pb-2"
        style={{
          marginTop: "135px",
          paddingTop: "20px",
          fontSize: "38px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          className="text-left text-blue-700"
          style={{ whiteSpace: "nowrap" }}
        >
          <span className="font-extrabold">મોજે : </span>-{" "}
          {project?.spot?.gaam || "..."}
        </div>
        <div className="text-center text-blue-700">
          <span className="font-extrabold">તાલુકો : </span>-{" "}
          {project?.spot?.taluka || "..."}
        </div>
        <div className="text-right text-blue-700">
          <span className="font-extrabold">જીલ્લો : </span>-{" "}
          {project?.spot?.district || "..."}
        </div>
      </header>

      {/* -------------------- TITLE -------------------- */}
      <div className="text-center mt-2 mb-2">
        <h1
          className="text-4xl font-extrabold text-blue-900 inline-block"
          style={{
            border: "6px double #515151",
            borderRadius: "50px",
            padding: "8px 20px",
            paddingTop: "0px",
            paddingBottom: "20px",
            position: "relative",
            transform: "translateY(-15px)",
            marginTop: "20px",
            paddingInline: "40px",
          }}
        >
          ગામના નમુના નંબર (૮) આકારણી રજીસ્ટર {title ? `- ${title}` : ""}
        </h1>
        <h2
          className="font-semibold text-gray-700"
          style={{ marginTop: "-25px", fontSize: "30px" }}
        >
          વર્ષ :- {project?.details?.akaraniYear || "2025/26"}
        </h2>
      </div>

      {/* -------------------- INSTRUCTIONS -------------------- */}
      <div className="mt-3 text-justify">
        <TextBlock>
          ગ્રામ પંચાયત આકારણી સર્વે, વાર્ષીક જમાબંધી જમીન મહેસુલ હિસાબ, પંચાયત
          કરવેરાનું ૯(ડી) રજીસ્ટર, ગામના નમુના નં.ર, લેમીનેશન, સ્કેનીંગ વર્ક
          ગ્રામ પંચાયતની તમામ
          <br />
          પ્રકારની સ્ટેશનરી પંચાયત તથા રેવન્યુ ગામ નમુનાઓ, તેમજ પંચાયત હિસાબ
          નમુના મળશે. કોમ્પ્યુટરાઈઝડ તમામ પ્રકારનું કામ પ્રિન્ટીંગ કામ માટે મળો.
          (ગ્રામપંચાયત ડીજીટલ) માટે{" "}
        </TextBlock>
      </div>

      <div style={{ display: "flex", marginTop: "0px" }}>
        {/* -------------------- INFO BLOCK -------------------- */}
        <div
          className="mt-5 p-3 border-4 border-dashed border-gray-400 rounded-lg"
          style={{
            maxWidth: "fit-content",
            minWidth: "800px",
            paddingTop: "10px",
          }}
        >
          <div className="text-center text-3xl font-bold text-gray-600">
            --: કોમ્પ્યુટરાઈઝ કરનાર :--
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "0px",
            }}
          >
            <div className="col-span-2 space-y-4 pt-2 pr-6">
              <div className="text-base font-medium text-gray-800 space-y-1">
                <p
                  style={{
                    fontSize: "21px",
                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: "5px",
                  }}
                >
                  <span style={{ fontSize: "28px", paddingBottom: "15px" }}>
                    એ.એફ. ઈન્ફોસીસ
                  </span>
                  <span>&bull; મુ:- સાવરકુંડલા. &bull; જીલ્લો:- અમરેલી.</span>
                </p>
                <p style={{ marginTop: "10px", fontSize: "19px" }}>
                  <b>એડ્રેસ :</b> સેન્ટ્રલ પોઈન્ટ કોમ્પલેક્ષ, બીજા માળે, જુના
                  બસસ્ટેન્ડ સામે, સાવરકુંડલા.
                </p>
                <p style={{ fontSize: "19px" }}>
                  પીન કોડ નં. ૩૬૪૫૧૫ સોરાષ્ટ્ર. (પશ્ચિમ ગુજરાત)
                </p>
              </div>

              <div className="mt-4 pt-0 border-t border-gray-300 flex items-center justify-between text-lg font-semibold">
                <p>
                  E-mail :{" "}
                  <span className="text-blue-600">af.infosys146@gmail.com</span>
                </p>
                <a
                  href="https://www.afinfosys.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  www.afinfosys.com
                </a>
              </div>

              <div
                className="flex justify-start text-xl font-extrabold text-blue-900"
                style={{ gap: "10px", marginTop: "10px" }}
              >
                <p>શાહિદ કાલવા : 93764 43146</p>
                <span className="text-gray-400">|</span>
                <p>સરફરાઝ કાલવા : 99247 82732</p>
              </div>
            </div>

            <div className="col-span-1 flex justify-center items-center">
              <img
                src={LogoImage}
                alt="Logo"
                className="w-48 h-48 object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/200x200/CCCCCC/000000?text=LOGO";
                }}
              />
            </div>
          </div>
        </div>

        {/* -------------------- COUNTERS (DATA) -------------------- */}
        <div
          className="mt-3 pt-3 border-t border-gray-300"
          style={{ marginLeft: "40px", marginTop: "30px", paddingTop: "30px" }}
        >
          <div
            className="gap-x-12 gap-y-6"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* 1. Part Number */}
            <div className="flex items-center text-xl font-medium text-gray-700">
              <label style={{ maxWidth: "fit-content", fontSize: "21px" }}>
                ભાગ :-
                <b style={{ paddingInline: "5px", marginLeft: "2px" }}>
                  {toGujaratiNumber(part)}
                </b>
              </label>
            </div>

            {/* 2. Records in THIS Register */}
            <div className="flex items-center text-xl font-medium text-gray-700">
              <label style={{ maxWidth: "fit-content", fontSize: "21px" }}>
                આ રજીસ્ટર ના ઘરની સંખ્યા :-
                <b style={{ paddingInline: "5px", marginLeft: "2px" }}>
                  {toGujaratiNumber(coverProperties)}
                </b>
              </label>
            </div>

            {/* 3. Page Numbers (Calculated cleanly above) */}
            <div className="flex items-center text-xl font-medium text-gray-700">
              <label style={{ maxWidth: "fit-content", fontSize: "21px" }}>
                પાના નંબર :-
                <b style={{ paddingInline: "5px", marginLeft: "2px" }}>
                  {`${toGujaratiNumber(pageFrom)} થી ${toGujaratiNumber(pageTo)}`}
                </b>
              </label>
            </div>

            {/* 4. Total Records (Entire Village) */}
            <div className="flex items-center text-xl font-medium text-gray-700">
              <label style={{ maxWidth: "fit-content", fontSize: "21px" }}>
                ગામના કુલ ઘરની સંખ્યા :-
                <b style={{ paddingInline: "5px", marginLeft: "2px" }}>
                  {toGujaratiNumber(totalHoouse)}
                </b>
              </label>
            </div>
          </div>
        </div>
      </div>

      <p
        style={{
          position: "absolute",
          bottom: "0px",
          right: "10px",
          fontSize: "12px",
        }}
      >
        Cover - {part} {commercial ? "(Comm)" : "(Res)"}
      </p>
    </div>
  );
};

export default AkarniIndex;
