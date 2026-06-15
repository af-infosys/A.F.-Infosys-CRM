import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page3 = ({ data }) => {
  const structure = [
    {
      name: "સુશ્રી યુ.પી. વાળા",
      village: "લુવારા- રામગઢ",
      charge: "",
      mobile: "9537938021",
    },
    {
      name: "શ્રી એસ.જે.ખુમાણ",
      village: "ડેડકડી-મઢડા",
      charge: "છાપરી",
      mobile: "9909294598",
    },
    {
      name: "શ્રી પી એમ ગોહિલ",
      village: "મેકડા",
      charge: "ખાલપર-કુંકાવાવ, નાળ",
      mobile: "7984383552",
    },
    {
      name: "શ્રી પી.પી.મહેતા",
      village: "નેસડી",
      charge: "ખોડિયાણા",
      mobile: "9979187100",
    },
    {
      name: "શ્રી બી.એ.થાનકી",
      village: "ચરખડીયા",
      charge: "વંડા",
      mobile: "8511561419",
    },
    {
      name: "શ્રી આર.ડી.ખુમાણ",
      village: "લીખાળા",
      charge: "ઠવી",
      mobile: "9978717838",
    },
    {
      name: "કે.બી.મહેતા",
      village: "નાના ભામોદ્રા",
      charge: "સીમરણ",
      mobile: "8156063773",
    },
    {
      name: "શ્રી એચ એચ ધાંધલ્યા",
      village: "વિજયાનગર",
      charge: "બગોયા-ગીણીયા",
      mobile: "9099922219",
    },
    {
      name: "સુશ્રી એન.પી.ડાભી",
      village: "થોરડી",
      charge: "અભરામપરા",
      mobile: "9825561274",
    },
    {
      name: "શ્રી પી.એમ.જોષી",
      village: "આંબરડી",
      charge: "આદસંગ",
      mobile: "9909471182",
    },
    {
      name: "શ્રી ડી.એમ.બગડા",
      village: "બાઢડા",
      charge: "ખડસલી",
      mobile: "9725571678",
    },
    {
      name: "શ્રી બી એન ચાવડા",
      village: "જીરા",
      charge: "કાનાતળાવ",
      mobile: "9714536711",
    },
    {
      name: "શ્રી એ.વિ. બોરીચા",
      village: "સેંજળ-મેવાસા",
      charge: "ફાચરીયા, પિયાવા",
      mobile: "8347932184",
    },
    {
      name: "શ્રી એસ.બી.છોડવડીયા",
      village: "મોટા ભમોદ્રા",
      charge: "કેદારીયા, વાંશિયાળી",
      mobile: "9737691069",
    },
    {
      name: "શ્રી જેમીશભાઈ કે.જાજડીયા",
      village: "હાડીડા",
      charge: "વણોટ",
      mobile: "7861030789",
    },
    {
      name: "સુશ્રી કુંદનબેન ડી.ગેલાતર",
      village: "ઓળીયા",
      charge: "કરજાળા",
      mobile: "9512989298",
    },
    {
      name: "સુશ્રી શિલ્પાબેન વી.રૈયાણી",
      village: "પીપરડી",
      charge: "હિપાવડલી",
      mobile: "6357482811",
    },
    {
      name: "શ્રી મોહિતગીરી જે.ગૌસ્વામી",
      village: "મોટા ઝીંઝુડા",
      charge: "અમૃતવેલ",
      mobile: "9408208177",
    },
    {
      name: "શ્રી સુજાનસિંહ એચ.સરવૈયા",
      village: "વિરડી",
      charge: "જેજાદ",
      mobile: "6355508184",
    },
    {
      name: "શ્રી સુનીલભાઈ વેગડા",
      village: "મીતીયાળા-કૃષ્ણગઢ - સાકરપરા",
      charge: "",
      mobile: "9328163720",
    },
    {
      name: "સુશ્રી ચેતનાબેન જી.બગડા",
      village: "ધજડી",
      charge: "",
      mobile: "6353345031",
    },
    {
      name: "સુશ્રી કિંજલબેન બી.પરમાર",
      village: "મોલડી",
      charge: "પીઠવડી",
      mobile: "9106843183",
    },
    {
      name: "શ્રે હેમરાજસિંહ જે.મોરી",
      village: "ભૂવા",
      charge: "નાના ઝીંઝુડા",
      mobile: "6351233070",
    },
    {
      name: "સુશ્રી અનિતાબેન જી.જેઠવા",
      village: "ચીખલી",
      charge: "દાધિયા",
      mobile: "7069431824",
    },
    {
      name: "સુશ્રી ચાંદનીબેન એમ .સોલંકી",
      village: "ભમ્મર",
      charge: "જાંબુડા",
      mobile: "9737728858",
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
              <th
                colSpan="5"
                style={{
                  border: "1px solid black",
                  padding: "4px",

                  paddingRight: "8px",
                  paddingLeft: "8px",

                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                <span className="formatting">
                  તાલકા પંચાયત કચેરી સાવરકં ડલાના તલાટી કમ મંત્રીશ્રી ની માહિતી
                  (તા.૦૪ /૦૪ /2026 ની સ્થિતીએ)
                </span>
              </th>
            </tr>

            <tr>
              {[
                "ક્રમ",
                "તલાટી કમ મંત્રીશ્રીનું નામ",
                "સેજાના ગામનું",
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
                      i === 4
                        ? "100px"
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
              <tr key={index}>
                <td style={{ ...cellStyle, textAlign: "left" }}>
                  <span className="formatting">
                    {toGujaratiNumber(index + 1)}
                  </span>
                </td>
                <td style={{ ...cellStyle, textAlign: "left" }}>
                  <span className="formatting">{row?.name || ""}</span>
                </td>
                <td style={{ ...cellStyle, textAlign: "left" }}>
                  <span className="formatting">{row?.village || ""}</span>
                </td>
                <td style={{ ...cellStyle, textAlign: "left" }}>
                  <span className="formatting">{row?.charge || ""}</span>
                </td>
                <td style={{ ...cellStyle, maxWidth: "80px" }}>
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
      <div style={{ textAlign: "center", marginTop: "1mm" }}>(પાનાં નં.-૩)</div>
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

export default Page3;
