import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

export const editUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "User updated successfully",
      user: { id: user._id, role: user.role, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

export const assignUserWork = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { work: req.body },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Work Assigned successfully",
      user: { id: user._id, role: user.role, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

export const editUserWork = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { work: req.body },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Work Updated successfully",
      user: { id: user._id, role: user.role, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};

export const deleteUserWork = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { work: { gaam: "", taluka: "", district: "" } },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Work Deleted successfully",
      user: { id: user._id, role: user.role, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ message: "DB Error", error: err });
  }
};
