import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page6 = ({ data }) => {
  const structure = [
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
  ];

  const structure2 = [
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
                <td style={{ ...cellStyle, textAlign: "left" }}>
                  <span className="formatting">
                    {toGujaratiNumber(index + 49)}
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
            ))}
          </tbody>
        </table>
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

            {structure2?.map((row, index) => {
              if (index < 10) {
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
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: "1mm" }}>(પાનાં નં.-૬)</div>
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
