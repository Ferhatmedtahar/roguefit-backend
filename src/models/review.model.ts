import mongoose, { Query } from "mongoose";

import { Product } from "./product.model";

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
    rating: {
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

reviewSchema.pre(/^find/, function (next) {
  const query = this as Query<any, any>;
  query
    .populate({
      path: "user",
      select: "name photo ",
    })
    .select("-__v -createdAt -updatedAt");
  query.populate({
    path: "product",
    select: "name -__v -createdAt -updatedAt ",
  });
  next();
});

// REVIEW: calculate the average rating and quanitity using aggregation

reviewSchema.statics.calcAverageRatings = async function (productId) {
  //  use aggregation pipeline  ,this point on the model , and it go into each model than we update each product document
  const stats = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "$product",
        numRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length) {
    await Product.findByIdAndUpdate(
      productId,
      { ratingAverage: stats[0].avgRating, ratingQuantity: stats[0].numRating },
      { new: true, runValidators: true }
    );
  } else {
    await Product.findByIdAndUpdate(
      productId,
      { ratingAverage: 4.5, ratingQuantity: 0 },
      { new: true, runValidators: true }
    );
  }
};

reviewSchema.post("save", function () {
  (this.constructor as any).calcAverageRatings(this.product);
});

//  !now part 2 for this calculation when we perform an update or delete

//  REVIEW for findByIdAndUpdate findByIdAndDelete

reviewSchema.pre(/^findOneAnd/, async function (next) {
  const query = this as any;
  // `this` points to the query, we store the query result in a custom property (not the query execution).
  query.setQuery({ ...query.getQuery() });
  next();
});
reviewSchema.post(/^findOneAnd/, async (doc) => {
  // `doc` is the document returned by the query in `findOneAnd`
  if (doc) {
    // Call the static method to calculate average ratings using the product ID
    await (doc.constructor as any).calcAverageRatings(doc.product);
  }
});

export const Review = mongoose.model("Review", reviewSchema);
