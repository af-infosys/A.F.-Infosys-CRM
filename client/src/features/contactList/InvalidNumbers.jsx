import React from "react";
import { useLocation } from "react-router-dom";

const InvalidNumbers = () => {
  const location = useLocation();
  const invalidNumbers = location.state?.invalid || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Invalid WhatsApp Numbers</h1>
      {invalidNumbers.length > 0 ? (
        <ul className="list-disc list-inside space-y-2">
          {invalidNumbers.map((number, index) => (
            <li key={index}>{number}</li>
          ))}
        </ul>
      ) : (
        <p>No invalid numbers were found or passed to this page.</p>
      )}
    </div>
  );
};

export default InvalidNumbers;
