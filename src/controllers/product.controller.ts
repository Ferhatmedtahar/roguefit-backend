import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.model";

export async function getAllProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const products = await Product.find();
  if (!products) next(new Error("no products found!"));

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
}
export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const newProduct = await Product.create(req.body);
    if (!newProduct) {
      next(new Error("could not be created"));
    }
    res.status(201).json({
      status: "success",
      data: {
        newProduct,
      },
    });
  } catch (err) {
    console.log(err);
  }
}
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
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
      slug,
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
        slug,
      },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!updatedProduct) {
      next(new Error("could not be created"));
    }
    res.status(200).json({
      status: "success",
      data: {
        updatedProduct,
      },
    });
  } catch (err) {
    console.log(err);
  }
}
