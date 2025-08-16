import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Report.scss";
import apiPath from "../../isProduction";

const BillView = () => {
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
          Bill/Reciept
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
                  flexDirection: "column",
                  alignItems: "end",
                  width: "100%",
                  paddingInline: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <h3 style={{ fontSize: "1rem" }}>
                    SHAHID KALVA | <span>93764 43146</span>
                  </h3>

                  <h3 style={{ fontSize: "1rem" }}>
                    E-MAIL :-
                    <b style={{ textDecoration: "underline" }}>
                      af.infosys146@gmail.com
                    </b>
                  </h3>
                </div>
              </div>
            </div>

            {/* Names Start */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  textAlign: "center",
                  fontWeight: "800",
                  marginTop: "1rem",
                }}
              >
                A.F. Infosys
              </h2>

              <img
                src="https://afinfosys.netlify.app/logo512.png"
                alt="Logo"
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "35px",
                  width: "120px",
                  borderRadius: "10px",
                }}
              />
            </div>
            {/* Names End */}

            {/* Description */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".1rem",
                padding: "1rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  textAlign: "center",
                  fontWeight: "800",
                }}
              >
                ગ્રામપંચાયત રેવન્યુ (જમા બંધી) વાર્ષીક હિસાબ, આકારહણી સર્વે
              </h3>

              <h3
                style={{
                  fontSize: ".93rem",
                  textAlign: "center",
                  paddingInline: "5rem",
                }}
              >
                પંચાયત કરવેરા ( ૯ / ડી ) રજીસ્ટર, રોજ મેળ, તથા તમામ પ્રકારના
                કોમ્પ્યુટરાઈઝડ તથા પ્રિન્ટીગ કામ માટે માળો
              </h3>

              <h3
                style={{
                  fontSize: ".95rem",
                  textAlign: "center",
                  marginTop: ".5rem",
                }}
              >
                જુના બસ સ્ટેન્ડ, સેન્ટર પોઈન્ટ કોમ્પ્લેક્ષ, સાવરકુંડલા.
              </h3>
              <h3
                style={{
                  fontSize: ".95rem",
                  textAlign: "center",
                }}
              >
                પિન કોડ નં. ૩૬૪૫૧૫ જિ. અમરેલી, (પશ્ચિમ ગુજરાત)
              </h3>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                paddingRight: "1rem",
                justifyContent: "end",
              }}
            >
              <span
                style={{
                  fontSize: ".8rem",
                  textAlign: "right",
                }}
              >
                આ કામ અંગેનો ચેક એ. એફ. ઇન્ફોસીસ નામનો લખવા વિનંતી.
              </span>
            </div>

            <table className="divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{
                      color: "black",
                      background: "#f4f4f4ff",
                      textAlign: "center",
                    }}
                    colSpan="6"
                  >
                    આકારણી રજીસ્ટર કોમ્પ્યુટરાઇઝડ પિન્ટ જોબ વર્કનું બિલ
                    સને.2024/25
                  </th>
                </tr>
              </thead>

              <tr>
                <th
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ padding: "5px", textAlign: "center" }}
                >
                  ક્રમ
                </th>
                <th
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ padding: "5px", textAlign: "center" }}
                >
                  તારીખ
                </th>
                <th
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ padding: "5px", textAlign: "center" }}
                >
                  વિગત
                </th>
                <th
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ padding: "5px", textAlign: "center" }}
                >
                  ઘર
                </th>
                <th
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ padding: "5px", textAlign: "center" }}
                >
                  ભાવ
                </th>
                <th
                  className="text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ padding: "5px", textAlign: "center" }}
                >
                  રૂપિયા
                </th>
              </tr>

              <tbody className="bg-white divide-y divide-gray-200">
                {/* {records.map((record, index) => {
                  return ( */}
                <tr>
                  <td
                    className="px-1 py-1 whitespace-nowrap text-sm font-medium text-gray-900"
                    style={{
                      maxWidth: "10px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    1{" "}
                  </td>
                  <td
                    className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                    style={{
                      maxWidth: "10px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    3/3/2025
                  </td>{" "}
                  <td
                    className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                    style={{
                      maxWidth: "200px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    નાના ઝીંઝુડા ગામની મકાન આકારણી સર્વે, વર્ષ:- 2025/26 નું ગામ
                    નમુના નં. ૮ આકારણી રજીસ્ટર ઘેર ઘેર જઇને બનાવી અને ગા.ન.ન.-
                    ૯/ ડી કરવેરા રજીસ્ટર બનાવિ કોમ્પ્યુટરાઈઝડ પ્રિન્ટ સાથે
                    સ્પાઇરલ બાઈન્ડિંગ સાથે ઓનલાઈન ગ્રામ સુવિધા પોર્ટલમાં
                    ડેટાએન્ટ્રી સાથે જોબવર્ક/મજુરીથી કમ્પલેટ અદ્યતન બનાવેલ
                  </td>
                  <td
                    className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                    style={{
                      maxWidth: "30px",

                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    397
                  </td>
                  <td
                    className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                    style={{
                      maxWidth: "50px",

                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    55
                  </td>
                  <td
                    className="px-1 py-1 whitespace-normal text-sm text-gray-500"
                    style={{
                      maxWidth: "30px",
                      padding: "5px",
                      textAlign: "center",
                    }}
                  >
                    {(397 * 55.0).toString().padEnd(2, "0")}
                  </td>
                </tr>
                {/* );
                })} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillView;
