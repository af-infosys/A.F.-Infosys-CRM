import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page7 = ({ data }) => {
  const structure = [
    {
      gram_panchayat: "વાંશીયાળી",
      name: "ગજેરા વિમાળાબેન રમેશભાઈ",
      mobile: "૯૯૧૩૬૫૫૮૬૧",
    },
    {
      gram_panchayat: "વિજપડી",
      name: "ભરતભાઈ ભીખુભાઈ ગીગૈયા",
      mobile: "૯૮૭૯૪૧૯૧૫૪",
    },
    {
      gram_panchayat: "વિજયાનગર",
      name: "ઘનશ્યામભાઈ કેશવલાલ બલર",
      mobile: "૯૫૮૪૫૭૧૪૦૦",
    },
    {
      gram_panchayat: "શેલણા",
      name: "મહેશભાઈ આણંદુભાઈ જેબલીયા",
      mobile: "૯૪૨૮૪૦૮૬૦૦",
    },
    {
      gram_panchayat: "સાકરપરા",
      name: "ભનુભાઈ પોપટભાઈ પાઘડાળ",
      mobile: "૯૯૦૯૭૮૩૭૩૪",
    },
    {
      gram_panchayat: "સેંજળ",
      name: "નરેશભાઈ ભરતભાઈ ખુમાણ",
      mobile: "૯૭૧૪૧૪૫૬૫૬",
    },
    {
      gram_panchayat: "હાડીડા",
      name: "નજકુભાઈ બદરુંભાઈ ખુમાણ",
      mobile: "૯૫૧૦૮૫૫૨૫૫",
    },
    {
      gram_panchayat: "હાથસણી",
      name: "નિતાબેન સંજયભાઈ ગોહિલ",
      mobile: "૮૧૪૦૨૮૪૮૬૭",
    },
    {
      gram_panchayat: "હિપયવડલી",
      name: "દક્ષાબેન પ્રેશભાઈ કંટારિયા",
      mobile: "૭૬૨૧૦૧૪૯૦૯",
    },
    {
      gram_panchayat: "પીપરડી",
      name: "સાંમતભાઈ સાંઢસુર",
      mobile: "૮૭૮૦૬૩૨૭૭૯",
    },
    {
      gram_panchayat: "કાનાતળાવ",
      name: "એન. પી. ડાભી  (તલાટી કમ મંત્રી,ગાધકડા )",
      mobile: "૮૩૪૭૯૩૨૧૮૪",
    },
    {
      gram_panchayat: "છાપરી",
      name: "ડી એમ બગડા (તલાટી કમ મંત્રી, આદસંગ, ઘ.નગર)",
      mobile: "૮૫૧૧૫૬૧૪૧૯",
    },
    {
      gram_panchayat: "ગાધકડા",
      name: "જે.એન.પરમાર (તલાટી કમ મંત્રી, પીઠવડી )",
      mobile: "૭૨૦૧૦૪૪૩૫૬",
    },
    {
      gram_panchayat: "થોરડી",
      name: "એમ. બી. લાધવા  (તલાટી કમ મંત્રી, પિયાવા)",
      mobile: "૮૧૪૧૪૨૪૩૭૭",
    },
    {
      gram_panchayat: "ભેંકરા",
      name: "પી પી મહેતા (તલાટી કમ મંત્રી, ગીણીયા-બગોયા)",
      mobile: "૯૯૭૯૧૮૭૧૦૦",
    },
    {
      gram_panchayat: "બાઢડા",
      name: "આર. બી. ચાવડા  (તલાટી કમ મંત્રી, ગોરડકા )",
      mobile: "૯૪૨૭૦૩૪૮૭૬",
    },
    {
      gram_panchayat: "નાળ",
      name: "જે. એલ. બારૈયા  (તલાટી કમ મંત્રી, મોટા ભમોદ્રા )",
      mobile: "૯૭૩૭૬૯૧૦૬૯",
    },
    {
      gram_panchayat: "કેદારીયા",
      name: "આર. ડી.ખુમાણ  (તલાટી કમ મંત્રી, લીખાળા )",
      mobile: "૯૯૭૮૭૧૭૮૩૮",
    },
    {
      gram_panchayat: "લુવારા",
      name: "એસ જે ખુમાણ (તલાટી કમ મંત્રી, ડેડકડી, મઢડા)",
      mobile: "૯૯૦૯૨૯૪૫૯૮",
    },
    {
      gram_panchayat: "વિરડી",
      name: "આર.એસ.રમણા (તલાટી કમ મંત્રી, શેલણા )",
      mobile: "૮૧૫૪૯૦૨૧૬૯",
    },
    {
      gram_panchayat: "સીમરણ",
      name: "એચ. કે. પંડયા (તલાટી કમ મંત્રી, મોટા જીંજુડા )",
      mobile: "૯૯૨૪૯૯૪૨૯૩",
    },
    {
      gram_panchayat: "ગણેશગઢ",
      name: "ડી. એચ. પંડયા  (તલાટી કમ મંત્રી,વાંશિયાળી )",
      mobile: "૭૦૪૬૨૯૫૦૩૬",
    },
    {
      gram_panchayat: "ઘનશ્યામનગર",
      name: "સુનિલભાઈ વેગડા (તલાટી કમ મંત્રી,વાંશિયાળી )",
      mobile: "૯૩૨૮૧૬૩૭૨૦",
    },
    {
      gram_panchayat: "ધાર",
      name: "એસ. બી. છોડવડિયા (તલાટી કમ મંત્રી,મેકડા  )",
      mobile: "૯૭૧૪૫૩૬૭૧૧",
    },
    {
      gram_panchayat: "પાટી",
      name: "એચ.એચ.ધાંધલિયા (તલાટી કમ મંત્રી,ઘોબા)",
      mobile: "૯૮૨૪૬૪૯૮૨૫",
    },
    {
      gram_panchayat: "ભુવા",
      name: "જે. જી. જાડેજા (તલાટી કમ મંત્રી,જુના સાવર )",
      mobile: "૯૦૯૯૨૦૧૯૩૨",
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
                  તાલુકા પંચાયત કચેરી - સાવરકુંડલા તા.૦૧/૦૪/૨૦૨૫ની સ્થિતિએ સરપંચ
                  / વહીવટદાર યાદી
                </span>
              </th>
            </tr>

            <tr>
              {[
                "ક્રમ",
                "સરપંચશ્રીનું પુરુ નામ",
                "ગ્રામ-પંચાયત",
                "મોબાઇલ નંબર",
                "રીમાર્કસ",
              ].map((h, i) => (
                <th
                  key={i}
                  style={{
                    whiteSpace: "nowrap",

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
            {structure?.map((row, index) => {
              if (index > 9) {
                return null;
              }

              return (
                <tr key={index}>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting">
                      {toGujaratiNumber(index + 54)}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting">{row?.name || ""}</span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting">
                      {row?.gram_panchayat || ""}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting">{row?.mobile || ""}</span>
                  </td>
                  <td style={{ ...cellStyle, minWidth: "80px" }}></td>
                </tr>
              );
            })}

            <tr>
              <td style={cellStyle} colSpan="5">
                <span
                  className="formatting"
                  style={{ textAlign: "center", fontWeight: "bold" }}
                >
                  વહીવટદાર (તલાટી કમ મંત્રીશ્રીઑ)
                </span>
              </td>
            </tr>

            {structure?.map((row, index) => {
              if (index < 10) {
                return null;
              }

              return (
                <tr key={index}>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting">{index + 54}</span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting">{row?.name || ""}</span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting">
                      {row?.gram_panchayat || ""}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting">{row?.mobile || ""}</span>
                  </td>
                  <td style={{ ...cellStyle, minWidth: "80px" }}></td>
                </tr>
              );
            })}
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
      <div style={{ textAlign: "center", marginTop: "1mm" }}>(પાનાં નં.-૭)</div>
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

export default Page7;
