import React, { useState, useEffect } from "react";
import apiPath from "../../isProduction";
import { useNavigate, useParams } from "react-router-dom";

const AddStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [status, setStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchStaffData = async () => {
        try {
          const apiURL = `${await apiPath()}/api/users/user/${id}`;
          const response = await fetch(apiURL, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const staffData = await response.json();

          setFormData({
            name: staffData.user.name || "",
            mobile: staffData.user.mobile || "",
            email: staffData.user.email || "",
            password: staffData.user.password || "",
            role: staffData.user.role || "",
            account: staffData.user.account || "",
            address: staffData.user.address || "",
            village: staffData.user.village || "",
            taluko: staffData.user.taluko || "",
            district: staffData.user.district || "",
            dob: staffData.user.dob
              ? new Date(staffData.user.dob).toISOString().split("T")[0]
              : "",
            addhar: staffData.user.addhar || "",
            age: staffData.user.age || "",
            education: staffData.user.education || "",
            experience: staffData.user.experience || "",
            behaviour: staffData.user.behaviour || "",
          });
        } catch (err) {
          console.error("Failed to fetch staff data:", err);
          setStatus("❌ Failed to load staff data.");
        }
      };
      fetchStaffData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const apiURL = isEditing
        ? `${await apiPath()}/api/users/${id}`
        : `${await apiPath()}/api/auth/register`;
      const method = isEditing ? "PUT" : "POST";
      const dataToSend = { ...formData };

      const response = await fetch(apiURL, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const msg = responseData.message || "Something went wrong.";
        throw new Error(msg);
      }

      setStatus(
        `✅ Staff ${isEditing ? "Updated" : "Registered"} Successfully!`
      );
      setTimeout(() => navigate("/staff/manage"), 1500);
    } catch (err) {
      const msg = err.message || "Something went wrong.";
      setStatus(`❌ ${msg}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-4xl font-bold mb-2 text-blue-600">
          A.F. Infosys
        </h2>
        <h1 className="text-center text-2xl font-semibold mb-6 text-gray-800">
          {isEditing ? "Edit Staff" : "Add Staff - Register"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              pattern="[0-9]{10}"
              title="Mobile number must be 10 digits"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="form-group md:col-span-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Role</option>
              <option value="owner">Chairman / Owner</option>
              <option value="md">Managing Director</option>
              <option value="telecaller">Telecaller</option>
              <option value="surveyor">Surveyor</option>
              <option value="monitor">Monitor</option>
              <option value="operator">Operator</option>
              <option value="accountant">Accountant</option>
            </select>
          </div>

          <h3 className="md:col-span-2 mt-4 text-xl font-semibold text-gray-800">
            Other Details
          </h3>

          <div>
            <label
              htmlFor="account"
              className="block text-sm font-medium text-gray-700"
            >
              Account Number
            </label>
            <input
              id="account"
              name="account"
              value={formData.account}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
            />
          </div>

          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="date"
            />
          </div>

          <h3 className="md:col-span-2 mt-4 text-xl font-semibold text-gray-800">
            Address
          </h3>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="village"
              className="block text-sm font-medium text-gray-700"
            >
              Village
            </label>
            <input
              id="village"
              name="village"
              value={formData.village}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="taluko"
              className="block text-sm font-medium text-gray-700"
            >
              Taluko
            </label>
            <input
              id="taluko"
              name="taluko"
              value={formData.taluko}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-700"
            >
              District
            </label>
            <input
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h3 className="md:col-span-2 mt-4 text-xl font-semibold text-gray-800">
            Professional Details
          </h3>
          <div>
            <label
              htmlFor="addhar"
              className="block text-sm font-medium text-gray-700"
            >
              Aadhaar
            </label>
            <input
              id="addhar"
              name="addhar"
              value={formData.addhar}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="education"
              className="block text-sm font-medium text-gray-700"
            >
              Education
            </label>
            <input
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700"
            >
              Experience
            </label>
            <input
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="behaviour"
              className="block text-sm font-medium text-gray-700"
            >
              Behaviour
            </label>
            <input
              id="behaviour"
              name="behaviour"
              value={formData.behaviour}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors mt-4 md:col-span-2"
            disabled={status}
          >
            {isEditing ? "Update Staff" : "Add Staff"}
          </button>

          <button
            type="button"
            className="w-full bg-gray-500 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-600 transition-colors mt-2 md:col-span-2"
            onClick={() => {
              navigate("/staff/manage");
            }}
          >
            Cancle
          </button>
        </form>

        <div className="mt-6 text-center">
          {status && (
            <p
              className={`p-3 rounded-md font-semibold ${
                status.startsWith("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
