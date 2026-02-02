import meetingLetter from "../../../assets/meeting-letter.png";

const Page2 = ({ data }) => {
  return (
    <div
      id="letter-page"
      className="bg-white"
      style={{
        width: "794px",
        height: "1123px",
        padding: "20mm",
        boxSizing: "border-box",
      }}
    >
      <img src={meetingLetter} style={{ width: "100%" }} alt="Meeting Letter" />

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "10mm" }}>
        (પાનાં નં.-૨)
      </div>
    </div>
  );
};

export default Page2;
