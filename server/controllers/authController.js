import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      work: user?.work,
    },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      mobile,
      role,
      email,
      password,
      account,
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
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      mobile,
      role,
      email,
      password,
      account,
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
    });

    await newUser.save();
    console.log("Staff Added Sucessfully,", name);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Error Registering Staff", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = password == user.password;
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    console.log(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        work: user?.work || {},
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
