const Certificate = ({ data }) => {
  return (
    <div
      id="letter-page"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "18mm",
        boxSizing: "border-box",
        fontFamily: "Noto Serif Gujarati, serif",
        fontSize: "12pt",
        lineHeight: 1.6,
        position: "relative",
        border: "4mm solid #b23a3a",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "20pt",
          marginBottom: "10mm",
          letterSpacing: "1px",
        }}
      >
        પ્રમાણપત્ર
      </h1>

      {/* Body */}
      <p style={{ textIndent: "12mm", textAlign: "justify" }}>
        આથી પ્રમાણપત્ર આપવામાં આવે છે કે, શ્રી એક્સ-વાયઝોન ઇન્ફોસિસ અમરેલી
        દ્વારા અને તેની તાલુકા પંચાયત કચેરીમાં સાલાંતરીક માસિક તલાટી કમ મંત્રી
        મિટિંગમાં પંચાયત સંબંધી અને દૈનિક રેકર્ડ અદ્યતન કરવા બાબતે વિસ્તૃત
        માહિતી આપવામાં આવેલ છે.
      </p>

      <p style={{ textIndent: "12mm", textAlign: "justify" }}>
        ગ્રામ પંચાયતોમાં કાર્યરત કર્મચારીઓ માટે તલાટી કમ મંત્રીની દૈનિક
        કામગીરીમાં મદદરૂપ થાય તેવું માર્ગદર્શન આપવામાં આવેલ છે.
      </p>

      <p style={{ textIndent: "12mm", textAlign: "justify" }}>
        તેમજ પ્રેઝન્ટેશન દ્વારા તાલુકા કક્ષાની તલાટી કમ મંત્રીની કામગીરીને વધુ
        સરળ અને ઝડપી બનાવવા અંગે માર્ગદર્શન આપવામાં આવેલ છે.
      </p>

      <p style={{ textIndent: "12mm", textAlign: "justify" }}>
        જે બદલ આ પ્રમાણપત્ર અહીં આપવામાં આવે છે.
      </p>

      {/* Footer */}
      <div style={{ marginTop: "30mm" }}>
        <div style={{ float: "left" }}>
          <p>સ્થળ : તાલુકા પંચાયત કચેરી</p>
          <p>તા. </p>
        </div>

        <div style={{ float: "right", textAlign: "center" }}>
          <p>તાલુકા વિકાસ અધિકારી</p>
          <p> </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
