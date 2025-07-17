import { authSwagger } from "./swaggerPaths/authSwagger";
import { orderSwagger } from "./swaggerPaths/orderSwagger";
import { productSwagger } from "./swaggerPaths/productSwagger";
import { reviewSwagger } from "./swaggerPaths/reviewSwagger";
import { userSwagger } from "./swaggerPaths/userSwagger";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "RogueFit API docs",
    version: "1.0.0",
    description:
      "API documentation for the RogueFit application, including endpoints for users, products orders and reviews.",
  },

  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local server",
    },
  ],
  paths: {
    ...userSwagger,
    ...authSwagger,
    ...productSwagger,
    ...orderSwagger,
    ...reviewSwagger,
  },
};

// Options for the swagger docs
export const SwaggerOptions = {
  swaggerDefinition,
  apis: ["../routes/*.ts"],
};
