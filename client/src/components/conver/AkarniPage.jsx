import React from "react";
import toGujaratiNumber from "../toGujaratiNumber";

const AkarniPage = ({
  pageIndex,
  project,
  pageRecords,
  totalHoouse,
  totalPages,
  current,
  count,
}) => {
  return (
    <div
      className="watermark"
      style={{ minHeight: "100%", position: "relative" }}
    >
      <div className="page-header-container">
        <span
          className="page-number"
          style={{
            position: "relative",
            color: "black",
            fontSize: "16px",
            transform: "translate(-3px, 65px)",
          }}
        >
          પાના નં. {toGujaratiNumber(pageIndex + 1)}
        </span>

        <h1 className="heading" style={{ marginTop: "50px" }}>
          પંચાયત હિસાબ નમુનો નંબર - ૮ (આકારણી રજીસ્ટર)
        </h1>

        <h2 className="subheading">
          સને {project?.details?.akaraniYear} ના વર્ષ માટેના વેરાપાત્ર હોય તેવા
          મકાનો જમીનનો આકારણી ની યાદી
        </h2>

        <div
          className="location-info"
          style={{
            paddingInline: "50px",
          }}
        >
          <span>ગામ:- {project?.spot?.gaam}</span>

          <span>તાલુકો:- {project?.spot?.taluka}</span>

          <span>જિલ્લો:- {project?.spot?.district}</span>
        </div>
      </div>

      {/* --- Semantic Table Structure --- */}
      <table
        className="akarni-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid black",
          textAlign: "center",
        }}
      >
        <thead>
          {/* Main Headers with RowSpan/ColSpan */}
          <tr>
            <th className="" rowSpan={2} style={headerStyle}>
              <span className="formatting">અનુંક્રમાંક</span>
            </th>
            <th
              className=""
              rowSpan={2}
              style={{ ...headerStyle, fontSize: "14px", width: "120px" }}
            >
              <span className="formatting">વિસ્તારનું નામ</span>
            </th>
            <th
              className=""
              rowSpan={2}
              style={{ ...headerStyle, fontSize: "14px", width: "55px" }}
            >
              <span className="formatting">મિલ્કત ક્રમાંક</span>
            </th>
            <th
              className=""
              rowSpan={2}
              style={{ ...headerStyle, fontSize: "14px" }}
            >
              <span className="formatting">મિલ્કતનું વર્ણન</span>
            </th>
            <th
              className=""
              rowSpan={2}
              style={{ ...headerStyle, fontSize: "14px" }}
            >
              <span className="formatting">માલિકનું નામ</span>
            </th>
            <th
              className=""
              rowSpan={2}
              style={{ ...headerStyle, fontSize: "14px", width: "45px" }}
            >
              <span className="formatting">જુનો મિ.નં.</span>
            </th>
            <th
              className=""
              rowSpan={2}
              style={{ ...headerStyle, fontSize: "14px" }}
            >
              <span className="formatting">મોબાઈલ નંબર</span>
            </th>
            <th className="" rowSpan={2} style={{ ...headerStyle }}>
              <span className="formatting">
                મિલ્કતની <br /> કિંમત
              </span>
            </th>
            <th
              className=""
              rowSpan={2}
              style={{ ...headerStyle, width: "60px" }}
            >
              <span className="formatting">આકારેલ વેરાની રકમ</span>
            </th>
            <th className="" rowSpan={2} style={headerStyle}>
              <span className="formatting">મિલ્કત પર લખેલ નામ</span>
            </th>

            {/* Merged Header for Facilities */}
            <th className="" colSpan={2} style={headerStyle}>
              <span className="formatting">અન્ય સુવિધા</span>
            </th>

            <th
              className=""
              rowSpan={2}
              style={{ ...headerStyle, minWidth: "90px" }}
            >
              <span className="formatting">નોંધ / રીમાર્કસ</span>
            </th>
          </tr>

          {/* Sub Header Row for Facilities */}
          <tr style={{ borderBottom: "1px solid black" }}>
            <th style={headerStyle}>
              <span className="formatting">નળ</span>
            </th>
            <th style={headerStyle}>
              <span className="formatting">શોચાલય</span>
            </th>
          </tr>

          {/* Numbering Row (1, 2, 3...) */}
          <tr
            style={{
              borderBottom: "1px solid black",
              backgroundColor: "#f0f0f0",
            }}
          >
            {Array.from({ length: 13 }, (_, index) => (
              <th
                key={index}
                style={{
                  ...headerStyle,
                  textAlign: "center",
                  fontSize: "14px",
                  paddingBottom: "2px",
                }}
              >
                <span className="formatting" style={{ textAlign: "center" }}>
                  {toGujaratiNumber(index + 1)}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {pageRecords.map((record, index) => (
            <tr
              key={index}
              style={{
                borderBottom: "1px solid #000",
              }}
            >
              <td
                className=""
                style={{
                  ...cellStyle,
                  height: "70px",
                  minHeight: "70px",
                  maxHeight: "70px",
                }}
              >
                <span className="formatting">
                  {toGujaratiNumber(record[0] || 0)}
                </span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">{record[1] || 0}</span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">
                  {toGujaratiNumber(record[2])}
                </span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">{record[15]}</span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">{record[3]}</span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">{record[4]}</span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">{record[5]}</span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">
                  {toGujaratiNumber(record[18])}
                </span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">
                  {toGujaratiNumber(record[19])}
                </span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">{record[6]}</span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">
                  {toGujaratiNumber(Number(record[11] || 0))}
                  <br />
                  {Number(record[11] || 0) !== 0 ? "હા" : "ના"}
                </span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">
                  {toGujaratiNumber(Number(record[12] || 0))}
                  <br />
                  {Number(record[12] || 0) !== 0 ? "હા" : "ના"}
                </span>
              </td>
              <td className="" style={cellStyle}>
                <span className="formatting">{record[13]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages === current ? (
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          1{")"} કુલ ઘર : <b style={{ marginRight: "20px" }}>{totalHoouse}</b>{" "}
          2) કુલ મોબાઈલ નં. :{" "}
          <b style={{ marginRight: "20px" }}>{count?.totalPhoneNumber || 0}</b>{" "}
          3{")"} કુલ નળ :{" "}
          <b style={{ marginRight: "20px" }}>
            {count?.totalTapConnection || 0}
          </b>{" "}
          4{")"} કુલ શૌચાલય :{" "}
          <b style={{ marginRight: "20px" }}>{count?.totalToilet || 0}</b>
        </p>
      ) : null}

      <p
        style={{
          position: "absolute",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#333",
        }}
      >
        A.F. INFOSYS | 93764 43146 | 99247 82732{" "}
      </p>
    </div>
  );
};

const headerStyle = {
  // border: "1px solid black",
  // padding: "5px",
  fontSize: "12px",
  textAlign: "center",
  verticalAlign: "middle",
};

const cellStyle = {
  fontSize: "14px",
  verticalAlign: "top",
  paddingTop: "4px",

  // border: "1px solid black",
  // padding: "5px",
  // textAlign: "center",
  // verticalAlign: "middle",
};

export default AkarniPage;
