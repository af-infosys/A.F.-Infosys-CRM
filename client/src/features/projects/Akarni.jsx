import axios from "axios";
import { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import "./akarni.scss";

const quicklinks = [
  { id: 1, label: "Order Valuation Report", path: "/orderValuation/report" },
  { id: 2, label: "Akarni Register (No.8)", path: "/survay/akarniReport" },
  { id: 3, label: "Tax Register (9D)", path: "/survay/taxRegister" },
  { id: 4, label: "Index Report પાનોત્રી બુક", path: "/survay/indexReport" },
  { id: 5, label: "Tarij Report", path: "/survay/tarij" },
  { id: 6, label: "Analysis Report", path: "/survay/analysis" },
];

const Akarni = () => {
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
                onClick={() =>
                  navigate(`${item.path}/6882180eab7cc70564b9fb4b`)
                }
              >
                {item.id}. {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Akarni;
