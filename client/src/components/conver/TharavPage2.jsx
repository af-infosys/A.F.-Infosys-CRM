import React from "react";

const TharavPage2 = ({ project }) => {
  const dummy = {
    village: "",
    taluka: "",
    district: "",
    startYear: "",
    committeeDate: "",
    resolutionNo: "",
    noticeDate: "",
    meetingNo: "",
    meetingDate: "",
    effectiveYear: "",
    propertyFrom: "",
    propertyTo: "",
    annualDemand: "",
  };

  // Styling classes adjusted for a LANDSCAPE appearance (max-w-7xl)

  return (
    <div
      style={{
        position: "relative",
        border: "10px double #6a6a6a",
        marginTop: "120px",
        padding: "10px",
        paddingBottom: "25px",
      }}
    >
      {/* -------------------- 1. Main Title -------------------- */}
      <header className="text-center pb-12">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-wider">
          :: પ્રમાણપત્ર ::
        </h1>
      </header>

      <p style={{ fontSize: "21px", textIndent: "100px" }}>
        સદરહુ મોજે <span>{project?.spot?.gaam || "................"}</span>{" "}
        તાલુકો <span>{project?.spot?.taluka || "..............."}</span>{" "}
        જિલ્લાની <span>{project?.spot?.district || "..............."}</span> સને
        વર્ષ <span>{dummy?.startYear || ".............."}</span> થી લાગુ કરવાના
        કરવેરા માટે આપણા ગામની નવી આકારણી કરવા માટે પ્રથમ કમિટીની રચના તારીખ{" "}
        <span>{dummy?.committeeDate || ".............."}</span> ઠરાવ નં{" "}
        <span>{dummy?.resolutionNo || ".............."}</span> થી કરવામાં આવી.
        આકારણી કમિટી રચના બાદ ઘરે ઘરે ફરીને આકારણીની પ્રાથમિક યાદિ તૈયાર કરીને
        તારીખ <span>{dummy?.noticeDate || ".............."}</span> ના રોજ ગ્રામ
        પંચાયતના નોટીસ બોર્ડ તથા જાહેર સ્થળોએ પ્રસિધ્ધિ કરી વાંધા સુચનો
        માંગવામાં આવ્યા. મુદત દરમ્યાન કોઈ વાંધા સુચનો પ્રાપ્ત થયેલ નથી. સદરહુ
        કોઈ વાંધા સુચનો રજુ થયેલ ન હોય સને{" "}
        <span>{dummy?.effectiveYear || ".............."}</span> ના વર્ષથી ચાર
        વર્ષ માટે આકારેલ વેરાના દર લાગુ કરવાના માટે ગ્રામપંચાયતની બેઠક નં{" "}
        <span>{dummy?.meetingNo || ".............."}</span> તારીખ{" "}
        <span>{dummy?.meetingDate || ".............."}</span> થી નક્કી થયા મુજબ
        તારીખ ૧/૪/<span>{dummy?.effectiveYear || ".............."}</span> થી
        લાગુ કરવા આખરી પ્રમાણીત કરવામાં આવે છે.
      </p>

      <p style={{ fontSize: "21px", textIndent: "100px" }}>
        સદરહુ આકારણી યાદિ મુજબના મિલ્કતના ક્રમ નં{" "}
        <span>{dummy?.propertyFrom || ".............."}</span> થી ક્રમ નં{" "}
        <span>{dummy?.propertyTo || ".............."}</span> સુધીના ટેક્સ પાત્ર
        મિલ્કતોની વાર્ષીક માંગણું{" "}
        <span>{dummy?.annualDemand || ".............."}</span> છે. સરકારી મિલ્કત
        હેતુ માટેની જગ્યા કરપાત્ર લેવામાં આવેલ નથી. જે ગ્રામ પંચાયતની સામાન્ય
        બેઠક મુજબ તારીખ <span>{dummy?.meetingDate || ".............."}</span> થી
        થયેલ નિર્ણય મુજબ વસુલાત માટે અમલમાં લેવામાં આવે છે.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          fontSize: "18px",

          marginTop: "50px",
          marginBottom: "70px",
          paddingRight: "50px",
        }}
      >
        {/* Sarpanch */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <span>
            સરપંચ
            <b
              style={{
                display: "block",
                marginTop: "2px",
              }}
            >
              {project?.details?.sarpanchName || "......................."}
            </b>
          </span>

          <span style={{ marginTop: "10px" }}>
            {" "}
            {project?.details?.gaam || "....."} ગ્રામ પંચાયત કચેરી{" "}
          </span>

          <span>
            તા. {project?.details?.taluka || "......"}, જિ.{" "}
            {project?.details?.district || "....."}
          </span>
        </div>
      </div>

      <p
        style={{
          position: "absolute",
          bottom: "20px",
          right: "10px",
          fontSize: "12px",
        }}
      >
        GP Benefits
      </p>
    </div>
  );
};

export default TharavPage2;
