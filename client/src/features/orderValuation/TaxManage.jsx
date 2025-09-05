import React, { useState } from "react";

const TaxManage = () => {
  const [taxes, setTaxes] = useState([
    { name: "ઘર વેરો", baseId: 0, format: "pr" },
    { name: "સા.પાણી વેરો", baseId: 0, format: "rs" },
    { name: "ખા.પાણી વેરો", baseId: 0, format: "rs" },
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
  ]);

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

      <div>
        {taxes.map((tax, index) => (
          <div>
            <div key={index}>
              <p>કરનું નામ : {tax.name}</p>

              <label>ટેક્ષ ગણવાનો આધાર </label>
              <select onChange={() => {}}>
                <option value="0">Select</option>

                {base.map((baseItem, baseIndex) => (
                  <option key={baseIndex} value={baseItem.id}>
                    {baseItem.name}
                  </option>
                ))}
              </select>

              <label>રકમ રૂ. / ટકા (આધાર)</label>
              <select onChange={() => {}}>
                <option value="pr">ટકા</option>
                <option value="rs">રકમ</option>
              </select>
            </div>

            <table>
              <tr>
                <th>રહેઠાણ</th>
                <th>બિન-રહેઠાણ</th>
                <th>પ્લોટ</th>
                <th>કોમન પ્લોટ</th>
              </tr>

              <tr>
                <td>
                  <input type="number" onChange={() => {}} />
                </td>
                <td>
                  <input type="number" onChange={() => {}} />
                </td>
                <td>
                  <input type="number" onChange={() => {}} />
                </td>
                <td>
                  <input type="number" onChange={() => {}} />
                </td>
              </tr>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaxManage;
