import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Report.scss";
import apiPath from "../../isProduction";

const OrderValuationReport = () => {
  const records = [
    "કાચા ગાર માટી રૂમ ૧ ની કિંમત",
    "નળીયા, પતરા, પીઢીયા, પાકા રૂમ ૧ ની કિંમત",
    "પાકા સ્લેબવાળા રૂમ ૧ ની કિંમત",
    "માલ ઢોર નું ઢાળીયુ પતરા નું ત્થા વાહન રાખવાની જગ્‍યા",
    "કાચા જર્જરીત બંધ પડતર રૂમ ૧ ની કિંમત",
    "પાકા જર્જરીત બંધ પડતર રૂમ ૧ ની કિંમત",
    "કેબીન, પાલા, કાચી દુકાન, ૧ ની કિંમત",
    "પાકી દુકાન ૧ ની કિંમત",
    "ગોડાઉન ૧ ની કિંમત",
    "હોલ ૧ ની કિંમત",
    "શેડ ૧ ની કિંમત",
    "ખુલ્લો પ્લોટ ની કિંમત",
    "હિરાના કારખાના નાના",
    "હિરાના કારખાના મોટા",
    "મોબાઇલ ટાવર",
    "પેટ્રોલ પંપ, ગેસ પંપ",
    "હોટલ, રેસ્‍ટોરેન્‍ટ, લોજ હાઇવે પર",
    "કોટન કપાસ નું જીનીંગ",
    "તેલ ની ઘાણી ઓઇલ મીલ",
    "કારખાના, ફેકટરી, કંપ્‍ની, ઇન્‍ડસ્‍ટીજ",
    "કોલ્‍ડ સ્‍ટોરેજ",
    "લાતી / બેન્‍સો લાકડાનો",
    "વે બ્રિજ તોલ માપ કાટો વાહન માટેનો",
    "",
    "",
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const background = "#333";

  const alphaIndex = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const totalHouses = 7;

  const taxes = [
    { description: "સામાન્ય પાણી વેરો", amount: 23 },
    { description: "ખાસ પાણી નળ વેરો", amount: 23 },
    { description: "સફાઇ વેરો", amount: 23 },
    { description: "દીવાબતી લાઈટ વેરો", amount: 23 },
    { description: "અન્ય વેરો", amount: 23 },
  ];
  return (
    <>
      <div
        className="container mx-auto p-2 sm:p-6 lg:p-8"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyConten: "center",
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Order Valuation Report{" "}
        </h1>

        <h2 className="text-xl text-center text-gray-600">Owner & Sales</h2>
        <h2 className="text-xl text-center mb-8 text-gray-600">
          by - A.F. Infosys
        </h2>

        {/* Report - 1 */}
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="table-container rounded-lg shadow-md border border-gray-200"
            style={{
              width: "600px",
              padding: "1rem",
              background: "#fff",
            }}
          >
            <div
              className="flex justify-between items-center mb-4"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingInline: "1rem",
                }}
              >
                <h3 style={{ fontSize: "1rem" }}>
                  અંદાજીત ઘર ની સંખ્યા :– <b>{totalHouses}</b>
                </h3>

                <h3 style={{ fontSize: "1rem" }}>
                  TBR <b>{""}</b>
                </h3>

                <h3 style={{ fontSize: "1rem" }}>
                  <b style={{ textDecoration: "underline" }}>{"Demo"}</b> ગ્રામ
                  પંચાયત કચેરી
                </h3>
              </div>
            </div>

            {/* Names Start */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: ".1rem" }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                }}
              >
                સરપંચશ્રીનું પુરૂ નામ તથા મો.નં. <b>{"Test"}</b>
              </h2>

              <h2
                style={{
                  fontSize: "1.1rem",
                }}
              >
                તલાટી કમ મંત્રીશ્રીનું પુરૂ નામ તથા મો.નં. <b>{"Test"}</b>
              </h2>

              <h2
                style={{
                  fontSize: "1.1rem",
                }}
              >
                સાથે રહેનાર વ્યકિતનું પુરૂ નામ તથા મો.નં. <b>{"Test"}</b>
              </h2>
            </div>
            {/* Names End */}

            <br />

            <table className="divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      color: "white",
                      background: background,
                      textAlign: "center",
                    }}
                    colSpan="6"
                  >
                    Order રીપોર્ટ – : : ઑર્ડર રીપોર્ટ આકાર (વેલ્યુએશન) રીપોર્ટ :
                    : –
                  </th>
                </tr>
              </thead>

              {/* <tr>
              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                રૂમ દિઠ કિમત મુકવી
              </th>

              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                મકાન દિઠ કિમત લેવી
              </th>

              <th className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                વાર્ષિક ભાડા રૂપી આકારણી
              </th>
            </tr> */}

              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, index) => {
                  return (
                    <tr key={index}>
                      <td
                        className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-900"
                        style={{ maxWidth: "10px" }}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                        style={{ maxWidth: "10px" }}
                      >
                        {alphaIndex[index]}
                      </td>{" "}
                      <td
                        className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                        style={{ maxWidth: "200px" }}
                      >
                        {record}
                      </td>
                      <td
                        className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                        style={{ maxWidth: "30px" }}
                      >
                        ....
                      </td>
                      <td
                        className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                        style={{ maxWidth: "50px" }}
                      >
                        વેરો રૂ।.
                      </td>
                      <td
                        className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                        style={{ maxWidth: "30px" }}
                      >
                        ....
                      </td>
                    </tr>
                  );
                })}

                {records.length === 0 && !loading && !error && (
                  <tr>
                    <td
                      colSpan="25"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No Data Found!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <br />

        {/* Report - 2 */}
        <div
          style={{
            maxWidth: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            className="table-container rounded-lg shadow-md border border-gray-200"
            style={{
              width: "600px",
              padding: "1rem",
              background: "#fff",
            }}
          >
            <div
              className="flex justify-between items-center mb-4"
              style={{ width: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingInline: "1rem",
                }}
              >
                <h3 style={{ fontSize: "1rem" }}>
                  ગામ :- <b>{"Gaam"}</b>
                </h3>

                <h3 style={{ fontSize: "1rem" }}>
                  તાલુકો :- <b>{"Taluko"}</b>
                </h3>

                <h3 style={{ fontSize: "1rem" }}>
                  જિલ્લો :- <b>{"Jillo"}</b>
                </h3>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".1rem",
                padding: ".5rem",
                borderRadius: "10px",
                background: "#f4f4f4ff",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  width: "100%",
                  textAlign: "center",
                  border: "1px solid #707174",
                  borderRadius: "5px",
                  marginBottom: ".5rem",
                }}
              >
                અન્ય વેરા
              </h2>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {taxes?.map((tax, index) => {
                  return (
                    <span>
                      ({index + 1}) {tax?.description} રૂ।. <b>{tax?.amount}</b>
                    </span>
                  );
                })}
              </div>
            </div>

            <br />

            {/* Order Report */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".1rem",
                padding: ".5rem",
                borderRadius: "10px",
                background: "#ffffffff",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  width: "100%",
                  textAlign: "center",
                  border: "1px solid #707174",
                  borderRadius: "5px",
                  marginBottom: ".5rem",
                }}
              >
                ઑર્ડર રીપોર્ટ આકાર (વેલ્યુએશન) રીપોર્ટ મિલ્કત આકારણી સર્વેની
                અન્ય વિગત
              </h2>

              <p>
                ગુજરાત પંચાયત ધારા ની કલમ ૨૦૦ મુજબ ગ્રામ પંચાયતને દર ચાર વર્ષે
                આકારણી સર્વે કરવું ફરજીયાત છે. આપણા ગામની પંચાયતની આકારણી મુદત
                પૂર્ણ થઇ ગઈ હોય તો આજની ગ્રામ પંચાયત ની સામાન્ય બેઠક ની તા.{" "}
                {"          "} ના રોજ બેઠક નંબર {".................."} {" , "}
                મુદ્દા નં. {".............."} {" , "}
                ઠરાવ નં. {"............."} થી મિલ્કત આકારણી સર્વેની કામગીરી કરી
                આપવા પાટીને નક્કી માં આવ્યું.
              </p>

              <p style={{ marginTop: "1rem" }}>
                આ આકારણી સર્વેનું કામ શરૂ કરતા પહેલા પંચાયત ના ત.ક.મ. તથા
                સરપંચશ્રી અને આકારણી કમિટીના સભ્યો, પટટાવાળા, વાલમેન સાથે રહિને
                સર્વે કરનાર એજન્સી ને કામ શરૂ કરવાનું રહેશે આકારણીસર્વે ગામ ની
                તમામ મિલકતનૈ રૂબરૂ માં સ્થળ તપાસ કરી આકારણી રજીસ્ટર તથા કરવેરા
                માંગણા રજિ. અને કરવેરા તારીજ પત્રક તેમજ પાનોતરી તથા આકારણી ને
                લગત તમામ પ્રકાર નું રેકડ કોમ્પ્યુટરાઇઝડ સ્પાઈરલ બાઇનડીંગ સાથે
                અધ્યતન તેયાર કરી આપવાનું રહેશે.
              </p>

              <p style={{ marginTop: "1rem" }}>
                સબબ કામગીરી એ.એફ.ઇન્ફોસીસ - સાવરકુંડલા ના ભાવ - એક મિલ્કત દિઠ
                રૂ। {"..................."} શબ્દો માં અંકે રૂપીયા{" "}
                {"....................................."} ભાવ મંજુર કરેલ છે જે
                આજની પંચાયત ની સામાન્ય બેઠક માં બહાલી આપી.
              </p>
            </div>

            <br />

            {/* Vigat Start */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: ".1rem" }}
            >
              {/* Section 1 */}

              <h2 style={{ fontSize: "1.2rem", textDecoration: "underline" }}>
                વિસ્તારની વિગત : : -
              </h2>

              <h2
                style={{
                  fontSize: "1.1rem",
                }}
              >
                પહેલા વિસ્તાર/શેરી મહોલ્લો કયા થી શરૂ કરવો :- <b>{"Test"}</b>
              </h2>

              <h2
                style={{
                  fontSize: "1.1rem",
                }}
              >
                આકારણી સર્વે કામ પહેલી મિલ્કત/ઘર કોની લખવી : - <b>{"Test"}</b>
              </h2>

              {/* Section 2 */}
              <h2
                style={{
                  fontSize: "1.2rem",
                  textDecoration: "underline",
                  marginTop: ".8rem",
                }}
              >
                પાણી ની વિગત : : -
              </h2>
              <h2
                style={{
                  fontSize: "1.1rem",
                }}
              >
                જે મિલ્‍કત માં નળ હોય તેમા સામાન્‍ય પાણી વેરો લેવો કે નહી ?{" "}
                <b>{"Test"}</b>
              </h2>

              <h2
                style={{
                  fontSize: "1.1rem",
                }}
              >
                ખાસ પાણી નળ વેરો ત્થા સા.પાણી વેરો બન્‍ને વેરા મુકવા કે ફકત એક જ
                વેરો લેવો. <b>{"Test"}</b>
              </h2>
            </div>
            {/* Vigat End */}

            <br />
            <br />

            <div style={{ padding: "1rem" }}>
              <h2
                style={{
                  fontSize: "1.2rem",
                  textDecoration: "underline",
                  marginBottom: ".5rem",
                }}
              >
                નોધ ::-{" "}
              </h2>
              <p>
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here', making it look like readable English. Many
                desktop publishing packages and web page editors now use Lorem
                Ipsum as their default model text, and a search for 'lorem
                ipsum' will uncover many web sites still in their infancy.
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose (injected humour and the like).
              </p>
            </div>

            <br />
            <br />

            {/* Footer & Signature */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                paddingBottom: "2rem",
              }}
            >
              {/* TCM */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>
                  સહિ. <b>........</b>
                </span>

                <span>
                  ત.ક.મ.નું પુરૂ નામ
                  <b
                    style={{
                      display: "block",
                      marginTop: ".8rem",
                    }}
                  >
                    ................................
                  </b>
                </span>

                <br />
                <span>ત.ક.મ.નો સિક્કો</span>
              </div>

              {/* Sarpanch */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>
                  સહિ. <b>........</b>
                </span>

                <span>
                  સરપંચનું પુરૂ નામ
                  <b
                    style={{
                      display: "block",
                      marginTop: ".8rem",
                    }}
                  >
                    ................................
                  </b>
                </span>

                <br />
                <span>સરપંચ નો સિક્કો</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderValuationReport;
