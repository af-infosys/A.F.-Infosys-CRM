import React, { useEffect, useState } from "react";
import BuildDescription from "./BuildDescription";

const SurveyEditForm = ({
  index,
  setShowModal,
  handleChange: setData,
  record,
}) => {
  //   index={showModal}
  //   setShowModal={setShowModal}
  //   handleChange={handleEditPopup}
  //   record={data}

  const [category, setCategory] = useState("");
  const [floors, setFloors] = useState([]);
  const [facilities, setFacilities] = useState({
    kitchenCount: 0,
    bathroomCount: 0,
    verandaCount: 0,
    tapCount: 0,
    toiletCount: 0,
  });

  useEffect(() => {
    if (index !== false) {
      setCategory(record[index][7]);

      setFloors(JSON.parse(record[index][14]));

      setFacilities({
        kitchenCount: Number(record[index][8] || 0),
        bathroomCount: Number(record[index][9] || 0),
        verandaCount: Number(record[index][10] || 0),
        tapCount: Number(record[index][11] || 0),
        toiletCount: Number(record[index][12] || 0),
      });
    }
  }, [index]);

  useEffect(() => {
    if (index !== false) {
      setData(() => {
        const newData = [...record];
        newData[index][7] = category;
        console.log(newData[index][7]);

        return newData;
      });
    }
  }, [category]);

  useEffect(() => {
    if (index !== false) {
      setData(() => {
        const newData = [...record];
        newData[index][14] = JSON.stringify(floors);
        newData[index][15] = BuildDescription(record[index], floors);

        return newData;
      });
    }
  }, [floors, record]);

  useEffect(() => {
    if (index !== false) {
      setData(() => {
        const newData = [...record];
        newData[index][8] = facilities.kitchenCount;
        newData[index][9] = facilities.bathroomCount;
        newData[index][10] = facilities.verandaCount;
        newData[index][11] = facilities.tapCount;
        newData[index][12] = facilities.toiletCount;

        newData[index][15] = BuildDescription(newData[index], floors);

        return newData;
      });
    }
  }, [facilities]);

  const handleFloorTypeChange = (floorIndex, e) => {
    const { value } = e.target;
    setFloors((prev) => {
      const newFloors = [...prev];
      newFloors[floorIndex] = {
        ...newFloors[floorIndex],
        floorType: value,
      };
      return newFloors;
    });
  };

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

  const handleRoomDetailsChange = (floorIndex, roomIndex, e) => {
    const { name, value } = e.target;

    const processedValue =
      e.target.type === "number" ? Number(value || 0) : value;

    setFloors((prevFloors) => {
      const newFloors = [...prevFloors];

      const floor = { ...newFloors[floorIndex] };
      const roomDetails = [...floor.roomDetails];

      roomDetails[roomIndex] = {
        ...roomDetails[roomIndex],
        [name]: processedValue,
      };

      floor.roomDetails = roomDetails;
      newFloors[floorIndex] = floor;

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
            slabRooms: 0,
            tinRooms: 0,
            woodenRooms: 0,
            tileRooms: 0,
          },
        ],
      },
    ]);
  };

  const addRoomDetails = (floorIndex) => {
    setFloors((prevFloors) => {
      const newFloors = [...prevFloors];
      const floor = { ...newFloors[floorIndex] };

      floor.roomDetails = [
        ...floor.roomDetails,
        {
          type: "",
          roomHallShopGodown: "",
          slabRooms: 0,
          tinRooms: 0,
          woodenRooms: 0,
          tileRooms: 0,
        },
      ];

      newFloors[floorIndex] = floor;
      return newFloors;
    });
  };

  const deleteFloor = (floorIndex) => {
    if (!window.confirm("Sure to Delete!")) return;

    setFloors((prevFloors) => prevFloors.filter((_, i) => i !== floorIndex));
  };

  const deleteRoomDetails = (floorIndex, roomIndex) => {
    if (!window.confirm("Sure to Delete!")) return;

    setFloors((prevFloors) => {
      const newFloors = [...prevFloors];
      const floor = { ...newFloors[floorIndex] };

      floor.roomDetails = floor.roomDetails.filter((_, i) => i !== roomIndex);

      newFloors[floorIndex] = floor;
      return newFloors;
    });
  };

  const handleFacilitiesChange = (e) => {
    const { name, value } = e.target;
    setFacilities((prev) => ({
      ...prev,
      [name]: Number(value || 0),
    }));
  };

  const handleLandAreaChange = (e) => {
    const checked = e.target.checked;

    setFloors((prev) => {
      if (checked) {
        // already exists? do nothing
        const exists = prev.some((floor) => floor.floorType === "ફળિયું");
        if (exists) return prev;

        return [
          ...prev,
          {
            floorType: "ફળિયું",
            roomDetails: [
              {
                type: "",
                roomHallShopGodown: "",
                slabRooms: 0,
                tinRooms: 0,
                woodenRooms: 0,
                tileRooms: 0,
              },
            ],
          },
        ];
      }

      // unchecked → remove it
      return prev.filter((floor) => floor.floorType !== "ફળિયું");
    });
  };

  if (!record[index]) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: "99999999999",
        width: "95vw",
        maxHeight: "95dvh",
        overflow: "auto",
        background: "white",
        borderRadius: "10px",
        right: "2.5vw",
        top: "2.5dvh",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        padding: "20px",

        display: "flex",
        flexDirection: "column",
        maxWidth: "700px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <h2>અનુ ક્રમાંક: {record[index][0] || ""}</h2>

        <h2>મિલ્કત ક્રમાંક: {record[index][2] || ""}</h2>
      </div>

      <h1 style={{ marginTop: "5px", marginBottom: "8px" }}>
        <b>વર્ણન: {record[index][15] || ""}</b>
      </h1>

      <div style={{ maxHeight: "70dvh", overflow: "auto" }}>
        <div>
          <label htmlFor="houseCategory" className="form-label">
            8. મકાન category *
          </label>
          <select
            id="houseCategory"
            name="houseCategory"
            className="form-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            required
          >
            <option value="">કેટેગરી પસંદ કરો</option>
            {categories?.map((category) => {
              return <option value={category}>{category}</option>;
            })}
          </select>
        </div>
        <h2 className="section-title mt-8">9. માળની વિગતો *</h2>
        <div id="floorsContainer">
          {floors?.map((floor, floorIndex) =>
            floor?.floorType === "ફળિયું" ? null : floor?.floorType ===
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

                      <button
                        type="button"
                        onClick={() => deleteRoomDetails(floorIndex, roomIndex)}
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
                      </button>
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
        {floors[0]?.floorType === "પ્લોટ" ? null : (
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
        <br /> <br />
        <div className="form-field" style={{ display: "flex", gap: "20px" }}>
          <label
            className="form-label"
            htmlFor="landArea"
            style={{ textWrap: "nowrap", userSelect: "none" }}
          >
            10. ફળિયું (ખુલ્લી જગ્યા)
          </label>

          <input
            type="checkbox"
            id="landArea"
            name="landArea"
            checked={floors.some((floor) => floor.floorType === "ફળિયું")}
            onChange={handleLandAreaChange}
            style={{ width: "20px" }}
          />
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
              value={facilities.kitchenCount}
              onChange={handleFacilitiesChange}
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
              value={facilities.bathroomCount}
              onChange={handleFacilitiesChange}
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
              value={facilities.verandaCount}
              onChange={handleFacilitiesChange}
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
              value={facilities.tapCount}
              onChange={handleFacilitiesChange}
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
              value={facilities.toiletCount}
              onChange={handleFacilitiesChange}
              maxLength="3"
            />
          </div>
        </div>
        <br />
      </div>

      <button
        onClick={() => {
          setShowModal(false);
        }}
        style={{
          background: "lightgreen",
          padding: "10px 20px",
          borderRadius: "20px",
        }}
      >
        Done
      </button>
    </div>
  );
};

export default SurveyEditForm;
