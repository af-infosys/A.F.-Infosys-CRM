import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import apiPath from "../../isProduction";

// The main component for the order valuation form
const OrderValuationForm = () => {
  const { projectId } = useParams();

  const [details, setDetails] = useState({
    totalHouses: 0,
    gaam: "",
    taluka: "",
    district: "",
    date: "",
    panchayat: "",
    akaraniYear: "",
    taxYear: "",
    sarpanchName: "",
    sarpanchNumber: "",
    tcmName: "",
    tcmNumber: "",
    assistantName: "",
    assistantNumber: "",
  });

  const [valuation, setValuation] = useState([
    { name: "કાચા ગાર માટી રૂમ - ૧", price: 0, tax: 0 },
    { name: "નળીયા, પતરા, પીઢીયા, પાકા રૂમ ૧", price: 0, tax: 0 },
    { name: "પાકા સ્લેબવાળા રૂમ ૧", price: 0, tax: 0 },
    {
      name: "માલ ઢોર નું ઢાળીયુ પતરા નું ત્થા વાહન રાખવાની જગ્‍યા",
      price: 0,
      tax: 0,
    },
    { name: "કાચા જર્જરીત બંધ પડતર રૂમ ૧", price: 0, tax: 0 },
    { name: "પાકા જર્જરીત બંધ પડતર રૂમ ૧", price: 0, tax: 0 },
    { name: "કેબીન, પાલા, કાચી દુકાન, ૧", price: 0, tax: 0 },
    { name: "પાકી દુકાન ૧", price: 0, tax: 0 },
    { name: "ગોડાઉન ૧", price: 0, tax: 0 },
    { name: "હોલ ૧", price: 0, tax: 0 },
    { name: "શેડ ૧", price: 0, tax: 0 },
    { name: "ખુલ્લો પ્લોટ", price: 0, tax: 0 },
    { name: "હિરાના કારખાના નાના", price: 0, tax: 0 },
    { name: "હિરાના કારખાના મોટા", price: 0, tax: 0 },
    { name: "મોબાઇલ ટાવર", price: 0, tax: 0 },
    { name: "પેટ્રોલ પંપ, ગેસ પંપ", price: 0, tax: 0 },
    { name: "હોટલ, રેસ્‍ટોરેન્‍ટ, લોજ હાઇવે પર", price: 0, tax: 0 },
    { name: "કોટન કપાસ નું જીનીંગ", price: 0, tax: 0 },
    { name: "તેલ ની ઘાણી ઓઇલ મીલ", price: 0, tax: 0 },
    { name: "કારખાના, ફેકટરી, કંપ્‍ની, ઇન્‍ડસ્‍ટીજ", price: 0, tax: 0 },
    { name: "કોલ્‍ડ સ્‍ટોરેજ", price: 0, tax: 0 },
    { name: "લાતી / બેન્‍સો લાકડાનો", price: 0, tax: 0 },
    { name: "વે બ્રિજ તોલ માપ કાટો વાહન માટેનો", price: 0, tax: 0 },
  ]);

  const fetchData = async () => {
    try {
      // In a real application, you would pass a token for authentication
      const response = await axios.get(
        `${await apiPath()}/api/api/valuation/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      setDetails(data.details);
      setValuation(data.valuation || valuation);

      console.log(`Fetching data for project ID: ${projectId}`);
    } catch (error) {
      console.error("Error fetching data:", error);

      console.log("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `http://localhost:5000/api/valuation/${projectId}`,
        { body: { details, valuation } },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      console.log("ડેટા સેવ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  const handleChangeDetails = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleChangeValuation = (index, field, value) => {
    const newValuation = [...valuation];
    newValuation[index][field] = value;
    setValuation(newValuation);
  };

  const handleAddRow = () => {
    setValuation((prevValuation) => [
      ...prevValuation,
      { name: "", price: 0, tax: 0 },
    ]);
  };

  const handleDeleteRow = (index) => {
    setValuation((prevValuation) =>
      prevValuation.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const getAlphabeticalIndex = (index) => {
    let result = "";
    let temp = index;
    while (temp >= 0) {
      result = alphabets[temp % 26] + result;
      temp = Math.floor(temp / 26) - 1;
    }
    return result;
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="rounded-xl">
        {/* Title */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            આકારણી વેલ્યુએશન ફોર્મ
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            મિલ્કતની વિગતો અને વેરાની ગણતરી
          </p>
        </header>

        {/* Input Fields Section */}
        <section className="bg-white p-6 rounded-lg shadow-inner mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            સામાન્ય વિગતો
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label
                htmlFor="totalHouses"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                અંદાજીત ઘર ની સંખ્યા
              </label>
              <input
                type="number"
                id="totalHouses"
                name="totalHouses"
                value={details.totalHouses}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            {/* Other details fields can be added here in a similar fashion */}
            <div className="flex flex-col">
              <label
                htmlFor="gaam"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                ગ્રામ પંચાયત કચેરી
              </label>
              <input
                type="text"
                id="gaam"
                name="gaam"
                value={details.gaam}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="taluka"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                તાલુકો
              </label>
              <input
                type="text"
                id="taluka"
                name="taluka"
                value={details.taluka}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="district"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                જિલ્લો
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={details.district}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                તારીખ
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={details.date}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="panchayat"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                જુથ પંચાયત છે હા/ ના ગામના નામ લખવા
              </label>
              <input
                type="text"
                id="panchayat"
                name="panchayat"
                value={details.panchayat}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="akaraniYear"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                આકારણીનું વર્ષ
              </label>
              <input
                type="number"
                id="akaraniYear"
                name="akaraniYear"
                value={details.akaraniYear}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="taxYear"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                વેરા રજીસ્ટરનું વર્ષ
              </label>
              <input
                type="number"
                id="taxYear"
                name="taxYear"
                value={details.taxYear}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="sarpanchName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                સરપંચશ્રીનું પુરૂ નામ
              </label>
              <input
                type="text"
                id="sarpanchName"
                name="sarpanchName"
                value={details.sarpanchName}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="sarpanchNumber"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                મો.નં. (સરપંચ)
              </label>
              <input
                type="number"
                id="sarpanchNumber"
                name="sarpanchNumber"
                value={details.sarpanchNumber}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="tcmName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                તલાટી કમ મંત્રીશ્રીનું પુરૂ નામ
              </label>
              <input
                type="text"
                id="tcmName"
                name="tcmName"
                value={details.tcmName}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="tcmNumber"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                મો.નં. (તલાટી)
              </label>
              <input
                type="number"
                id="tcmNumber"
                name="tcmNumber"
                value={details.tcmNumber}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="assistantName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                સાથે રહેનાર વ્યકિતનું પુરૂ નામ
              </label>
              <input
                type="text"
                id="assistantName"
                name="assistantName"
                value={details.assistantName}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="assistantNumber"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                મો.નં. (સાથે રહેનાર)
              </label>
              <input
                type="number"
                id="assistantNumber"
                name="assistantNumber"
                value={details.assistantNumber}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </section>

        {/* Valuation Table Section */}
        <form onSubmit={handleSave}>
          <div className="overflow-x-auto rounded-lg shadow-md mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                    ક્રમ
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                    આલ્ફાબેટ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider min-w-[200px]">
                    મિલ્કતનું વર્ણન
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider min-w-[120px]">
                    મિલ્કતની કિંમત
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider min-w-[120px]">
                    મિલ્કત વેરો
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                    ડીલીટ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {valuation.map((data, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-500">
                      {getAlphabeticalIndex(index)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) =>
                          handleChangeValuation(index, "name", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        value={data.price}
                        onChange={(e) =>
                          handleChangeValuation(
                            index,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        value={data.tax}
                        onChange={(e) =>
                          handleChangeValuation(
                            index,
                            "tax",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(index)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200 rounded-full hover:bg-red-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleAddRow}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>ઉમેરો</span>
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <span>માહિતી સેવ કરો</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderValuationForm;
