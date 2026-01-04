import axios from "axios";
import { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AkarniProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(false);

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
      toast.error(`Error Fetching Projects: ${error}`);
    } finally {
      setLoading(false);
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

            <th>તાલુકો</th>

            <th>જિલ્લો</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {projects?.map((project, index) => (
            <tr style={{ cursor: "pointer" }}>
              <td
                onClick={() => {
                  navigate(`/survay/manage/${project?._id}`);
                }}
              >
                {index + 1}
              </td>
              <td
                onClick={() => {
                  navigate(`/survay/manage/${project?._id}`);
                }}
              >
                {project?.spot?.gaam}
              </td>
              <td
                onClick={() => {
                  navigate(`/survay/manage/${project?._id}`);
                }}
              >
                {project?.spot?.taluka}
              </td>
              <td
                onClick={() => {
                  navigate(`/survay/manage/${project?._id}`);
                }}
              >
                {project?.spot?.district}
              </td>

              <td>
                <div style={{ display: "flex" }}>
                  <button
                    style={{
                      background: "orange",
                      color: "white",
                      borderRadius: "20px",
                      padding: ".3rem 1rem",
                      textWrap: "nowrap",
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
                      textWrap: "nowrap",
                    }}
                    className="ml-2 cursor-pointer"
                    onClick={() => {
                      navigate(`/orderValuation/form/${project?._id}`);
                    }}
                  >
                    Order Valuation Form
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

export default AkarniProjects;
