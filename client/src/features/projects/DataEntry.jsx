import axios from "axios";
import { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./akarni.scss";

const quicklinks = [
  { id: 0, label: "0. Tharaav Set", path: "/orderValuation/tharav" },
  { id: 1, label: "1. Order Valuation Report", path: "/orderValuation/report" },

  {
    id: 2,
    label: "2. Akarni Register (No.8)",
    path: "/dataentry/akarniReport",
  },

  {
    id: 3,
    label: "2. Akarni Register (No.8) - With Image",
    path: "/dataentry/akarniImgReport",
  },
  { id: 4, label: "3. Vera Register (9D)", path: "/dataentry/taxRegister" },
  { id: 5, label: "4. Magla Register", path: "/dataentry/manglaRegister" },
  { id: 6, label: "5. Vasulat Register", path: "/dataentry/vasulatRegister" },
  {
    id: 7,
    label: "6. Index Report (પાનોત્રી બુક)",
    path: "/dataentry/indexReport",
  },
  { id: 8, label: "7. Tarij Report", path: "/dataentry/tarij" },
  { id: 9, label: "8. Analysis Report", path: "/dataentry/analysis" },
  { id: 10, label: "8. Analysis Kacha Report", path: "/dataentry/kacha" },
  { id: 11, label: "Bill / Quotation", path: "/dataentry/bill" },
];

const DataEntry = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);

  const { projectId } = useParams();

  // const fetchProject = async () => {
  //   try {
  //     setLoading(true);
  //     const { data } = await axios.get(
  //       `${await apiPath()}/api/work/project/${projectId}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     setProject(data?.data || {});
  //   } catch (error) {
  //     console.error("Error fetching projects:", error);
  //     toast.error(`Error Fetching Projects: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchProject();
  // }, []);

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
                key={item.id}
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

export default DataEntry;
