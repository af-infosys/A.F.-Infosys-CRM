import LOGOpng from "../../../assets/logo.png";
import toGujaratiNumber from "../../../components/toGujaratiNumber";

const Page4 = ({ data }) => {
  const structure = [
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

  const structure2 = [
    {
      gram_panchayat: "અભરામપરા",
      name: "શામજીભાઈ પીઠાભાઈ બગડા",
      mobile: "૯૩૧૬૮૧૯૯૧૦",
    },
    {
      gram_panchayat: "અમૃતવેલ",
      name: "ગજરાબેન પ્રતાપભાઈ ખુમાણ",
      mobile: "૯૮૭૯૮૬૦૧૩૧",
    },
    {
      gram_panchayat: "આંબરડી",
      name: "પ્રેમજીભાઈ લાખાભાઈ બગડા",
      mobile: "૯૪૨૭૮૦૬૬૪૩",
    },
    {
      gram_panchayat: "આકોલડા",
      name: "રાયબાઈબેન દડુભાઈ ખુમાણ",
      mobile: "૯૬૬૨૬૪૩૬૩૦",
    },
    {
      gram_panchayat: "આદસંગ",
      name: "ચંદ્રાબેન લખુભાઈ ચાંદુ",
      mobile: "૮૩૪૭૫૨૪૭૫૯",
    },
    {
      gram_panchayat: "ઓળીયા",
      name: "અંજુબેન પ્રકાશભાઈ બગડા",
      mobile: "૮૧૨૮૨૬૮૩૬૯",
    },
    {
      gram_panchayat: "કરજાળા",
      name: "દયાબેન કરમશીભાઈ કાથરોટીયા",
      mobile: "૯૯૧૩૧૫૨૩૧૯",
    },
    {
      gram_panchayat: "કૃષ્ણગઢ",
      name: "હર્ષદભાઈ કનુભાઈ મુંજપરા",
      mobile: "૯૪૨૯૧૮૪૬૫૨",
    },
    {
      gram_panchayat: "કેરાળા",
      name: "કાળુભાઈ પહુંભાઈ જેબલિયા (ઉપસરપંચ, ઈ.ચા)",
      mobile: "૯૯૨૫૯૭૭૫૨૬",
    },
    {
      gram_panchayat: "ખડકાળા",
      name: "ચંદ્રાબેન ભગવાનભાઈ ખુમાણ",
      mobile: "૭૦૪૬૩૬૪૬૨૭",
    },
    {
      gram_panchayat: "ખડસલી",
      name: "શિલ્પાબેન ચેતનભાઈ માલાણી",
      mobile: "૯૩૨૭૭૦૧૦૩૯",
    },
    {
      gram_panchayat: "ખાલપર",
      name: "ભાવેશભાઈ પ્રાગજીભાઈ શિરોયા",
      mobile: "૯૫૮૬૫૧૧૧૮૨",
    },
    {
      gram_panchayat: "ખોડીયાણા",
      name: "કાનજીભાઈ ભાયાભાઈ બગડા",
      mobile: "૯૦૨૩૪૪૧૩૦૫",
    },
    {
      gram_panchayat: "ગોરડકા",
      name: "માધવભાઈ જહાભાઈ લાડુમોર",
      mobile: "૯૭૨૩૫૩૦૫૨૪",
    },
    {
      gram_panchayat: "ઘજડી",
      name: "ભાવનાબેન ભરતભાઈ ધડુક",
      mobile: "૯૮૭૯૮૧૯૭૧૨",
    },
    {
      gram_panchayat: "ઘાંણલા",
      name: "જયાબેન કાળુભાઈ કાતરીયા",
      mobile: "૯૫૮૬૧૮૬૬૧૩",
    },
    {
      gram_panchayat: "ઘોબા",
      name: "ઈલાબેન પ્રતાપભાઈ પટગીર",
      mobile: "૯૯૭૯૯૫૫૨૨૨",
    },
    {
      gram_panchayat: "ચરખડીયા",
      name: "મોનીકાબેન હિરેનભાઈ કાછડિયા",
      mobile: "૯૯૦૯૩૬૯૯૭૫",
    },
    {
      gram_panchayat: "ચીખલી",
      name: "અમિતાબેન ભીખુભાઈ વાઘમશી",
      mobile: "૯૯૦૯૪૭૧૧૨૫",
    },
    {
      gram_panchayat: "જાંબુડા",
      name: "ઘુસાભાઈ કાનાભાઈ વાણીયા",
      mobile: "૯૯૭૮૦૪૮૨૧૦",
    },
    {
      gram_panchayat: "જાબાળ",
      name: "જયદીપભાઈ પ્રતાપભાઈ ખુમાણ",
      mobile: "૯૭૧૪૪૧૯૧૧૯",
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
                <td style={{ ...cellStyle, textAlign: "left" }}>
                  <span className="formatting">
                    {toGujaratiNumber(index + 30)}
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
            {structure2?.map((row, index) => (
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
      <div style={{ textAlign: "center", marginTop: "3mm" }}>(પાનાં નં.-૪)</div>
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
