import User from "../models/User.js";

// 🔹 Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// 🔹 Get user  by ID
export const getUserInfo = async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// 🔹 Get user name by ID
export const getUserName = async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ name: user.name || "Unknown" });
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// 🔹 Edit user info
export const editUser = async (req, res) => {
  try {
    const {
      name,
      mobile,
      role,
      password,
      address,
      village,
      taluko,
      district,
      dob,
      addhar,
      age,
      education,
      experience,
      behaviour,
      account,
    } = req.body;

    const updatedUser = {
      name,
      mobile,
      role,
      password,
      address,
      village,
      taluko,
      district,
      dob,
      addhar,
      age,
      education,
      experience,
      behaviour,
      account,
    };

    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// 🔹 Assign, Edit or Delete User Work (Reusable handler)
const updateUserWork = async (req, res, action) => {
  try {
    const update =
      action === "delete" ? { work: "" } : { work: req.body.workSheetId };

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message:
        action === "delete"
          ? "Work deleted successfully"
          : action === "edit"
          ? "Work updated successfully"
          : "Work assigned successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// 🔹 Exported endpoints using the reusable handler
export const assignUserWork = (req, res) => updateUserWork(req, res, "assign");

export const editUserWork = (req, res) => updateUserWork(req, res, "edit");

export const deleteUserWork = (req, res) => updateUserWork(req, res, "delete");
