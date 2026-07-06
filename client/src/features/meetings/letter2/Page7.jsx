import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page7 = ({ data }) => {
  const structure2 = [
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "જાફરાબાદ",
      jillo: "અમરેલી",
      date: "27-12-2018",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "લીલીયા",
      jillo: "અમરેલી",
      date: "03-01-2019",
    },
    {
      role: "લીલીયા તાલુકા તલાટી કમ મંત્રી મંડળ",
      taluka: "લીલીયા",
      jillo: "અમરેલી",
      date: "03-01-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "અમરેલી",
      jillo: "અમરેલી",
      date: "03-01-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "બાબરા",
      jillo: "અમરેલી",
      date: "10-01-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "લાઠી",
      jillo: "અમરેલી",
      date: "17-01-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "જેતપુર",
      jillo: "રાજકોટ",
      date: "24-01-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "ધારી",
      jillo: "અમરેલી",
      date: "31-01-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "પાલીતાણા",
      jillo: "ભાવનગર",
      date: "02-02-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "વિસાવદર",
      jillo: "જુનાગઢ",
      date: "05-02-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "કુંકાવાવ",
      jillo: "અમરેલી",
      date: "07-02-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "ખાંભા",
      jillo: "અમરેલી",
      date: "28-02-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "ઉના",
      jillo: "ગીર સોમનાથ",
      date: "27-06-2019",
    },
    {
      role: "તાલુકા વિકાસ અધિકારી સાહેબશ્રી",
      taluka: "બગસરા",
      jillo: "અમરેલી",
      date: "31-11-2019",
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
            {/* <tr>
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
            </tr> */}

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
                        ? "180px"
                        : i === 2
                          ? "105px"
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
            {structure2?.map((row, index) => {
              return (
                <tr key={index}>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting" style={{ fontSize: "15px" }}>
                      {toGujaratiNumber(index + 1)}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting" style={{ fontSize: "15px" }}>
                      {row?.role || ""}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting" style={{ fontSize: "15px" }}>
                      {row?.taluka || ""}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "left" }}>
                    <span className="formatting" style={{ fontSize: "15px" }}>
                      {row?.jillo || ""}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, minWidth: "80px" }}>
                    <span className="formatting" style={{ fontSize: "15px" }}>
                      {row?.date || ""}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p
        style={{
          marginBottom: "5mm",
          textAlign: "justify",
          textIndent: "15mm",
        }}
      >
        ઉપરોક્ત યાદી મુજબ જુદી/જુદી તાલુકા પંચાયત કચેરી માં અમારી સંસ્થા એ. એફ.
        ઈન્ફોસીસ ધ્વારા તલાટી કમ મંત્રી મીટીંગમાં ખાસ પ્રકારનું પ્રેજન્ટેશન આપેલ
        છે જે આપ સાહેબ ને વિદીત થાય.
      </p>

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
