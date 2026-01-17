import React from "react";

// Utility component for the two-column benefit list
const OwnerBenefitItem = ({ number, children }) => (
  <div className="flex text-lg text-gray-800 mb-4 items-start">
    <span className="font-extrabold text-blue-700 mr-5 mt-0 w-6 text-right pr-1">
      ({number})
    </span>
    <p className="flex-1 leading-relaxed">{children}</p>
  </div>
);

const PublicBenefit = () => {
  return (
    <div style={{ position: "relative" }}>
      {/* -------------------- 1. Main Title -------------------- */}
      <header className="text-center pb-8" style={{ marginTop: "120px" }}>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wider">
          --:: મિલ્કત માલિકને આકારણીથી થતા ફાયદાઓ ::--
        </h1>
      </header>

      {/* -------------------- 2. Benefits Grid Section (New Content) -------------------- */}
      <main
        className="flex-grow px-12 text-gray-700 benefit2"
        style={{ maxWidth: "100%", overflow: "hidden" }}
      >
        <div className="grid grid-cols-2 gap-x-16">
          {/* Left Column (1-6) */}
          <div>
            <OwnerBenefitItem number="૧">
              વીજ કનેક્શન (લાઈટનું મીટર) લેવા માટે
            </OwnerBenefitItem>
            {/* Light Meter */}

            <OwnerBenefitItem number="૨">
              લોન લેવા માટે આધાર પુરાવા તથા સહાય માટે
            </OwnerBenefitItem>
            {/* Bank Lon */}

            <OwnerBenefitItem number="૩">
              પ્રધાન મંત્રી આવાસ યોજના માટે
            </OwnerBenefitItem>
            {/* PMY Yojna */}

            <OwnerBenefitItem number="૪">
              પંડિત દિનદયાળ ઉપાધ્યાય આવાસ યોજના
            </OwnerBenefitItem>
            {/* PDAY */}

            <OwnerBenefitItem number="૫">
              આંબેડકર આવાસ યોજના માટે
            </OwnerBenefitItem>
            {/* AAvas */}

            <OwnerBenefitItem number="૬">
              રહેણાંકના પુરાવા માટે
            </OwnerBenefitItem>
            {/* House Dastavej */}
          </div>

          {/* Right Column (7-12) */}
          <div>
            <OwnerBenefitItem number="૭">
              જી.એસ.ટી. નંબર, વ્યવસાય વેરા, નંબર લેવા માટે
            </OwnerBenefitItem>
            {/* GST */}

            <OwnerBenefitItem number="૮">
              કુદરતી અકસ્માતમાં/અતિભારે વરસાદમાં પાણીમાં ડુબી જવું, વાવાઝોડામાં
              પડી જવું, બિલ્ડીંગ પડી વિગેરે
            </OwnerBenefitItem>
            {/* House Effected by Kudarati Afat / Water / Pavan */}

            <OwnerBenefitItem number="૯">
              ભૂકંપ થવાથી મકાન ધરાશાય થયું હોય તેના આધાર પુરાવા સહાય માટે
            </OwnerBenefitItem>
            {/* Huose effected by Earthqueck */}

            <OwnerBenefitItem number="૧૦">શોચાલય બનાવવા માટે</OwnerBenefitItem>
            {/* Bathroom */}

            <OwnerBenefitItem number="૧૧">
              પ્રોપર્ટી કાર્ડ માટે
            </OwnerBenefitItem>
            {/* Property Card */}

            <OwnerBenefitItem number="૧૨">
              સરકારશ્રીની વિવિધ યોજનાઓ માટે જરુરી
            </OwnerBenefitItem>
            {/* Government Schemes */}
          </div>
        </div>

        {/* Important Note (વિશેષ મહત્ત્વનું) */}
        <div className="mt-6 pt-6 border-t border-gray-400">
          <p className="text-xl font-bold text-red-700">
            વિશેષ મહત્ત્વનું: –
            <span className="font-medium text-gray-800 ml-3">
              બેન્ક લોન લેવા માટે, પ્રોપર્ટી વેલ્યુએશન સર્ટીફીકેટ માટે અતી જરુરી
              તેમજ મહત્વપૂર્ણ.
            </span>
          </p>
        </div>
      </main>

      {/* -------------------- 3. Footer Contact Information (Removed to make this a single-purpose page) -------------------- */}
      {/* As per the image, the footer is empty here. Keeping the layout structure clean. */}
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
        Property Owner Benefits
      </p>
    </div>
  );
};

export default PublicBenefit;
