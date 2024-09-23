import mongoose, { Query } from "mongoose";
import { AppError } from "../utils/appError";
import { Product } from "./product.model";

// interface Product {
//   name: string;
//   stock: number;
//   price: number;
//   discount: number;
//   isAvailable: boolean;
// }

// !user info , price info , products and  quantity ,adress , order Status

const orderSchema = new mongoose.Schema(
  {
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: [true, "a order must have a user"],
    // },
    customerContact: {
      type: String,
      required: [true, "Order must have a customer Contanct"],
    },
    totalPrice: {
      type: Number,
      // required: [true, "a order must have a total price "],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "a order must have a products"],
        },
        quantity: {
          type: Number,
          required: [true, "product must have quantity in a specific order"],
        },
      },
    ],
    // ! address stuff

    state: {
      type: String,
      required: [true, "Order must have a state to get delivered"],
      trim: true,
      // Bordj Badji Mokhtar
      maxLength: 25,
    },
    adress: {
      type: String,
      trim: true,
      // required: [true, "order must have an adress"],
    },
    deliveryType: {
      type: String,
      enum: ["office", "home"],
      default: "office",
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.pre("save", function (next) {
  if (!/^0[567]\d{8}$/.test(this.customerContact))
    next(new AppError("the contact number is wrong", 400));

  next();
});

orderSchema.pre("save", async function (next) {
  await this.populate({
    path: "products.product",
    select: "name stock price discount isAvailable ",
  });

  const promises: Query<any, any>[] = [];
  this.products.forEach(async (demand: any) => {
    if (demand.product?.stock < demand.quantity) {
      next(
        new AppError(
          `no available quanitity${demand.quantity} for this product:${demand.product?.name}, available:${demand.product?.stock}`,
          400
        )
      );
    }
    // $ update the stock

    const stock = demand.product.stock - demand.quantity;

    promises.push(
      Product.findByIdAndUpdate(
        demand.product?._id,
        {
          stock,
        },
        { runValidators: true, new: true }
      )
    );
  });
  // !end of checking the availability + update the stock
  await Promise.all(promises);

  const prices = this.products.map((demand: any) =>
    demand.product?.discount
      ? demand.product.price * demand.product.discount * demand.quantity
      : demand.product.price * demand.quantity
  );
  this.totalPrice = prices.reduce((acc, cur) => acc + cur, 0);
});

export const Order = mongoose.model("Order", orderSchema);

// check if the stock are available to serve the order
// get an array of prices after calculating the discount if exist
// update the stock
