import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    console.log(req.body);

    if (!content) throw new ApiError(400, "The fields are required.");

    const tweet = await Tweet.create({
      owner: req.user,
      content,
    });

    if (!tweet) throw new ApiError(501, "Failed to create tweet.");

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet created successfully."));
  } catch (error) {
    throw new ApiError(500, error || "Something went wrong.");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  try {
    const { userId } = req.params;

    if (!userId) throw new ApiError(400, "UserId is required.");

    const tweets = await Tweet.find({ owner: userId });

    if (!tweets) throw new ApiError(404, "No tweets found.");

    return res
      .status(200)
      .json(new ApiResponse(200, tweets, "Tweets fetched successfully."));
  } catch (error) {
    throw new ApiError(
      500,
      error || "Failed to fetch tweets, somehing went wrong."
    );
  }
});

export { createTweet, getUserTweets };
