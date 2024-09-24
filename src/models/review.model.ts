import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "review must have a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "review must have a user"],
    },
    content: {
      type: String,
      trim: true,
      max: 400,
    },
    review: {
      type: Number,
      max: 5,
      min: 1,
      // set:(value)=>Math.round(value*10)/10
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
reviewSchema.index(
  { product: 1, user: 1 },
  {
    unique: true,
  }
);

// TODO: calculate the average rating and quanitity using aggregation
