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

const Page11 = ({ data }) => {
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

      {/* Body */}
      <div style={{ textAlign: "justify" }}>
        {/* <p>સવિનય,</p> */}

        <p style={{ textIndent: "15mm", marginTop: "50px", fontSize: "22px" }}>
          અમો ભારત સરકારના ફ્લેગશીપ પ્રોગામ ડિજીટલ ઈન્ડિયા મીશન ભાગ રૂપે ગ્રામ
          પંચાયતના વહિવટમાં ડિજીટલાઈજેશનો મહતમ ઉપયોગ થાય તે માટેના કાર્યો જેવા
          કે, ગ્રામપંચાયતની ડિજીટલ પ્રોફાઈલ, ગ્રામ પંચાયતને આર્થીક સધ્ધર બનાવી
          શકાય ગ્રામજનોને ઝડપી રીતે અને સમયનો બચાવ થાય તેવી સુવિધાઓ મળી શકે તેવા
          હેતુને ખાસ, મહત્વ આપી અમો આપના તાલુકામાં આવતા તમામ તલાટી કમ
          મંત્રીશ્રીઓ તથા સરપંચશ્રીઓની નામ, સબંધિત ગામ, મોબાઈલ નંબરની યાદિ ઈ -
          મેલ ધ્વારા મોકલવા આપ સાહેબશ્રીને અમારી ન્રમ વિનંતી છે આપના સાહેબના
          સહયોગના અપેક્ષા સહ.
        </p>

        <p style={{ paddingLeft: "20px", marginTop: "10px", fontSize: "20px" }}>
          ઈ-મેલ નિચે મુજબ છે.
          <br />
          <a
            href="mailto:af.infosys146@gmail.com"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            af.infosys146@gmail.com
          </a>
        </p>

        <p style={{ paddingLeft: "20px", marginTop: "30px", fontSize: "20px" }}>
          <b>બિડાણ ::-</b>
          <br />
          અમોને તા.પં. કચેરી, તાલુકા વિકાસ અધિકારી સાહેબ આપેલ તલાટી કમ મંત્રી
          તથા સરપંચશ્રીઑની યાદિ તથા પ્રમાણ પત્ર સામેલ.
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
            marginTop: "20px",
            position: "relative",
          }}
          id="sikko"
        >
          <p
            id="faithfull"
            style={{
              textAlign: "right",
              marginTop: "30px",
              fontSize: "20px",
              position: "absolute",
              top: "-85px",
              color: "black",
              fontWight: "200",
            }}
          >
            લી. આપનો વિશ્વાસું
          </p>
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
      <div style={{ textAlign: "center", marginTop: "38mm" }}>
        (પાનાં નં.-૨)
      </div>
    </div>
  );
};

export default Page11;
