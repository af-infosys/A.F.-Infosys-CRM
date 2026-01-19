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

      <div className="table-row table-header-row">
        <div className="table-cell s-no">
          <span className="formatting table-font">અનું ક્રમાંક</span>
        </div>

        <div className="table-cell area-name">
          <span className="formatting table-font">વિસ્તારનું નામ</span>
        </div>

        <div className="table-cell prop-no">
          <span className="formatting table-font">મિલ્કત ક્રમાંક</span>
        </div>

        <div className="table-cell description">
          <span className="formatting table-font">મિલ્કતનું વર્ણન</span>
        </div>

        <div className="table-cell owner">
          <span className="formatting table-font">માલિકનું નામ</span>
        </div>

        <div className="table-cell old-prop-no">
          <span className="formatting table-font">જુનો મિ.નં.</span>
        </div>

        <div className="table-cell mobile">
          <span className="formatting table-font">મોબાઈલ નંબર</span>
        </div>

        <div className="table-cell valuation">
          <span className="formatting table-font">
            મિલ્કતની
            <br />
            કિંમત
          </span>
        </div>

        <div className="table-cell tax">
          <span className="formatting table-font">આકારેલ વેરાની રકમ</span>
        </div>

        <div className="table-cell prop-name">
          <span className="formatting table-font">
            મિલ્કત પર લખેલ
            <br />
            નામ
          </span>
        </div>

        {/* <div className="table-cell type">
                <span className="formatting"> મકાન ટાઈપ </span>
              </div> */}

        <div className="table-cell facility table-font">
          <div className="facility-inner">
            <div className="facility-title">
              <span className="formatting"> અન્ય સુવિધા </span>
            </div>

            <div
              className="facility-sub-row table-font"
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
          className="table-cell remarks table-font"
          style={{
            // fontSize: "10px",
            textAlign: "center",
          }}
        >
          નોંધ / રીમાર્કસ
        </div>
      </div>

      <div className="table-row table-header-row">
        <div className="table-cell s-no">
          <span className="formatting table-font">1</span>
        </div>

        <div className="table-cell area-name">
          <span className="formatting table-font">2</span>
        </div>

        <div className="table-cell prop-no">
          <span className="formatting table-font">3</span>
        </div>

        <div className="table-cell description">
          <span className="formatting table-font">4</span>
        </div>

        <div className="table-cell owner">
          <span className="formatting table-font">5</span>
        </div>

        <div className="table-cell old-prop-no">
          <span className="formatting table-font">6</span>
        </div>

        <div className="table-cell mobile">
          <span className="formatting table-font">7</span>
        </div>

        <div className="table-cell valuation">
          <span className="formatting table-font">8</span>
        </div>

        <div className="table-cell tax">
          <span className="formatting table-font">9</span>
        </div>

        <div className="table-cell prop-name">
          <span className="formatting table-font">10</span>
        </div>

        <div className="table-cell" style={{ width: "3%" }}>
          <span className="formatting table-font">11</span>
        </div>

        <div className="table-cell" style={{ width: "3%" }}>
          <span className="formatting table-font">12</span>
        </div>

        <div className="table-cell remarks">
          <span className="formatting table-font">13</span>
        </div>
      </div>

      {/* Table Rows using Divs */}

      {pageRecords.map((record, index) => (
        <div key={index} className="table-row">
          <div className="table-cell s-no" style={{ textAlign: "center" }}>
            <span className="formatting table-font">{record[0]}</span>
          </div>

          <div className="table-cell area-name">
            <span className="formatting table-font">{record[1]}</span>
          </div>

          <div className="table-cell prop-no">
            <span className="formatting table-font">{record[2]}</span>
          </div>

          <div className="table-cell description">
            <span className="formatting table-font">{record[15]}</span>
          </div>

          <div className="table-cell owner">
            <span className="formatting table-font">{record[3]}</span>
          </div>

          <div className="table-cell old-prop-no">
            <span className="formatting table-font">{record[4]}</span>
          </div>

          <div className="table-cell mobile">
            <span className="formatting table-font">{record[5]}</span>
          </div>

          <div className="table-cell valuation">
            <span className="formatting table-font">{record[18]}</span>
          </div>

          <div className="table-cell tax">
            <span className="formatting table-font">{record[19]}</span>
          </div>

          <div className="table-cell prop-name">
            <span className="formatting table-font">{record[6]}</span>
          </div>

          <div className="table-cell tap">
            <span className="formatting table-font">{record[11]}</span>
          </div>

          <div className="table-cell toilet">
            <span className="formatting table-font">{record[12]}</span>
          </div>

          <div className="table-cell remarks">
            <span className="formatting table-font">{record[13]}</span>
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
