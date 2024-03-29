import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

// Controller 1 : Registering a New User
const registerUser = asyncHandler(async (req, res) => {
  // Logic to register user
  // 1. Get all the data sent from the client
  // 2. We should validate the data to maintain the integrity of the data
  // 2.1 check if the user already exists (username or email should be unique)
  // 3. Handle the file upload
  // 4. Create a new user object
  // 5. Save the data to the database
  // 6. remove sensitive data from the user object response

  const { username, email, fullName, password } = req.body;

  // Validating the data
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Kindly provide data for all the fields...");
  }

  // Check for existing user based on email or username
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    res
      .status(409)
      .json(
        new ApiResponse(
          409,
          {},
          "User with same email or username already exists!!! Please try again with different email or username..."
        )
      );

    throw new ApiError(
      409,
      "User with same email or username already exists!!! Please try again with different email or username..."
    );
  }

  // Handeling file upload
  // console.log(req.files);

  let avatarLocalPath = "";
  let coverImageLocalPath = "";

  if (req.files) {
    const { avatar, coverImage } = req.files;

    if (avatar && avatar.length > 0) {
      avatarLocalPath = avatar[0].path;
    }

    if (coverImage && coverImage.length > 0) {
      coverImageLocalPath = coverImage[0]?.path;
    }
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required...");
  }

  // uploading to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Error uploading avatar");
  }

  // Create a new user object
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created"));
});

// Controller 2 : User Login
const loginUser = asyncHandler(async (req, res) => {
  // Logic to login user
  // 1. Fetch the data(username or email and password) from the frontend.
  // 2. Validate the username and email if they exist in the database or not
  // 2.1 If not then throw an error
  // 2.2 If yes then check the password
  // 3. If password is correct then generate access and refresh token and send it to the client through cokkies else throw an error.

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required...");
  }

  const user = await User.findOne({
    $or: [{ fullName: username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist!!!");
  }

  // Let's check the password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password Incorrect!!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

// Controller 3 : User Logout
const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new ApiError(500, "Error while logging user out...");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully..."));
});

// Controller 4 : Refresh the Tokens
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req?.cookies?.refreshToken || req?.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request!!!");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token!!!");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new Error(401, "Refresh Token is Expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
          },
          "Access Token refreshed!!!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token!!!");
  }
});

// Controller 5 : Change User Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  // 1. Take the oldPassword, newPassword and confirmNewPassword from the user
  // 2. Authenticate the oldPassword entered by the user
  // 2.1 If the oldPassword is wrong throw an error
  // 2.2 If the oldPassword is correct check the newPassword and confirmNewPassword
  // 3. If both are different throw an error.
  // 4. If they both are same save it into the dataase and send response

  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  if (!newPassword && !confirmNewPassword) {
    throw new ApiError(
      400,
      "Please give both the newPassword and confirmNewPassword..."
    );
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "newPassword and confirmNewPassword mismatched...");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "Password Updated Successfully!!!"));
});

// Controller 6 : Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Found Successfully!!!"));
});

// Controller 7 : Update User Account Details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(400, "All fields are required!!!");
  }

  // Let's Check if the email is already taken or not
  const isEmailTaken = await User.find({ email });

  if (isEmailTaken.length > 0) {
    throw new ApiError(
      400,
      "User with this email already exists. Please try again with some different email!!"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(201)
    .json(
      new ApiResponse(201, user, "Account details updated successfully!!!")
    );
});

// Controller 8 : Update User Avatar Image
const updateUserAvatar = asyncHandler(async (req, res) => {
  // 1. get new avatar from the user
  // 2. upload it on cloudinary
  // 3. update the url in the database for that particular user
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!!!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Error uploading avatar");
  }

  await deleteOnCloudinary(req.user?.avatar);

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    {
      new: true,
    }
  ).select("-password");

  res
    .status(201)
    .json(new ApiResponse(201, user, "Avatar Uploaded Successfully!!!"));
});

// Controller 9 : Update User Cover Image
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image is required!!");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    throw new ApiError(500, "Error uploading cover image");
  }

  await deleteOnCloudinary(req.user?.coverImage);

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { coverImage: coverImage.url },
    },
    {
      new: true,
    }
  ).select("-password");

  res
    .status(201)
    .json(new ApiResponse(201, user, "Cover Image Uploaded Successfully!!!"));
});

// Controller 10 : Get User Channel Profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
  // We will get the username from the URL
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  // User.find({username})

  // Let's do it all at once
  const channel = await User.aggregate([
    // 1st Pipeline : finding the user from username
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },

    // 2nd Pipeline : let's lookup for subscribers
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    // 3rd Pipeline : let's lookup for channels subscribed
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },

    // 4th Pipeline : let's add all the fields
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channeIsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },

    // 5th Pipeline : sending selected fields
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channeIsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(400, "No channel found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, channel[0], "channel fetched successfully"));
});

// Controller 11 : Get User's Watch History
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    // 1st Pipeline : findind the user
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },

    // 2nd Pipeline : lookup for watch history
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          // 1st SubPipeline : lookup for users
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                // 1st Sub-SubPipeline : filtering fields
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },

          // 2nd SubPipeline
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch History Fetched Successfully!!!"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};

// Just to understand the Working of some
// The some() method of Array instances tests whether at least one element in the array passes the test implemented by the provided function. It returns true if, in the array, it finds an element for which the provided function returns true; otherwise it returns false. It doesn't modify the array.
/*
  [username, email, fullName, password].some(function (field) {
    console.log(typeof field);
    console.log(field?.trim().length);
  });
  */

// [Object: null prototype] {
//   avatar: [
//     {
//       fieldname: 'avatar',
//       originalname: '7d34d9d53640af5cfd2614c57dfa7f13.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: './public/temp/',
//       filename: '7d34d9d53640af5cfd2614c57dfa7f13.png',
//       path: 'public\\temp\\7d34d9d53640af5cfd2614c57dfa7f13.png',
//       size: 10805
//     }
//   ],
//   coverImage: [
//     {
//       fieldname: 'coverImage',
//       originalname: 'NNANgW09QELm_1584_396.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: './public/temp/',
//       filename: 'NNANgW09QELm_1584_396.png',
//       path: 'public\\temp\\NNANgW09QELm_1584_396.png',
//       size: 92663
//     }
//   ]
// }
