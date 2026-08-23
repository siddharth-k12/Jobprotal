const asyncHandler = require("../middlewares/asyncHandler");
const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const safeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
});

// Register
const registerHandler = asyncHandler(async (req, res) => {
  let {
    username,
    password,
    email,
    phoneNumber,
  } = req.body;

  username = username?.trim();
  password = password?.trim();
  email = email?.toLowerCase().trim();
  phoneNumber = phoneNumber?.trim();

  if (!username || !password || !email || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Username, password, email and phone number are required",
    });
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must contain exactly 10 digits",
    });
  }

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    password: hashedPassword,
    email,
    phoneNumber,
  });

  const token = createToken(newUser._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: safeUser(newUser),
  });
});

// Login
const loginController = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  email = email?.toLowerCase().trim();
  password = password?.trim();

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await userModel
    .findOne({ email })
    .select("+password");

  // Same message for security
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const passwordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = createToken(user._id);

  res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: safeUser(user),
  });
});

// Update user
const updateController = asyncHandler(async (req, res) => {
  const currentUserId = req.user;

  const {
    username,
    email,
    phoneNumber,
  } = req.body;

  const currentUser = await userModel.findById(currentUserId);

  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const userInfo = {};

  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase().trim();

    if (normalizedEmail !== currentUser.email) {
      const existingEmail = await userModel.findOne({
        email: normalizedEmail,
      });

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      userInfo.email = normalizedEmail;
    }
  }

  if (phoneNumber !== undefined) {
    const normalizedPhone = String(phoneNumber).trim();

    if (!/^\d{10}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must contain exactly 10 digits",
      });
    }

    userInfo.phoneNumber = normalizedPhone;
  }

  if (username !== undefined) {
    const normalizedUsername = username.trim();

    if (normalizedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must contain at least 3 characters",
      });
    }

    userInfo.username = normalizedUsername;
  }

  if (Object.keys(userInfo).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No valid field to update",
    });
  }

  const updateUser = await userModel.findByIdAndUpdate(
    currentUserId,
    { $set: userInfo },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "User updated successfully",
    user: safeUser(updateUser),
  });
});

// Change password
const passwordController = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 8 characters",
    });
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// Get role
const userAdminController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const currentUser = await userModel
    .findById(userId)
    .select("role")
    .lean();

  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    currentUser,
  });
});

// Current user
const currenctUserController = asyncHandler(async (req, res) => {
  const userId = req.user;

  const currentUser = await userModel
    .findById(userId)
    .select("username email phoneNumber role createdAt")
    .lean();

  if (!currentUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    currentUser,
  });
});

module.exports = {
  registerHandler,
  loginController,
  updateController,
  passwordController,
  logoutUser,
  userAdminController,
  currenctUserController,
};