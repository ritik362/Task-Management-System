import User from "../models/User.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar
});

export const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      res.status(400);
      throw new Error("Nothing to update");
    }

    const update = {};

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (trimmed.length < 2) {
        res.status(400);
        throw new Error("Name must be at least 2 characters long");
      }
      update.name = trimmed;
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).toLowerCase().trim();
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(normalizedEmail)) {
        res.status(400);
        throw new Error("Please provide a valid email address");
      }

      // Prevent updating to an email that belongs to another user
      const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: req.user._id } });
      if (existingUser) {
        res.status(409);
        throw new Error("An account with this email already exists");
      }

      update.email = normalizedEmail;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user || !(await user.comparePassword(currentPassword))) {
      res.status(401);
      throw new Error("Invalid current password");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an image");
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

