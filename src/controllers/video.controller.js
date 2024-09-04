import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFilesOnCloudinary,
  uploadFileOnCloudinary,
} from "../services/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  try {
    const {
      page = 1,
      limit = 20,
      query = "",
      sortBy = "_id",
      sortType = "asc",
      userId,
    } = req.query;

    const pipeline = [
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
      },
      { $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } },
    ];

    const options = { page: parseInt(page), limit: parseInt(limit) };

    const videos = await Video.aggregatePaginate(
      Video.aggregate(pipeline),
      options
    );

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully!"));
  } catch (error) {
    throw new ApiError(500, error || "Something went wrong.");
  }
});

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
    owner: req.user?._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully!"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //TODO: get video by id
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate(
    "owner",
    "-password -refreshToken"
  );
  if (!video) throw new ApiError(404, "Video was not found!");

  return res
    .status(200)
    .json(new ApiResponse(200, { video }, "Video fetched successfully!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(404, "Video not found!");

    if (title && title !== video.title) {
      video.title = title.trim();
    }

    if (description && description !== video.description) {
      video.description = description.trim();
    }

    let cloudinaryThumbnail;
    if (req?.file?.path) {
      cloudinaryThumbnail = await uploadFileOnCloudinary(req.file.path);
      await deleteFilesOnCloudinary(video.thumbnail, "image");
      if (cloudinaryThumbnail !== video.thumbnail) {
        video.thumbnail = cloudinaryThumbnail.url;
      }
    }

    await video.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Details updated successfully."));
  } catch (error) {
    throw new ApiError(500, error || "Something went wrong.");
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(404, "Video not found.");

    await deleteFilesOnCloudinary(video.videoFile, "video");
    await deleteFilesOnCloudinary(video.thumbnail, "image");

    await Video.deleteOne({ _id: videoId });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully."));
  } catch (error) {
    throw new ApiError(500, error || "Something went wrong.");
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found.");

    video.isPublished = !video.isPublished;
    await video.save();

    return res
      .status(200)
      .json(new ApiResponse(200, video, "Toggled the publish status."));
  } catch (error) {
    throw new ApiError(500, error || "Something went wrong.");
  }
});

export {
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideos,
};
