// buildPropertyDescription ફંક્શનને અહીં જ વ્યાખ્યાયિત કરેલ છે
function BuildDescription(formData, floorData) {
  const descriptionParts = [];

  // ગણતરીઓને ગુજરાતી અંકોમાં રૂપાંતરિત કરવા માટેનું ફંક્શન
  const convertToArabicToGujaratiNumerals = (number) => {
    const arabicNumerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const gujaratiNumerals = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
    let gujaratiNumber = String(number);
    for (let i = 0; i < arabicNumerals.length; i++) {
      gujaratiNumber = gujaratiNumber.replace(
        new RegExp(arabicNumerals[i], "g"),
        gujaratiNumerals[i],
      );
    }

    return gujaratiNumber;
  };

  let isFaliyu = false;

  let isGovPlot = false;
  let isPvtPlot = false;
  let isGovPlotDival = false;
  let isPvtPlotDival = false;

  // 🟢 પ્લોટ માટે ખાસ હેન્ડલિંગ
  if (formData?.houseCategory?.inclues("પ્લોટ")) {
    if (formData?.houseCategory?.inclues("પ્લોટ સરકારી - કોમનપ્લોટ")) {
      isGovPlot = true;
      return;
    } else if (formData?.houseCategory?.inclues("પ્લોટ ખાનગી - ખુલ્લી જગ્યા")) {
      isPvtPlot = true;
      return;
    } else if (formData?.houseCategory?.inclues("પ્લોટ (ફરતી દિવાલ) ખાનગી")) {
      isGovPlotDival = true;
      return;
    } else if (formData?.houseCategory?.inclues("પ્લોટ (ફરતી દિવાલ) સરકારી")) {
      isPvtPlotDival = true;
      return;
    }
  }

  // માળની વિગતોનું વર્ણન
  if (floorData && floorData.length > 0) {
    floorData.forEach((floor) => {
      if (floor.floorType === "ફળિયું") {
        isFaliyu = true;
        return;
      }

      let floorPrefix = "";

      if (floor.floorType && floor.floorType !== "ગ્રાઉન્ડ ફ્લોર") {
        floorPrefix = `ઉપરના ${floor.floorType.replace(" માળ", " માળે")} - `;
      }

      const floorDescriptionParts = [];

      // 2. રૂમની વિગતોનું વર્ણન
      if (floor.roomDetails && floor.roomDetails.length > 0) {
        floor.roomDetails.forEach((room) => {
          // ખાતરી કરો કે સંખ્યાઓ યોગ્ય રીતે રૂપાંતરિત થાય છે
          const slabRoomsNum = Number(room.slabRooms);
          const tinRoomsNum = Number(room.tinRooms);
          const woodenRoomsNum = Number(room.woodenRooms);
          const tileRoomsNum = Number(room.tileRooms);
          const roomType = room.type; // પાકા / કાચા / પ્લોટ

          // રૂમના ભાગોને સ્ટોર કરવા માટે ટેમ્પરરી એરે
          const roomParts = [];

          if (slabRoomsNum > 0) {
            roomParts.push(
              `${roomType} સ્લેબવાળા ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(slabRoomsNum)}`,
            );
          }

          if (tinRoomsNum > 0) {
            roomParts.push(
              `${roomType} પતરાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(tinRoomsNum)}`,
            );
          }
          if (woodenRoomsNum > 0) {
            roomParts.push(
              `${roomType} પીઢીયાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(woodenRoomsNum)}`,
            );
          }
          if (tileRoomsNum > 0) {
            roomParts.push(
              `${roomType} નળિયાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(tileRoomsNum)}`,
            );
          }

          if (roomParts.length > 0) {
            floorDescriptionParts.push(roomParts.join(", "));
          }
        });
      }

      // 3. જો માળમાં કોઈ વિગતો હોય, તો તેને મુખ્ય વર્ણનમાં ઉમેરો (ફ્લોર પ્રીફિક્સ સાથે)
      if (floorDescriptionParts.length > 0) {
        descriptionParts.push(floorPrefix + floorDescriptionParts.join(", "));
      }
    });
  }

  // રસોડા, બાથરૂમ અને વરંડાની ગણતરી (વર્ણનના અંતે ઉમેરાશે)
  const amenitiesParts = [];

  //
  if (isFaliyu) {
    amenitiesParts.push(`ફળિયું (ખુલ્લી જગ્યા)`);
  }

  if (isGovPlot) {
    amenitiesParts.push(`પ્લોટ સરકારી - કોમનપ્લોટ`);
  }

  if (isPvtPlot) {
    amenitiesParts.push(`પ્લોટ ખાનગી - ખુલ્લી જગ્યા`);
  }

  if (isGovPlotDival) {
    amenitiesParts.push(`પ્લોટ (ફરતી દિવાલ) ખાનગી`);
  }

  if (isPvtPlotDival) {
    amenitiesParts.push(`પ્લોટ (ફરતી દિવાલ) સરકારી`);
  }

  // રસોડાની ગણતરી
  if (formData[8] > 0) {
    amenitiesParts.push(
      `રસોડું-${convertToArabicToGujaratiNumerals(formData[8])}`,
    );
  }

  // બાથરૂમની ગણતરી
  if (formData[9] > 0) {
    amenitiesParts.push(
      `બાથરૂમ-${convertToArabicToGujaratiNumerals(formData[9])}`,
    );
  }

  // ફરજો (વરંડા) ની ગણતરી
  if (formData[10] > 0) {
    amenitiesParts.push(
      `ફરજો-${convertToArabicToGujaratiNumerals(formData[10])}`,
    );
  }

  // મુખ્ય વર્ણન અને સુવિધાઓના વર્ણનને જોડો
  const finalDescription = descriptionParts.concat(amenitiesParts);

  return finalDescription.join(", ");
}

export default BuildDescription;
