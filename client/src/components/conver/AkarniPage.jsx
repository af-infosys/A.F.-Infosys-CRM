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
          સને ૨૦૨૫/૨૬ ના વર્ષ માટેના વેરાપાત્ર હોય તેવા મકાનો જમીનનો આકારણી ની
          યાદી
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

      <div className="table-row table-header-row">
        <div className="table-cell s-no">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            અનું ક્રમાંક
          </span>
        </div>

        <div className="table-cell area-name">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            વિસ્તારનું નામ
          </span>
        </div>

        <div className="table-cell prop-no">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            મિલ્કત ક્રમાંક
          </span>
        </div>

        <div className="table-cell description">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            મિલ્કતનું વર્ણન
          </span>
        </div>

        {/* <div className="table-cell s-no">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            બી.પ.
          </span>
        </div> */}

        <div className="table-cell owner">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            માલિકનું નામ
          </span>
        </div>

        <div className="table-cell old-prop-no">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            જુનો મિ.નં.
          </span>
        </div>

        <div className="table-cell mobile">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            મોબાઈલ નંબર
          </span>
        </div>

        <div className="table-cell valuation">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            મિલ્કતની
            <br />
            કિંમત
          </span>
        </div>

        <div className="table-cell tax">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            આકારેલ વેરાની રકમ
          </span>
        </div>

        <div className="table-cell prop-name">
          <span
            className="formatting"
            style={{
              fontSize: "10px",
            }}
          >
            મિલ્કત પર લખેલ
            <br />
            નામ
          </span>
        </div>

        {/* <div className="table-cell type">
                <span className="formatting"> મકાન ટાઈપ </span>
              </div> */}

        <div className="table-cell facility">
          <div className="facility-inner">
            <div className="facility-title">
              <span className="formatting"> અન્ય સુવિધા </span>
            </div>

            <div
              className="facility-sub-row"
              style={{ borderTop: "1px solid black" }}
            >
              <div className="table-cell">
                <span className="formatting">નળ</span>
              </div>

              <div className="table-cell">
                <span className="formatting">શોચાલય</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="table-cell remarks"
          style={{
            fontSize: "10px",
          }}
        >
          નોંધ / રીમાર્કસ
        </div>
      </div>

      <div className="table-row table-header-row">
        <div className="table-cell s-no">
          <span className="formatting">1</span>
        </div>

        <div className="table-cell area-name">
          <span className="formatting">2</span>
        </div>

        <div className="table-cell prop-no">
          <span className="formatting">3</span>
        </div>

        <div className="table-cell description">
          <span className="formatting">4</span>
        </div>

        {/* <div className="table-cell s-no">
          <span className="formatting">5</span>
        </div> */}

        <div className="table-cell owner">
          <span className="formatting">5</span>
        </div>

        <div className="table-cell old-prop-no">
          <span className="formatting">6</span>
        </div>

        <div className="table-cell mobile">
          <span className="formatting">7</span>
        </div>

        <div className="table-cell valuation">
          <span className="formatting">8</span>
        </div>

        <div className="table-cell tax">
          <span className="formatting">9</span>
        </div>

        <div className="table-cell prop-name">
          <span className="formatting">10</span>
        </div>

        <div className="table-cell" style={{ width: "3%" }}>
          <span className="formatting">11</span>
        </div>

        <div className="table-cell" style={{ width: "3%" }}>
          <span className="formatting">12</span>
        </div>

        <div className="table-cell remarks">
          <span className="formatting">13</span>
        </div>
      </div>

      {/* Table Rows using Divs */}

      {pageRecords.map((record, index) => (
        <div key={index} className="table-row">
          <div className="table-cell s-no" style={{ textAlign: "center" }}>
            <span className="formatting">{record[0]}</span>
          </div>

          <div className="table-cell area-name">
            <span className="formatting">{record[1]}</span>
          </div>

          <div className="table-cell prop-no">
            <span className="formatting">{record[2]}</span>
          </div>

          <div className="table-cell description">
            <span className="formatting">{record[15]}</span>
          </div>

          {/* <div className="table-cell s-no">
            <span className="formatting">
              {record[13]?.includes("બી.પ.") ? "બી.પ." : ""}
            </span>
          </div> */}

          <div className="table-cell owner">
            <span className="formatting">{record[3]}</span>
          </div>

          <div className="table-cell old-prop-no">
            <span className="formatting">{record[4]}</span>
          </div>

          <div className="table-cell mobile">
            <span className="formatting">{record[5]}</span>
          </div>

          <div className="table-cell valuation">
            <span className="formatting">{record[18]}</span>
          </div>

          <div className="table-cell tax">
            <span className="formatting">{record[19]}</span>
          </div>

          <div className="table-cell prop-name">
            <span className="formatting">{record[6]}</span>
          </div>

          <div className="table-cell tap">
            <span className="formatting">{record[11]}</span>
          </div>

          <div className="table-cell toilet">
            <span className="formatting">{record[12]}</span>
          </div>

          <div className="table-cell remarks">
            <span className="formatting">{record[13]}</span>
          </div>
        </div>
      ))}

      {totalPages === current ? (
        <p style={{ marginTop: "20px", textAlign: "center" }}>
          1. કુલ ઘર : <b style={{ marginRight: "20px" }}>{totalHoouse}</b> 2.
          કુલ મોબાઈલ નં. :{" "}
          <b style={{ marginRight: "20px" }}>{count?.totalPhoneNumber || 0}</b>{" "}
          3. કુલ નળ :{" "}
          <b style={{ marginRight: "20px" }}>
            {count?.totalTapConnection || 0}
          </b>{" "}
          4. કુલ શૌચાલય :{" "}
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

export default AkarniPage;
