function buildPropertyDescription(formData) {
  const descriptionParts = [];

  /**
   * અરબી અંકોને ગુજરાતી અંકોમાં રૂપાંતરિત કરે છે.
   * @param {number|string} number - રૂપાંતરિત કરવાની સંખ્યા.
   * @returns {string} ગુજરાતી અંકોમાં રૂપાંતરિત થયેલ સ્ટ્રિંગ.
   */
  const convertToArabicToGujaratiNumerals = (number) => {
    const arabicNumerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const gujaratiNumerals = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
    let gujaratiNumber = String(number);
    for (let i = 0; i < arabicNumerals.length; i++) {
      gujaratiNumber = gujaratiNumber.replace(
        new RegExp(arabicNumerals[i], "g"),
        gujaratiNumerals[i]
      );
    }
    return gujaratiNumber;
  };

  // માળની વિગતોનું વર્ણન
  if (formData.floors && formData.floors.length > 0) {
    formData.floors.forEach((floor, index) => {
      // દરેક માળ માટે રૂમના પ્રકારો અને સંખ્યાઓનું વર્ણન
      if (floor.slabRooms > 0) {
        descriptionParts.push(
          `${floor.type} સ્લેબવાળા ${
            floor.roomHallShopGodown
          }-${convertToArabicToGujaratiNumerals(floor.slabRooms)}`
        );
      }
      if (floor.tinRooms > 0) {
        descriptionParts.push(
          `${floor.type} પતરાવાળી ${
            floor.roomHallShopGodown
          }-${convertToArabicToGujaratiNumerals(floor.tinRooms)}`
        );
      }
      if (floor.woodenRooms > 0) {
        descriptionParts.push(
          `${floor.type} પીઢીયાવાળી ${
            floor.roomHallShopGodown
          }-${convertToArabicToGujaratiNumerals(floor.woodenRooms)}`
        );
      }
      if (floor.tileRooms > 0) {
        descriptionParts.push(
          `${floor.type} નળિયાવાળી ${
            floor.roomHallShopGodown
          }-${convertToArabicToGujaratiNumerals(floor.tileRooms)}`
        );
      }
    });
  }

  // રસોડાની ગણતરી
  if (formData.kitchenCount > 0) {
    descriptionParts.push(
      `રસોડું-${convertToArabicToGujaratiNumerals(formData.kitchenCount)}`
    );
  }

  // બાથરૂમની ગણતરી
  if (formData.bathroomCount > 0) {
    descriptionParts.push(
      `બાથરૂમ-${convertToArabicToGujaratiNumerals(formData.bathroomCount)}`
    );
  }

  // ફરજો (વરંડા) ની ગણતરી
  if (formData.verandaCount > 0) {
    descriptionParts.push(
      `ફરજો-${convertToArabicToGujaratiNumerals(formData.verandaCount)}`
    );
  }

  // નળની ગણતરી
  if (formData.tapCount > 0) {
    descriptionParts.push(
      `નળ-${convertToArabicToGujaratiNumerals(formData.tapCount)}`
    );
  }

  // શોચાલયની ગણતરી
  if (formData.toiletCount > 0) {
    descriptionParts.push(
      `શોચાલય-${convertToArabicToGujaratiNumerals(formData.toiletCount)}`
    );
  }

  // બધા ભાગોને કોમા અને સ્પેસથી જોડો
  return descriptionParts.join(", ");
}

export default buildPropertyDescription;
