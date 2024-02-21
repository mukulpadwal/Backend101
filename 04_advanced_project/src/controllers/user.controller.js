import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // Logic to register user
  res.status(201).json({ success: true, message: "User registered" });
});

export { registerUser };
