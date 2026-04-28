import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../config/AuthContext";
import apiPath from "../../isProduction.js";

// import "./SurvayForm.scss";
import { toast } from "react-toastify";
import axios from "axios";

const InputCell = ({ name, value, onChange, isYellow = false }) => (
  <td className="border border-gray-300 p-0 min-w-[70px]">
    <input
      type="number"
      name={name}
      value={Number(value) || ""}
      onChange={onChange}
      disabled={isYellow}
      className={`w-full h-full px-2 py-1.5 outline-none text-sm text-right transition-all focus:ring-2 focus:ring-blue-500 focus:z-10 relative
        ${isYellow ? "bg-yellow-50 text-gray-700 font-semibold cursor-not-allowed" : "bg-white hover:bg-gray-50"}
      `}
    />
  </td>
);

const TaxEntryForm = () => {
  const initialTaxes = [
    {
      id: "house",
      name: "ઘર વેરો",
      demand: { pb: 0, chalu: 0 },
      recovery: { pb: 0, chalu: 0 },
      advance: { last: 0, chalu: 0 },
    },
    {
      id: "water_gen",
      name: "સામાન્ય પાણી વેરો",
      demand: { pb: 0, chalu: 0 },
      recovery: { pb: 0, chalu: 0 },
      advance: { last: 0, chalu: 0 },
    },
    {
      id: "water_spl",
      name: "ખાસ પાણી વેરો",
      demand: { pb: 0, chalu: 0 },
      recovery: { pb: 0, chalu: 0 },
      advance: { last: 0, chalu: 0 },
    },
    {
      id: "light",
      name: "લાઇટ વેરો",
      demand: { pb: 0, chalu: 0 },
      recovery: { pb: 0, chalu: 0 },
      advance: { last: 0, chalu: 0 },
    },
    {
      id: "cleaning",
      name: "સફાઈ વેરો",
      demand: { pb: 0, chalu: 0 },
      recovery: { pb: 0, chalu: 0 },
      advance: { last: 0, chalu: 0 },
    },
  ];

  const [taxes, setTaxes] = useState(initialTaxes);

  // --- Bottom Details State ---
  const [receiptDetails, setReceiptDetails] = useState({
    pNo: "0",
    date: "//",
    amount: "0.00",
  });

  const totalTax = taxes.reduce(
    (acc, tax) => ({
      demand: {
        pb: acc.demand.pb + (Number(tax.demand.pb) || 0),
        chalu: acc.demand.chalu + (Number(tax.demand.chalu) || 0),
      },
      recovery: {
        pb: acc.recovery.pb + (Number(tax.recovery.pb) || 0),
        chalu: acc.recovery.chalu + (Number(tax.recovery.chalu) || 0),
      },
      advance: {
        last: acc.advance.last + (Number(tax.advance.last) || 0),
        chalu: acc.advance.chalu + (Number(tax.advance.chalu) || 0),
      },
    }),
    {
      demand: { pb: 0, chalu: 0 },
      recovery: { pb: 0, chalu: 0 },
      advance: { last: 0, chalu: 0 },
    },
  );

  const handleTaxChange = (index, section, field, value) => {
    const updatedTaxes = [...taxes];

    updatedTaxes[index][section][field] = Number(value);

    setTaxes(updatedTaxes);
  };

  const handleReceiptChange = (e) => {
    const { name, value } = e.target;
    setReceiptDetails((prev) => ({ ...prev, [name]: value }));
  };

  const { mId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, []);

  // 1. STATE INITIALIZATION - Check Local Storage for non-edit mode
  const [formData, setFormData] = useState({});

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const [project, setProject] = useState([]);
  const { projectId } = useParams();

  const fetchProject = async () => {
    try {
      const data = await axios.get(
        `${await apiPath()}/api/work/project/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log(data);
      setProject(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(`Error Fetching Projects: ${error}`);
    }
  };

  useEffect(() => {
    const fetchRecordForEdit = async () => {
      setFormLoading(true);
      setFormError(null);

      try {
        const response = await fetch(
          `${await apiPath()}/api/sheet/${mId}?workId=${projectId}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const record = result.data;

        if (record) {
          // Populate formData
          setFormData({
            serialNumber: record[0] || "",
            areaName: record[1] || "",
            propertyNumber: record[2] || "",
            ownerName: record[3] || "",
            houseCategory: record[8] || "",
          });

          setTaxes([
            {
              id: "house",
              name: "ઘર વેરો",
              demand: {
                pb: Number(record[22] || 0),
                chalu: Number(record[20] || 0),
              },
              recovery: {
                pb: Number(
                  JSON.parse(record[24] || "{}")?.vasulat?.prevtax || 0,
                ),
                chalu: Number(
                  JSON.parse(record[24] || "{}")?.vasulat?.currtax || 0,
                ),
              },
              advance: { last: 0, chalu: 0 },
            },

            {
              id: "water_gen",
              name: "સામાન્ય પાણી વેરો",
              demand: {
                pb: Number(
                  JSON.parse(record[23] || "{}")?.normal_water?.prev || 0,
                ),
                chalu: Number(
                  JSON.parse(record[21] || "{}")?.normal_water?.curr || 0,
                ),
              },
              recovery: {
                pb: Number(
                  JSON.parse(record[23] || "{}")?.normal_water?.vasulat || 0,
                ),
                chalu: Number(
                  JSON.parse(record[21] || "{}")?.normal_water?.vasulat || 0,
                ),
              },
              advance: { last: 0, chalu: 0 },
            },

            {
              id: "water_spl",
              name: "ખાસ પાણી વેરો",
              demand: {
                pb: Number(
                  JSON.parse(record[23] || "{}")?.special_water?.prev || 0,
                ),
                chalu: Number(
                  JSON.parse(record[21] || "{}")?.special_water?.curr || 0,
                ),
              },
              recovery: {
                pb: Number(
                  JSON.parse(record[23] || "{}")?.special_water?.vasulat || 0,
                ),
                chalu: Number(
                  JSON.parse(record[21] || "{}")?.special_water?.vasulat || 0,
                ),
              },
              advance: { last: 0, chalu: 0 },
            },

            {
              id: "light",
              name: "લાઇટ વેરો",
              demand: {
                pb: Number(JSON.parse(record[23] || "{}")?.light?.prev || 0),
                chalu: Number(JSON.parse(record[21] || "{}")?.light?.curr || 0),
              },
              recovery: {
                pb: Number(JSON.parse(record[23] || "{}")?.light?.vasulat || 0),
                chalu: Number(
                  JSON.parse(record[21] || "{}")?.light?.vasulat || 0,
                ),
              },
              advance: { last: 0, chalu: 0 },
            },
            {
              id: "cleaning",
              name: "સફાઈ વેરો",
              demand: {
                pb: Number(JSON.parse(record[23] || "{}")?.cleaning?.prev || 0),
                chalu: Number(
                  JSON.parse(record[21] || "{}")?.cleaning?.curr || 0,
                ),
              },
              recovery: {
                pb: Number(
                  JSON.parse(record[23] || "{}")?.cleaning?.vasulat || 0,
                ),
                chalu: Number(
                  JSON.parse(record[21] || "{}")?.cleaning?.vasulat || 0,
                ),
              },
              advance: { last: 0, chalu: 0 },
            },
          ]);

          setReceiptDetails({
            pNo: JSON.parse(record[24] || "{}")?.receipt?.pNo || "",
            date: JSON.parse(record[24] || "{}")?.receipt?.date || "",
            amount: JSON.parse(record[24] || "{}")?.receipt?.amount || "",
          });
        } else {
          setFormError("રેકોર્ડ મળ્યો નથી.");
        }
      } catch (err) {
        console.error("Error fetching record for edit:", err);
        setFormError("રેકોર્ડ લાવવામાં નિષ્ફળ.");
      } finally {
        setFormLoading(false);
      }
    };

    fetchRecordForEdit();
  }, [projectId]);

  const handleSubmit = async (e) => {
    if (formLoading) return;

    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    // Update time just before submission
    const finalFormData = {
      formData,
      taxes,
      receiptDetails,
      workId: projectId,
    };

    try {
      const response = await fetch(`${await apiPath()}/api/sheet/tax/${mId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(finalFormData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Success:", result.message);
        alert(`Entry Saved ✅`);
        navigate(`/survay/taxform/${projectId}`);
      } else {
        console.error("Error submitting form:", result.message);
        setFormError(`ફોર્મ અપડેટ કરવામાં ભૂલ: ${result.message}`);
      }
    } catch (error) {
      console.error("Network error or unexpected issue:", error);
      setFormError("નેટવર્ક ભૂલ અથવા અણધારી સમસ્યા આવી.");
    } finally {
      setFormLoading(false);
    }
  };

  console.log(formData);

  // --- Render (Omitted for brevity, as it's the same) ---
  return (
    <div className="form-container">
      {/* Added margin for sidebar */}

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Tax Data Entry Form
      </h1>
      <div className="flex justify-around text-sm font-medium text-gray-600 mb-4">
        <span>ગામ: {project?.spot?.gaam || "..."}</span>
        <span>તાલુકો: {project?.spot?.taluka || "..."}</span>
        <span>જિલ્લો: {project?.spot?.district || "..."}</span>
      </div>

      {formError && (
        <div className="text-center text-red-600 text-lg mb-4">{formError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 flex flex-col gap-6">
            {/* Main Title */}
            <div className="bg-[#c2a77a] text-white text-center py-2 rounded shadow-sm font-bold text-lg tracking-wide">
              ગામનો નમુનો નંબર ૯
            </div>

            {/* Header Inputs - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm items-center">
              <div className="md:col-span-2 md:text-right font-medium text-gray-700">
                ખાતા નંબર
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="serialNumber"
                  value={formData?.serialNumber || ""}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-2 md:text-right font-medium text-gray-700">
                ખાતેદાર નું નામ
              </div>
              <div className="md:col-span-3">
                <input
                  type="text"
                  name="ownerName"
                  value={formData?.ownerName || ""}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="md:col-span-1 md:text-right font-medium text-gray-700">
                પ્રોપર્ટી નંબર
              </div>
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="propertyNumber"
                  value={formData?.propertyNumber || ""}
                  className="w-full border border-gray-300 bg-yellow-50 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="text-center font-semibold bg-gray-100 text-gray-700">
                    <th className="border border-gray-300 p-2" rowSpan="2">
                      વેરાના નામો
                    </th>
                    <th className="border border-gray-300 p-2" colSpan="3">
                      માંગણું
                    </th>
                    <th className="border border-gray-300 p-2" colSpan="3">
                      કુલ વસૂલાત
                    </th>
                    <th className="border border-gray-300 p-2" colSpan="3">
                      બાકી
                    </th>
                    <th className="border border-gray-300 p-2 text-xs leading-tight">
                      ગઈ સાલના
                      <br />
                      જમા
                    </th>
                    <th className="border border-gray-300 p-2 text-xs leading-tight">
                      ચાલુસાલના
                      <br />
                      જમા
                    </th>
                  </tr>
                  <tr className="text-center font-medium bg-gray-50 text-gray-600 text-xs">
                    <th className="border border-gray-300 py-1 px-2">
                      પા. બા.
                    </th>
                    <th className="border border-gray-300 py-1 px-2">ચાલુ</th>
                    <th className="border border-gray-300 py-1 px-2">કુલ</th>
                    <th className="border border-gray-300 py-1 px-2">
                      પા. બા.
                    </th>
                    <th className="border border-gray-300 py-1 px-2">ચાલુ</th>
                    <th className="border border-gray-300 py-1 px-2">કુલ</th>
                    <th className="border border-gray-300 py-1 px-2">
                      પા. બા.
                    </th>
                    <th className="border border-gray-300 py-1 px-2">ચાલુ</th>
                    <th className="border border-gray-300 py-1 px-2">કુલ</th>
                    <th className="border border-gray-300"></th>
                    <th className="border border-gray-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {taxes.map((tax, index) => (
                    <tr key={tax.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 font-medium bg-gray-50 text-gray-700 whitespace-nowrap">
                        {tax.name}
                      </td>

                      {/* DEMAND */}
                      <InputCell
                        name="demand.pb"
                        value={tax.demand.pb}
                        onChange={(e) =>
                          handleTaxChange(index, "demand", "pb", e.target.value)
                        }
                      />
                      <InputCell
                        name="demand.chalu"
                        value={tax.demand.chalu}
                        onChange={(e) =>
                          handleTaxChange(
                            index,
                            "demand",
                            "chalu",
                            e.target.value,
                          )
                        }
                      />
                      <InputCell
                        name="demand.total"
                        value={tax.demand.pb + tax.demand.chalu}
                        isYellow
                      />

                      {/* RECOVERY */}
                      <InputCell
                        name="recovery.pb"
                        value={tax.recovery.pb}
                        onChange={(e) =>
                          handleTaxChange(
                            index,
                            "recovery",
                            "pb",
                            e.target.value,
                          )
                        }
                      />
                      <InputCell
                        name="recovery.chalu"
                        value={tax.recovery.chalu}
                        onChange={(e) =>
                          handleTaxChange(
                            index,
                            "recovery",
                            "chalu",
                            e.target.value,
                          )
                        }
                      />
                      <InputCell
                        name="recovery.total"
                        value={tax.recovery.pb + tax.recovery.chalu}
                        isYellow
                      />

                      {/* BALANCE */}
                      <InputCell
                        name="balance.pb"
                        value={tax.demand.pb - tax.recovery.pb}
                        isYellow
                      />
                      <InputCell
                        name="balance.chalu"
                        value={tax.demand.chalu - tax.recovery.chalu}
                        isYellow
                      />
                      <InputCell
                        name="balance.total"
                        value={
                          tax.demand.pb -
                          tax.recovery.pb +
                          (tax.demand.chalu - tax.recovery.chalu)
                        }
                        isYellow
                      />

                      {/* ADVANCE */}
                      <InputCell
                        name="advance.last"
                        value={tax.advance.last}
                        onChange={(e) =>
                          handleTaxChange(
                            index,
                            "advance",
                            "last",
                            e.target.value,
                          )
                        }
                      />
                      <InputCell
                        name="advance.chalu"
                        value={tax.advance.chalu}
                        onChange={(e) =>
                          handleTaxChange(
                            index,
                            "advance",
                            "chalu",
                            e.target.value,
                          )
                        }
                      />
                    </tr>
                  ))}

                  {/* Total Row */}
                  <tr className="bg-gray-100">
                    <td className="border border-gray-300 px-3 py-2 font-bold text-gray-800 text-right">
                      એકંદર કુલ
                    </td>
                    <InputCell value={totalTax.demand.pb} isYellow />
                    <InputCell value={totalTax.demand.chalu} isYellow />
                    <InputCell
                      value={totalTax.demand.pb + totalTax.demand.chalu}
                      isYellow
                    />

                    <InputCell value={totalTax.recovery.pb} isYellow />
                    <InputCell value={totalTax.recovery.chalu} isYellow />
                    <InputCell
                      value={totalTax.recovery.pb + totalTax.recovery.chalu}
                      isYellow
                    />

                    <InputCell
                      value={totalTax.demand.pb - totalTax.recovery.pb}
                      isYellow
                    />
                    <InputCell
                      value={totalTax.demand.chalu - totalTax.recovery.chalu}
                      isYellow
                    />
                    <InputCell
                      value={
                        totalTax.demand.pb -
                        totalTax.recovery.pb +
                        (totalTax.demand.chalu - totalTax.recovery.chalu)
                      }
                      isYellow
                    />

                    <InputCell value={totalTax.advance.last} isYellow />
                    <InputCell value={totalTax.advance.chalu} isYellow />
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Section - Receipt */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="border border-gray-300 bg-gray-50 rounded p-3 shadow-sm">
                <div className="text-center font-bold text-gray-700 mb-2 text-sm border-b pb-2">
                  પહોંચની વિગત
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium text-center text-gray-600 mb-1">
                  {/* <div>ક્રમ</div> */}
                  <div>પ.નં</div>
                  <div>તારીખ</div>
                  <div>રૂપિયા</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* <input
                    type="text"
                    name="sr"
                    value={receiptDetails.sr}
                    onChange={handleReceiptChange}
                    className="w-full border border-gray-300 rounded px-1 py-1 text-center outline-none focus:ring-2 focus:ring-blue-400"
                  /> */}
                  <input
                    type="text"
                    name="pNo"
                    value={receiptDetails.pNo}
                    onChange={handleReceiptChange}
                    className="w-full border border-gray-300 rounded px-1 py-1 text-center outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="date"
                    name="date"
                    value={receiptDetails.date}
                    onChange={handleReceiptChange}
                    className="w-full border border-gray-300 rounded px-1 py-1 text-center outline-none focus:ring-2 focus:ring-blue-400 text-xs"
                  />
                  <input
                    type="number"
                    name="amount"
                    value={receiptDetails.amount}
                    onChange={handleReceiptChange}
                    className="w-full border border-gray-300 rounded px-1 py-1 text-right outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={formLoading}
            className={`px-8 py-3 rounded-lg text-white font-bold text-lg shadow-md transition-colors 
                ${formLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"}`}
          >
            {formLoading ? "Updating..." : "Update Record"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaxEntryForm;
