import React from "react";

// Utility component for structuring the benefit points
const BenefitPoint = ({ number, children }) => (
  <div className="flex text-lg text-gray-800 mb-4 items-start">
    <span className="font-extrabold text-blue-700 mr-3 mt-0">{number}.</span>
    <p className="flex-1 leading-relaxed text-justify">{children}</p>
  </div>
);

const PanchayatBenefit = () => {
  // Styling classes adjusted for a LANDSCAPE appearance (max-w-7xl)

  return (
    <div style={{ position: "relative" }}>
      {/* -------------------- 1. Main Title -------------------- */}
      <header className="text-center pb-12" style={{ marginTop: "150px" }}>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wider">
          --:: ગ્રામ પંચાયત મિલ્કત આકારણી સર્વેથી થતા વિશેષ ફાયદાઓ ::--
        </h1>
      </header>

      {/* -------------------- 2. Benefits Section -------------------- */}
      <main
        className="flex-grow px-12 text-gray-700 benefit1"
        style={{ maxWidth: "100%", marginTop: "-20px", paddingBottom: "0px" }}
      >
        <BenefitPoint number="1">
          ગ્રામ પંચાયત આકારણીથી કરવાથી ગામની ભૌગોલીક સ્થિતિ હાલની આર્થીક સ્થીતી
          તેમજ ભવિષ્ય આધારીત ખર્ચાઓની સમીક્ષા થઈ શકે છે.
        </BenefitPoint>
        {/* Money */}

        <BenefitPoint number="2">
          વહિવટીય ખર્ચા, આકસ્મીક ખર્ચાઓને પહોચીવળવા આગોતરી વ્યવસ્થા તેમજ આયોજન
          માટે ખુબજ જરૂરી છે.
        </BenefitPoint>
        {/* Planing */}

        <BenefitPoint number="3">
          પંચાયતના નવિની કરણ અને વહીવટી રેકર્ડના આધુનિકરણ તેમજ રક્ષણ માટે મુળભુત
          પાયાની જરૂરીયાત છે. ગ્રામ પંચાયતના વહીવટી કાર્યોમાં ઝડપી અત્યાધુનીકતા
          સરળતા બનાવવા માટે જરૂરી
        </BenefitPoint>
        {/* Computer Data Entry */}

        <BenefitPoint number="4">
          ગ્રામ પંચાયત સમયસર મિલ્કત આકારણી સર્વે કરવાથી પંચાયત પોતાના સ્વભંડોળની
          આવકમાંથી લોક ફાળાની રકમ ભરી સરકારશ્રીની વિવિધ યોજનાઓમાંથી ૭પ% , ૮૦% ,
          ૯૦% સુધી વિકાસના કામોની ગ્રાંટ મેળવી શકે છે અને ગામનો વધુ સારી રીતે
          વિકાસ થઈ શકે તથા સારી સગવડતાઓ મેળવી શકે છે.
        </BenefitPoint>
        {/* Survey */}

        <BenefitPoint number="5">
          આ ઉપરાંત ગ્રામ પંચાયતનું સ્વભંડોળ આવક વધારવા , નાણાકિય સધ્ધર બનાવવા
          માટે, ગ્રામ પંચાયતનું લાઈટ બિલ ભરવા માટે, ગ્રામપંચાયતના કારકુન,
          પટૃાવાળા, વાલમેન, વાયર મેન, સફાઈ કામદારો, વિગેરે કર્મચારીઓનો પગારમાં
          તેમજ અન્ય નાણાકિય જરૂરીયાત માટે અન્યથા ગ્રામ પંચાયત હસ્તકની મિલ્કતોની
          જાળવણી તેમજ મરામત માટે પણ ખર્ચ કરી શકાય તે માટે મહત્વની તેમજ ઉપયોગી
          બને છે.
        </BenefitPoint>
        {/* Light Bill - Meter, Office Clerk - Working, Cleaning Workers, Waterman, Electrician, Old Government Office */}
      </main>

      {/* -------------------- 3. Footer Contact Information -------------------- */}
      <footer className="mt-0 pt-4 border-t-2 border-dashed border-gray-400">
        {/* Company Name */}
        <div className="text-center text-2xl font-extrabold text-blue-800 mb-2">
          એ. એફ. ઈન્ફોસીસ – સાવરકુંડલા
        </div>

        {/* Contact Details (Shahid & Sarfaraz) */}
        <div className="text-center text-xl font-bold text-gray-700 mb-2">
          શાહિદ કાલવા - <span className="text-red-600">93764 43146</span>,
          સરફરાઝ કાલવા - <span className="text-red-600">99247 82732</span>
        </div>

        {/* Address */}
        <div className="text-center text-lg text-gray-600 mb-4">
          બીજા માળે, સેન્ટ્રલ પોઈન્ટ કોમ્પલેકક્ષ, જુના બસ સ્ટેન્ડ
          મું.સાવરકુંડલા. તાલુકો :– સાવરકુંડલા જીલ્લો :– અમરેલી (પશ્વિમ ગુજરાત)
        </div>

        {/* Email and Website */}
        <div className="flex justify-center items-center space-x-12 text-lg font-semibold border-t border-gray-300 pt-2">
          <p className="text-gray-700">
            E-mail ID :{" "}
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
      </footer>

      <p
        style={{
          position: "absolute",
          bottom: "-40px",
          right: "10px",
          fontSize: "12px",
        }}
      >
        GP Benefits
      </p>
    </div>
  );
};

export default PanchayatBenefit;
