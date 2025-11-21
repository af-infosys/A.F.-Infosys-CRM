import ExcelJS from "exceljs";

export const extractRecordsFromExcel = async (file) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const sheet = workbook.worksheets[0]; // First sheet

    const records = [];

    // 🧩 Identify which row to start reading from
    // (Example: header rows = 8 → records start from row 9)
    const startRow = 9;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber >= startRow) {
        const rowValues = row.values
          .slice(1) // remove the first undefined index (ExcelJS starts from 1)
          .map((cell) =>
            cell && typeof cell === "object" ? cell.text || "" : cell || ""
          );

        // Check if it's not an empty row
        if (rowValues.some((v) => v !== "" && v !== null && v !== undefined)) {
          records.push(rowValues);
        }
      }
    });

    console.log("✅ Extracted Records:", records);
    return records;
  } catch (error) {
    console.error("❌ Error reading Excel file:", error);
    throw error;
  }
};

export default function AkarniImport() {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const records = await extractRecordsFromExcel(file);
      console.log("Extracted Data:", records);
      // You can now setRecords(records) or send to backend
    }
  };

  return (
    <div>
      <h2>Import Data</h2>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        style={{ marginTop: 20 }}
      />
    </div>
  );
}
