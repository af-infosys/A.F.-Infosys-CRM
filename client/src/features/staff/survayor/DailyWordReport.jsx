import React from "react";

const DailyWordReport = () => {
  return (
    <div>
      <h2>Surveyor Daily Work Report</h2>

      <table className="min-w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th
              scope="col"
              className="py-3 px-4 rounded-tl-lg"
              style={{ width: "100px" }}
            >
              ક્રમ
            </th>
            <th
              scope="col"
              className="py-3 px-4 rounded-tl-lg"
              style={{ width: "120px" }}
            >
              ગામ સર્વે કરેલ
            </th>
            <th scope="col" className="py-3 px-4">
              તારીખ કામની
            </th>
            <th scope="col" className="py-3 px-4">
              દિવસ
            </th>
            <th scope="col" className="py-3 px-4">
              શરૂ કરેલ સર્વેઘર નં.
            </th>
            <th scope="col" className="py-3 px-4">
              પુર્ણ કરેલ સર્વેઘર નં.
            </th>
            <th scope="col" className="py-3 px-4 rounded-tr-lg">
              કુલ ઘર
            </th>
            <th scope="col" className="py-3 px-4 rounded-tr-lg">
              નોંધ / રીમાર્કસ
            </th>
            <th scope="col" className="py-3 px-4 rounded-tr-lg">
              પરચુરણ ખર્ચ
            </th>
            <th scope="col" className="py-3 px-4 rounded-tr-lg">
              તાલુકો
            </th>
            <th scope="col" className="py-3 px-4 rounded-tr-lg">
              જીલ્લો
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>ગામ</td>
            <td>તારીખ</td>
            <td>દિવસ</td>
            <td>શરૂ કરેલ સર્વેઘર નં.</td>
            <td>પુર્ણ કરેલ સર્વેઘર નં.</td>
            <td>કુલ ઘર</td>
            <td>નોંધ / રીમાર્કસ</td>
            <td>પરચુરણ ખર્ચ</td>
            <td>તાલુકો</td>
            <td>જીલ્લો</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DailyWordReport;
