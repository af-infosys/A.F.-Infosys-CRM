import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import apiPath from "../../isProduction";

// Tax management component
const TaxManage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);

  // const base = [
  //   { id: 20, name: "કીમત પ્રમાણે" },
  //   { id: 21, name: "વિસ્તાર પ્રમાણે" },
  //   { id: 54, name: "નળ ક્નેકશન" },
  //   { id: 19, name: "ઉચ્ચક" },
  //   { id: 20055, name: "ઘર વેરાના આધારે" },
  //   { id: 24, name: "કુલ કરના આધારે" },
  //   { id: 25, name: "બીજા કરના આધારે" },
  // ];

  // Default tax data to use if no data is fetched
  const defaultTaxes = [
    { name: "સા.પાણી વેરો", format: "rs", values: {} },
    { name: "ખા.પાણી વેરો", format: "rs", values: {} },
    { name: "લાઈટ વેરો", format: "rs", values: {} },
    { name: "સફાઈ વેરો", format: "rs", values: {} },
    { name: "ગટર વેરો", format: "rs", values: {} },
    { name: "નોટીસ", format: "rs", values: {} },
    { name: "એડવાન્સ", format: "rs", values: {} },
    { name: "અન્ય", format: "rs", values: {} },
    { name: "તાલુકા પં. કર", format: "pr", values: {} },
    { name: "અન્ય૩", format: "rs", values: {} },
    { name: "અન્ય૪", format: "rs", values: {} },
    { name: "અન્ય૫", format: "rs", values: {} },
  ];

  // Function to fetch data based on projectId
  const fetchData = async () => {
    setLoading(true);
    try {
      let fetchedData = await axios.get(
        `${await apiPath()}/api/valuation/tax/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchedData = fetchedData?.data?.taxes;
      console.log(fetchedData);

      if (fetchedData && fetchedData.length > 0) {
        setTaxes(fetchedData);
        toast.success("Tax Data Fetched Successfully.");
      } else {
        setTaxes(defaultTaxes);
        toast.info("No Tax Data Found! try adding new Data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error Fetching Taxes Data.");
      setTaxes(defaultTaxes); // Load default data on error as well
    } finally {
      setLoading(false);
    }
  };

  // Function to save data to the server
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${await apiPath()}/api/valuation/tax/${projectId}`,
        { taxes },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Saving taxes:", taxes);
      toast.success("ડેટા સફળતાપૂર્વક સાચવવામાં આવ્યો છે!");

      navigate(`/orderValuation/report/${projectId}`);
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("ડેટા સેવ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
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
      <div className="max-w-7xl mx-auto">
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
                {/* <div className="flex flex-col">
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
                </div> */}
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
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap">
                        {tax.format === "pr" ? "ટકા %" : "રકમ રૂ."}
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
                          style={{ minWidth: "100px" }}
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
                          style={{ minWidth: "100px" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={tax.values?.plot || ""}
                          onChange={(e) =>
                            handleValueChange(taxIndex, "plot", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                          style={{ minWidth: "100px" }}
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
                          style={{ minWidth: "100px" }}
                        />
                      </td>
                    </tr>
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
