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
          એ.એફ.ઇન્ફો/નં.{date?.index || "-0-"}/પ્રેજ/મીટીંગ/તા.પં/
          {toGujaratiNumber(date.getMonth() + 1)}/
          {toGujaratiNumber(date.getFullYear())}
        </span>

        <span>તારીખ :- {formatDate(data.date)}</span>
      </div>

      {/* Recipient block */}
      <div style={{ marginBottom: "6mm" }}>
        <p>
          પ્રતિ <br />
          શ્રી તાલુકા વિકાસ અધિકારી સાહેબ,
        </p>
        <p>તાલુકા પંચાયત કચેરી, {data.taluka || "____________"}</p>
        <p>જિલ્લો :- {data.district || "____________"}</p>
      </div>

      {/* Subject */}
      <div style={{ textAlign: "center", marginBottom: "5mm" }}>
        <p
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            fontSize: "21px",
          }}
        >
          વિષય ::- તલાટી કમ મંત્રીશ્રીઑની મીટીંગમાં પ્રેજન્ટેશન આપવા બાબત.
        </p>
      </div>

      {/* Body */}
      <div style={{ textAlign: "justify" }}>
        <p>સવિનય,</p>

        <p style={{ textIndent: "15mm", marginTop: "10px" }}>
          ઉપરોક્ત વિષય અન્વયે જણાવવાનું કે, એ. એફ. ઈન્ફોસીસ નામની અમારી કંપની
          છેલ્લા ૧પ વર્ષથી કોમ્પ્યુટરાઈજર્ડ સોફ્ટવેર, વેબસાઈટ તથા પંચાયત વસુલાત
          તેમજ રેકર્ડ જેવુ કે, આકારણીસર્વે, કરવેરા માંગણા પત્રક ૯/ડી, જન્મ/મરણ
          રજીસ્ટર, રેવન્યુ નમુનાઓ ૧૧ નંબર ટાળા પત્રક, ૮ક - બ, ગામ નમુના નં.-ર,
          નમુનાનું લેમીનેશન, ગા. નં. નં.-ર અધ્યતન કરવા ત્થા પંચાયત નમુનાઓ તેમજ
          ઓડિટ નોંધના પેરાના જવાબો અને ગ્રામસુવિધા પોર્ટલ, ઓનલાઈન ડેટાએન્ટ્રી,
          કોમ્પ્યુટરાઈઝડ કામ, તલાટી કમ મંત્રી ગ્રામપંચાયત, તાલુકાપંચાયતને ઉપયોગી
          તમામ નમુનાઓની અધ્યતન કરવાની કામગીરી કરી આપીએ છીએ.
        </p>

        <p style={{ textIndent: "15mm", marginTop: "10px" }}>
          અમો આપની તાલુકા પંચાયત કચેરીના જ્યારે આપ સાહેબ સમય આપો ત્યારે
          તલાટીશ્રીઓને મીટીંગમાં ખાસ પ્રકારનું પ્રેજન્ટેશન આપવા માટે અમોને ફક્ત
          ૨૦ મિનીટ પ્રેજન્ટેશન આપવા મંજુરી આપવા ન્રમ વિનંતી.
        </p>

        <p style={{ textIndent: "15mm", marginTop: "10px" }}>
          ગ્રામ પંચાયતની વસુલાતની કામગીરી સરળ અને ઝડપી બને તે હેતુ માટે અમો
          પ્રેજન્ટેશન નિ:શુલ્ક સેવા આપીશું તો પ્રેજન્ટેશન આપવા મંજુરી, તારીખ
          આપવા વિનંતી છે.
        </p>
      </div>

      {/* Footer Section */}
      <div
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
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "25mm" }}>
        (પાનાં નં.-૧)
      </div>
    </div>
  );
};

export default Page1;
