import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetSchema = Schema(
  { timestamps: true },
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    content: {
      type: String,
      required: true,
    },
  }
);

mongoose.plugin(mongooseAggregatePaginate());

export const Tweet = mongoose.model("Tweet", tweetSchema);
