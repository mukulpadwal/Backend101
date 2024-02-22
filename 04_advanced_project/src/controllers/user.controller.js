import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // Logic to register user
  // 1. Get all the data sent from the client
  // 2. We should validate the data to maintain the integrity of the data
  // 2.1 check if the user already exists (username or email should be unique)
  // 3. Handle the file upload
  // 4. Create a new user object
  // 5. Save the data to the database
  // 6. remove sensitive data from the user object response
});

export { registerUser };
