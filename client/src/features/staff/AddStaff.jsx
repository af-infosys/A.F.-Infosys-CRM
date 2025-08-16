// src/pages/AddStaff.jsx
import React, { useState } from "react";
import axios from "axios";
import apiPath from "../../isProduction";

import "./Login.scss";
import { useNavigate } from "react-router-dom";

const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",

    email: "",
    password: "",

    role: "",

    account: "",

    address: "",
    village: "",
    taluko: "",
    district: "",

    dob: "",
    addhar: "",
    age: "",

    education: "",
    experience: "",
    behaviour: "",
  });

  const navigate = useNavigate();

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await axios.post(`${await apiPath()}/api/auth/register`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStatus("✅ Staff Registered Successfully!");
      setFormData({ name: "", email: "", password: "", role: "surveyor" });

      navigate("/staff/manage");
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong.";
      setStatus(`❌ ${msg}`);
    }
  };

  // name
  // mobile
  // role
  // email
  // password
  // account
  // address
  // village
  // taluko
  // district
  // dob
  // addhar
  // age
  // education
  // experienc,
  // behaviour

  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="brand">A.F. Infosys</h2>
        <h1 className="title">Add Staff - Register</h1>

        <form onSubmit={handleSubmit} className="form">
          <input
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            placeholder="Mobile Number"
            name="mobile"
            type="number"
            value={formData.mobile}
            onChange={handleChange}
            className="input"
            required
          />

          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            children
            className="input"
            required
          >
            <option value="">Select Role</option>
            <option value="owner">Chairman / Owner</option>
            <option value="md">Managing Director</option>
            <option value="telecaller">Telecaller</option>
            <option value="surveyor">Surveyor</option>
            <option value="operator">Operator</option>
            <option value="accountant">Accountant</option>
          </select>

          {/* Account Number */}
          <input
            placeholder="Account Number"
            name="account"
            value={formData.account}
            onChange={handleChange}
            className="input"
            type="number"
          />

          {/* Other Details */}
          <h3>Address</h3>
          <input
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input"
          />

          <input
            placeholder="Village"
            name="village"
            value={formData.village}
            onChange={handleChange}
            className="input"
          />
          <input
            placeholder="Taluko"
            name="taluko"
            value={formData.taluko}
            onChange={handleChange}
            className="input"
          />
          <input
            placeholder="District"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="input"
          />

          <span>Date of Birth</span>
          <input
            placeholder="Date of Birth"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="input"
            type="date"
          />

          <input
            placeholder="Addhar"
            name="addhar"
            value={formData.addhar}
            onChange={handleChange}
            className="input"
          />

          <input
            placeholder="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="input"
          />

          <input
            placeholder="Education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="input"
          />

          <input
            placeholder="Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="input"
          />

          <input
            placeholder="Behaviour"
            name="behaviour"
            value={formData.behaviour}
            onChange={handleChange}
            className="input"
          />

          <button type="submit" className="btn">
            Add Staff
          </button>

          <button
            type="button"
            className="btn view-btn"
            onClick={() => {
              navigate("/staff/manage");
            }}
          >
            View All Staff
          </button>
        </form>

        <br />
        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
};

export default AddStaff;
