import React from "react";
import LogoImage from "../../assets/logo.png";

// Utility component for the main text blocks
const TextBlock = ({ children }) => (
  <p className="text-m text-gray-800 leading-relaxed indent-8 mt-2">
    {children}
  </p>
);

const AkarniIndex = ({ part, nop, project, totalHoouse }) => {
  console.log(project);
  return (
    <div>
      {/* -------------------- 1. Top Header (Village, Taluka, District) -------------------- */}
      <header
        className="grid grid-cols-3 text-3xl font-bold pb-2"
        style={{ marginTop: "80px" }}
      >
        <div className="text-left text-blue-700">
          <span className="font-extrabold">મોજે:</span>-{" "}
          {project?.spot?.gaam || "..."}
        </div>
        <div className="text-center text-blue-700">
          <span className="font-extrabold">તાલુકો:</span>-{" "}
          {project?.spot?.taluka || "..."}
        </div>
        <div className="text-right text-blue-700">
          <span className="font-extrabold">જીલ્લો:</span>-{" "}
          {project?.spot?.district || "..."}
        </div>
      </header>

      {/* -------------------- 2. Main Title and Subtitle -------------------- */}
      <div className="text-center mt-2 mb-2">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2 p-2 border-b-4 border-blue-500 inline-block">
          ગામના નમુના નંબર (૮) આકારણી રજીસ્ટર
        </h1>
        <h2 className="text-2xl font-semibold mt-2 text-gray-700">
          વર્ષ :- {project?.details?.akarniYear || "2025/26"}
        </h2>
      </div>

      {/* -------------------- 3. Instruction/Description Blocks -------------------- */}
      <div className="mt-3 text-justify">
        <TextBlock>
          ગ્રામ પંચાયત આકારણી સર્વે, વાર્ષીક જમાબંધી જમીન મહેસુલ હિસાબ, પંચાયત
          કરવેરાનું ૯(ડી) રજીસ્ટર, ગામના નમુના નં.ર, લેમીનેશન,
        </TextBlock>
        <TextBlock>
          સ્કેનીંગ વર્ક ગ્રામ પંચાયતની તમામ પ્રકારની સ્ટેશનરી પંચાયત તથા રેવન્યુ
          ગામ નમુનાઓ, તેમજ પંચાયત હિસાબ નમુના મળશે.
        </TextBlock>
        <TextBlock>
          કોમ્પ્યુટરાઈઝડ તમામ પ્રકારનું કામ પ્રિન્ટીંગ કામ માટે મળો.
          (ગ્રામપંચાયત ડીજીટલ) માટે{" "}
        </TextBlock>
      </div>

      {/* -------------------- 4. Central Information Block (Logo & Details) -------------------- */}
      <div className="grid grid-cols-3 mt-5 p-3 border-4 border-dashed border-gray-400 rounded-lg">
        {/* Left Column (Address Details) */}
        <div className="col-span-2 space-y-4 pt-0 pr-6">
          <div className="text-center text-3xl font-bold text-gray-600 mb-8">
            --: કોમ્પ્યુટરાઈઝ કરનાર :--
          </div>
          <div className="text-base font-medium text-gray-800 space-y-1">
            <p>
              એ.એફ. ઇન્ફોસોસ &bull; મુ:- સાવરકુંડલા. &bull; જીલ્લો:- અમરેલી.
            </p>
            <p>
              સેન્ટ્રલ પોઈન્ટ કોમ્પલેક્ષ, બીજા માળે, જુના
              બસસ્ટેન્ડસામે,સાવરકુંડલા.
            </p>
            <p>પીન કોર્ડ નં.૩૬૪૫૧૫ સોરાષ્ટ્ર. (પશ્ચિમ ગુજરાત)</p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-300 flex items-center justify-between text-lg font-semibold">
            <p>
              E-mail ID:{" "}
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
            className="flex justify-start pt-0 text-xl font-extrabold text-blue-900"
            style={{ gap: "10px" }}
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

      {/* -------------------- 5. Footer Data/Counters (Now includes Part and Page Range) -------------------- */}
      {/* Changed to use grid-cols-2 for a two-column layout */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {/* 1. Register Count (Top Left) */}
          <div
            className="flex items-center text-xl font-medium text-gray-700"
            style={{ justifyContent: "start" }}
          >
            <label htmlFor="partNumber" style={{ maxWidth: "fit-content" }}>
              ભાગઃ–
            </label>
            <input
              id="partNumber"
              type="text"
              defaultValue="1"
              value={part}
              readOnly
              className="w-48 p-1 border-b border-black text-center font-bold"
            />
          </div>

          {/* 2. Village Count (Top Right) */}
          <div className="flex items-center text-xl font-medium text-gray-700">
            <label htmlFor="registerCount" style={{ maxWidth: "fit-content" }}>
              આ રજીસ્ટર ના ઘરની સંખ્યા:-
            </label>
            <input
              id="registerCount"
              type="text"
              value={`${nop * 100}`}
              readOnly
              className="w-48 p-1 border-b border-black text-center font-bold"
            />
          </div>

          {/* 3. NEW: Part Number (ભાગ) (Bottom Left) */}
          {/* Note: Removed pt-4 border-t border-gray-200 since the parent grid handles spacing */}
          <div className="flex items-center text-xl font-medium text-gray-700 pt-3 border-t border-gray-200 col-span-2">
            {/* Applying border and padding to span both columns for a visual break before Part/Page info */}
            <div className="grid grid-cols-2 gap-x-12 w-full">
              <div className="flex items-center text-xl font-medium text-gray-700">
                <label htmlFor="pageRange" style={{ maxWidth: "fit-content" }}>
                  પાના નંબરઃ–
                </label>
                <input
                  id="pageRange"
                  type="text"
                  defaultValue="1 થી 100" // 1 to 100
                  readOnly
                  className="w-48 p-1 border-b border-black text-center font-bold"
                />
              </div>

              {/* 4. NEW: Page Range (પાના નંબર) (Bottom Right) */}
              <div className="flex items-center text-xl font-medium text-gray-700">
                <label
                  htmlFor="villageCount"
                  style={{ maxWidth: "fit-content" }}
                >
                  ગામના કુલ ઘરની સંખ્યા:-
                </label>
                <input
                  id="villageCount"
                  type="text"
                  defaultValue="800"
                  value={totalHoouse}
                  readOnly
                  className="w-48 p-1 border-b border-black text-center font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AkarniIndex;
