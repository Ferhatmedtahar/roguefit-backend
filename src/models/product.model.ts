import mongoose, { UpdateQuery } from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a product must have a name"],
      maxLength: [50, "a product's name must be below 50 caractres"],
      minLength: [1, "a product's name must be above 1 caractres"],
      unique: true,
    },
    category: {
      type: String,
      enum: {
        values: [
          "Protien Powders",
          "Healthy Fats",
          "Fat Burners",
          "Amino Acids",
          "Creatine",
          "Vitamins and Minerals",
          "Other Supplements",
          "Fitness Food",
          "Sportswear",
          "Workout Accessories",
        ],
        message: "only this categories are available",
      },
      required: [true, "product must have a category"],
    },
    description: {
      type: String,
      required: [true, "a product must have a description"],
    },
    summary: {
      type: String,
      required: [true, "a product must have a summary"],
    },
    usage: {
      type: String,
      required: [true, "a product must specify the usage"],
    },
    price: {
      type: Number,
      required: [true, "a product must have a price"],
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    stock: {
      type: Number,
      min: 0,
      required: [true, "a product must have a stock"],
    },
    isAvailable: { type: Boolean, default: true },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "ratingAverage must be more than 1 "],
      max: [5, "ratingAverage must be less than 5"],
      set: (value: number) => Math.round(value * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    images: [String],

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    slug: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// ! indexes
productSchema.index({ isAvailable: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });

// £  pre, post :Document and Query middlewares

// check the price and add slug field and fill the isAvailable field
productSchema.pre("save", function (next) {
  // Check if discount is less than price
  if (this.discount && this.discount >= this.price) {
    return next(new Error("The discount must be less than the price"));
  }
  this.slug = slugify(this.name, { lower: true });
  this.isAvailable = this.stock > 0;
  next();
});
//  check the availability
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as UpdateQuery<typeof this>;

  // Check if stock is being modified in the update
  if (update.stock !== undefined) {
    // Set isAvailable based on the stock value
    update.isAvailable = update.stock > 0;
  }
  next();
});

productSchema.pre(/^find/, function (next) {
  // eslint-disable-next-line
  const query = this as mongoose.Query<any, any>;
  query.select("-__v -createdAt -updatedAt");
  next();
});

// REVIEW virtual populate

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

export const Product = mongoose.model("Product", productSchema);
