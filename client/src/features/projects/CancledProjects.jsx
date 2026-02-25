import axios from "axios";
import React, { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import { useNavigate } from "react-router-dom";

const CancledProjects = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <h2>પુર્ણ કરેલ કામની આકારણી સર્વેની યાદિ</h2>
      <h3>A.F. Infosys</h3>

      <table>
        <thead>
          <tr>
            <th>ક્રમ</th>

            <th>ગામ</th>

            <th>ઘર</th>

            <th>તાલુકો</th>
            <th>જિલ્લો</th>
            <th>કામની વિગત</th>
            <th>સર્વેયરનું નામ</th>
            <th>સ્થિતિ</th>
            <th>સરપંચશ્રી ત્થા તલાટી કમ મંત્રીનું નામ </th>
            <th>મોબાઈલ નંબર </th>
            <th>બિલ / ભાવ</th>
            <th>નોંધ / રિમાર્કસ</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {projects?.map((project, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{project?.spot?.gaam}</td>
              <td>{"--"}</td>
              <td>{project?.spot?.taluka}</td>
              <td>{project?.spot?.district}</td>
              <td>{new Date()?.toLocaleDateString() && "--"}</td>
              <td>{project?.name || "--"}</td>
              <td>{project?.updates || "--"}</td>

              <td>Sarpanch</td>
              <td>9876543210</td>

              <td>Bill</td>

              <td>{project?.remarks}</td>
              <td>
                <div style={{ display: "flex" }}>
                  <button
                    style={{
                      background: "blue",
                      color: "white",
                      borderRadius: "20px",
                      padding: ".3rem 1rem",
                    }}
                    className="ml-2 cursor-pointer"
                    onClick={() => {
                      navigate(`/survay/manage/${project?._id}`);
                    }}
                  >
                    Details
                  </button>

                  <button
                    style={{
                      background: "orange",
                      color: "white",
                      borderRadius: "20px",
                      padding: ".3rem 1rem",
                    }}
                    className="ml-2 cursor-pointer"
                    onClick={() => {
                      navigate(`/projects/update/${project?._id}`);
                    }}
                  >
                    <span style={{ whiteSpace: "nowrap" }}>Update Status</span>
                  </button>

                  <button
                    style={{
                      background: "orangered",
                      color: "white",
                      borderRadius: "20px",
                      padding: ".3rem 1rem",
                    }}
                    className="ml-2 cursor-pointer"
                    onClick={() => {
                      navigate(`/orderValuation/form/${project?._id}`);
                    }}
                  >
                    <span style={{ whiteSpace: "nowrap" }}>OV Form</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {loading ? (
            <tr>
              <td colSpan="10" className="text-center">
                Loading Project / Work Data...
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default CancledProjects;
