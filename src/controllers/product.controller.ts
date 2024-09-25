import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.model";
import { APIFeatures } from "../utils/APIfeatures";
import { AppError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";

// ! get all products

export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const products = await query.query;
    if (!products) return next(new AppError("no products found!", 404));

    res.status(200).json({
      status: "success",
      results: products.length,
      data: {
        products,
      },
    });
  }
);

// £ get one product

export const getProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) {
      return next(new AppError("product not found ", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  }
);

// $ create one product
export const createProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newProduct = await Product.create(req.body);
    if (!newProduct) {
      return next(new AppError("could not be created", 400));
    }
    res.status(201).json({
      status: "success",
      data: {
        newProduct,
      },
    });
  }
);

// * update one product

export const updateProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      category,
      description,
      summary,
      usage,
      price,
      discount,
      stock,
      images,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        description,
        summary,
        usage,
        price,
        discount,
        stock,
        images,
      },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!updatedProduct) {
      return next(new AppError("could not be created", 400));
    }
    res.status(200).json({
      status: "success",
      data: {
        updatedProduct,
      },
    });
  }
);

// ! delete one product

export const deleteProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return next(new AppError("could not be deleted", 404));
    res.status(204).json({
      message: "success",
    });
  }
);
