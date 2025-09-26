import React from "react";

const SurvayorExpense = () => {
  return (
    <div>
      <h2>2- કંપનીએ સર્વેયરને આપેલ પરચુરણ ખર્ચનો હિસાબ</h2>

      <table>
        <thead>
          <tr>
            <th>ક્રમ</th>
            <th>સર્વેયરનું નામ</th>
            <th>સર્વે કરેલ ગામ</th>
            <th>પરચુરણ ખર્ચની વિગત</th>
            <th>પરચુરણ ખર્ચ આપેલ</th>
            <th>Payment Method</th>
            <th>ચૂકવેલ તારીખ</th>
            <th>દિવસ</th>
            <th>તાલુકો</th>
            <th>જીલ્લો</th>
          </tr>

          <tr>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1 </td> <td> યુનુશભાઈ મુસાભાઈ </td> <td> કાલવા </td>
            <td> ડુંગર </td> <td> 1000 </td> <td> UPI </td> <td> 2/1/2025 </td>
            <td> સોમવાર </td> <td> રાજુલા </td> <td> અમરેલી </td>
          </tr>

          <tr>
            <td>4 </td> <td> યુનુશભાઈ મુસાભાઈ </td> <td> કાલવા </td>
            <td> ડુંગર </td> <td> 800 </td> <td> UPI </td> <td> 2/4/2025 </td>
            <td> ગુરૂવાર </td> <td> રાજુલા </td> <td> અમરેલી </td>
          </tr>

          <tr>
            <td>5 </td> <td> યુનુશભાઈ મુસાભાઈ </td> <td> કાલવા </td>
            <td> ડુંગર </td> <td> 200 </td> <td> Cash </td> <td> 2/5/2025 </td>
            <td> શુક્રવાર </td> <td> રાજુલા </td> <td> અમરેલી </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SurvayorExpense;
