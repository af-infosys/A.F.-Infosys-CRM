import React, { useState, useEffect } from "react";
import apiPath from "../../isProduction";

export default function AddAkarni() {
  // State for form data, mapping directly to the image fields
  const [formData, setFormData] = useState({
    formNumber: "", // 1. ફોર્મ 010 A.S.
    gaam: "", // 2. ગામનું નામ
    talatiName: "", // 3. ગ્રાહક તલાટીનું નામ
    talatiMobile: "", // 4. મોબાઈલ નંબર (તલાટી)
    taluka: "", // 5. તાલુકો
    district: "", // 6. જીલ્લો
    sarpanchName: "", // 7. સરપંચશ્રી નું નામ
    sarpanchMobile: "", // 8. મોબાઈલ નંબર (સરપંચ)
    recordOfficeDate: "", // 9. રેકર્ડ ઓફિસ પર આવ્યા તારીખ
    oldAakaraniReg: "ના", // 10. જુનું આકારણી રજી. (હા/ના)
    oldAakaraniYear: "", // 10. વર્ષ
    old9DReg: "ના", // 11. જુનું ૯ / ડિ રજી. (હા/ના)
    old9DYear: "", // 11. વર્ષ
    totalHouses: "", // 12. કુલ ઘરની સંખ્યા
    expectedCompletionDate: "", // 13. કામ પૂર્ણ કરી આપવાની અંદાજીત તારીખ
    recordReturnDate: "", // 14. રેકર્ડ પરત મંત્રીને સોપ્યા/ આપ્યા તારીખ
    remarks: "", // 15. નોંધ / રિમાર્ક્સ
  });

  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [currentWork, setCurrentWork] = useState(null); // Set this to simulate "edit" mode

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setActionMessage("");

    // Basic validation based on image fields (Adjust as needed)
    if (
      !formData.formNumber.trim() ||
      !formData.gaam.trim() ||
      !formData.taluka.trim() ||
      !formData.district.trim()
    ) {
      setActionMessage(
        "કૃપા કરીને બધા ફરજિયાત ક્ષેત્રો (ફોર્મ નં, ગામ, તાલુકો, જીલ્લો) ભરો.",
      );
      setLoading(false);
      return;
    }

    try {
      const method = currentWork ? "PUT" : "POST";
      const basePath = await apiPath();
      const endpoint = currentWork
        ? `${basePath}/api/survey/${currentWork.id}` // Assuming currentWork has an id
        : `${basePath}/api/survey`;

      // Construct payload matching the form structure
      const payload = {
        ...formData,
        // If your API expects nested objects like in your example, you can construct it here:
        // spot: { gaam: formData.gaam, taluka: formData.taluka, district: formData.district },
      };

      console.log(
        `Sending ${method} request to ${endpoint} with payload:`,
        payload,
      );

      // --- COMMENTED OUT ACTUAL API CALL FOR PREVIEW TO WORK WITHOUT ERRORS ---
      // const response = await fetch(endpoint, {
      //   method: method,
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("token") || 'dummy-token'}`,
      //   },
      //   body: JSON.stringify(payload),
      // });
      //
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      // }
      // const result = await response.json();

      // SIMULATING API DELAY AND SUCCESS
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = { message: "Data saved successfully" };

      setActionMessage(
        `માહિતી સફળતાપૂર્વક ${currentWork ? "અપડેટ" : "ઉમેરવામાં"} આવી: ${result.message}`,
      );

      // Reset form if it's a new entry
      if (!currentWork) {
        setFormData({
          formNumber: "",
          gaam: "",
          talatiName: "",
          talatiMobile: "",
          taluka: "",
          district: "",
          sarpanchName: "",
          sarpanchMobile: "",
          recordOfficeDate: "",
          oldAakaraniReg: "ના",
          oldAakaraniYear: "",
          old9DReg: "ના",
          old9DYear: "",
          totalHouses: "",
          expectedCompletionDate: "",
          recordReturnDate: "",
          remarks: "",
        });
      }

      setTimeout(() => {
        setActionMessage("");
      }, 2000);
    } catch (err) {
      console.error("Error adding/editing data:", err);
      setActionMessage(
        `માહિતી ${currentWork ? "અપડેટ" : "ઉમેરવામાં"} નિષ્ફળ: ${err.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 py-6 px-8 text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            આકારણી સર્વે (ફોર્મ) નવા ઑર્ડરની
          </h1>
          <h2 className="text-xl font-medium text-blue-100 mt-2">
            માહિતી રેકર્ડ ઓફિસ પર ગ્રાહકે આપેલ તેની વિગત
          </h2>
        </div>

        {/* Form Section */}
        <form onSubmit={handleAddEditSubmit} className="p-8">
          {/* Messages */}
          {actionMessage && (
            <div
              className={`mb-6 p-4 rounded-md ${actionMessage.includes("નિષ્ફળ") || actionMessage.includes("કૃપા કરીને") ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}
            >
              {actionMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {/* Field 1: Form Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                1. ફોર્મ (દા.ત. 010 A.S.){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="formNumber"
                value={formData.formNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="ફોર્મ નંબર દાખલ કરો"
              />
            </div>
            {/* Field 2 & 5 & 6: Location Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                2. ગામનું નામ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="gaam"
                value={formData.gaam}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="ગામનું નામ"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                3. તાલુકો <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="taluka"
                value={formData.taluka}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="તાલુકો"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                4. જીલ્લો <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="જીલ્લો"
              />
            </div>
            <div className="hidden md:block"></div>{" "}
            {/* Spacer for grid alignment */}
            {/* Field 3 & 4: Talati Info */}
            <div className="mt-4 border-t border-gray-100 pt-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  5. ગ્રાહક તલાટીનું નામ
                </label>
                <input
                  type="text"
                  name="talatiName"
                  value={formData.talatiName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="તલાટીનું પૂરું નામ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  6. મોબાઈલ નંબર (તલાટી)
                </label>
                <input
                  type="tel"
                  name="talatiMobile"
                  value={formData.talatiMobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="98XXXXXXXX"
                />
              </div>
            </div>
            {/* Field 7 & 8: Sarpanch Info */}
            <div className="border-t border-gray-100 pt-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  7. સરપંચશ્રી નું નામ
                </label>
                <input
                  type="text"
                  name="sarpanchName"
                  value={formData.sarpanchName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="સરપંચશ્રી નું પૂરું નામ"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  8. મોબાઈલ નંબર (સરપંચ)
                </label>
                <input
                  type="tel"
                  name="sarpanchMobile"
                  value={formData.sarpanchMobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="94XXXXXXXX"
                />
              </div>
            </div>
            {/* Field 9: Date */}
            <div className="border-t border-gray-100 pt-4 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                9. રેકર્ડ ઓફિસ પર આવ્યા તારીખ
              </label>
              <input
                type="date"
                name="recordOfficeDate"
                value={formData.recordOfficeDate}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {/* Section: ગ્રાહકે આપેલ રેકર્ડની વિગત */}
            <div className="md:col-span-2 mt-8 mb-4">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-200 pb-2 inline-block">
                ગ્રાહકે આપેલ રેકર્ડની વિગત
              </h3>
            </div>
            {/* Field 10: Old Aakarani Reg */}
            <div className="bg-gray-50 p-4 rounded-lg md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  10. જુનું આકારણી રજીસ્ટર?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="oldAakaraniReg"
                      value="હા"
                      checked={formData.oldAakaraniReg === "હા"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">હા</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="oldAakaraniReg"
                      value="ના"
                      checked={formData.oldAakaraniReg === "ના"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">ના</span>
                  </label>
                </div>
              </div>
              <div>
                {formData.oldAakaraniReg === "હા" && (
                  <>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      વર્ષ (દા.ત. 2010/2011)
                    </label>
                    <input
                      type="text"
                      name="oldAakaraniYear"
                      value={formData.oldAakaraniYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="વર્ષ"
                    />
                  </>
                )}
              </div>
            </div>
            {/* Field 11: Old 9/D Reg */}
            <div className="bg-gray-50 p-4 rounded-lg md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  11. જુનું ૯ / ડિ રજીસ્ટર?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="old9DReg"
                      value="હા"
                      checked={formData.old9DReg === "હા"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">હા</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="old9DReg"
                      value="ના"
                      checked={formData.old9DReg === "ના"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">ના</span>
                  </label>
                </div>
              </div>
              <div>
                {formData.old9DReg === "હા" && (
                  <>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      વર્ષ (દા.ત. 2024/2025)
                    </label>
                    <input
                      type="text"
                      name="old9DYear"
                      value={formData.old9DYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="વર્ષ"
                    />
                  </>
                )}
              </div>
            </div>
            {/* Field 12: Total Houses */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                12. કુલ ઘરની સંખ્યા
              </label>
              <input
                type="number"
                name="totalHouses"
                value={formData.totalHouses}
                onChange={handleInputChange}
                className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="સંખ્યા દાખલ કરો"
              />
            </div>
            {/* Field 13 & 14: Dates */}
            <div className="border-t border-gray-100 pt-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  13. કામ પૂર્ણ કરી આપવાની અંદાજીત તારીખ
                </label>
                <input
                  type="date"
                  name="expectedCompletionDate"
                  value={formData.expectedCompletionDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  14. રેકર્ડ પરત મંત્રીને સોપ્યા/ આપ્યા તારીખ
                </label>
                <input
                  type="date"
                  name="recordReturnDate"
                  value={formData.recordReturnDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            {/* Field 15: Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                15. નોંધ / રિમાર્ક્સ
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                placeholder="કોઈ અન્ય નોંધ હોય તો અહી લખો..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-bold text-lg shadow-md transition-colors ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  સેવ થઇ રહ્યું છે...
                </span>
              ) : currentWork ? (
                "અપડેટ કરો"
              ) : (
                "માહિતી સેવ કરો"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
