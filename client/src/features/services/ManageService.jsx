import axios from "axios";
import { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "../projects/akarni.scss";

const quicklinks = [
  { id: 0, label: "1. રેવન્યુ હિસાબ", path: "manage/revenue" },
  { id: 1, label: "2. તારીજ", path: "manage/tarij" },

  { id: 2, label: "3. આકારણી સર્વે", path: "manage/akarni" },

  {
    id: 3,
    label: "4. ૯ / ડી",
    path: "manage/tax9d",
  },
  { id: 4, label: "5. પ્લાસ્ટીક બાઈન્ડિંગ", path: "" },
  { id: 5, label: "6. DSC / ડીજીટલ સીગનેચર", path: "" },
  { id: 6, label: "7. વ્યવસાય વેરા રજીસ્ટર", path: "" },
  {
    id: 7,
    label: "8. માંગણા બીલ પ્રિન્ટ / હાર્ડકોપી",
    path: "",
  },
  { id: 8, label: "9. માંગણા બીલ વોટસેઅપ (PDF)", path: "" },
  {
    id: 9,
    label: "10. વોઈસ કોલીંગ ઘરવેરા તેમજ પંચાયત જાહેરાત",
    path: "",
  },
  { id: 10, label: "11. ગામ નમુના નં.- ૨", path: "" },
  { id: 11, label: "12. વેબસાઈટ ગ્રામ પંચાયતની બનાવવી", path: "" },
];

const ManageService = () => {
  const navigate = useNavigate();

  return (
    <div className="akarni-container">
      <div className="akarni-header">
        <h2>Manage Orders</h2>
        <h3>A.F. Infosys</h3>
      </div>

      {/* Quicklinks */}
      <div className="quicklinks-container">
        {quicklinks.map((item) => (
          <button
            key={item.id}
            className="quicklinks"
            onClick={() => navigate(`/services/${item.path}`)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageService;
