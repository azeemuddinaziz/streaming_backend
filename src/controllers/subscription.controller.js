import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params;

  //subscribed remove document.
  try {
    const subscirption = await Subscription.findOne({
      subscriber: req.user?._id,
      channel: channelId,
    });

    if (subscirption) {
      // Document exists

      await Subscription.deleteOne({ _id: subscirption._id });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Subscription removed successfully."));
    } else {
      // Document does not exist

      const channel = await User.findById(channelId);
      const subscriber = await User.findById(req.user?._id);

      if (!channel || !subscriber) {
        throw new ApiError(404, "Either Channel or Subscriber not found.");
      }

      const subscirption = await Subscription.create({
        subscriber,
        channel,
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            subscirption,
            "Subscribed to channel successfully."
          )
        );
    }
  } catch (error) {
    throw new ApiError(500, error?.message || error || "Failed to subscribe.");
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) throw new ApiError(400, "Channel Id is required.");

    const channel = await User.findById(channelId);

    if (!channel) throw new ApiError(400, "Channel not found.");

    const subscribersList = await Subscription.find({
      channel: channel,
    }).select("-channel");

    if (!subscribersList) throw new ApiError(400, "Subscribers not found.");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribersList,
          "Subscribers list fetched successfully."
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || error || "Failed to fetch subscribers."
    );
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  try {
    const { subscriberId } = req.params;
    if (!subscriberId) throw new ApiError(400, "Subscriber Id is required.");

    const subscriber = await User.findById(subscriberId);
    if (!subscriber) throw new ApiError(400, "Subscriber not found.");

    const channelList = await Subscription.find({ subscriber }).select(
      "-subscriber"
    );
    if (!channelList) throw new ApiError(500, "Could not fetch subscriptions.");

    return res
      .status(200)
      .json(
        new ApiResponse(200, channelList, "Channel list fetched successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message ||
        error ||
        "Something went wrong while fetched channel list."
    );
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
