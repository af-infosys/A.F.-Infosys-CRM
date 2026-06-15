import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page6 = ({ data }) => {
  const structure = [
    {
      gram_panchayat: "દેતડ઼",
      name: "ભાવનાબેન જયંતીભાઈ ગોઠડીયા",
      mobile: "૯૬૩૮૪૫૭૧૫૯",
    },
    {
      gram_panchayat: "દોલતી",
      name: "ચતુરાબેન કાળાભાઈ વાઘમશી",
      mobile: "૯૯૭૯૩૭૭૯૧૧",
    },
    {
      gram_panchayat: "નાના ઝીંઝુડા",
      name: "ભરતભાઈ લલ્લુભાઈ સુદાણી",
      mobile: "૯૮૨૫૪૭૩૨૮૧",
    },
    {
      gram_panchayat: "નાના ભમોદ્રા",
      name: "ભરતભાઈ બાબુભાઈ કથીરીયા",
      mobile: "૯૪૨૬૪૫૬૯૭૩",
    },
    {
      gram_panchayat: "નાની વડાળ",
      name: "લાભુબેન રણછોડભાઈ પુભડીયા",
      mobile: "૬૩૫૪૭૭૧૩૨૦",
    },
    {
      gram_panchayat: "નેસડી",
      name: "કરશનભાઈ નાનજીભાઈ વઘાસીયા",
      mobile: "૯૯૭૪૫૩૭૫૩૦",
    },
    {
      gram_panchayat: "પીઠવડી",
      name: "ભૌતિકભાઈ મનસુખભાઈ સુહાગીયા",
      mobile: "૯૭૩૭૮૫૯૧૯૩",
    },
    {
      gram_panchayat: "પીયાવા",
      name: "શીવરાજભાઈ જીલુંભાઈ મૈત્રા",
      mobile: "૯૮૭૯૮૯૮૭૯૮",
    },
    {
      gram_panchayat: "ફાચરીયા",
      name: "રંજનબેન અરવિંદભાઈ રામાણી",
      mobile: "૯૯૯૮૯૫૦૧૧૬",
    },
    {
      gram_panchayat: "ફીફાદ",
      name: "રેખાબેન દિપકભાઈ રાણપરીયા",
      mobile: "૯૬૩૮૦૧૪૩૫૮",
    },
    {
      gram_panchayat: "બગોયા",
      name: "યાસ્મીનબેન મન્સૂરશા શેખ",
      mobile: "૯૯૨૫૧૮૫૦૯૮",
    },
    {
      gram_panchayat: "બોરાળા",
      name: "કંચનબેન અતુલભાઈ રાદડીયા",
      mobile: "૭૨૮૪૮૮૨૮૧૮",
    },
    {
      gram_panchayat: "ભમર",
      name: "મોદબાઈબેન બચુભાઈ ભૂકણ",
      mobile: "૯૭૭૩૧૦૯૦૭૨",
    },
    {
      gram_panchayat: "ભોકરવા",
      name: "ધૃતિબેન દાનુભાઈ મોરી",
      mobile: "૯૯૦૪૭૮૫૬૨૧",
    },
    {
      gram_panchayat: "મઢડા",
      name: "નાજાભાઈ કરશનભાઈ સરવૈયા",
      mobile: "૯૯૨૪૪૫૮૦૬૩",
    },
    {
      gram_panchayat: "મીતીયાળા",
      name: "મનસુખભાઈ સાદુળભાઈ મોલાડીયા",
      mobile: "૯૭૨૫૫૦૮૯૮૧",
    },
    {
      gram_panchayat: "મેકડા",
      name: "લાખાભાઈ સુરાભાઈ સાટીયા",
      mobile: "૯૮૭૯૦૯૬૦૭૧",
    },
    {
      gram_panchayat: "મેરીયાણા",
      name: "હિતેશભાઈ મનસુખભાઈ ખાત્રાણી",
      mobile: "૯૩૨૭૭૪૫૭૨૦",
    },
    {
      gram_panchayat: "મેવાસા",
      name: "રઘુવીરભાઈ મંગળુભાઈ ખુમાણ",
      mobile: "૯૫૩૭૩૯૫૭૭૧",
    },
    {
      gram_panchayat: "મોટા ઝીંઝુડા",
      name: "પંકજકુમાર વલ્લભભાઈ ઉનાવા",
      mobile: "૭૬૦૦૨૮૦૦૭૪",
    },
    {
      gram_panchayat: "મોટા ભમોદ્રા",
      name: "સરસ્વતીબેન ભાવેશભાઈ ખૂટ",
      mobile: "૯૭૧૪૪૧૮૯૯૬",
    },
    {
      gram_panchayat: "મોલડી",
      name: "રમેશભાઈ તેજાભાઈ સાવલીયા",
      mobile: "૯૭૨૫૨૮૫૮૧૬",
    },
    {
      gram_panchayat: "રામગઢ",
      name: "ભાભલુભાઈ દેવકુંભાઈ ખુમાણ",
      mobile: "૯૯૭૮૭૮૪૦૯૪",
    },
    {
      gram_panchayat: "લીખાળા",
      name: "મનસુખભાઈ સવજીભાઈ સાવલિયા",
      mobile: "૯૯૭૯૧૪૪૫૧૯",
    },
    {
      gram_panchayat: "વંડા",
      name: "વાલાભાઈ ગોકુળભાઈ સાટીયા",
      mobile: "૯૭૨૭૧૮૦૫૭૪",
    },
    {
      gram_panchayat: "વણોટ",
      name: "જિગ્નેશભાઈ નાગભાઈ કાછડ",
      mobile: "૯૬૬૨૯૧૯૧૮૩",
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
            {structure?.map((row, index) => (
              <tr key={index}>
                <td style={cellStyle}>
                  <span className="formatting">
                    {toGujaratiNumber(index + 28)}
                  </span>
                </td>
                <td style={cellStyle}>
                  <span className="formatting">{row?.name || ""}</span>
                </td>
                <td style={cellStyle}>
                  <span className="formatting">
                    {row?.gram_panchayat || ""}
                  </span>
                </td>
                <td style={cellStyle}>
                  <span className="formatting">{row?.mobile || ""}</span>
                </td>
                <td style={{ ...cellStyle, minWidth: "80px" }}></td>
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

export default Page6;
