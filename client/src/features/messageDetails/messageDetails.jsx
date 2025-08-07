import React from "react";

const messageDetails = () => {
  return <div className="container mx-auto p-2 sm:p-6 lg:p-8"></div>;
  //       <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
  //         (Overview) Customer List Report [ C. L . R. ] / ટેલીકોલર ફોર્મ દરરોજ ફોન
  //         કરેલ યાદી
  //       </h1>
  //       <h2 className="text-xl text-center mb-8 text-gray-600">
  //         by - A.F. Infosys
  //       </h2>

  //       <div className="flex justify-between items-center gap-2">
  //         <button
  //           className="add-btn"
  //           onClick={() => navigate("/customers/form")}
  //           style={{ fontSize: ".8rem", padding: ".8rem .9rem" }}
  //         >
  //           Add New Customer Record
  //         </button>

  //         <button
  //           className="add-btn"
  //           onClick={() => navigate("/customers/report")}
  //           style={{ fontSize: ".8rem", padding: ".8rem .9rem" }}
  //         >
  //           Full Report
  //         </button>
  //       </div>

  //       {error ? (
  //         <div className="flex justify-center items-center h-screen text-red-600">
  //           Error: {error}
  //         </div>
  //       ) : loading ? (
  //         <div className="flex justify-center items-center h-screen text-gray-700">
  //           Loading Data...
  //         </div>
  //       ) : (
  //         <div className="table-container rounded-lg shadow-md border border-gray-200">
  //           <table className="min-w-full divide-y divide-gray-200">
  //             <thead className="bg-gray-50">
  //               <tr>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   ક્રમ
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{
  //                     color: "white",
  //                     background: background,
  //                     minWidth: "150px",
  //                   }}
  //                 >
  //                   તારીખ થી
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   તારીખ
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   ફોનમા વાત કરેલ સંખ્યા
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   આવેલ કોલની સંખ્યા
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   ટોટલ કોલ કરેલ / આવેલ ની સંખ્યા
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   મીટીંગ તારીખ રૂબરુ મળવા જવાની સંખ્યા
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   સર્વિસ (1) આકારણી સર્વે કેટેગરી વાઈઝ સંખ્યા
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   સર્વિસ (2)રેવન્યુ હિસાબ કેટેગરી વાઈઝ સંખ્યા
  //                 </th>

  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   સર્વિસ (3) 9/ડી વેરા રજીસ્ટર કેટેગરી વાઈઝ સંખ્યા
  //                 </th>

  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   સર્વિસ (4) ગામ નમુના - 2 રજીસ્ટર કેટેગરી વાઈઝ સંખ્યા
  //                 </th>
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
  //                   style={{ color: "white", background: background }}
  //                 >
  //                   સર્વિસ (5) ઓડિટ પેરા જવાબ કેટેગરી વાઈઝ સંખ્યા
  //                 </th>
  //               </tr>
  //             </thead>

  //             {/* Index Start */}
  //             <tr>
  //               {/* 1 to 18 th for index */}
  //               {Array.from({ length: 12 }).map((_, index) => (
  //                 <th
  //                   className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
  //                   style={{
  //                     textAlign: "center",
  //                     color: "white",
  //                     background: background,
  //                   }}
  //                   key={index}
  //                 >
  //                   {index + 1}
  //                 </th>
  //               ))}
  //             </tr>
  //             {/* Index End */}

  //             <tbody className="bg-white divide-y divide-gray-200">
  //               {dateSummaries.map((summary, idx) => (
  //                 <tr key={summary.id}>
  //                   <td className="px-2 py-2 text-sm text-center">{idx + 1}</td>

  //                   <td className="px-2 py-2 text-sm text-center">
  //                     <input
  //                       type="date"
  //                       className="border rounded px-2"
  //                       value={summary.dateFrom}
  //                       onChange={(e) =>
  //                         updateDateField(summary.id, "dateFrom", e.target.value)
  //                       }
  //                     />
  //                   </td>

  //                   <td className="px-2 py-2 text-sm text-center">
  //                     <input
  //                       type="date"
  //                       className="border rounded px-2"
  //                       value={summary.dateTo}
  //                       onChange={(e) =>
  //                         updateDateField(summary.id, "dateTo", e.target.value)
  //                       }
  //                     />
  //                   </td>

  //                   <td className="px-2 py-2 text-sm text-center">
  //                     {summary.outgoing}
  //                   </td>
  //                   <td className="px-2 py-2 text-sm text-center">
  //                     {summary.incoming}
  //                   </td>
  //                   <td className="px-2 py-2 text-sm text-center">
  //                     {summary.total}
  //                   </td>
  //                   <td className="px-2 py-2 text-sm text-center">
  //                     {summary.meetings}
  //                   </td>

  //                   {/* Optional service placeholders */}
  //                   <td className="px-2 py-2 text-sm text-center">-</td>
  //                   <td className="px-2 py-2 text-sm text-center">-</td>
  //                   <td className="px-2 py-2 text-sm text-center">-</td>
  //                   <td className="px-2 py-2 text-sm text-center">-</td>
  //                   <td className="px-2 py-2 text-sm text-center">-</td>
  //                 </tr>
  //               ))}

  //               {records.length === 0 && !loading && !error && (
  //                 <tr>
  //                   <td
  //                     colSpan="12"
  //                     className="px-6 py-4 text-center text-gray-500"
  //                   >
  //                     No Records Found!
  //                   </td>
  //                 </tr>
  //               )}
  //             </tbody>
  //           </table>
  //         </div>
  //       )}
  //       <div className="mt-4 flex justify-end">
  //         <button
  //           onClick={addSummaryRow}
  //           className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
  //         >
  //           ➕ Add Date-wise Summary Row
  //         </button>
  //       </div>
  // </div>
  //   );
};

export default messageDetails;
