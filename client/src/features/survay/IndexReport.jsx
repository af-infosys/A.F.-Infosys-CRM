import React, { useEffect, useState } from "react";
import apiPath from "../../isProduction";

import "./IndexReport.scss";

// The main component for the analytics report
const IndexReport = () => {
  // Use state to manage all the report data

  const village = "મેઘરજ";
  const taluka = "મેઘરજ";
  const district = "અરવલ્લી";

  const [records, setRecords] = useState([]);

  // Function to fetch dynamic data from an API
  const fetchRecords = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/sheet`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      // Sort records by owner name (index 3)
      const sortedRecords = [...result.data].sort((a, b) => {
        const nameA = a[3]?.toString().toLowerCase() || "";
        const nameB = b[3]?.toString().toLowerCase() || "";
        return nameA.localeCompare(nameB, "gu", { sensitivity: "base" });
      });

      setRecords(sortedRecords);
    } catch (err) {
      console.error("Error fetching records:", err);
      console.log("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  const [societies, setSocieties] = useState([]);
  const fetchAreas = async () => {
    try {
      const response = await fetch(`${await apiPath()}/api/sheet/areas`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setSocieties(result.data); // Set the fetched areas to state
    } catch (err) {
      console.error("Error fetching areas:", err);
      alert("વિસ્તારો લાવવામાં નિષ્ફળ.");
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchAreas();
  }, []);

  const background = "#007bff";

  // Function to determine the Gujarati letter for a name
  const getGujaratiInitial = (name) => {
    if (!name) return "";
    const firstChar = name.charAt(0);
    // A more comprehensive mapping for Gujarati alphabet.
    const alphabetMap = {
      અ: ["અ", "આ", "ઇ", "ઈ", "ઉ", "ઊ", "ઋ", "એ", "ઐ", "ઓ", "ઔ"],
      ક: ["ક", "કા", "કી", "કુ", "કૂ", "કૃ", "કે", "કૈ", "કો", "કૌ"],
      ખ: ["ખ", "ખા", "ખી", "ખુ", "ખૂ", "ખૃ", "ખે", "ખૈ", "ખો", "ખૌ"],
      ગ: ["ગ", "ગા", "ગી", "ગુ", "ગૂ", "ગૃ", "ગે", "ગૈ", "ગો", "ગૌ"],
      ઘ: ["ઘ", "ઘા", "ઘી", "ઘુ", "ઘૂ", "ઘૃ", "ઘે", "ઘૈ", "ઘો", "ઘૌ"],
      ચ: ["ચ", "ચા", "ચી", "ચુ", "ચૂ", "ચૃ", "ચે", "ચૈ", "ચો", "ચૌ"],
      છ: ["છ", "છા", "છી", "છુ", "છૂ", "છૃ", "છે", "છૈ", "છો", "છૌ"],
      જ: ["જ", "જા", "જી", "જુ", "જૂ", "જૃ", "જે", "જૈ", "જો", "જૌ"],
      ઝ: ["ઝ", "ઝા", "ઝી", "ઝુ", "ઝૂ", "ઝૃ", "ઝે", "ઝૈ", "ઝો", "ઝૌ"],
      ટ: ["ટ", "ટા", "ટી", "ટુ", "ટૂ", "ટૃ", "ટે", "ટૈ", "ટો", "ટૌ"],
      ઠ: ["ઠ", "ઠા", "ઠી", "ઠુ", "ઠૂ", "ઠૃ", "ઠે", "ઠૈ", "ઠો", "ઠૌ"],
      ડ: ["ડ", "ડા", "ડી", "ડુ", "ડૂ", "ડૃ", "ડે", "ડૈ", "ડો", "ડૌ"],
      ઢ: ["ઢ", "ઢા", "ઢી", "ઢુ", "ઢૂ", "ઢૃ", "ઢે", "ઢૈ", "ઢો", "ઢૌ"],
      ણ: ["ણ", "ણા", "ણી", "ણુ", "ણૂ", "ણૃ", "ણે", "ણૈ", "ણો", "ણૌ"],
      ત: ["ત", "તા", "તી", "તુ", "તૂ", "તૃ", "તે", "તૈ", "તો", "તૌ"],
      થ: ["થ", "થા", "થી", "થુ", "થૂ", "થૃ", "થે", "થૈ", "થો", "થૌ"],
      દ: ["દ", "દા", "દી", "દુ", "દૂ", "દૃ", "દે", "દૈ", "દો", "દૌ"],
      ધ: ["ધ", "ધા", "ધી", "ધુ", "ધૂ", "ધૃ", "ધે", "ધૈ", "ધો", "ધૌ"],
      ન: ["ન", "ના", "ની", "નુ", "નૂ", "નૃ", "ને", "નૈ", "નો", "નૌ"],
      પ: ["પ", "પા", "પી", "પુ", "પૂ", "પૃ", "પે", "પૈ", "પો", "પૌ"],
      ફ: ["ફ", "ફા", "ફી", "ફુ", "ફૂ", "ફૃ", "ફે", "ફૈ", "ફો", "ફૌ"],
      બ: ["બ", "બા", "બી", "બુ", "બૂ", "બૃ", "બે", "બૈ", "બો", "બૌ"],
      ભ: ["ભ", "ભા", "ભી", "ભુ", "ભૂ", "ભૃ", "ભે", "ભૈ", "ભો", "ભૌ"],
      મ: ["મ", "મા", "મી", "મુ", "મૂ", "મૃ", "મે", "મૈ", "મો", "મૌ"],
      ય: ["ય", "યા", "યી", "યુ", "યૂ", "યૃ", "યે", "યૈ", "યો", "યૌ"],
      ર: ["ર", "રા", "રી", "રુ", "રૂ", "રૃ", "રે", "રૈ", "રો", "રૌ"],
      લ: ["લ", "લા", "લી", "લુ", "લૂ", "લૃ", "લે", "લૈ", "લો", "લૌ"],
      વ: ["વ", "વા", "વી", "વુ", "વૂ", "વૃ", "વે", "વૈ", "વો", "વૌ"],
      શ: ["શ", "શા", "શી", "શુ", "શૂ", "શૃ", "શે", "શૈ", "શો", "શૌ"],
      ષ: ["ષ", "ષા", "ષી", "ષુ", "ષૂ", "ષૃ", "ષે", "ષૈ", "ષો", "ષૌ"],
      સ: ["સ", "સા", "સી", "સુ", "સૂ", "સૃ", "સે", "સૈ", "સો", "સૌ"],
      હ: ["હ", "હા", "હી", "હુ", "હૂ", "હૃ", "હે", "હૈ", "હો", "હૌ"],
      ળ: ["ળ", "ળા", "ળી", "ળુ", "ળૂ", "ળૃ", "ળે", "ળૈ", "ળો", "ળૌ"],
      ક્ષ: [
        "ક્ષ",
        "ક્ષા",
        "ક્ષિ",
        "ક્ષી",
        "ક્ષુ",
        "ક્ષૂ",
        "ક્ષૃ",
        "ક્ષે",
        "ક્ષૈ",
        "ક્ષો",
        "ક્ષૌ",
      ],
      જ્ઞ: [
        "જ્ઞ",
        "જ્ઞા",
        "જ્ઞિ",
        "જ્ઞી",
        "જ્ઞુ",
        "જ્ઞૂ",
        "જ્ઞૃ",
        "જ્ઞે",
        "જ્ઞૈ",
        "જ્ઞો",
        "જ્ઞૌ",
      ],
      ત્ર: [
        "ત્ર",
        "ત્રા",
        "ત્રિ",
        "ત્રી",
        "ત્રુ",
        "ત્રૂ",
        "ત્રૃ",
        "ત્રે",
        "ત્રૈ",
        "ત્રો",
        "ત્રૌ",
      ],
    };

    for (const key in alphabetMap) {
      if (alphabetMap[key].includes(firstChar)) {
        return key;
      }
    }
    return "";
  };

  // Group records by their Gujarati initial
  const groupedRecords = records.reduce((acc, record) => {
    const initial = getGujaratiInitial(record[3]); // Assuming name is at index 3
    if (initial) {
      if (!acc[initial]) {
        acc[initial] = [];
      }
      acc[initial].push(record);
    }
    return acc;
  }, {});

  const sortedKeys = Object.keys(groupedRecords).sort((a, b) =>
    a.localeCompare(b, "gu", { sensitivity: "base" })
  );

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 bg-gray-100 min-h-screen font-sans">
      {/* Report container for PDF generation */}
      <div
        id="report-content"
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-10 mb-8"
      >
        <header className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 leading-tight">
            Index Book - (પાનોત્રી બુક) ક, ખ, ગ, પ્રમાણે <br /> ગામનો નમુના નંબર
            ૯/ડી - કરવેરા રજીસ્ટરની પાનોત્રીની યાદી
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-600 mb-4">
            સને {"2025/2026"}
          </h2>
          <hr className="border-t-2 border-dashed border-gray-300 mx-auto w-full" />
        </header>

        {/* Village details section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-700 mb-8">
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            ગામ : <b className="font-semibold text-blue-800">{village}</b>
          </span>
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            તાલુકો : <b className="font-semibold text-blue-800">{taluka}</b>
          </span>
          <span className="p-3 bg-blue-50 rounded-lg shadow-sm">
            જીલ્લો : <b className="font-semibold text-blue-800">{district}</b>
          </span>
        </div>

        {/* Main analytics grid */}
        <div className="table-container rounded-lg shadow-md border border-gray-200 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th
                  className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                  style={{
                    color: "white",
                    background: background,
                    maxWidth: "30px",
                  }}
                >
                  ક્રમ નંબર
                </th>

                <th
                  className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                  style={{
                    color: "white",
                    background: background,
                    maxWidth: "30px",
                  }}
                >
                  મિલ્ક્ત નંબર
                </th>

                <th
                  className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                  style={{
                    color: "white",
                    background: background,
                    minWidth: "150px",
                  }}
                >
                  માલિકનું નામ
                </th>

                <th
                  className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                  style={{
                    color: "white",
                    background: background,
                    minWidth: "150px",
                  }}
                >
                  વિસ્તારનું નામ
                </th>

                <th
                  className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                  style={{
                    color: "white",
                    background: background,

                    maxWidth: "40px",
                  }}
                >
                  પાના નંબર
                </th>

                <th
                  className="px-2 py-3 text-xm text-center font-medium text-gray-500 uppercase tracking-wider sticky top-0 z-10"
                  style={{
                    color: "white",
                    background: background,
                    maxWidth: "20px",
                  }}
                >
                  મોબાઈલ નંબર
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedKeys.map((key, index1) => (
                <React.Fragment key={key}>
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-lg font-bold text-gray-700 bg-gray-200"
                    >
                      {key}
                    </td>
                  </tr>
                  {groupedRecords[key].map((data, index) => (
                    <tr key={index1}>
                      <td
                        className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                        style={{ padding: "3px 8px" }}
                      >
                        {index + 1}
                      </td>{" "}
                      <td
                        className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                        style={{ padding: "3px 8px" }}
                      >
                        {data[2] || ""}
                      </td>
                      <td
                        className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                        style={{ padding: "3px 8px" }}
                      >
                        {data[3] || ""}
                      </td>
                      <td
                        className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                        style={{ padding: "3px 8px" }}
                      >
                        {data[1] || ""}
                      </td>
                      <td
                        className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                        style={{ padding: "3px 8px" }}
                      >
                        {Math.ceil(data[0] / 15)}
                      </td>
                      <td
                        className="px-1 py-2 whitespace-normal text-sm text-gray-500"
                        style={{ padding: "3px 8px" }}
                      >
                        {data[5] || ""}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndexReport;
