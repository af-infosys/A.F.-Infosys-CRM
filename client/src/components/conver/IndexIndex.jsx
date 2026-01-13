import React from "react";
import LogoImage from "../../assets/logo.png";

// Utility component for the main text blocks
const TextBlock = ({ children }) => (
  <p
    className="text-gray-800 leading-relaxed mt-4 text-center"
    style={{ fontSize: "18px", lineHeight: "1.6" }}
  >
    {children}
  </p>
);

const IndexIndex = ({ part, nop, project, totalHoouse }) => {
  const housesPerBundle = nop * 100;
  const startHouseIndex = (part - 1) * housesPerBundle;
  const remainingHouses = totalHoouse - startHouseIndex;

  const registerHouseCount =
    remainingHouses >= housesPerBundle
      ? housesPerBundle
      : Math.max(remainingHouses, 0);

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
        width: "210mm", // A4 Width
        minHeight: "297mm", // A4 Height
        padding: "5mm",
        margin: "0 auto",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* -------------------- 1. Top Header -------------------- */}
      <header
        className="grid grid-cols-1 gap-4 text-2xl font-bold border-b-2 border-blue-800 pb-4"
        style={{ marginTop: "40px" }}
      >
        <div className="flex justify-between text-blue-700">
          <span>
            <span className="font-extrabold">મોજે : </span>
            {project?.spot?.gaam || "..."}
          </span>
          <span>
            <span className="font-extrabold">તાલુકો : </span>
            {project?.spot?.taluka || "..."}
          </span>
          <span>
            <span className="font-extrabold">જીલ્લો : </span>
            {project?.spot?.district || "..."}
          </span>
        </div>
      </header>

      {/* -------------------- 2. Main Title -------------------- */}
      <div className="text-center mt-10 mb-2">
        <h1 className="text-4xl font-extrabold text-blue-900 border-4 border-blue-900 p-4 inline-block">
          ઈન્ડેક્સ રિપોર્ટ
        </h1>
        <h2 className="text-2xl font-semibold mt-6 text-gray-700">
          વર્ષ :- {project?.details?.akarniYear || "2025/26"}
        </h2>
      </div>

      {/* -------------------- 3. Instruction Blocks -------------------- */}
      <div className="mt-0">
        <TextBlock>
          ગ્રામ પંચાયત આકારણી સર્વે, વાર્ષીક જમાબંધી જમીન મહેસુલ હિસાબ, પંચાયત
          કરવેરાનું ૯(ડી) રજીસ્ટર, ગામના નમુના નં.ર, લેમીનેશન, સ્કેનીંગ વર્ક
          ગ્રામ પંચાયતની તમામ પ્રકારની સ્ટેશનરી પંચાયત તથા રેવન્યુ ગામ નમુનાઓ
          મળશે.
        </TextBlock>
      </div>

      {/* -------------------- 4. Computerised By Block (Stacked for Portrait) -------------------- */}
      <div className="mt-6 p-6 border-4 border-dashed border-gray-400 rounded-lg w-full">
        <div className="text-center text-2xl font-bold text-gray-600 mb-6">
          --: કોમ્પ્યુટરાઈઝ કરનાર :--
        </div>

        <div className="flex flex-col items-center text-center">
          <img
            src={LogoImage}
            alt="Logo"
            className="w-32 h-32 object-contain mb-4"
          />

          <div className="space-y-2">
            <p className="text-xl font-bold text-gray-800">
              એ.એફ. ઈન્ફોસીસ &bull; મુ:- સાવરકુંડલા. &bull; જીલ્લો:- અમરેલી.
            </p>
            <p className="text-lg">
              સેન્ટ્રલ પોઈન્ટ કોમ્પલેક્ષ, બીજા માળે, સાવરકુંડલા.
            </p>
            <p className="text-blue-600 font-semibold">
              af.infosys146@gmail.com | www.afinfosys.com
            </p>

            <div className="flex justify-center gap-6 mt-4 text-xl font-extrabold text-blue-900">
              <p>શાહિદ કાલવા : 93764 43146</p>
              <p>સરફરાઝ કાલવા : 99247 82732</p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- 5. Footer Data/Counters -------------------- */}
      <div className="mb-10 border-t-2 border-gray-300 pt-2 mt-2">
        <div className="grid grid-cols-2 gap-y-6 gap-x-10">
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="text-xl font-bold">ભાગઃ–</span>
            <span className="text-xl font-extrabold">{part}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="text-xl font-bold">પાના નંબરઃ–</span>
            <span className="text-xl font-extrabold">{pageRange}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="text-xl font-bold">આ રજીસ્ટરના ઘરની સંખ્યા:-</span>
            <span className="text-xl font-extrabold">{registerHouseCount}</span>
          </div>
          <div className="flex justify-between items-center border-b border-black pb-1">
            <span className="text-xl font-bold">ગામના કુલ ઘરની સંખ્યા:-</span>
            <span className="text-xl font-extrabold">{totalHoouse}</span>
          </div>
        </div>
      </div>

      <p className="absolute bottom-4 right-4 text-xs text-gray-400">
        Cover - {part}
      </p>
    </div>
  );
};

export default IndexIndex;
