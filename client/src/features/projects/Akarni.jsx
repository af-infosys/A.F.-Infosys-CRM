import axios from "axios";
import { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./akarni.scss";

const quicklinks = [
  { label: "1.1 Order Valuation Report", path: "/orderValuation/report" },
  { label: "1.2 Order Valuation Form", path: "/orderValuation/form" },

  { label: "0. Tharaav Set", path: "/orderValuation/tharav" },

  { label: "Bulk Upload", path: "/survay/bulk" },
  { label: "2. Akarni Register (No.8)", path: "/survay/akarniReport" },

  {
    label: "2. Akarni Register (No.8) - With Image",
    path: "/survay/akarniImgReport",
  },
  { label: "3.1. Vera Register (9D)", path: "/survay/taxRegister" },
  {
    label: "3.2. Water Tax Register",
    path: "/survay/waterTaxRegister",
  },

  { label: "4. Magla Register", path: "/survay/manglaRegister" },
  { label: "5. Vasulat Register", path: "/survay/vasulatRegister" },
  {
    label: "6. Index Report (પાનોત્રી બુક)",
    path: "/survay/indexReport",
  },
  {
    label: "6.5. Water Index Report (પાનોત્રી બુક)",
    path: "/survay/waterIndexReport",
  },

  { label: "7. Tarij Report", path: "/survay/tarij" },
  { label: "7.5. Water Tarij Report", path: "/survay/waterTarij" },
  { label: "8. Analysis Report", path: "/survay/analysis" },
  { label: "8. Analysis Kacha Report", path: "/survay/kacha" },
  { label: "Bill / Quotation", path: "/survay/bill" },
  { label: "Water Tax Bill / Quotation", path: "/survay/waterBill" },
];

const Akarni = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);

  const { projectId } = useParams();

  return (
    <div className="akarni-container">
      <div className="akarni-header">
        <h2>View & Manage Orders</h2>
        <h3>A.F. Infosys</h3>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {/* Project Info Card */}
          {/* <div className="project-info">
            <span>ગામ: {project?.spot?.gaam || "—"} |</span>
            <span>તાલુકો: {project?.spot?.taluka || "—"} |</span>
            <span>જિલ્લો: {project?.spot?.district || "—"}</span>
          </div> */}

          {/* Quicklinks */}
          <div className="quicklinks-container">
            {quicklinks.map((item) => (
              <button
                className="quicklinks"
                onClick={() => navigate(`${item.path}/${projectId}`)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Akarni;
