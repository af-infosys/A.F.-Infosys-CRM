import axios from "axios";
import { useEffect, useState } from "react";
import apiPath from "../../isProduction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CurrentProjects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = await apiPath();
      const res = await fetch(`${url}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      const usersWithWork = data.map((user) => ({
        ...user,
        work: user.work || { gaam: "", taluka: "", district: "" },
      }));
      setUsers(usersWithWork);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("સ્ટાફ ડેટા લાવવામાં નિષ્ફળ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
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
          {projects
            ?.filter((project) => {
              return project?.other?.status === "working";
            })
            ?.map((project, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{project?.spot?.gaam || "..."}</td>
                <td>{project?.details?.totalHouses || "...."}</td>
                <td>{project?.spot?.taluka || "...."}</td>
                <td>{project?.spot?.district || "...."}</td>
                <td>
                  {/* {new Date(project?.createdAt).toLocaleDateString() || "...."} */}
                  {new Date(project?.details?.date)?.toLocaleDateString() ||
                    "...."}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {users?.find((user) => user._id === project?.other?.surveyor)
                    ?.name || "----"}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {project?.other?.updates || "...."}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {project?.other?.remarks || "...."}
                </td>
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
                      <span style={{ whiteSpace: "nowrap" }}>
                        Update Status
                      </span>
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

export default CurrentProjects;
