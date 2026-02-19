import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import apiPath from "../../isProduction";
import numberToGujaratiWords from "../../components/ToGujarati";
import toGujaratiNumber from "../../components/toGujaratiNumber";

// The main component for the order valuation form
const OrderValuationForm = () => {
  const navigate = useNavigate();

  const { projectId } = useParams();

  const [details, setDetails] = useState({
    javak: `0/આકરણી/${new Date().getMonth() + 1}/${new Date()
      .getFullYear()
      .toString()
      .slice(-3)}`,
    tbr: 0,
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
    assistantHoddo: "",

    valuationType: "",

    meetingDate: "",
    meetingNumber: "",
    agendaNumber: "",
    resolutionNumber: "",

    surveyHouseRate: "",
    approvedAmountWords: "",

    startArea: "",
    firstPropertyOwner: "",

    generalWaterTaxApplicable: "",
    specialAndGeneralWaterTax: "",

    seperatecommercial: false,

    comity: [{ name: "", designation: "" }],

    notes: [],
  });

  const [newNote, setNewNote] = useState("");

  const [valuation, setValuation] = useState([
    {
      name: "કાચા ગાર માટી",
      price: 100000,
      per: 0.5,
      tax: 500,
    },
    {
      name: "નળીયા, પતરા, પીઢીયા, પાકા",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "પાકા સ્લેબવાળા",
      price: 10000,
      per: 0,
      tax: 0,
    },
    {
      name: "માલ ઢોર નું ઢાળીયુ પતરા નું ત્થા વાહન રાખવાની જગ્‍યા",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "કાચા જર્જરીત બંધ પડતર",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "પાકા જર્જરીત બંધ પડતર",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "કેબીન, પાલા, કાચી દુકાન",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "દુકાન પાકી નાની",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "દુકાન પાકી મોટી",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "ગોડાઉન પાકા નાના",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "ગોડાઉન પાકા મોટા",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "હોલ નાના",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "પાકા હોલ મોટા",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "શેડ",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "ખુલ્લો પ્લોટની કિંમત (માલિકી)",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "હિરાના કારખાના નાના",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "હિરાના કારખાના મોટા",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "મોબાઇલ ટાવર",
      price: 0,
      per: 3,
      tax: 0,
    },
    {
      name: "પેટ્રોલ પંપ, ગેસ પંપ",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "હોટલ, રેસ્‍ટોરેન્‍ટ, લોજ હાઇવે પર",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "કોટન કપાસ નું જીનીંગ",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "તેલ ની ઘાણી ઓઇલ મીલ",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "કારખાના, ફેકટરી, કંપ્‍ની, ઇન્‍ડસ્‍ટીજ",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "કોલ્‍ડ સ્‍ટોરેજ",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "લાતી / બેન્‍સો લાકડાનો",
      price: 0,
      per: 0,
      tax: 0,
    },
    {
      name: "વે બ્રિજ તોલ માપ કાટો વાહન માટેનો",
      price: 0,
      per: 0,
      tax: 0,
    },
  ]);

  const fetchData = async () => {
    try {
      // In a real application, you would pass a token for authentication
      const response = await axios.get(
        `${await apiPath()}/api/valuation/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = response.data;
      console.log(data);

      setDetails(data.details || details);
      setValuation(
        Array.isArray(data?.valuation) && data?.valuation.length
          ? data.valuation
          : valuation,
      );

      console.log(`Fetching data for project ID: ${projectId}`);
    } catch (error) {
      console.error("Error fetching data:", error);

      console.log("ડેટા લાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
  };

  const [editNote, setEditNote] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${await apiPath()}/api/valuation/${projectId}`,
        { details, valuation },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Data saved successfully!");
      navigate(`/orderValuation/tax/${projectId}`);
    } catch (error) {
      console.error("Error saving data:", error);
      console.log("ડેટા સેવ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.");
    }
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
      prevValuation.filter((_, i) => i !== index),
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

  // Generic field change (for text, number, etc.)
  const handleChangeDetails = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));

    const indicesToUpdate = [1, 2, 3, 8, 9, 10, 11, 12, 16, 17];

    const updatedValuation = valuation.map((item, index) => {
      // Check if the current index is in the list of indices to update
      if (indicesToUpdate.includes(index + 1)) {
        // First, remove "રૂમ - 1" to avoid duplicates
        let updatedName = item.name.replace(/\s*રૂમ - 1$/, "");

        // Then, add it back if the selected value is "room"
        if (value === "room") {
          updatedName += " રૂમ - 1";
        }
        return { ...item, name: updatedName };
      }

      // If the index is not in the list, return the item as is
      return item;
    });

    setValuation(updatedValuation);
  };

  // Add a new note (defensive)
  const handleAddNote = () => {
    const note = newNote.trim();
    if (!note) return;
    setDetails((prev) => {
      const notes = Array.isArray(prev?.notes) ? prev.notes : [];
      return { ...prev, notes: [...notes, note] };
    });
    setNewNote("");
  };

  // Remove a note safely by index
  const handleRemoveNote = (idx) => {
    setDetails((prev) => {
      const notes = Array.isArray(prev?.notes) ? prev.notes : [];
      return { ...prev, notes: notes.filter((_, i) => i !== idx) };
    });
  };

  const addCommittee = () => {
    setDetails((prev) => ({
      ...prev,
      comity: [...(prev.comity || []), { name: "", designation: "" }],
    }));
  };

  const handleChange = (index, field, value) => {
    setDetails((prev) => {
      const updated = [...(prev.comity || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        comity: updated,
      };
    });
  };

  const deleteCommittee = (index) => {
    setDetails((prev) => {
      const updated = [...(prev.comity || [])];
      updated.splice(index, 1);

      return {
        ...prev,
        comity: updated,
      };
    });
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="rounded-xl">
        {/* Title */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Order Valuation FORM <br />
            પત્રક - 1 ઑર્ડર વેલ્યુએશન ફોર્મ <br />
            (ભાગ - 1)
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
                htmlFor="javak"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                ગ્રા.પં./વશી/જા.નં./
              </label>
              <input
                type="text"
                id="javak"
                name="javak"
                value={details.javak}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="totalHouses"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                1. અંદાજીત ઘર ની સંખ્યા
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

            <div className="flex flex-col">
              <label
                htmlFor="oldregi"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                જુના રજી.ની ઘરની સંખ્યા
              </label>
              <input
                type="text"
                id="oldregi"
                name="oldregi"
                value={details.oldregi}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="imageAkarni"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                ફોટા વાળી આકારણી
              </label>
              <input
                type="checkbox"
                id="imageAkarni"
                name="imageAkarni"
                checked={details.imageAkarni}
                onChange={(e) =>
                  setDetails({ ...details, imageAkarni: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="tbr"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                2. TBR
              </label>
              <input
                type="number"
                id="tbr"
                name="tbr"
                value={details.tbr}
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
                3. ગ્રામ પંચાયત કચેરી
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
                4. તાલુકો
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
                5. જિલ્લો
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
                6. તારીખ
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
                7. જુથ પંચાયત છે હા/ નહિ ગામના નામ લખવા
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
                8. આકારણીનું વર્ષ
              </label>
              <input
                type="text"
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
                9. વેરા રજીસ્ટરનું વર્ષ
              </label>
              <input
                type="text"
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
                10. સરપંચશ્રીનું પુરૂ નામ
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
                11. સરપંચ મો.નં.
              </label>
              <input
                type="text"
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
                12. તલાટી કમ મંત્રીશ્રીનું પુરૂ નામ
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
                13. તલાટી મો.નં.
              </label>
              <input
                type="text"
                id="tcmNumber"
                name="tcmNumber"
                value={details.tcmNumber}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="s2Name"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                14. વહિવટ કર્તા વ્યક્તિનું પુરૂ નામ
              </label>
              <input
                type="text"
                id="s2Name"
                name="s2Name"
                value={details.s2Name}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="s2Number"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                15. વહિવટ કર્તા વ્યક્તિ મો.નં.
              </label>
              <input
                type="text"
                id="s2Number"
                name="s2Number"
                value={details.s2Number}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="assistantName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                16. સાથે રહેનાર વ્યકિતનું પુરૂ નામ
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
                17. સાથે રહેનાર મો.નં.
              </label>
              <input
                type="text"
                id="assistantNumber"
                name="assistantNumber"
                value={details.assistantNumber}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="assistantHoddo"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                18. સાથે રહેનાર વ્યક્તિનો હોદ્દો
              </label>
              <input
                type="text"
                id="assistantHoddo"
                name="assistantHoddo"
                value={details.assistantHoddo}
                onChange={handleChangeDetails}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <br />
          <div className="flex flex-col col-span-3">
            <label className="text-sm font-medium text-gray-700 mb-2">
              19. Valuation Type
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="valuationType"
                  value="room"
                  checked={details.valuationType === "room"}
                  onChange={handleChangeDetails}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>રૂમ દિઠ કિમત મુકવી</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="valuationType"
                  value="house"
                  checked={details.valuationType === "house"}
                  onChange={handleChangeDetails}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>મકાન દિઠ કિમત લેવી</span>
              </label>
            </div>
          </div>
        </section>

        {/* Valuation Table Section */}
        <form onSubmit={handleSave}>
          <div className="overflow-x-auto rounded-lg shadow-md mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider"
                    colSpan="2"
                  >
                    ક્રમ
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider min-w-[300px]">
                    મિલ્કતનું વર્ણન
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider"
                    style={{ maxWidth: "190px" }}
                  >
                    મિલ્કતની કિંમત
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider"
                    style={{ maxWidth: "100px" }}
                  >
                    ટકા (%)
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider"
                    style={{ maxWidth: "130px" }}
                  >
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
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ maxWidth: "190px" }}
                    >
                      <input
                        type="number"
                        value={data.price}
                        onChange={(e) => {
                          handleChangeValuation(
                            index,
                            "price",
                            Number(e.target.value),
                          );
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ maxWidth: "100px" }}
                    >
                      <input
                        type="number"
                        value={data.per}
                        onChange={(e) => {
                          handleChangeValuation(
                            index,
                            "per",
                            Number(e.target.value),
                          );

                          handleChangeValuation(
                            index,
                            "price",
                            Number((data.tax * 100) / data.per),
                          );
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </td>
                    <td
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ maxWidth: "130px" }}
                    >
                      <input
                        type="number"
                        value={data.tax}
                        onChange={(e) => {
                          handleChangeValuation(
                            index,
                            "tax",
                            Number(e.target.value),
                          );

                          handleChangeValuation(
                            index,
                            "price",
                            Number((data.tax * 100) / data.per),
                          );
                        }}
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
          </div>

          <section className="bg-white p-6 rounded-lg shadow-inner mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Valuation FORM <br />
              પત્રક - 2 ઑર્ડર વેલ્યુએશન ફોર્મ <br />
              (ભાગ - 2)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Gram Panchayat Meeting */}
              <div className="flex flex-col">
                <label
                  htmlFor="meetingDate"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  1. સામાન્ય બેઠકની તારીખ ગ્રામ પંચાયતની
                </label>
                <input
                  type="date"
                  id="meetingDate"
                  name="meetingDate"
                  value={details.meetingDate}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="meetingNumber"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  2. સામાન્ય બેઠક નંબર ગ્રામ પંચાયતની
                </label>
                <input
                  type="text"
                  id="meetingNumber"
                  name="meetingNumber"
                  value={details.meetingNumber}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="agendaNumber"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  3. મુદ્દા નં. સામાન્ય બેઠકના ગ્રામ પંચાયતનો
                </label>
                <input
                  type="text"
                  id="agendaNumber"
                  name="agendaNumber"
                  value={details.agendaNumber}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="resolutionNumber"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  4. ઠરાવ નં. સામાન્ય બેઠકના ગ્રામ પંચાયતનો
                </label>
                <input
                  type="text"
                  id="resolutionNumber"
                  name="resolutionNumber"
                  value={details.resolutionNumber}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Aakarani Survey Work */}
              <div className="flex flex-col">
                <label
                  htmlFor="surveyHouseRate"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  5. 1-ઘર દિઠ રૂપિયા આકારણી સર્વે કામના
                </label>
                <input
                  type="number"
                  id="surveyHouseRate"
                  name="surveyHouseRate"
                  value={details.surveyHouseRate}
                  onInput={(e) => {
                    setDetails((prev) => ({
                      ...prev,
                      approvedAmountWords: numberToGujaratiWords(
                        e.target.value,
                      ),
                    }));

                    handleChangeDetails(e);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="approvedAmountWords"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  6. શબ્દોમાં અંકે રૂપીયા ભાવ મંજુર કરેલ છે
                </label>
                <input
                  type="text"
                  id="approvedAmountWords"
                  name="approvedAmountWords"
                  value={details.approvedAmountWords}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Area Details */}
              <div className="flex flex-col">
                <h3>વિસ્તારની વિગત ::-</h3>

                <label
                  htmlFor="startArea"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  7. પહેલા વિસ્તાર/શેરી મહોલ્લો કયા થી શરૂ કરવો :-
                </label>
                <input
                  type="text"
                  id="startArea"
                  name="startArea"
                  value={details.startArea}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="firstPropertyOwner"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  8. આકારણી સર્વે કામ પહેલી મિલ્કત/ઘર કોની લખવી : -
                </label>
                <input
                  type="text"
                  id="firstPropertyOwner"
                  name="firstPropertyOwner"
                  value={details.firstPropertyOwner}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <br />

              <div className="flex flex-col">
                <h2>પ્રસિધ્ધ આકારણી :-</h2>
                <label
                  htmlFor="meetingNumber2"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  i. બેઠક નંબર
                </label>
                <input
                  type="text"
                  id="meetingNumber2"
                  name="meetingNumber2"
                  value={details?.meetingNumber2 || ""}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="resolutionNumber2"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  ii. ઠરાવ નંબર
                </label>
                <input
                  type="text"
                  id="resolutionNumber2"
                  name="resolutionNumber2"
                  value={details?.resolutionNumber2 || ""}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="date2"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  iii. તારીખ
                </label>
                <input
                  type="date"
                  id="date2"
                  name="date2"
                  value={details?.date2 || ""}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Water Details */}

              <div className="flex flex-col">
                <h3>પાણી ની વિગત ::-</h3>

                <label
                  htmlFor="generalWaterTaxApplicable"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  9. જે મિલ્‍કત માં નળ હોય તેમા સામાન્‍ય પાણી વેરો લેવો કે નહી ?
                </label>

                <select
                  id="generalWaterTaxApplicable"
                  name="generalWaterTaxApplicable"
                  value={details.generalWaterTaxApplicable}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="yes">હા</option>
                  <option value="no">ના</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="specialAndGeneralWaterTax"
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  10. ખાસ પાણી નળ વેરો ત્થા સા.પાણી વેરો બન્‍ને વેરા મુકવા કે
                  ફકત એક જ વેરો લેવો.
                </label>

                <select
                  id="specialAndGeneralWaterTax"
                  name="specialAndGeneralWaterTax"
                  value={details.specialAndGeneralWaterTax}
                  onChange={handleChangeDetails}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="સામાન્ય પાણી વેરો">સામાન્ય પાણી વેરો</option>
                  <option value="ખાસ પાણી નળ વેરો">ખાસ પાણી નળ વેરો</option>
                  <option value="બંને વેરા લેવા">બંને વેરા લેવા</option>
                </select>
              </div>
            </div>

            <br />

            {/* <div className="flex gap-3 mb-4 mt-2">
              <label
                htmlFor="seperatecommercial"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                11. Seperate commercial Properties
              </label>

              <input
                type="checkbox"
                id="seperatecommercial"
                value={details.seperatecommercial}
                onChange={(e) => {
                  setDetails((prev) => ({
                    ...prev,
                    seperatecommercial: e.target.checked,
                  }));
                }}
                checked={details.seperatecommercial || false}
              />
            </div> */}

            {/* Notes Section */}
            <div className="flex flex-col col-span-3">
              <label className="text-sm font-medium text-gray-700 mb-1">
                11. નોધ (Notes)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note..."
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Add
                </button>
              </div>

              <br />

              <button
                onClick={() => setEditNote(!editNote)}
                className="px-4 py-2 bg-orange-600 text-white rounded-md"
                type="button"
                style={{ maxWidth: "fit-content" }}
              >
                {!editNote ? "Edit" : "View"}
              </button>

              <ul
                className="list-disc pl-6 mt-3 text-gray-800 space-y-1"
                style={{ maxWidth: "100%", overflow: "auto" }}
              >
                {details?.notes?.map((note, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span style={{ display: "flex" }}>
                      {toGujaratiNumber(idx + 1)}.
                      {editNote ? (
                        <input
                          type="text"
                          value={note}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setDetails((prev) => {
                              const updatedNotes = [...prev.notes];
                              updatedNotes[idx] = newValue;
                              return { ...prev, notes: updatedNotes };
                            });
                          }}
                          className="border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 text-sm bg-transparent"
                          style={{ width: "90%", minWidth: "800px" }}
                        />
                      ) : (
                        note
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveNote(idx)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <table
              style={{
                marginTop: "30px",
                maxWidth: "fit-content",
              }}
            >
              <thead>
                <tr>
                  <th>ક્રમ</th> <th>આયોજન</th> <th>તારીખ</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>1</td>
                  <td>વર્ક ઓર્ડર આપ્યા તારીખ</td>
                  <td>
                    <input
                      type="date"
                      id="workOrderDate"
                      name="workOrderDate"
                      value={details.workOrderDate}
                      onChange={handleChangeDetails}
                    />
                  </td>
                </tr>

                <tr>
                  <td>2</td>
                  <td>ગામજનો માટે જાહેરાત તારીખ</td>
                  <td>
                    <input
                      type="date"
                      id="jaheratDate"
                      name="jaheratDate"
                      value={details.jaheratDate}
                      onChange={handleChangeDetails}
                    />
                  </td>
                </tr>

                <tr>
                  <td>3</td>
                  <td>આકારણી સર્વે કામ શરૂ કર્યા તારીખ</td>
                  <td>
                    <input
                      type="date"
                      id="akaraniStartDate"
                      name="akaraniStartDate"
                      value={details.akaraniStartDate}
                      onChange={handleChangeDetails}
                    />
                  </td>
                </tr>

                <tr>
                  <td>4</td>
                  <td>સર્વે કામ પુર્ણ કર્યા તારીખ</td>
                  <td>
                    <input
                      type="date"
                      id="akaraniEndDate"
                      name="akaraniEndDate"
                      value={details.akaraniEndDate}
                      onChange={handleChangeDetails}
                    />
                  </td>
                </tr>

                <tr>
                  <td>5</td>
                  <td>રફ સર્વે રજી. PDF આકારણી મોકલ્યા તારીખ</td>
                  <td>
                    <input
                      type="date"
                      id="submitionDate"
                      name="submitionDate"
                      value={details.submitionDate}
                      onChange={handleChangeDetails}
                    />
                  </td>
                </tr>

                <tr>
                  <td>6</td>
                  <td>ફાઇનલ સુધારો કરેલ સમય અને ૧૫ દિવસ તારીખ</td>
                  <td>
                    <input
                      type="date"
                      id="updationDate"
                      name="updationDate"
                      value={details.updationDate}
                      onChange={handleChangeDetails}
                    />
                  </td>
                </tr>

                <tr>
                  <td>7</td>
                  <td>પોર્ટલમાં ડેટા એન્ટ્રી કરવાની 4 મહિના બાદ તારીખ</td>
                  <td>
                    <input
                      type="date"
                      id="entryDate"
                      name="entryDate"
                      value={details.entryDate}
                      onChange={handleChangeDetails}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              style={{
                marginTop: "50px",
                maxWidth: "fit-content",
              }}
            >
              <thead>
                <tr>
                  <th>ક્રમ</th>
                  <th>આકરણી કમિટીના નામ</th>
                  <th>હોદો</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {details?.comity?.map((comity, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>
                      <input
                        type="text"
                        value={comity?.name}
                        onChange={(e) =>
                          handleChange(index, "name", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="text"
                        value={comity?.designation}
                        onChange={(e) =>
                          handleChange(index, "designation", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => deleteCommittee(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={addCommittee}
              style={{
                marginTop: "30px",
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-md transition-all duration-200 flex items-center gap-2"
            >
              Add Commitee Member
            </button>
          </section>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <span>Save & Next</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderValuationForm;
