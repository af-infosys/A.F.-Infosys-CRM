import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

// Tax management component
const TaxManage = () => {
  const { projectId } = useParams();

  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  const base = [
    { id: 20, name: "કીમત પ્રમાણે" },
    { id: 21, name: "વિસ્તાર પ્રમાણે" },
    { id: 54, name: "નળ ક્નેકશન" },
    { id: 19, name: "ઉચ્ચક" },
    { id: 20055, name: "ઘર વેરાના આધારે" },
    { id: 24, name: "કુલ કરના આધારે" },
    { id: 25, name: "બીજા કરના આધારે" },
  ];

  // Default tax data to use if no data is fetched
  const defaultTaxes = [
    { name: "ઘર વેરો", baseId: 0, format: "pr", values: {} },
    { name: "સા.પાણી વેરો", baseId: 0, format: "rs", values: {} },
    { name: "ખા.પાણી વેરો", baseId: 0, format: "rs", values: {} },
    { name: "લાઈટ વેરો", baseId: 0, format: "rs", values: {} },
    { name: "સફાઈ વેરો", baseId: 0, format: "rs", values: {} },
    { name: "ગટર વેરો", baseId: 0, format: "rs", values: {} },
    { name: "નોટીસ", baseId: 0, format: "rs", values: {} },
    { name: "એડવાન્સ", baseId: 0, format: "rs", values: {} },
    { name: "અન્ય", baseId: 0, format: "rs", values: {} },
    { name: "તાલુકા પં. કર", baseId: 0, format: "pr", values: {} },
    { name: "અન્ય૩", baseId: 0, format: "rs", values: {} },
    { name: "અન્ય૪", baseId: 0, format: "rs", values: {} },
    { name: "અન્ય૫", baseId: 0, format: "rs", values: {} },
  ];

  // Placeholder data to simulate a successful fetch with unique keys for the "નળ ક્નેકશન" base
  const mockFetchedTaxes = [
    {
      name: "ઘર વેરો",
      baseId: 20,
      format: "pr",
      values: { residence: 5, nonResidence: 8, plot: 2, commonPlot: 1 },
    },
    {
      name: "સા.પાણી વેરો",
      baseId: 54,
      format: "rs",
      values: {
        line1_residence: 200,
        line1_nonResidence: 250,
        line1_plot: 220,
        line1_commonPlot: 180,
        halfLine_residence: 150,
        halfLine_nonResidence: 180,
        halfLine_plot: 160,
        halfLine_commonPlot: 140,
        threeQuarterLine_residence: 180,
        threeQuarterLine_nonResidence: 220,
        threeQuarterLine_plot: 200,
        threeQuarterLine_commonPlot: 160,
        none_residence: 0,
        none_nonResidence: 0,
        none_plot: 0,
        none_commonPlot: 0,
      },
    },
    {
      name: "ખા.પાણી વેરો",
      baseId: 54,
      format: "rs",
      values: {
        line1_residence: 150,
        line1_nonResidence: 180,
        line1_plot: 160,
        line1_commonPlot: 120,
        halfLine_residence: 100,
        halfLine_nonResidence: 120,
        halfLine_plot: 110,
        halfLine_commonPlot: 90,
        threeQuarterLine_residence: 120,
        threeQuarterLine_nonResidence: 150,
        threeQuarterLine_plot: 130,
        threeQuarterLine_commonPlot: 110,
        none_residence: 0,
        none_nonResidence: 0,
        none_plot: 0,
        none_commonPlot: 0,
      },
    },
    {
      name: "લાઈટ વેરો",
      baseId: 19,
      format: "rs",
      values: { residence: 50, nonResidence: 100, plot: 0, commonPlot: 0 },
    },
    {
      name: "સફાઈ વેરો",
      baseId: 19,
      format: "rs",
      values: { residence: 30, nonResidence: 60, plot: 0, commonPlot: 0 },
    },
    {
      name: "ગટર વેરો",
      baseId: 19,
      format: "rs",
      values: { residence: 40, nonResidence: 80, plot: 0, commonPlot: 0 },
    },
    {
      name: "નોટીસ",
      baseId: 19,
      format: "rs",
      values: { residence: 20, nonResidence: 20, plot: 20, commonPlot: 20 },
    },
    {
      name: "એડવાન્સ",
      baseId: 19,
      format: "rs",
      values: { residence: 0, nonResidence: 0, plot: 0, commonPlot: 0 },
    },
    {
      name: "અન્ય",
      baseId: 19,
      format: "rs",
      values: { residence: 0, nonResidence: 0, plot: 0, commonPlot: 0 },
    },
    {
      name: "તાલુકા પં. કર",
      baseId: 24,
      format: "pr",
      values: { residence: 1, nonResidence: 1, plot: 1, commonPlot: 1 },
    },
    {
      name: "અન્ય૩",
      baseId: 19,
      format: "rs",
      values: { residence: 0, nonResidence: 0, plot: 0, commonPlot: 0 },
    },
    {
      name: "અન્ય૪",
      baseId: 19,
      format: "rs",
      values: { residence: 0, nonResidence: 0, plot: 0, commonPlot: 0 },
    },
    {
      name: "અન્ય૫",
      baseId: 19,
      format: "rs",
      values: { residence: 0, nonResidence: 0, plot: 0, commonPlot: 0 },
    },
  ];

  // Function to fetch data based on projectId
  const fetchData = async () => {
    setLoading(true);
    try {
      // For this demo, we use a random condition to simulate no data found
      const fetchedData = Math.random() > 0.5 ? mockFetchedTaxes : [];

      if (fetchedData && fetchedData.length > 0) {
        setTaxes(fetchedData);
        toast.success("ડેટા સફળતાપૂર્વક લોડ થયો છે.");
      } else {
        setTaxes(defaultTaxes);
        toast.info(
          "પ્રોજેક્ટ માટે કોઈ ડેટા મળ્યો નથી. ડિફોલ્ટ ડેટા લોડ થઈ રહ્યો છે."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
      setTaxes(defaultTaxes); // Load default data on error as well
    } finally {
      setLoading(false);
    }
  };

  // Function to save data to the server
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log("Saving taxes:", taxes);
      toast.success("ડેટા સફળતાપૂર્વક સાચવવામાં આવ્યો છે!");
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("ડેટા સેવ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  // Handlers for updating state
  const handleBaseChange = (index, value) => {
    const newTaxes = [...taxes];
    newTaxes[index].baseId = Number(value);
    setTaxes(newTaxes);
  };

  const handleFormatChange = (index, value) => {
    const newTaxes = [...taxes];
    newTaxes[index].format = value;
    setTaxes(newTaxes);
  };

  const handleValueChange = (taxIndex, key, value) => {
    const newTaxes = [...taxes];
    // Check if values object exists, if not, create it
    if (!newTaxes[taxIndex].values) {
      newTaxes[taxIndex].values = {};
    }
    newTaxes[taxIndex].values[key] = Number(value);
    setTaxes(newTaxes);
  };

  // Fetch data on component mount or projectId change
  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
        <div className="text-xl text-gray-700">ડેટા લોડ થઈ રહ્યો છે...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans relative">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            કરની યાદી (Tax Manage)
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            પ્રોજેક્ટ ID: {projectId}
          </p>
        </header>
        <form onSubmit={handleSave} className="space-y-8">
          {taxes.map((tax, taxIndex) => (
            <div
              key={taxIndex}
              className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {taxIndex + 1}. કરનું નામ : {tax.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    ટેક્ષ ગણવાનો આધાર
                  </label>
                  <select
                    value={tax.baseId}
                    onChange={(e) => handleBaseChange(taxIndex, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="0">પસંદ કરો</option>
                    {base.map((baseItem) => (
                      <option key={baseItem.id} value={baseItem.id}>
                        {baseItem.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    રકમ રૂ. / ટકા (આધાર)
                  </label>
                  <select
                    value={tax.format}
                    onChange={(e) =>
                      handleFormatChange(taxIndex, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <option value="pr">ટકા</option>
                    <option value="rs">રકમ</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider"></th>
                      <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                        રહેઠાણ
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                        બિન-રહેઠાણ
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                        પ્લોટ
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                        કોમન પ્લોટ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tax.baseId === 54 ? (
                      <>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                            ૧ લાઇન {tax.format === "rs" ? "(રૂ.)" : "(%)"}
                          </th>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.line1_residence || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "line1_residence",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.line1_nonResidence || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "line1_nonResidence",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.line1_plot || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "line1_plot",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.line1_commonPlot || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "line1_commonPlot",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                            ૧/૨ લાઇન {tax.format === "rs" ? "(રૂ.)" : "(%)"}
                          </th>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.halfLine_residence || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "halfLine_residence",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.halfLine_nonResidence || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "halfLine_nonResidence",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.halfLine_plot || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "halfLine_plot",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.halfLine_commonPlot || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "halfLine_commonPlot",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                            ૩/૪ લાઇન {tax.format === "rs" ? "(રૂ.)" : "(%)"}
                          </th>
                          <td>
                            <input
                              type="number"
                              value={
                                tax.values?.threeQuarterLine_residence || ""
                              }
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "threeQuarterLine_residence",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={
                                tax.values?.threeQuarterLine_nonResidence || ""
                              }
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "threeQuarterLine_nonResidence",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.threeQuarterLine_plot || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "threeQuarterLine_plot",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={
                                tax.values?.threeQuarterLine_commonPlot || ""
                              }
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "threeQuarterLine_commonPlot",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                            નથી {tax.format === "rs" ? "(રૂ.)" : "(%)"}
                          </th>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.none_residence || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "none_residence",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.none_nonResidence || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "none_nonResidence",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.none_plot || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "none_plot",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={tax.values?.none_commonPlot || ""}
                              onChange={(e) =>
                                handleValueChange(
                                  taxIndex,
                                  "none_commonPlot",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                          {tax.format === "rs" ? "રકમ રૂ." : "ટકા %"}
                        </th>
                        <td>
                          <input
                            type="number"
                            value={tax.values?.residence || ""}
                            onChange={(e) =>
                              handleValueChange(
                                taxIndex,
                                "residence",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={tax.values?.nonResidence || ""}
                            onChange={(e) =>
                              handleValueChange(
                                taxIndex,
                                "nonResidence",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={tax.values?.plot || ""}
                            onChange={(e) =>
                              handleValueChange(
                                taxIndex,
                                "plot",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={tax.values?.commonPlot || ""}
                            onChange={(e) =>
                              handleValueChange(
                                taxIndex,
                                "commonPlot",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-all duration-200"
            >
              સેવ કરો
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxManage;
