import axios from "axios";
import React, { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import { useNavigate } from "react-router-dom";

const FinalProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const data = await axios.get(`${await apiPath()}/api/work`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(data);
      setProjects(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>ચાલુ કામ હોય તેની આકારણી સર્વેની યાદિ</h2>
      <h3>A.F. Infosys</h3>

      <table>
        <thead>
          <tr>
            <th>ક્રમ</th>

            <th>ગામ</th>

            <th>અંદાજીત ઘર</th>

            <th>તાલુકો</th>

            <th>જિલ્લો</th>
            <th>કામની વિગત</th>
            <th>સર્વેયરનું નામ</th>
            <th>સ્થિતિ</th>
            <th>નોંધ / રિમાર્કસ</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {projects?.map((project, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{project?.spot?.gaam}</td>
              <td>{project?.totalHouses}</td>
              <td>{project?.spot?.taluka}</td>
              <td>{project?.spot?.district}</td>
              <td>{new Date(project?.createdAt).toLocaleDateString()}</td>
              <td>{project?.name}</td>
              <td>{project?.updates}</td>
              <td>{project?.remarks}</td>
              <td>
                <button
                  style={{
                    background: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: ".3rem 1rem",
                    marginTop: ".4rem",
                  }}
                  className="ml-2 cursor-pointer"
                  onClick={() => {
                    navigate(`/orderValuation/form/${project?._id}`);
                  }}
                >
                  Form
                </button>

                <button
                  style={{
                    background: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: ".3rem 1rem",
                    marginTop: ".4rem",
                  }}
                  className="ml-2 cursor-pointer"
                  onClick={() => {
                    navigate(`/orderValuation/report/${project?._id}`);
                  }}
                >
                  Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinalProjects;
