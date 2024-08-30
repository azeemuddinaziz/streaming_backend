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

export { toggleSubscription };
