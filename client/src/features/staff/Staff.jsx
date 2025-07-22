import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import apiPath from "../../isProduction";

const Staff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${await apiPath()}/api/users`);
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch leads", err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>All Staff</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Password</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={() => {
          navigate("/staff/add");
        }}
      >
        Add Staff
      </button>
    </div>
  );
};

export default Staff;
