import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ==========================================
// 1. REGISTER LOCAL FONT (FIXED)
// ==========================================
// Note: Path '/fonts/...' public folder ko refer karta hai automatically.
Font.register({
  family: "NotoSansGujarati",
  src: "/fonts/NotoSansGujarati-Regular.ttf",
});

// ==========================================
// 2. STYLES (Safe Flexbox Layout)
// ==========================================
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "NotoSansGujarati", // Font Family must match registered name
    fontSize: 9,
    backgroundColor: "#FFFFFF",
  },
  // Header
  headerContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 5,
    alignItems: "center",
  },
  title: { fontSize: 14, marginBottom: 4 },
  subTitle: { fontSize: 10, marginBottom: 2 },

  // Table (Pure Flexbox - No 'display: table')
  tableContainer: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#000",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    minHeight: 20,
    alignItems: "center",
  },
  tableHeaderRow: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: "#e4e4e4",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 30,
    alignItems: "center",
  },
  tableCol: {
    borderStyle: "solid",
    borderRightWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#000",
    height: "100%",
    justifyContent: "center",
  },
  tableCell: {
    margin: 2,
    fontSize: 8,
    textAlign: "center",
  },
});

// Column Widths (Must verify total is 100%)
const colWidths = {
  sr: "4%",
  area: "10%",
  propNo: "6%",
  desc: "12%",
  owner: "16%",
  oldNo: "5%",
  mobile: "8%",
  value: "8%",
  tax: "6%",
  nameOnProp: "10%",
  tap: "5%",
  toilet: "5%",
  remark: "5%",
};

// ... (CoverPage and BenefitPage same as before - no changes needed there) ...

const DataPage = ({ records, pageIndex, project }) => (
  <Page size="LEGAL" orientation="landscape" style={styles.page}>
    <View style={styles.headerContainer}>
      <Text style={styles.title}>પંચાયત હિસાબ નમુનો નંબર - ૮</Text>
      <Text style={styles.subTitle}>ગામ: {project?.spot?.gaam}</Text>
    </View>

    <View style={styles.tableContainer}>
      {/* Header */}
      <View style={styles.tableHeaderRow}>
        {/* Simplified headers for testing - you can add full Gujarati text back once it works */}
        <View style={{ ...styles.tableCol, width: colWidths.sr }}>
          <Text style={styles.tableCell}>No.</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.area }}>
          <Text style={styles.tableCell}>Area</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.propNo }}>
          <Text style={styles.tableCell}>Prop No</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.desc }}>
          <Text style={styles.tableCell}>Desc</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.owner }}>
          <Text style={styles.tableCell}>Owner</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.oldNo }}>
          <Text style={styles.tableCell}>Old</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.mobile }}>
          <Text style={styles.tableCell}>Mob</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.value }}>
          <Text style={styles.tableCell}>Val</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.tax }}>
          <Text style={styles.tableCell}>Tax</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.nameOnProp }}>
          <Text style={styles.tableCell}>Name</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.tap }}>
          <Text style={styles.tableCell}>Tap</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.toilet }}>
          <Text style={styles.tableCell}>Toilet</Text>
        </View>
        <View style={{ ...styles.tableCol, width: colWidths.remark }}>
          <Text style={styles.tableCell}>Rem</Text>
        </View>
      </View>

      {/* Rows */}
      {records.map((row, idx) => (
        <View style={styles.tableRow} key={idx} wrap={false}>
          {/* wrap={false} prevents rows from breaking across pages awkwardly */}
          <View style={{ ...styles.tableCol, width: colWidths.sr }}>
            <Text style={styles.tableCell}>{row[0] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.area }}>
            <Text style={styles.tableCell}>{row[1] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.propNo }}>
            <Text style={styles.tableCell}>{row[2] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.desc }}>
            <Text style={styles.tableCell}>{row[15] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.owner }}>
            <Text style={styles.tableCell}>{row[3] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.oldNo }}>
            <Text style={styles.tableCell}>{row[4] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.mobile }}>
            <Text style={styles.tableCell}>{row[5] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.value }}>
            <Text style={styles.tableCell}>{row[18] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.tax }}>
            <Text style={styles.tableCell}>{row[19] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.nameOnProp }}>
            <Text style={styles.tableCell}>{row[6] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.tap }}>
            <Text style={styles.tableCell}>{row[11] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.toilet }}>
            <Text style={styles.tableCell}>{row[12] || "-"}</Text>
          </View>
          <View style={{ ...styles.tableCol, width: colWidths.remark }}>
            <Text style={styles.tableCell}>{row[13] || "-"}</Text>
          </View>
        </View>
      ))}
    </View>
  </Page>
);

// Main Export
const ReportDocument = ({ pages, project }) => (
  <Document>
    {pages?.map((item, index) => {
      // Logic same as before...

      console.log("Ye raha: ", index, item);

      if (item.type === "page") {
        return (
          <DataPage
            key={index}
            records={item.pageRecords}
            pageIndex={item.pageIndex}
            project={project}
          />
        );
      }
      return null;
    })}
  </Document>
);

export default ReportDocument;
