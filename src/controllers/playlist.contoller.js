import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {
  //TODO: create playlist
  try {
    const { name, description } = req.body;
    if (!name) throw new ApiError(400, "Name field is required.");

    const playlist = await Playlist.create({
      name,
      description,
    });
    if (!playlist) throw new ApiError(500, "Failed to create playlist.");

    return res.status(200).json(new ApiResponse());
  } catch (error) {
    throw new ApiError(
      500,
      error.message || error || "Something went wrong while creating playlist."
    );
  }
});

export { createPlaylist };
