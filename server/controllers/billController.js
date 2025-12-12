const GoogleSheetService = require("./config/CRUD.js");
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
          house_id: arr[2],
          year: arr[3],
          society: arr[4],
          phone: "",
          category: arr[5],
          description: arr[6],
          price: Number(arr[7]),
          taxes: JSON.parse(arr[8]),
          tab_connection: arr[9],
          marked: arr[10],
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

export const getPropertyById = async (req, res) => {
  try {
    const { sheetId, id: mId } = req.params;
    const dataId = process.env.WORK_SHEET_ID;

    const data = await sheet.read(dataId, sheetId);
    const record = data.find((record) => Number(record[0]) === Number(mId));

    const propertyDetail = {
      m_id: record[0],
      owner_name: record[1],
      house_id: record[2],
      year: record[3],
      society: record[4],
      phone: "",
      category: record[5],
      description: record[6],
      price: Number(record[7]),
      taxes: JSON.parse(record[8]),
      tab_connection: record[9],
      marked: record[10],
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

export const updateStatus = async (req, res) => {
  try {
    const { sheetId, id: mId } = req.params;

    console.log("hello");
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

    record[10] = true;

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
