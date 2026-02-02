import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page3 = ({ data }) => {
  const structure = [
    {
      designation: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluko: "જાફરાબાદ",
      district: "અમરેલી",
      date: "૨૭-૧૨-૨૦૧૮",
    },
    {
      designation: "- / / -",
      taluko: "લીલીયા",
      district: "અમરેલી",
      date: "૩-૦૧-૨૦૧૯",
    },
    {
      designation: "લીલીયા તાલુકા તલાટી કમ મંત્રી મંડળ",
      taluko: "લીલીયા",
      district: "અમરેલી",
      date: "૩-૦૧-૨૦૧૯",
    },
    {
      designation: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluko: "અમરેલી",
      district: "અમરેલી",
      date: "૩-૦૧-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "બાબરા",
      district: "અમરેલી",
      date: "૧૦-૦૧-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "લાઠી",
      district: "અમરેલી",
      date: "૧૭-૦૧-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "જેતપુર",
      district: "રાજકોટ",
      date: "૨૪-૦૧-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "ધારી",
      district: "અમરેલી",
      date: "૩૧-૦૧-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "પાલીતાણા",
      district: "ભાવનગર",
      date: "૨-૦૨-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "વિસાવદર",
      district: "જુનાગઢ",
      date: "૫-૦૨-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "કુંકાવાવ",
      district: "અમરેલી",
      date: "૭-૦૨-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "ખાંભા",
      district: "અમરેલી",
      date: "૨૮-૦૨-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "ઉના",
      district: "ગીર સોમનાથ",
      date: "૨૭-૦૬-૨૦૧૯",
    },
    {
      designation: "- / / -",
      taluko: "બગસરા",
      district: "અમરેલી",
      date: "૩૧-૧૧-૨૦૧૯",
    },
  ];

  return (
    <div
      id="letter-page"
      style={{
        width: "794px",
        height: "1123px",
        padding: "8mm",
        boxSizing: "border-box",
        fontFamily: "Noto Serif Gujarati, serif",
        fontSize: "13.5pt",
        lineHeight: "1.6",

        position: "relative",
        zIndex: 1,
      }}
      className="bg-white"
    >
      <div className="watermark-logo-arji"></div>

      <div className="flex justify-between items-center mb-4 w-full">
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

      {/* TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "5mm",
          marginTop: "15px",
        }}
      >
        <thead>
          <tr>
            {[
              "ક્રમ",
              "હોદ્દો",
              "તાલુકા ઑફિસ",
              "જિલ્લો",
              "પ્રમાણ પત્ર આપ્યા તારીખ",
            ].map((h, i) => (
              <th
                key={i}
                style={{
                  border: "1px solid black",
                  padding: "4px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                  maxWidth:
                    i === 4 ? "90px" : i === 2 ? "45px" : i === 1 ? "30px" : "",
                }}
              >
                <span className="formatting">{h}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {structure.map((row, index) => (
            <tr key={index}>
              <td style={cellStyle}>
                <span className="formatting">
                  {toGujaratiNumber(index + 1)}
                </span>
              </td>
              <td style={cellStyle}>
                <span className="formatting">{row?.designation || ""}</span>
              </td>
              <td style={cellStyle}>
                <span className="formatting">{row?.taluko || ""}</span>
              </td>
              <td style={cellStyle}>
                <span className="formatting">{row?.district || ""}</span>
              </td>
              <td style={{ ...cellStyle, maxWidth: "30px" }}>
                <span className="formatting">{row?.date || ""}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* NOTE */}
      <p
        style={{
          marginBottom: "5mm",
          textAlign: "justify",
          textIndent: "15mm",
        }}
      >
        ઉપરોક્ત યાદી મુજબ જુદી/જુદી તાલુકા પંચાયત કચેરી માં અમારી કંપની એ. એફ.
        ઈન્ફોસીસ ધ્વારા તલાટી કમ મંત્રી મીટીંગમાં ખાસ પ્રકારનું પ્રેજન્ટેશન આપેલ
        છે જે આપ સાહેબ ને વિદીત થાય.
      </p>

      {/* SIGNATURE */}
      <div
        style={{ textAlign: "right", marginTop: "5mm", paddingRight: "10mm" }}
      >
        <p>લી. આપનો વિશ્વાસુ</p>
        {/* <p style={{ fontWeight: "bold" }}>
          {data.karmchariName || "__________"}
        </p>
        <p>({data.designation || "A. F. Infosys"})</p> */}
      </div>

      {/* Footer Section */}
      <div
        className="w-full mt-2"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
        }}
      >
        <span
          style={{
            position: "relative",
            transform: "translate(50px, -100px)",
          }}
          id="circle"
        ></span>
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

      {/* ATTACHMENT */}
      <div style={{ marginTop: "12mm" }}>
        <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
          બિડાણ ::-
        </p>
        <p>
          તાલુકા વિકાસ અધિકારીએ આપેલ પ્રમાણ પત્ર ત્થા તા.પં. કચેરીમાં
          પ્રેજન્ટેશન બતાવેલ અંગેની યાદી
        </p>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: "12mm" }}>
        (પાનાં નં.-૩)
      </div>
    </div>
  );
};

const cellStyle = {
  border: "1px solid black",
  padding: "2px",
  textAlign: "center",
  fontSize: "15px",
};

export default Page3;
