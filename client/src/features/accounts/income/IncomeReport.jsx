import React, { useState, useEffect } from "react";

const IncomeReport = () => {
  const [incomeRecords, setIncomeRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);

  const fetchIncomeRecords = () => {
    const mockData = [
      {
        indexNumber: 1,
        date: "2023-10-26",
        description: "Payment for web development project",
        amount: 5500,
        category: "Project Income",
        paymentType: "UPI",
        paymentDetails: {
          upiId: "johndoe@paytm",
          bankName: "State Bank of India",
        },
        through: "John Doe",
      },
      {
        indexNumber: 2,
        date: "2023-10-25",
        description: "Consulting fees",
        amount: 2500,
        category: "Consulting",
        paymentType: "Cash",
        paymentDetails: {
          upiId: null,
          bankName: null,
        },
        through: "Jane Smith",
      },
      {
        indexNumber: 3,
        date: "2023-10-24",
        description: "Sale of digital product",
        amount: 850,
        category: "Product Sale",
        paymentType: "Cheque",
        paymentDetails: {
          chequeNumber: "001234",
          bankName: "HDFC Bank",
        },
        through: "Alice Johnson",
      },
      {
        indexNumber: 4,
        date: "2023-10-23",
        description: "Graphic design services",
        amount: 1500,
        category: "Service Income",
        paymentType: "UPI",
        paymentDetails: {
          upiId: "graphicguy@okicici",
          bankName: "ICICI Bank",
        },
        through: "Bob Williams",
      },
      {
        indexNumber: 5,
        date: "2023-10-22",
        description: "Website maintenance retainer",
        amount: 12000,
        category: "Retainer Fees",
        paymentType: "Cash",
        paymentDetails: {
          upiId: null,
          bankName: null,
        },
        through: "Client Company Inc.",
      },
    ];

    setTimeout(() => {
      try {
        setIncomeRecords(mockData);

        const total = mockData.reduce((sum, record) => sum + record.amount, 0);
        setTotalIncome(total);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch income records.");
        setLoading(false);
      }
    }, 1500); // 1.5 second delay
  };

  useEffect(() => {
    fetchIncomeRecords();
  }, []);

  // Renders the component UI.
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8 font-sans antialiased">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2 sm:mb-0">
              Income Report
              <br />
              <span style={{ fontSize: "1.rem" }}>A.F. Infosys</span>
            </h1>
            <button
              onClick={() => alert("Navigate to Add Income Form")}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Add New Record
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-100 p-4 rounded-xl shadow-md flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-blue-800 mt-1">
                  ₹ {totalIncome.toLocaleString()}
                </p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 10v2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            {/* You can add more summary cards here, e.g., for different categories */}
          </div>
        </div>

        {/* Loading, Error, or Table content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Loading records...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200">
            <table className="w-full text-sm text-left text-gray-500">
              {/* Table Header */}
              <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="py-3 px-4 rounded-tl-xl whitespace-nowrap"
                  >
                    #
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Date
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Description
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Amount
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Category
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Payment Type
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Payment History
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Received From
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {incomeRecords.map((record) => (
                  <tr
                    key={record.indexNumber}
                    className="bg-white border-b hover:bg-gray-100 transition-colors duration-200 ease-in-out"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">
                      {record.indexNumber}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {record.description}
                    </td>
                    <td className="py-3 px-4 font-bold text-green-600 whitespace-nowrap">
                      ₹ {record.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {record.category}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          record.paymentType === "UPI"
                            ? "bg-blue-200 text-blue-800"
                            : record.paymentType === "Cash"
                            ? "bg-green-200 text-green-800"
                            : "bg-indigo-200 text-indigo-800"
                        }`}
                      >
                        {record.paymentType}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {record.paymentDetails?.upiId && (
                        <span>UPI: {record.paymentDetails.upiId}</span>
                      )}
                      {record.paymentDetails?.chequeNumber && (
                        <span>
                          Cheque No: {record.paymentDetails.chequeNumber}
                        </span>
                      )}
                      {record.paymentDetails?.bankName && (
                        <span className="text-gray-400">
                          {" "}
                          ({record.paymentDetails.bankName})
                        </span>
                      )}
                      {!record.paymentDetails?.upiId &&
                        !record.paymentDetails?.chequeNumber &&
                        "N/A"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {record.through}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeReport;
