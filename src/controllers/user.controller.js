import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadFileOnCloudinary } from "../services/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh tokens."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in do
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullname, email, username, password } = req.body;

  if (!username || !email || !password || !fullname)
    throw new ApiError(400, "All fields are required");

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) throw new ApiError(409, "Username or email already exists!");

  const avatarLocalPath = req.files?.avatar[0]?.path;

  // const coverImageLocalPath = req.files?.coverImage[0]?.path; //This is a quite wrong method.
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) throw new ApiError(400, "Avatar image is required!");

  const avatar = await uploadFileOnCloudinary(avatarLocalPath);
  const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar image is required!");

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  return res.status(201).json(
    new ApiResponse({
      statusCode: 200,
      data: createdUser,
      message: "User registered successfully.",
    })
  );
});

const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  //username or email
  //find the user
  //password check ? access/refresh token : "not authorized, wrong password"
  //set cookies
  //response success login

  const { username, email, password } = req.body;

  if (!(username || email))
    throw new ApiError(400, "Username or email is required!");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw (401, "Wrong password! Invalid user credentials.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // user.refreshToken = refreshToken;
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    hhtpOnly: true,
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
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secured: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out!"));
});

export { registerUser, loginUser, logoutUser };
