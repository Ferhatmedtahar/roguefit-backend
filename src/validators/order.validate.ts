import Joi from "joi";

const productRole = Joi.array()
  .items(
    Joi.object({
      product: Joi.string().length(24).required().messages({
        "string.empty": "Product ID is required",
        "string.length": "Product ID must be a valid ObjectId",
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 1",
      }),
    })
  )
  .min(1)
  .required()
  .messages({
    "array.empty": "At least one product is required",
  });

// Schema for creating a new order
export const createOrderSchema = Joi.object({
  customer: Joi.string().required().messages({
    "string.empty": "User ID is required",
  }),
  customerContact: Joi.string().required().messages({
    "string.empty": "Customer contact is required",
  }),
  products: productRole,
  //  address stuff
  deliveryType: Joi.string()
    .optional()
    .default("office")
    .valid("office", "home")
    .messages({
      "any.only": "Delivery type must be either 'office' or 'home'",
    }),

  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "canceled")
    .optional()
    .messages({
      "any.only":
        "Status must be one of 'pending', 'shipped', 'delivered', or 'canceled' or proccessing",
    }),
  state: Joi.string().max(25).required().messages({
    "string.max": "State cant pass 25 caracters",
    "string.empty": "order should contain a state",
  }),
  address: Joi.string().optional(),
});

// Schema for updating an existing order
export const updateOrderSchema = Joi.object({
  isPaid: Joi.boolean().optional().messages({
    "boolean.base": "IsPaid must be a boolean value",
  }),
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "canceled")
    .optional()
    .messages({
      "any.only":
        "Status must be one of 'pending', 'shipped', 'delivered', or 'canceled' or proccessing",
    }),
});
