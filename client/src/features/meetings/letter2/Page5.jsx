import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page5 = ({ data }) => {
  const structure = [
    {
      gram_panchayat: "જીરા",
      name: "દક્ષાબેન ધર્મેશભાઈ ચોડવડિયા",
      mobile: "૯૮૭૯૭૨૧૭૩૫",
    },
    {
      gram_panchayat: "જુના સાવર",
      name: "કલ્પેશભાઈ પ્રવિણભાઈ કાનાણી",
      mobile: "૯૨૬૫૯૬૪૦૦૫",
    },
    {
      gram_panchayat: "જેજાદ",
      name: "ગીતાબેન બાબુભાઈ વાઘેલા",
      mobile: "૯૮૭૯૩૮૯૨૧૨",
    },
    {
      gram_panchayat: "ઠવી",
      name: "દેવજીભાઈ લાલજીભાઈ કાછડિયા",
      mobile: "૯૯૨૫૯૬૬૫૦૧",
    },
    {
      gram_panchayat: "ડેડકડી",
      name: "શીતલબેન નિલેશભાઈ ઘેવરીયા",
      mobile: "૭૬૯૮૬૨૦૭૯૦",
    },
    {
      gram_panchayat: "દાઘીયા",
      name: "ગીતાબેન પ્રદિપભાઈ ભાલાળા",
      mobile: "૭૯૯૦૮૯૩૭૦૭",
    },
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
                    {toGujaratiNumber(index + 22)}
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

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: "-4mm" }}>
        (પાનાં નં.-૫)
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

export default Page5;
