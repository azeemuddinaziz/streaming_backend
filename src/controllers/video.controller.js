import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../services/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video

  //verify loginned or not //middleware will do this.
  //all fields in form, text - direct, files-multr-cloudinary (video, thumbnail)
  //User.create("Video")- command to create new video document
  //return response of success

  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(401, "Title and description are required!");
  }

  const videoLocalPath = req.files?.video[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(401, "Video and Thumbanail files are required!");
  }

  const cloudinaryVideo = await uploadFileOnCloudinary(videoLocalPath);
  const cloudinaryThumbnail = await uploadFileOnCloudinary(thumbnailLocalPath);

  if (!cloudinaryVideo || !cloudinaryThumbnail) {
    throw new ApiError(500, "Unable to upload files on cloudinary!");
  }

  const video = await Video.create({
    videoFile: cloudinaryVideo.url,
    thumbnail: cloudinaryThumbnail.url,
    title,
    description,
    duration: cloudinaryVideo.duration,
    owner: req.user,
  });

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully!"));
});

export { publishAVideo };
