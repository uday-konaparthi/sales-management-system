const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const {
      email,
      username,
      password,
      shopName,
      ownerName,
      phone,
      alternatePhone,
      gstNumber,
      emailBusiness,
      address,
      city,
      state,
      pincode,
      country,
      logo,
    } = req.body;

    // Check existing email
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Check existing username
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner account
    const user = await User.create({
      email,
      username,
      password: hashedPassword,

      role: "owner",
      ownerId: null,

      shopName,
      ownerName,
      phone,
      alternatePhone,
      gstNumber,
      emailBusiness,
      address,
      city,
      state,
      pincode,
      country: country || "India",
      logo,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        shopName: user.shopName,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ownerId =
      user.role === "owner" ? user._id : user.ownerId;

    const token = jwt.sign(
      {
        userId: user._id,
        ownerId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    /*res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });*/

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        ownerId,
        shopName: user.shopName,
        ownerName: user.ownerName,
        phone: user.phone,
        alternatePhone: user.alternatePhone,
        gstNumber: user.gstNumber,
        emailBusiness: user.emailBusiness,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
        logo: user.logo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Auto-login: Verify token from cookie and return user data
exports.autoLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const ownerId =
      user.role === "owner" ? user._id : user.ownerId;

    res.status(200).json({
      success: true,
      message: "Auto login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        ownerId,
        shopName: user.shopName,
        ownerName: user.ownerName,
        phone: user.phone,
        alternatePhone: user.alternatePhone,
        gstNumber: user.gstNumber,
        emailBusiness: user.emailBusiness,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
        logo: user.logo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Logout: Clear the cookie
exports.logout = async (req, res) => {
  /*res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });*/
  res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});
  res.json({ message: 'Logged out successfully' });
};
