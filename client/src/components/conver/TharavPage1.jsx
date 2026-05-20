import React from "react";

import toGujaratiNumber from "../toGujaratiNumber";

const TharavPage1 = ({ project }) => {
  // Styling classes adjusted for a LANDSCAPE appearance (max-w-7xl)

  console.log("Tharav Committe", project);

  function formatDate(dateString) {
    if (!dateString) return "";
    const dateObj = new Date(dateString);

    if (isNaN(dateObj)) return "";

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${toGujaratiNumber(day)}/${toGujaratiNumber(month)}/${toGujaratiNumber(year)}`;
  }

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
      <header className="text-center pb-2">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wider">
          {project?.spot?.gaam || "................"} ગ્રામપંચાયત આકારણી કમિટિની
          રચના - વર્ષ {project?.details?.akaraniYear || ""}
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
          સામાન્ય બેઠક તા. {formatDate(project?.details.meetingDate) || ""}{" "}
        </div>
        <div>
          ઠરાવ નં. {toGujaratiNumber(project?.details?.resolutionNumber) || ""}
        </div>
        <div>
          સામાન્ય બેઠક નં.{" "}
          {toGujaratiNumber(project?.details?.meetingNumber) || ""}
        </div>
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
                  સહી
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
                <td style={{ minWidth: "500px", height: "50px" }}>
                  <span className="formatting">{comity?.name || ""}</span>
                </td>
                <td style={{ minWidth: "150px" }}>
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
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ textAlign: "center", textDecoration: "underline" }}>
          <b>જાહેર પ્રસિધ્ધિ કર્યા તારીખ</b>
        </h4>

        <div style={{ textAlign: "center", marginTop: "25px" }}>
          તારીખ{" "}
          {formatDate(project?.details?.date2) ||
            ".................................."}{" "}
          થી તારીખ{" "}
          {(() => {
            const date = new Date(project?.details?.date2) || false;
            if (date === false) return "..................................";
            date?.setDate(date.getDate() + 30);

            return formatDate(date);
          })()}{" "}
          સુધી (30) દિવસની મુદત
        </div>
      </div>

      {/* Final Implementation Section */}
      <div style={{ marginTop: "12px" }}>
        <h4 style={{ textAlign: "center", textDecoration: "underline" }}>
          <b>આખરી અમલવારીની તારીખ</b>
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            gap: "50px",
          }}
        >
          <div>
            સામાન્ય બેઠક તા. .............................................{" "}
          </div>
          <div>ઠરાવ નં. __________</div>
          <div>સામાન્ય બેઠક નં. __________</div>
        </div>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          અમલવારી કરવાની તા. .............................................
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
