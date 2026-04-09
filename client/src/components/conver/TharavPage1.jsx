import React from "react";
import toGujaratiNumber from "../toGujaratiNumber";

const TharavPage1 = ({ project }) => {
  // Styling classes adjusted for a LANDSCAPE appearance (max-w-7xl)

  console.log("Tharav Committe", project);

  return (
    <div
      style={{
        position: "relative",
        // border: "10px double #6a6a6a",
        marginTop: "120px",
        padding: "10px",
        paddingBottom: "25px",
      }}
    >
      {/* -------------------- 1. Main Title -------------------- */}
      <header className="text-center pb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wider">
          {project?.spot?.gaam || "................"} ગ્રામપંચાયત આકારણી કમિટિની
          રચના
        </h1>
      </header>

      <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
        તા. {project?.spot?.taluka || "......"}, જિ.{" "}
        {project?.spot?.district || "....."}
      </h2>

      {/* Header */}
      {/* <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
        ગ્રામપંચાયત આકારણી કમિટિ
      </h2>

      <h3 style={{ textAlign: "center", textDecoration: "underline" }}>
        <b>આકારણી કમિટિ રચના</b>
      </h3> */}

      {/* Meeting Details */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          paddingInline: "200px",
          gap: "50px",
        }}
      >
        <div>
          સામાન્ય બેઠક તા. .........../.........../......................{" "}
          ....{" "}
        </div>
        <div>ઠરાવ નં. __________</div>
        <div>સામાન્ય બેઠક નં. __________</div>
      </div>

      {/* Table */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{
            maxWidth: "fit-content",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th>
                <span className="formatting" style={{ textAlign: "center" }}>
                  ક્રમ
                </span>
              </th>
              <th>
                <span className="formatting" style={{ textAlign: "center" }}>
                  નામ
                </span>
              </th>
              <th>
                <span className="formatting" style={{ textAlign: "center" }}>
                  હોદ્દો
                </span>
              </th>
              <th>
                <span className="formatting" style={{ textAlign: "center" }}>
                  આકારણી કમિટિનો હોદ્દો
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {project?.details?.comity?.map((comity, index) => (
              <tr key={index}>
                <td>
                  <span className="formatting">
                    {toGujaratiNumber(index + 1)}
                  </span>
                </td>
                <td style={{ minWidth: "500px", height: "38px" }}>
                  <span className="formatting">{comity?.name || ""}</span>
                </td>
                <td style={{ minWidth: "230px" }}>
                  <span className="formatting">
                    {comity?.designation || ""}
                  </span>
                </td>
                <td style={{ minWidth: "270px" }}>
                  <span className="formatting"></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Public Notice Section */}
      <div style={{ marginTop: "40px" }}>
        <h4 style={{ textAlign: "center", textDecoration: "underline" }}>
          <b>જાહેર પ્રસિધ્ધિ કર્યા તારીખ</b>
        </h4>

        <div style={{ textAlign: "center", marginTop: "10px" }}>
          તારીખ .........../.........../.......................... થી તારીખ
          .........../.........../.......................... સુધી (30) દિવસની
          મુદત
        </div>
      </div>

      {/* Final Implementation Section */}
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ textAlign: "center", textDecoration: "underline" }}>
          <b>આખરી અમલવારીની તારીખ</b>
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            gap: "50px",
          }}
        >
          <div>
            સામાન્ય બેઠક તા.
            .........../.........../..........................{" "}
          </div>
          <div>ઠરાવ નં. __________</div>
          <div>સામાન્ય બેઠક નં. __________</div>
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          અમલવારી કરવાની તા. .........../.........../..........................
        </div>
      </div>

      <p
        style={{
          position: "absolute",
          bottom: "0px",
          right: "10px",
          fontSize: "12px",
        }}
      >
        Book Tharav 1 - Committee
      </p>
    </div>
  );
};

export default TharavPage1;
