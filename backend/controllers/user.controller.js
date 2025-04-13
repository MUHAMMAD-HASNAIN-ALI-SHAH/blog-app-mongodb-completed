const bcrypt = require("bcrypt");
const { generateToken } = require("../config/utils.js");
const User = require("../models/user.model.js");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const getUsername = username.toLowerCase();
    const getEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: getEmail });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: getUsername,
      email: getEmail,
      password: hashedPassword,
    });

    generateToken(newUser._id, res);

    return res.status(201).json({
      msg: "Registration successful",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Register Controller Error: " + err.message);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Please fill in all fields" });

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user)
      return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    generateToken(user._id, res);

    return res.status(200).json({
      msg: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Controller Error: " + err.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const verify = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Verify Controller Error: " + err.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    console.error("Logout Controller Error: " + err.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = { register, login, verify, logout };
