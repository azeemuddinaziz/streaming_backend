import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  { timestamps: true },
  {
    subscriber: {
      type: Schema.Types.ObjectId, //one who is subscribing
      ref: "User",
    },

    channel: {
      type: Schema.Types.ObjectId, //one who is subscribed
      ref: "User",
    },
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
