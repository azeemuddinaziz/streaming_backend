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
      owner: req?.user,
    });
    if (!playlist) throw new ApiError(500, "Failed to create playlist.");

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist created successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || error || "Something went wrong while creating playlist."
    );
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  //TODO: get user playlists
  try {
    const { userId } = req.params;
    if (!userId) throw new ApiError(400, "userId is required.");

    const playlists = await Playlist.find({ owner: userId });
    if (!playlists) throw new ApiError(400, "Error while finding playlists.");

    return res
      .status(200)
      .json(new ApiResponse(200, playlists, "Playlists fetched successfully/"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || error || "Something went wrong while fetching playlsits."
    );
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    if (!playlistId) throw new ApiError(400, "playlistId is required.");

    const playlist = await Playlist.find({ _id: playlistId });
    if (!playlist) throw new ApiError(400, "Error while finding playlists.");

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist fetched successfully/"));
  } catch (error) {
    throw new ApiError(
      500,
      error.message || error || "Something went wrong while fetching playlsits."
    );
  }
});

export { createPlaylist, getUserPlaylists, getPlaylistById };
