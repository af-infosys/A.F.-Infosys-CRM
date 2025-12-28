import { GoogleSheetService } from "./../config/crud.js";
const sheet = new GoogleSheetService();

export const getAllProperties = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const dataId = process.env.WORK_SHEET_ID;

    const data = await sheet.read(dataId, sheetId);

    // Record to Object key
    const propertyDetails = data
      .filter((item) => item.length > 0)
      .map((arr) => {
        return {
          m_id: arr[0],
          owner_name: arr[1],
          other_name: arr[2],
          house_id: arr[3],
          society: arr[4],
          phone: arr[5],
          category: arr[6],
          description: arr[7],
          price: Number(arr[8]),
          bill_no: arr[9],
          taxes: JSON.parse(arr[10]),
          tab_connection: arr[11],
          marked: arr[12],
        };
      });

    return res.json({ success: true, data: propertyDetails });
  } catch (err) {
    console.log("Error Reading Data:", err);
    return res.status(500).json({
      success: false,
      message: "Error Reading Data",
    });
  }
};

export const getPublicProperty = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { owner_name, phone, society } = req.body;
    const dataId = process.env.WORK_SHEET_ID;

    if (!owner_name || !society) {
      return res.status(400).json({
        success: false,
        data: null,
        message:
          "कृपया अपनी प्रॉपर्टी खोजने के लिए नाम, फ़ोन नंबर या सोसायटी में से कम से कम एक विवरण दर्ज करें।",
      });
    }

    const data = await sheet.read(dataId, sheetId);

    // Records को Object key में बदलना
    const propertyDetails = data
      .filter((item) => item.length > 0)
      .map((arr) => {
        return {
          m_id: arr[0],
          owner_name: arr[1],
          other_name: arr[2],
          house_id: arr[3],
          society: arr[4],
          phone: arr[5],
          category: arr[6],
          description: arr[7],
          price: Number(arr[8]),
          bill_no: arr[9],
          taxes: JSON.parse(arr[10] || []),
          tab_connection: arr[11],
          marked: arr[12],
        };
      });

    let finalData = propertyDetails.filter((item) => {
      let match = true;

      // Owner Name Filter
      if (owner_name) {
        match = match && item.owner_name?.includes(owner_name.trim());
      }

      // Phone Filter
      if (phone) {
        match = match && item.phone?.includes(phone.trim());
      }

      // Society Filter
      if (society) {
        match = match && item.society?.trim() === society.trim();
      }

      return match;
    });

    // --- Privacy Check: Must be exactly 1 record ---
    if (finalData.length === 1) {
      // यदि केवल 1 ही record मिला है, तो इसे भेज दें
      return res
        .status(200)
        .json({ success: true, data: finalData[0], message: "Success" });
    }

    if (finalData.length === 0) {
      // यदि कोई record नहीं मिला
      return res.status(200).json({
        success: false,
        data: null, // null भेजना बेहतर है
        message:
          "આ વિગતો સાથે કોઈ પ્રોપર્ટી મળી નથી. કૃપા કરીને ફરીથી પ્રયાસ કરો.", // No Data Found
      });
    }

    // यदि 2 या 2 से अधिक records मिलते हैं (Privacy breach prevention)
    if (finalData.length > 1) {
      return res.status(200).json({
        success: false,
        data: null,
        message:
          "એકથી વધુ પ્રોપર્ટી મળી છે. ગોપનીયતા જાળવવા માટે, કૃપા કરીને વધુ વિગતો (દા.ત. માલિકનું નામ અને ફોન નં.) દાખલ કરો.",
      }); // Please Enter More Details
    }
  } catch (err) {
    console.error("Error Reading Data:", err); // console.log की जगह console.error का प्रयोग
    return res.status(500).json({
      success: false,
      data: null,
      message: "ડેટા વાંચવામાં ભૂલ. કૃપા કરીને પછીથી પ્રયાસ કરો.", // Error Reading Data
    });
  }
};

// New function to get the list of unique societies
export const getSocietyList = async (req, res) => {
  try {
    const { sheetId } = req.params; // Assuming sheetId comes from URL parameter
    const dataId = process.env.WORK_SHEET_ID;

    // 1. Read the raw data
    const data = await sheet.read(dataId, sheetId);

    // 2. Extract unique society names from column index 4 (arr[4])
    const societySet = new Set();

    // Skip the header row (index 0) and filter out empty rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row.length > 4) {
        // Ensure row has at least the society column
        const societyName = row[4]?.trim();
        if (societyName) {
          societySet.add(societyName);
        }
      }
    }

    // Convert the Set back to an Array and sort it alphabetically
    const societyList = Array.from(societySet).sort();

    return res.status(200).json({
      success: true,
      data: societyList,
      message: "Society list retrieved successfully.",
    });
  } catch (err) {
    console.error("Error Reading Society Data:", err);
    return res.status(500).json({
      success: false,
      data: [],
      message: "सोसायटीનો ડેટા વાંચવામાં ભૂલ.",
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { sheetId, id: mId } = req.params;
    const dataId = process.env.WORK_SHEET_ID;

    const data = await sheet.read(dataId, sheetId);
    const record = data.find((record) => Number(record[0]) === Number(mId));

    const propertyDetail = {
      m_id: record[0],
      owner_name: record[1],
      other_name: record[2],
      house_id: record[3],
      society: record[4],
      phone: record[5],
      category: record[6],
      description: record[7],
      price: Number(record[8]),
      bill_no: record[9],
      taxes: JSON.parse(record[10]),
      tab_connection: record[11],
      marked: record[12],
    };

    return res.status(200).json({ success: true, record: propertyDetail });
  } catch (err) {
    console.log("Error Reading Record:", err);
    return res.status(500).json({
      success: false,
      message: "Error Reading Record",
    });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { village, taluka, district } = req.body;

    const dataId = process.env.WORK_SHEET_ID;

    let updatedIndex = -1;

    const data = await sheet.read(dataId, "GramSuvidha");

    const record = data.find((record, index) => {
      if (Number(record[0]) === Number(sheetId)) {
        updatedIndex = index + 1;
        return true;
      }
      return false;
    });

    if (!record || updatedIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    record[2] = village;
    record[3] = taluka;
    record[4] = district;

    // ✅ real sheet row number
    const sheetRowIndex = updatedIndex;

    await sheet.update(dataId, "GramSuvidha", sheetRowIndex, record);

    console.log("Updated Successfully");

    return res.status(200).json(record);
  } catch (err) {
    console.log("Error Updating Record:", err);
    return res.status(500).json({
      success: false,
      message: "Error Updating Record",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    console.log("Updating Status...");

    const { sheetId, id: mId } = req.params;

    const { id: biller_id, role, name } = req.user;

    console.log(req.user);

    if (role !== "biller") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const dataId = process.env.WORK_SHEET_ID;

    let updatedIndex = -1;

    const data = await sheet.read(dataId, sheetId);

    const record = data.find((record, index) => {
      if (Number(record[0]) === Number(mId)) {
        updatedIndex = index + 1;
        return true;
      }
      return false;
    });

    if (!record || updatedIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    record[12] = JSON.stringify({
      id: biller_id,
      name,
      date: new Date(),
    });

    // ✅ real sheet row number
    const sheetRowIndex = updatedIndex;

    await sheet.update(dataId, sheetId, sheetRowIndex, record);

    console.log("Updated Successfully");

    return res.status(200).json(record);
  } catch (err) {
    console.log("Error Updating Record:", err);
    return res.status(500).json({
      success: false,
      message: "Error Updating Record",
    });
  }
};
