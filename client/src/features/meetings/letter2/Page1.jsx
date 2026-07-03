import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

function formatDate(date) {
  // dd/mm/yyyy

  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const Page1 = ({ data }) => {
  const date = new Date();

  return (
    <div
      id="letter-page"
      style={{
        width: "794px",
        height: "1123px",
        padding: "8mm",
        paddingLeft: "10mm",
        boxSizing: "border-box",
        fontFamily: "Noto Serif Gujarati, serif",
        fontSize: "14pt",
        lineHeight: "1.6",
        position: "relative",
        zIndex: 1,
      }}
      className="bg-white"
    >
      <div
        className="flex justify-between items-center mb-4 w-full"
        id="webicon"
      >
        <div className="flex flex-col items-end w-full">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <h3 className="text-base font-grey-700">
              Shahid Kalva - <span>93764 43146</span>
            </h3>
            <h3 className="text-base font-grey-700">
              Sarfaraz Kalva - <span>99247 82732</span>
            </h3>
            <h3 className="text-base font-grey-700">
              E-Mail :-{" "}
              <span className="underline">af.infosys146@gmail.com</span>
            </h3>
            <h3 className="text-base font-grey-700">
              Website :- <span className="underline">afinfosys.com</span>
            </h3>
          </div>
        </div>
      </div>
      {/* Business Name and Logo */}
      <div id="title">
        <div>
          <h2 className="text-5xl text-center font-extrabold mt-4">
            {/* A.F. Infosys */}
          </h2>

          <p className="trans">
            ગ્રામપંચાયત રેવન્યુ(જમાબંધી) વાર્ષીક હિસાબ, આકાણીસર્વે, કરવેરા
            રજીસ્ટર, રોજમેળ, ગ્રામસુવિધા પોર્ટલ તથા ઓનલાઈન / ઓફલાઈન તમામ
            પ્રકારની ડેટાએન્ટ્રી અને પ્રિન્ટીંગ, વેબસાઈટ, સોફ્ટવેર, કોમ્પ્યુટર
            કામ માટે મળો
          </p>

          <p className="address trans">
            બીજામાળે, સેન્ટ્રલપોઈન્ટ કોમ્પ્લેક્ષ, જુનાબસસ્ટેન્ડ સામે -
            સાવરકુંડલા જિ.અમરેલી. સૌરાષ્ટ્ર (પશ્વિમગુજરાત)
          </p>
        </div>

        <img src={LOGOpng} alt="Logo" />
      </div>

      <div className="watermark-logo-arji"></div>

      {/* Top right date */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6mm",
          marginTop: "3mm",
        }}
      >
        <span>
          એ.એફ.ઇન્ફોસીસ/યાદિ/જા.નં.
          {toGujaratiNumber(
            Number(2 + (data?.index + 1)?.toString().padStart(3, "0")),
          ) || "-0-"}
          /{/* {toGujaratiNumber(date.getMonth())}/ */}
          {toGujaratiNumber(date.getFullYear())}
        </span>

        <span>તારીખ :- {formatDate(data.date)}</span>
      </div>

      {/* Recipient block */}
      <div style={{ marginBottom: "6mm" }}>
        <p>
          પ્રતિ, <br />
          શ્રી તાલુકા વિકાસ અધિકારી સાહેબ,
        </p>
        <p>તાલુકા પંચાયત કચેરી, {data.taluka || "____________"}</p>
        <p>જિલ્લો :- {data.district || "____________"}</p>
        <p>E-Mail Id : - {data.email || "____________"}</p>
      </div>

      {/* Subject */}
      <div style={{ textAlign: "center", marginBottom: "5mm" }}>
        <p
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            fontSize: "23px",
          }}
        >
          વિષય ::- તલાટી કમ મંત્રીશ્રીઓ ત્થા સરપંચશ્રીઓની યાદી ઈ- મેલ મોકલવા
          બાબત...
        </p>
      </div>

      {/* Body */}
      <div style={{ fontSize: "22px" }}>
        <p>મહેરબાન સાહેબ શ્રી,</p>

        <p style={{ textIndent: "15mm", marginTop: "10px", fontSize: "22px" }}>
          જય ભારત સાથ સવિનય સહ ઉપરોક્ત વિષય અન્વયે જણાવવાનું કે, અમારી સંસ્થા
          ગ્રામપંચાયતની આવક વધે તે માટે અને રેવન્યુ નમુનાઓ તથા પંચાયત રેકર્ડ
          તેમજ તલાટી-કમ-મંત્રીશ્રીઓની તમામ પ્રકારના સાહિત્યને અધ્યતન
          કોમ્પ્યુટરાઈઝડ ઓનલાઈન કરવાની કામગીરી કરીએ છે.
        </p>

        <p style={{ textIndent: "15mm", marginTop: "10px", fontSize: "22px" }}>
          અમારો હેતુ પંચાયત વસુલાત ઝડપી થાય તેમજ ગ્રામ પંચાયત આવકનો સ્ત્રોત વધે
          તથા ગ્રામજનોને સુવિધા મળે તેવો છે તદઉપરાંત ગ્રામપંચાયત તલાટી-કમ-
          મંત્રીશ્રીઓની કામગીરી સરળ બનાવવાનો છે. અમારી સંસ્થાનું વિઝન ગુજરાત
          પંચાયતી રાજ વ્યવસ્થાના પ્રારંભબિંદુ ગ્રામપંચાયતની કાર્યપ્રણાલીમાં
          માળખાગત પરિવર્તન કરવાનો છે.
        </p>

        <p style={{ textIndent: "15mm", marginTop: "10px", fontSize: "22px" }}>
          અમારી સંસ્થા ગ્રામ પંચાયતની ડિજીટલ પ્રોફાઈલ બનાવવી, મિલ્કત આકારણી
          સર્વે, એગ્રીસ્ટેક રવિ ક્રોપ સર્વે, ખરીફ ક્રોપ સર્વે, તેમજ આધુનિક
          ટેકનોલોજીની જરૂરીયાત વાળા કાર્યો કરીને સરકારશ્રીના ડિજીટલ ઈન્ડિયા
          મિશનમાં મહત્વપૂર્ણ ભાગ ભજવે છે.
        </p>
      </div>

      {/* Footer Section */}
      {/* <div
        className="w-full"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "70px",
        }}
      >
        <span
          style={{
            position: "relative",
            transform: "translate(50px, -40px)",
          }}
          id="circle"
        >
          આભાર
        </span>
        <h2
          className="text-right pr-12 mt-4 mb-8 text-xl font-semibold"
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "-10px",
          }}
          id="sikko"
        >
          A. F. Infosys
          <p
            style={{
              fontSize: "14px",
              letterSpacing: "2.3px",
              marginTop: "-7px",
            }}
          >
            Savar Kundla
          </p>
        </h2>
      </div> */}

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "45mm" }}>
        (પાનાં નં.-૧)
      </div>
    </div>
  );
};

export default Page1;
