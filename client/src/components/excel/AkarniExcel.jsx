import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

const AkarniExcel = ({ records, headerData }) => {
  const { year, gaam, taluko, jillo } = headerData;

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("મિલ્કત રિપોર્ટ");

    // ============================================
    // 🔹 TOP HEADER SECTION (like your image)
    // ============================================

    // Panchayat Title Row (merged)
    sheet.mergeCells("A1:M1");
    const panchayatTitle = sheet.getCell("A1");
    panchayatTitle.value = `પંચાયત કિસાન પત્રક નંબર - ૮ (આકારણી રજીસ્ટર)`;
    panchayatTitle.font = { size: 14, bold: true };
    panchayatTitle.alignment = { horizontal: "center", vertical: "middle" };

    // Year note row (merged)
    sheet.mergeCells("A2:M2");
    const yearRow = sheet.getCell("A2");
    yearRow.value = `વર્ષ ${year} ના મકાન વેરાની આકારણી માટે ની યાદી`;
    yearRow.font = { size: 12 };
    yearRow.alignment = { horizontal: "center", vertical: "middle" };

    // Gram, Taluko, Jillo row
    sheet.addRow([]);
    const metaRow = sheet.addRow([
      "",
      "",
      `ગામ: ${gaam || ""}`,
      "",
      "",
      `તાલુકો: ${taluko || ""}`,
      "",
      "",
      `જિલ્લો: ${jillo || ""}`,
      "",
      "",
      "",
      "",
    ]);

    // Merge meta info cells for layout
    sheet.mergeCells("C4:D4"); // ગામ
    sheet.mergeCells("F4:G4"); // તાલુકો
    sheet.mergeCells("I5:J5"); // જિલ્લો

    // Style meta rows
    [4].forEach((r) => {
      const row = sheet.getRow(r);
      row.font = { bold: true };
    });

    // Add an empty spacer row before table

    // ============================================
    // 🔹 TABLE HEADER SECTION
    // ============================================

    sheet.addRow([
      "અનું ક્રમાંક",
      "વિસ્તારનું નામ",
      "મિલ્કત ક્રમાંક",
      "મિલ્કતનું વર્ણન",
      "માલિકનું નામ",
      "જુનો મિ.નં.",
      "મોબાઈલ નંબર",
      "મિલ્કતની કિંમત",
      "આકારેલ વેરાની રકમ",
      "મિલ્કત પર લખેલ નામ",
      "અન્ય સુવિધા",
      "",
      "નોંધ / રીમાર્કસ",
    ]);

    // Second header row (sub-headers)
    sheet.addRow(["", "", "", "", "", "", "", "", "", "", "નળ", "શોચાલય", ""]);

    // Merge multi-row headers
    sheet.mergeCells("A6:A7");
    sheet.mergeCells("B6:B7");
    sheet.mergeCells("C6:C7");
    sheet.mergeCells("D6:D7");
    sheet.mergeCells("E6:E7");
    sheet.mergeCells("F6:F7");
    sheet.mergeCells("G6:G7");
    sheet.mergeCells("H6:H7");
    sheet.mergeCells("I6:I7");
    sheet.mergeCells("J6:J7");
    sheet.mergeCells("K6:L6");
    sheet.mergeCells("M6:M7");

    // Index row
    sheet.addRow(Array.from({ length: 13 }, (_, i) => i + 1));

    // Header styling
    [6, 7, 8].forEach((rowIndex) => {
      const row = sheet.getRow(rowIndex);
      row.font = { bold: true };
      row.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        // optional background color
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFEFEFEF" },
        };
      });
    });

    // ============================================
    // 🔹 DATA ROWS
    // ============================================

    records.forEach((record) => {
      sheet.addRow([
        record[0], // અનું ક્રમાંક
        record[1], // વિસ્તારનું નામ
        record[2], // મિલ્કત ક્રમાંક
        record[16], // મિલ્કતનું વર્ણન
        record[3], // માલિકનું નામ
        record[5], // જુનો મિ.નં.
        record[6], // મોબાઈલ નંબર
        record[19], // મિલ્કતની કિંમત
        record[20], // આકારેલ વેરાની રકમ
        record[7], // મિલ્કત પર લખેલ નામ
        record[12], // નળ
        record[13], // શોચાલય
        record[14], // નોંધ / રીમાર્કસ
      ]);
    });

    // Style data rows
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 9) {
        row.alignment = { vertical: "middle", horizontal: "center" };
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    // Column widths
    sheet.columns = [
      { width: 10 },
      { width: 20 },
      { width: 15 },
      { width: 25 },
      { width: 20 },
      { width: 12 },
      { width: 15 },
      { width: 15 },
      { width: 18 },
      { width: 22 },
      { width: 10 },
      { width: 10 },
      { width: 20 },
    ];

    // ============================================
    // 🔹 DOWNLOAD FILE
    // ============================================
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),

      "1.Akarn_Report.xlsx",
    );
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Export Styled Excel
    </button>
  );
};

export default AkarniExcel;
