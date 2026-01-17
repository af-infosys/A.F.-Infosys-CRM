import React from "react";
import LogoImage from "../../assets/logo.png";
import WaleImage from "../../assets/wale.png";

// Utility component for the main text blocks
const TextBlock = ({ children }) => (
  <p
    className="text-m text-gray-800 leading-relaxed mt-2"
    style={{ fontSize: "20px" }}
  >
    {children}
  </p>
);

const AkarniIndex = ({
  title,
  part,
  nop,
  project,
  totalHoouse,
  total,
  commercial,
}) => {
  const housesPerBundle = nop * 100;

  const startHouseIndex = (part - 1) * housesPerBundle;
  const remainingHouses = totalHoouse - startHouseIndex;

  const registerHouseCount =
    remainingHouses >= housesPerBundle
      ? housesPerBundle
      : Math.max(remainingHouses, 0);

  // Pages Range
  const isLastBundle = remainingHouses <= housesPerBundle;

  const pagesInThisBundle = isLastBundle
    ? Math.ceil(registerHouseCount / nop)
    : 100;

  const startPage = (part - 1) * 100 + 1;
  const endPage = startPage + pagesInThisBundle - 1;

  const pageRange = `${startPage} થી ${endPage}`;

  return (
    <div
      style={{
        position: "relative",
        paddingInline: "20px",
        margin: 0,
        paddingLeft: "0px",
      }}
    >
      {/* -------------------- 1. Top Header (Village, Taluka, District) -------------------- */}

      <img
        src={WaleImage}
        style={{
          position: "absolute",
          top: "-50px",
          right: "-40px",
          height: "calc(100% + 40px + 100px)",
        }}
      />

      <img
        src={WaleImage}
        style={{
          position: "absolute",
          top: "-50px",
          left: "-55px",
          height: "calc(100% + 40px + 100px)",
          transform: "scaleX(-1)",
        }}
      />

      <header
        className="grid grid-cols-3 text-3xl font-bold pb-2"
        style={{ marginTop: "135px", paddingTop: "20px" }}
      >
        <div className="text-left text-blue-700">
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

      {/* -------------------- 2. Main Title and Subtitle -------------------- */}
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
          }}
        >
          ગામના નમુના નંબર (૮) આકારણી રજીસ્ટર {title ? `- ${title}` : ""}
        </h1>
        <h2 className="text-2xl font-semibold mt-0 text-gray-700">
          વર્ષ :- {project?.details?.akarniYear || "2025/26"}
        </h2>
      </div>

      {/* -------------------- 3. Instruction/Description Blocks -------------------- */}
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
        {/* -------------------- 4. Central Information Block (Logo & Details) -------------------- */}
        <div
          className="mt-5 p-3 border-4 border-dashed border-gray-400 rounded-lg"
          style={{
            maxWidth: "fit-content",
            minWidth: "800px",
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
            {/* Left Column (Address Details) */}
            <div className="col-span-2 space-y-4 pt-2 pr-6">
              <div className="text-base font-medium text-gray-800 space-y-1">
                <p
                  style={{
                    fontSize: "21px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span style={{ fontSize: "24px", paddingBottom: "10px" }}>
                    એ.એફ. ઈન્ફોસીસ
                  </span>
                  <span>&bull; મુ:- સાવરકુંડલા. &bull; જીલ્લો:- અમરેલી.</span>
                </p>
                <p style={{ marginTop: "10px" }}>
                  <b>એડ્રેસ :</b> સેન્ટ્રલ પોઈન્ટ કોમ્પલેક્ષ, બીજા માળે, જુના
                  બસસ્ટેન્ડસામે,સાવરકુંડલા.
                </p>
                <p>પીન કોડ નં. ૩૬૪૫૧૫ સોરાષ્ટ્ર. (પશ્ચિમ ગુજરાત)</p>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-300 flex items-center justify-between text-lg font-semibold">
                <p>
                  E-mail :{" "}
                  <span className="text-blue-600">af.infosys146@gmail.com</span>
                </p>
                {/* Website :{" "} */}
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

            {/* Right Column (Logo) */}
            <div className="col-span-1 flex justify-center items-center">
              <img
                src={LogoImage}
                alt="A.F. Infosys Logo Placeholder"
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

        {/* -------------------- 5. Footer Data/Counters (Now includes Part and Page Range) -------------------- */}
        {/* Changed to use grid-cols-2 for a two-column layout */}
        <div
          className="mt-3 pt-3 border-t border-gray-300"
          style={{ marginLeft: "40px", marginTop: "30px", paddingTop: "30px" }}
        >
          <div
            className="gap-x-12 gap-y-6"
            style={{ display: "flex", flexDirection: "column" }}
          >
            {/* 1. Register Count (Top Left) */}
            <div
              className="flex items-center text-xl font-medium text-gray-700"
              style={{ justifyContent: "start" }}
            >
              <label style={{ maxWidth: "fit-content" }}>
                ભાગઃ–
                <b
                  style={{
                    // paddingBottom: "4px",
                    paddingInline: "5px",
                    marginLeft: "8px",
                    // borderBottom: "1px solid #000",
                  }}
                >
                  {part}
                </b>
              </label>
            </div>

            {/* 2. Village Count (Top Right) */}
            <div className="flex items-center text-xl font-medium text-gray-700">
              <label style={{ maxWidth: "fit-content" }}>
                આ રજીસ્ટર ના ઘરની સંખ્યા:-
                <b
                  style={{
                    // paddingBottom: "4px",
                    paddingInline: "5px",
                    marginLeft: "8px",
                    // borderBottom: "1px solid #000",
                  }}
                >
                  {total ? `${total}` : registerHouseCount}
                </b>
              </label>
            </div>

            {/* Applying border and padding to span both columns for a visual break before Part/Page info */}

            <div className="flex items-center text-xl font-medium text-gray-700">
              <label style={{ maxWidth: "fit-content" }}>
                પાના નંબરઃ–
                <b
                  style={{
                    // paddingBottom: "4px",
                    paddingInline: "5px",
                    marginLeft: "8px",
                    // borderBottom: "1px solid #000",
                  }}
                >
                  {total
                    ? commercial
                      ? `${Math.ceil(commercial / nop) + 1} થી ${
                          Math.ceil(commercial / nop) + Math.ceil(total / nop)
                        }`
                      : `${part === 1 ? part : (part - 1) * 100 + 1} થી ${
                          (part === 1 ? part : (part - 1) * 100) +
                          Math.ceil(total / nop)
                        }`
                    : pageRange}
                </b>
              </label>
            </div>

            {/* 4. NEW: Page Range (પાના નંબર) (Bottom Right) */}
            <div className="flex items-center text-xl font-medium text-gray-700">
              <label style={{ maxWidth: "fit-content" }}>
                ગામના કુલ ઘરની સંખ્યા:-
                <b
                  style={{
                    // paddingBottom: "4px",
                    paddingInline: "5px",
                    marginLeft: "8px",
                    // borderBottom: "1px solid #000",
                  }}
                >
                  {totalHoouse}
                </b>
              </label>
            </div>
          </div>
        </div>
      </div>

      <p
        style={{
          position: "absolute",
          bottom: "-40px",
          right: "10px",
          fontSize: "12px",
        }}
      >
        Cover - {part}
      </p>
    </div>
  );
};

export default AkarniIndex;
