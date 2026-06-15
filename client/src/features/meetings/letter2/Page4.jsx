import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page4 = ({ data }) => {
  const structure = [
    {
      name: "શ્રી મહેશભાઈ એ કામલીયા",
      village: "જાબાળ",
      charge: "ઘાણલા",
      mobile: "9106161725",
    },
    {
      name: "શ્રી આકાશકુમાર બી.વાળા",
      village: "દેતડ",
      charge: "હાથસણી",
      mobile: "9033484668",
    },
    {
      name: "સુશ્રી યાત્રીબેન એમ.આચાર્ય",
      village: "મેરીયાણા",
      charge: "ગોરડકા",
      mobile: "9773023277",
    },
    {
      name: "સુશ્રી ધૃતિબેન વી દુધાત",
      village: "ખડકાળા-બોરાળા",
      charge: "",
      mobile: "7621952219",
    },
    {
      name: "શ્રી બી.એમ. ડવ",
      village: "ગાધકડા-ગણેશગઢ",
      charge: "",
      mobile: "9574822386",
    },
    {
      name: "શ્રી જે.જી. જાડેજા",
      village: "જૂના સાવર",
      charge: "કેરાળા",
      mobile: "9099201932/ 7016951145",
    },
    {
      name: "સુશ્રી મોનિકાબેન સોની",
      village: "વિજપડી",
      charge: "",
      mobile: "6352230240",
    },
    {
      name: "શ્રી ભાવેશકુમાર વી બારૈયા",
      village: "દોલતી",
      charge: "શેલણા, ઘનશ્યામનગર",
      mobile: "9723301965",
    },
    {
      name: "શ્રી આર. જે. સોલંકી",
      village: "ધાર",
      charge: "",
      mobile: "8200233877",
    },
    {
      name: "સુશ્રી મેઘનાબેન એચ ચૌહાણ",
      village: "નાનીવડાળ-ભેકરા",
      charge: "",
      mobile: "9725230177",
    },
    {
      name: "શ્રી પ્રતિક મોહનલાલ બારૈયા",
      village: "ફીફાદ-પાટી",
      charge: "આકોલ્ડા",
      mobile: "9974899414",
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
      <div
        style={{
          marginBottom: "5mm",
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <table
          style={{
            // width: "100%",
            maxWidth: "fit-content",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {[
                "ક્રમ",
                "તલાટી કમ મંત્રીશ્રીન ં નામ",
                "સેજાના ગામન",
                "ચાર્જના ગામો",
                "મોબાઈલ નંબર",
              ].map((h, i) => (
                <th
                  key={i}
                  style={{
                    border: "1px solid black",
                    padding: "4px",

                    paddingRight: "8px",
                    paddingLeft: "8px",

                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    maxWidth:
                      i === 3
                        ? "150px"
                        : i === 2
                          ? "45px"
                          : i === 1
                            ? "70px"
                            : "",
                  }}
                >
                  <span className="formatting">{h}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {structure.map((row, index) => (
              <tr key={index + 26}>
                <td style={cellStyle}>
                  <span className="formatting">
                    {toGujaratiNumber(index + 26)}
                  </span>
                </td>
                <td style={cellStyle}>
                  <span className="formatting">{row?.name || ""}</span>
                </td>
                <td style={cellStyle}>
                  <span className="formatting">{row?.village || ""}</span>
                </td>
                <td style={cellStyle}>
                  <span className="formatting">{row?.charge || ""}</span>
                </td>
                <td style={{ ...cellStyle, maxWidth: "90px" }}>
                  <span className="formatting">
                    {toGujaratiNumber(row?.mobile) || ""}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NOTE */}
      {/* <p
        style={{
          marginBottom: "5mm",
          textAlign: "justify",
          textIndent: "15mm",
        }}
      >
        ઉપરોક્ત યાદી મુજબ જુદી/જુદી તાલુકા પંચાયત કચેરી માં અમારી કંપની એ. એફ.
        ઈન્ફોસીસ ધ્વારા તલાટી કમ મંત્રી મીટીંગમાં ખાસ પ્રકારનું પ્રેજન્ટેશન આપેલ
        છે જે આપ સાહેબ ને વિદીત થાય.
      </p> */}

      {/* <div
        style={{ textAlign: "right", marginTop: "5mm", paddingRight: "10mm" }}
      >
        <p>લી. આપનો વિશ્વાસુ</p>
        <p style={{ fontWeight: "bold" }}>
          {data.karmchariName || "__________"}
        </p>
        <p>({data.designation || "A. F. Infosys"})</p>  
      </div> */}

      {/* Footer Section */}
      {/* <div
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
      </div> */}

      {/* ATTACHMENT */}
      {/* <div style={{ marginTop: "12mm" }}>
        <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
          બિડાણ ::-
        </p>
        <p>
          તાલુકા વિકાસ અધિકારીએ આપેલ પ્રમાણ પત્ર ત્થા તા.પં. કચેરીમાં
          પ્રેજન્ટેશન બતાવેલ અંગેની યાદી
        </p>
      </div> */}

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

  paddingRight: "8px",
  paddingLeft: "8px",

  textAlign: "center",
  fontSize: "15px",
};

export default Page4;
