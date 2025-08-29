import React from "react";

const TaxManage = () => {
  const taxes = [
    { name: "ઘર વેરો", baseId: 0 },
    { name: "સા.પાણી વેરો", baseId: 0 },
    { name: "ખા.પાણી વેરો", baseId: 0 },
    { name: "લાઈટ વેરો", baseId: 0 },
    { name: "સફાઈ વેરો", baseId: 0 },
    { name: "ગટર વેરો", baseId: 0 },
    { name: "નોટીસ", baseId: 0 },
    { name: "એડવાન્સ", baseId: 0 },
    { name: "અન્ય", baseId: 0 },
    { name: "તાલુકા પં. કર", baseId: 0 },
    { name: "અન્ય૩", baseId: 0 },
    { name: "અન્ય૪", baseId: 0 },
    { name: "અન્ય૫", baseId: 0 },
  ];

  const base = [
    { id: 20, name: "કીમત પ્રમાણે" }, // Done
    { id: 21, name: "વિસ્તાર પ્રમાણે" }, // Done
    { id: 54, name: "નળ ક્નેકશન" }, // Done
    { id: 19, name: "ઉચ્ચક" },
    { id: 20055, name: "ઘર વેરાના આધારે" },
    { id: 24, name: "કુલ કરના આધારે" },
    { id: 25, name: "બીજા કરના આધારે" },
  ];

  return (
    <div>
      <h1>Tax Manage (કરની યાદી)</h1>

      <div></div>
    </div>
  );
};

export default TaxManage;
