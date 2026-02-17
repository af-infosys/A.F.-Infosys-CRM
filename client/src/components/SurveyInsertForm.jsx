import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../config/AuthContext";
import apiPath from "../isProduction";

import "./SurvayForm.scss";
import ImageUploadSlot from "../components/ImageUploadSlot.jsx";
import { toast } from "react-toastify";
import axios from "axios";

// --- Initial State Definition ---
const initialFormData = (user) => ({
  serialNumber: "",
  areaName: "",
  propertyNumber: "",
  ownerName: "",
  oldPropertyNumber: "",
  mobileNumber: "",
  propertyNameOnRecord: "",
  houseCategory: "",
  kitchenCount: "",
  bathroomCount: "",
  verandaCount: "",
  tapCount: "",
  toiletCount: "",
  remarks: "",
  bp: "",
  survayor: { id: user?.id, name: user?.name, time: new Date() },
  img1: "",
  img2: "",
  img3: "",
});

const initialFloorsState = [
  {
    floorType: "",
    roomDetails: [
      {
        type: "",
        roomHallShopGodown: "",
        slabRooms: "",
        tinRooms: "",
        woodenRooms: "",
        tileRooms: "",
      },
    ],
  },
];
// ----------------------------------------

const SurvayInsertForm = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const isEditMode = !!id;

  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, []);

  const categories = [
    "રહેણાંક - મકાન",
    "દુકાન",
    "ધાર્મિક સ્થળ",
    "સરકારી મિલ્ક્ત",
    "પ્રાઈવેટ - સંસ્થાઓ",
    "પ્લોટ ખાનગી - ખુલ્લી જગ્યા",
    "પ્લોટ (ફરતી દિવાલ) ખાનગી",
    "પ્લોટ સરકારી - કોમનપ્લોટ",
    "પ્લોટ (ફરતી દિવાલ) સરકારી",
    "કારખાના - ઇન્ડસ્ટ્રીજ઼",
    "ટ્રસ્ટ મિલ્કત / NGO",
    "મંડળી - સેવા સહકારી મંડળી",
    "બેંક - સરકારી",
    "બેંક - અર્ધ સરકારી બેંક",
    "બેંક - પ્રાઇટ બેંક",
    "સરકારી સહાય આવાસ",
    "કોમ્પપ્લેક્ષ",
    "હિરાના કારખાના નાના",
    "હિરાના કારખાના મોટા",
    "મોબાઈલ ટાવર",
    "પેટ્રોલ પંપ, ગેસ પંપ",
  ];

  // --- Utility to convert Gujarati to English Digits ---
  const convertGujaratiToEnglishDigits = (input) => {
    const gujaratiDigits = "૦૧૨૩૪૫૬૭૮૯";
    const englishDigits = "0123456789";

    return input.replace(
      /[૦૧૨૩૪૫૬૭૮૯]/g,
      (char) => englishDigits[gujaratiDigits.indexOf(char)],
    );
  };
  // ----------------------------------------------------

  // 1. STATE INITIALIZATION - Check Local Storage for non-edit mode
  const [formData, setFormData] = useState(initialFormData(user));

  const [floors, setFloors] = useState(initialFloorsState);

  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areasError, setAreasError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [imageAkarni, setImageAkarni] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "houseCategory") {
      if (value === "પ્લોટ ખાનગી - ખુલ્લી જગ્યા") {
        setFloors([
          {
            floorType: "પ્લોટ",
            roomDetails: [
              {
                type: "પ્લોટ",
                roomHallShopGodown: "પ્લોટ ખાનગી - ખુલ્લી જગ્યા",
                slabRooms: "",
                tinRooms: "",
                woodenRooms: "",
                tileRooms: "",
              },
            ],
          },
        ]);
      } else if (value === "પ્લોટ સરકારી - કોમનપ્લોટ") {
        setFloors([
          {
            floorType: "પ્લોટ",
            roomDetails: [
              {
                type: "પ્લોટ",
                roomHallShopGodown: "પ્લોટ સરકારી - કોમનપ્લોટ",
                slabRooms: "",
                tinRooms: "",
                woodenRooms: "",
                tileRooms: "",
              },
            ],
          },
        ]);
      } else if (value === "પ્લોટ (ફરતી દિવાલ) ખાનગી") {
        setFloors([
          {
            floorType: "પ્લોટ",
            roomDetails: [
              {
                type: "પ્લોટ",
                roomHallShopGodown: "પ્લોટ (ફરતી દિવાલ) ખાનગી",
                slabRooms: "",
                tinRooms: "",
                woodenRooms: "",
                tileRooms: "",
              },
            ],
          },
        ]);
      } else if (value === "પ્લોટ (ફરતી દિવાલ) સરકારી") {
        setFloors([
          {
            floorType: "પ્લોટ",
            roomDetails: [
              {
                type: "પ્લોટ",
                roomHallShopGodown: "પ્લોટ (ફરતી દિવાલ) સરકારી",
                slabRooms: "",
                tinRooms: "",
                woodenRooms: "",
                tileRooms: "",
              },
            ],
          },
        ]);
      }
    }

    const englishValue = convertGujaratiToEnglishDigits(value);

    // Handle Checkbox for landArea
    if (name === "landArea") {
      if (checked === true) {
        setFloors((prev) => [
          ...prev,
          {
            floorType: "ફળિયું",
            roomDetails: [
              {
                type: "",
                roomHallShopGodown: "",
                slabRooms: "",
                tinRooms: "",
                woodenRooms: "",
                tileRooms: "",
              },
            ],
          },
        ]);
      } else {
        // delete floor with type == ફળિયું
        setFloors(floors.filter((floor) => floor.floorType !== "ફળિયું"));
      }

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    if (name === "bp") {
      if (checked === true) {
        setFormData((prev) => ({
          ...prev,
          remarks: `બિ.પ. ${prev?.remarks}`?.trim(),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          remarks: `${prev?.remarks.replace("બિ.પ.", "")}`?.trim(),
        }));
      }

      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));

      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: englishValue,
    }));
  };

  //   const handleFloorChange = (index, e) => {
  //     const { name, value } = e.target;
  //     const englishValue = convertGujaratiToEnglishDigits(value);

  //     const updatedFloors = floors.map((floor, i) =>
  //       i === index ? { ...floor, [name]: englishValue } : floor,
  //     );
  //     setFloors(updatedFloors);
  //   };

  const handleRoomDetailsChange = (floorIndex, roomIndex, e) => {
    const { name, value } = e.target;

    const processedValue =
      name !== "roomHallShopGodown" && name !== "type"
        ? convertGujaratiToEnglishDigits(value)
        : value;

    setFloors((prevFloors) => {
      const newFloors = [...prevFloors];
      newFloors[floorIndex].roomDetails[roomIndex] = {
        ...newFloors[floorIndex].roomDetails[roomIndex],
        [name]: processedValue,
      };
      return newFloors;
    });
  };

  const addFloor = () => {
    setFloors((prevFloors) => [
      ...prevFloors,
      {
        floorType: "",
        roomDetails: [
          {
            type: "",
            roomHallShopGodown: "",
            slabRooms: "",
            tinRooms: "",
            woodenRooms: "",
            tileRooms: "",
          },
        ],
      },
    ]);
  };

  const addRoomDetails = (floorIndex) => {
    setFloors((prevFloors) => {
      const newFloors = [...prevFloors];
      newFloors[floorIndex].roomDetails.push({
        type: "",
        roomHallShopGodown: "",
        slabRooms: "",
        tinRooms: "",
        woodenRooms: "",
        tileRooms: "",
      });
      return newFloors;
    });
  };

  const handleFloorTypeChange = (floorIndex, e) => {
    const { value } = e.target;
    setFloors((prevFloors) => {
      const newFloors = [...prevFloors];
      newFloors[floorIndex] = {
        ...newFloors[floorIndex],
        floorType: value,
      };
      return newFloors;
    });
  };

  const handleSubmit = async (e) => {
    if (formLoading) return;

    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    // Update time just before submission
    const finalFormData = {
      ...formData,
      mobileNumber: Number(formData.mobileNumber),
      floors: floors,
      workId: projectId,
    };

    try {
      const response = await fetch(`${await apiPath()}/api/sheet/insert`, {
        method: "POST",
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
        navigate(`/excel/akarni/${projectId}`);

        // Reset form for a *new* submission
        if (!isEditMode) {
          setFormData(initialFormData(user));
          setFloors(initialFloorsState);
          // Re-fetch index after successful submission
        }
      } else {
        console.error("Error submitting form:", result.message);
        setFormError(
          `ફોર્મ ${isEditMode ? "અપડેટ" : "સબમિટ"} કરવામાં ભૂલ: ${
            result.message
          }`,
        );
      }
    } catch (error) {
      console.error("Network error or unexpected issue:", error);
      setFormError("નેટવર્ક ભૂલ અથવા અણધારી સમસ્યા આવી.");
    } finally {
      setFormLoading(false);
    }
  };

  // Effect to load existing data if in edit mode (No Change Needed Here)

  // Effect for loading areas and Image Mode (No Change Needed Here)
  useEffect(() => {
    const fetchAreas = async () => {
      setAreasLoading(true);
      setAreasError(null);
      try {
        const response = await fetch(
          `${await apiPath()}/api/sheet/areas?workId=${projectId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setAreas(result.data);
      } catch (err) {
        console.error("Error fetching areas:", err);
        setAreasError("વિસ્તારો લાવવામાં નિષ્ફળ.");
      } finally {
        setAreasLoading(false);
      }
    };

    fetchAreas();
  }, []);

  console.log(formData);

  const deleteFloor = (floorIndex) => {
    if (!window.confirm("Sure to Delete!")) return;

    setFloors((prevFloors) => prevFloors.filter((_, i) => i !== floorIndex));
  };

  const deleteRoomDetails = (floorIndex, roomIndex) => {
    if (!window.confirm("Sure to Delete!")) return;

    setFloors((prevFloors) => {
      const newFloors = [...prevFloors]; // Create a shallow copy of the floors array
      const newRoomDetails = newFloors[floorIndex].roomDetails.filter(
        (_, i) => i !== roomIndex,
      );
      newFloors[floorIndex] = {
        ...newFloors[floorIndex], // Copy the rest of the floor data
        roomDetails: newRoomDetails, // Update the roomDetails array
      };
      return newFloors;
    });
  };

  // Original fetchImageMode logic
  useEffect(() => {
    const fetchImageMode = async () => {
      try {
        const res = await fetch(
          `${await apiPath()}/api/valuation/getImageMode/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await res.json();
        console.log("Image Mode: ", data);
        setImageAkarni(data?.isImage);
      } catch (err) {
        console.log("Image Catched", err);
        setImageAkarni(false);
      }
    };

    if (user?.id) {
      // Only run if user ID is available
      fetchImageMode();
    }
  }, [user?.id]);

  // --- Render (Omitted for brevity, as it's the same) ---
  return (
    <div className="form-container p-8">
      {/* Added margin for sidebar */}

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        સર્વે ફોર્મ {isEditMode ? "(સંપાદિત કરો)" : ""}
      </h1>
      <div className="flex justify-around text-sm font-medium text-gray-600 mb-4">
        <span>ગામ: {project?.spot?.gaam}</span>
        <span>તાલુકો: {project?.spot?.taluka}</span>
        <span>જિલ્લો: {project?.spot?.district}</span>
      </div>

      {formLoading && (
        <div className="text-center text-blue-600 text-lg mb-4">
          {isEditMode ? "Loading..." : "Submitting..."}
        </div>
      )}

      {formError && (
        <div className="text-center text-red-600 text-lg mb-4">{formError}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Field 1: અનું ક્રમાંક */}
          <div className="form-field">
            <label htmlFor="serialNumber" className="form-label">
              1. અનું ક્રમાંક *
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              className="form-input"
              placeholder="દા.ત. 001"
              value={Number(formData.serialNumber) || ""}
              onChange={handleChange}
              required
              // disabled={isEditMode}
              style={{ maxWidth: "82px" }}
              maxLength="5"
            />
          </div>

          {/* Field 2: વિસ્તારનું નામ (હવે select dropdown) */}
          <div className="form-field">
            <label htmlFor="areaName" className="form-label">
              2. વિસ્તારનું નામ *
            </label>
            {areasLoading ? (
              <select className="form-select" disabled>
                <option>વિસ્તારો લોડ થઈ રહ્યા છે...</option>
              </select>
            ) : areasError ? (
              <select className="form-select" disabled>
                <option>વિસ્તારો લોડ કરવામાં ભૂલ</option>
              </select>
            ) : (
              <select
                id="areaName"
                name="areaName"
                className="form-select"
                value={formData.areaName}
                onChange={handleChange}
                required
              >
                <option value="">વિસ્તાર પસંદ કરો</option>
                {areas?.map((area) => (
                  <option key={area?.id} value={area?.name}>
                    {area?.id}. {area?.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Field 3: મિલ્કત ક્રમાંક */}
          <div className="form-field">
            <label htmlFor="propertyNumber" className="form-label">
              3. મિલ્કત ક્રમાંક *
            </label>
            <input
              type="text"
              id="propertyNumber"
              name="propertyNumber"
              className="form-input"
              placeholder="દા.ત. P12345"
              value={Number(formData.propertyNumber) || ""}
              onChange={handleChange}
              required
              style={{ maxWidth: "82px" }}
              maxLength="5"
            />
          </div>

          {/* Field 4: માલિકનું નામ */}
          <div className="form-field">
            <label htmlFor="ownerName" className="form-label">
              4. માલિકનું નામ *
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              className="form-input"
              placeholder="Name Fathername Surname"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="occName" className="form-label">
              5. કબ્જેદારનું નામ *
            </label>
            <input
              type="text"
              id="occName"
              name="occName"
              className="form-input"
              placeholder="Name Fathername Surname"
              value={formData.occName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Field 5: જુનો મિલકત નંબર */}
          <div className="form-field">
            <label htmlFor="oldPropertyNumber" className="form-label">
              6. જુનો મિલકત નંબર
            </label>
            <input
              type="text"
              id="oldPropertyNumber"
              name="oldPropertyNumber"
              className="form-input"
              placeholder="જો હોય તો દાખલ કરો"
              value={formData.oldPropertyNumber}
              onChange={handleChange}
              style={{ maxWidth: "82px" }}
              maxLength="5"
            />
          </div>

          {/* Field 6: મોબાઈલ નંબર */}
          <div className="form-field">
            <label htmlFor="mobileNumber" className="form-label">
              7. મોબાઈલ નંબર (Whatsapp)
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              className="form-input"
              placeholder="9876543210"
              title="કૃપા કરીને 10 અંકનો મોબાઇલ નંબર દાખલ કરો"
              value={Number(formData.mobileNumber)}
              onChange={handleChange}
              style={{ maxWidth: "130px" }}
              maxLength="10"
            />
          </div>

          {/* Field 7: મિલ્ક્ત પર લખેલ નામ મકાન/દુકાન/ કારખાના/ કંપનીનું નામ */}
          <div className="form-field md:col-span-2">
            <label htmlFor="propertyNameOnRecord" className="form-label">
              8. મિલ્ક્ત પર લખેલ નામ મકાન/દુકાન/ કારખાના/ કંપનીનું નામ
            </label>
            <input
              type="text"
              id="propertyNameOnRecord"
              name="propertyNameOnRecord"
              className="form-input"
              placeholder=""
              value={formData.propertyNameOnRecord}
              onChange={handleChange}
            />
          </div>

          {/* Field 9: મકાન category */}
          <div className="form-field">
            <label htmlFor="houseCategory" className="form-label">
              9. મકાન category *
            </label>
            <select
              id="houseCategory"
              name="houseCategory"
              className="form-select"
              value={formData.houseCategory}
              onChange={handleChange}
              required
            >
              <option value="">કેટેગરી પસંદ કરો</option>
              {categories?.map((category) => {
                return <option value={category}>{category}</option>;
              })}
              {/* <option value="રહેણાંક - મકાન">1. રહેણાંક - મકાન</option>
              <option value="દુકાન">2. દુકાન</option>
              <option value="ધાર્મિક સ્થળ">3. ધાર્મિક સ્થળ</option>
              <option value="સરકારી મિલ્ક્ત">4. સરકારી મિલ્ક્ત</option>
              <option value="પ્રાઈવેટ - સંસ્થાઓ">5. પ્રાઈવેટ - સંસ્થાઓ</option>
              <option value="પ્લોટ ખાનગી - ખુલ્લી જગ્યા">
                6. પ્લોટ ખાનગી - ખુલ્લી જગ્યા
              </option>
              <option value="પ્લોટ સરકારી - કોમનપ્લોટ">
                7. પ્લોટ સરકારી - કોમનપ્લોટ
              </option>
              <option value="કારખાના - ઇન્ડસ્ટ્રીજ઼">
                8. કારખાના - ઇન્ડસ્ટ્રીજ઼
              </option>
              <option value="ટ્રસ્ટ મિલ્કત / NGO">
                9. ટ્રસ્ટ મિલ્કત / NGO
              </option>
              <option value="મંડળી - સેવા સહકારી મંડળી">
                10. મંડળી - સેવા સહકારી મંડળી
              </option>
              <option value="બેંક - સરકારી">11. બેંક - સરકારી</option>
              <option value="બેંક - અર્ધ સરકારી બેંક">
                12. બેંક - અર્ધ સરકારી બેંક
              </option>
              <option value="બેંક - પ્રાઇટ બેંક">13. બેંક - પ્રાઇટ બેંક</option>
              <option value="સરકારી સહાય આવાસ">14. સરકારી સહાય આવાસ</option>
              <option value="કોમ્પપ્લેક્ષ">15. કોમ્પપ્લેક્ષ</option>

              <option value="હિરાના કારખાના નાના">
                16. હિરાના કારખાના નાના
              </option>
              <option value="હિરાના કારખાના મોટા">
                17. હિરાના કારખાના મોટા
              </option>
              <option value="મોબાઈલ ટાવર">18. મોબાઈલ ટાવર</option>
              <option value="પેટ્રોલ પંપ, ગેસ પંપ">
                19. પેટ્રોલ પંપ, ગેસ પંપ
              </option> */}
            </select>
          </div>
        </div>

        <h2 className="section-title mt-8">10. માળની વિગતો *</h2>

        <div id="floorsContainer">
          {floors.map((floor, floorIndex) =>
            floor.floorType === "ફળિયું" ? null : floor.floorType ===
              "પ્લોટ" ? null : (
              <div
                key={floorIndex}
                className="floor-section mb-6 p-4 border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="floor-section-title text-lg font-semibold">
                    માળ:{" "}
                    <span className="floor-index">
                      {floor.floorType || `માળ ${floorIndex + 1}`}
                    </span>
                  </h3>

                  <div className="form-field mb-4" style={{ display: "flex" }}>
                    <label
                      htmlFor={`floorTypeSelect-${floorIndex}`}
                      className="form-label"
                    >
                      માળનો પ્રકાર *
                    </label>
                    <select
                      id={`floorTypeSelect-${floorIndex}`}
                      name="floorType"
                      className="form-select w-full p-2 border rounded"
                      value={floor.floorType}
                      onChange={(e) => handleFloorTypeChange(floorIndex, e)}
                      required
                    >
                      <option value="" selected disabled>
                        માળ પસંદ કરો
                      </option>
                      <option value="ગ્રાઉન્ડ ફ્લોર">ગ્રાઉન્ડ ફ્લોર</option>
                      <option value="પ્રથમ માળ">પ્રથમ માળ</option>
                      <option value="બીજો માળ">બીજો માળ</option>
                      <option value="ત્રીજો માળ">ત્રીજો માળ</option>
                      <option value="ચોથો માળ">ચોથો માળ</option>
                      <option value="પાંચમો માળ">પાંચમો માળ</option>
                    </select>
                  </div>

                  {floors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteFloor(floorIndex)}
                      className="delete-button text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {floor.roomDetails.map((room, roomIndex) => (
                  <div
                    key={roomIndex}
                    className="room-details-section p-4 my-4 bg-gray-50 rounded-md"
                    style={{ background: "#ffd7d3" }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">
                        વર્ણન : {roomIndex + 1} *
                      </h4>

                      {floor.roomDetails.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            deleteRoomDetails(floorIndex, roomIndex)
                          }
                          className="delete-button text-red-600 hover:text-red-800"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                      {/* Floor-level type select, now inside the room loop */}
                      <div className="form-field mb-4">
                        <label
                          htmlFor={`roomTypeSelect-${floorIndex}-${roomIndex}`}
                          className="form-label"
                        >
                          પ્રકાર
                        </label>
                        <select
                          id={`roomTypeSelect-${floorIndex}-${roomIndex}`}
                          name="type"
                          className="form-select w-full p-2 border rounded"
                          value={room.type}
                          onChange={(e) =>
                            handleRoomDetailsChange(floorIndex, roomIndex, e)
                          }
                          required
                        >
                          <option value="" selected disabled>
                            Select
                          </option>
                          <option value="પાકા">પાકા</option>
                          <option value="કાચા">કાચા</option>
                        </select>
                      </div>

                      {/* Inputs for number of rooms */}
                      <div
                        className="form-group flex space-x-0 mt-4"
                        style={{
                          display: "flex",
                          alignItems: "space-between",
                        }}
                      >
                        {/* સ્લેબ */}
                        <div className="form-field">
                          <label
                            htmlFor={`slabRooms-${floorIndex}-${roomIndex}`}
                            className="form-label text-sm"
                          >
                            સ્લેબ
                          </label>
                          <input
                            type="number"
                            id={`slabRooms-${floorIndex}-${roomIndex}`}
                            name="slabRooms"
                            className="form-input p-2 border rounded w-20"
                            min="0"
                            value={room.slabRooms}
                            onChange={(e) =>
                              handleRoomDetailsChange(floorIndex, roomIndex, e)
                            }
                            maxLength="3"
                            style={{ maxWidth: "45px" }}
                          />
                        </div>

                        {/* પતરા */}
                        <div className="form-field">
                          <label
                            htmlFor={`tinRooms-${floorIndex}-${roomIndex}`}
                            className="form-label text-sm"
                          >
                            પતરા
                          </label>
                          <input
                            type="number"
                            id={`tinRooms-${floorIndex}-${roomIndex}`}
                            name="tinRooms"
                            className="form-input p-2 border rounded w-20"
                            min="0"
                            value={room.tinRooms}
                            onChange={(e) =>
                              handleRoomDetailsChange(floorIndex, roomIndex, e)
                            }
                            maxLength="3"
                            style={{ maxWidth: "45px" }}
                          />
                        </div>

                        {/* પીઢીયા */}
                        <div className="form-field">
                          <label
                            htmlFor={`woodenRooms-${floorIndex}-${roomIndex}`}
                            className="form-label text-sm"
                          >
                            પીઢીયા
                          </label>
                          <input
                            type="number"
                            id={`woodenRooms-${floorIndex}-${roomIndex}`}
                            name="woodenRooms"
                            className="form-input p-2 border rounded w-20"
                            min="0"
                            value={room.woodenRooms}
                            onChange={(e) =>
                              handleRoomDetailsChange(floorIndex, roomIndex, e)
                            }
                            maxLength="3"
                            style={{ maxWidth: "45px" }}
                          />
                        </div>

                        {/* નળીયા */}
                        <div className="form-field">
                          <label
                            htmlFor={`tileRooms-${floorIndex}-${roomIndex}`}
                            className="form-label text-sm"
                          >
                            નળીયા
                          </label>
                          <input
                            type="number"
                            id={`tileRooms-${floorIndex}-${roomIndex}`}
                            name="tileRooms"
                            className="form-input p-2 border rounded w-20"
                            min="0"
                            value={room.tileRooms}
                            onChange={(e) =>
                              handleRoomDetailsChange(floorIndex, roomIndex, e)
                            }
                            maxLength="3"
                            style={{ maxWidth: "45px" }}
                          />
                        </div>
                      </div>

                      {/* Field: રૂમ હોલ દુકાન ગોડાઉન */}
                      <div className="form-field">
                        <label
                          htmlFor={`roomType-${floorIndex}-${roomIndex}`}
                          className="form-label"
                        >
                          રૂમ હોલ દુકાન ગોડાઉન
                        </label>
                        <select
                          id={`roomType-${floorIndex}-${roomIndex}`}
                          name="roomHallShopGodown"
                          className="form-select w-full p-2 border rounded"
                          value={room.roomHallShopGodown}
                          onChange={(e) =>
                            handleRoomDetailsChange(floorIndex, roomIndex, e)
                          }
                          required
                        >
                          <option value="" selected disabled>
                            Select
                          </option>
                          <option value="રૂમ">રૂમ (Room)</option>

                          <option value="હોલ નાનો">હોલ નાનો</option>
                          <option value="હોલ મોટો">હોલ મોટો</option>
                          {/* <option value="હોલ">હોલ (Hall)</option> */}

                          <option value="દુકાન નાની">દુકાન નાની</option>
                          <option value="દુકાન મોટી">દુકાન મોટી</option>
                          {/* <option value="દુકાન">દુકાન (Shop)</option> */}

                          <option value="ગોડાઉન નાનું">ગોડાઉન નાનું </option>
                          <option value="ગોડાઉન મોટું">ગોડાઉન મોટું</option>
                          {/* <option value="ગોડાઉન">ગોડાઉન (Godown)</option> */}

                          <option value="ઢાળિયું">ઢાળિયું</option>
                          <option value="કેબિન">કેબિન</option>
                          <option value="પાળું">પાળું</option>

                          <option value="શેડ નાના પતરાવાળા">
                            શેડ નાના પતરાવાળા
                          </option>
                          <option value="શેડ મોટા પતરાવાળા">
                            શેડ મોટા પતરાવાળા
                          </option>

                          <option value="પ્લોટ">પ્લોટ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addRoomDetails(floorIndex)}
                  className="flex items-center px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  style={{ background: "#8f40bc" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  વધુ વર્ણન ઉમેરો
                </button>
              </div>
            ),
          )}
        </div>

        {floors[0].floorType === "પ્લોટ" ? null : (
          <button type="button" onClick={addFloor} className="add-floor-button">
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
            વધુ માળ ઉમેરો
          </button>
        )}

        <br />
        <br />
        <br />
        <hr />
        <br />
        <br />

        {/* ફળિયું (ખુલ્લી જગ્યા) */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div className="form-field" style={{ display: "flex", gap: "20px" }}>
            <label
              className="form-label"
              htmlFor="landArea"
              style={{ textWrap: "nowrap", userSelect: "none" }}
            >
              11. ફળિયું (ખુલ્લી જગ્યા)
            </label>

            <input
              type="checkbox"
              id="landArea"
              name="landArea"
              className="form-input"
              value={formData.landArea}
              onChange={handleChange}
              checked={formData.landArea}
              style={{ width: "20px" }}
            />
          </div>

          <div>|</div>

          {/* બિ.પ. */}
          <div className="form-field" style={{ display: "flex", gap: "20px" }}>
            <label
              className="form-label"
              htmlFor="bp"
              style={{ textWrap: "nowrap", userSelect: "none" }}
            >
              12. બિ.પ.
            </label>

            <input
              type="checkbox"
              id="bp"
              name="bp"
              className="form-input"
              value={formData.bp}
              onChange={handleChange}
              checked={formData.bp}
              style={{ width: "20px" }}
            />
          </div>
        </div>

        <br />
        <br />

        <div className="form-group">
          {/* Field 16: રસોડું */}
          <div className="form-field">
            <label htmlFor="kitchenCount" className="form-label">
              રસોડું
            </label>
            <input
              type="number"
              id="kitchenCount"
              name="kitchenCount"
              className="form-input"
              min="0"
              value={formData.kitchenCount}
              onChange={handleChange}
              maxLength="3"
            />
          </div>

          {/* Field 17: બાથરૂમ */}
          <div className="form-field">
            <label htmlFor="bathroomCount" className="form-label">
              બાથરૂમ
            </label>
            <input
              type="number"
              id="bathroomCount"
              name="bathroomCount"
              className="form-input"
              min="0"
              value={formData.bathroomCount}
              onChange={handleChange}
              maxLength="3"
            />
          </div>

          {/* Field 18: ફરજો */}
          <div className="form-field">
            <label htmlFor="verandaCount" className="form-label">
              ફરજો
            </label>
            <input
              type="number"
              id="verandaCount"
              name="verandaCount"
              className="form-input"
              min="0"
              value={formData.verandaCount}
              onChange={handleChange}
              maxLength="3"
            />
          </div>

          {/* Field 19: નળ */}
          <div className="form-field">
            <label htmlFor="tapCount" className="form-label">
              નળ
            </label>
            <input
              type="number"
              id="tapCount"
              name="tapCount"
              className="form-input"
              min="0"
              value={formData.tapCount}
              onChange={handleChange}
              maxLength="3"
            />
          </div>

          {/* Field 20: શોચાલ્ય */}
          <div className="form-field">
            <label htmlFor="toiletCount" className="form-label">
              શોચાલ્ય
            </label>
            <input
              type="number"
              id="toiletCount"
              name="toiletCount"
              className="form-input"
              min="0"
              value={formData.toiletCount}
              onChange={handleChange}
              maxLength="3"
            />
          </div>
        </div>

        <br />
        <br />

        {/* Field 21: રીમાર્કસ */}
        <div className="form-field md:col-span-2">
          <label htmlFor="remarks" className="form-label">
            નોંધ/રીમાર્કસ
          </label>
          <textarea
            id="remarks"
            name="remarks"
            className="form-textarea"
            rows="3"
            placeholder="કોઈ વધારાની નોંધ..."
            value={formData.remarks}
            onChange={handleChange}
          ></textarea>
        </div>

        <br />

        {/* Image Upload Section */}
        {imageAkarni ? (
          <>
            <br />
            <br />{" "}
            <h2 className="text-2xl font-bold text-gray-800 pt-4 border-t mt-8">
              Image Documentation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUploadSlot
                label="1. મુખ્ય દરવાજો / Main Gate"
                slotKey="img1"
                formData={formData}
                setFormData={setFormData}
              />
              <ImageUploadSlot
                label="2. રૂમનો દરવાજો"
                slotKey="img2"
                formData={formData}
                setFormData={setFormData}
              />
              <ImageUploadSlot
                label="3. માલિકનો ફોટો (Optional)"
                slotKey="img3"
                formData={formData}
                setFormData={setFormData}
              />
            </div>{" "}
            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600">
              <h3 className="font-semibold mb-2">
                Current Form State (for debug):
              </h3>
              <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(
                  {
                    img1: formData.img1,
                    img2: formData.img2,
                    img3: formData.img3,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
            <br />
            <br />
          </>
        ) : null}

        <button type="submit" className="submit-button">
          {isEditMode ? "અપડેટ" : "સબમિટ"}
        </button>
      </form>
    </div>
  );
};

export default SurvayInsertForm;
