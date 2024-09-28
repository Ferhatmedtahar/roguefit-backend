export const orderSwagger = {
  "/orders": {
    post: {
      tags: ["Order"],
      summary: "Create a new order",
      description: "Create a new order with the provided details.",
      requestBody: {
        description: "Order object that needs to be created.",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                userId: { type: "string" },
                productId: { type: "string" },
                quantity: { type: "integer" },
                totalPrice: { type: "number", format: "float" },
                status: {
                  type: "string",
                  enum: ["pending", "completed", "canceled"],
                },
              },
              required: ["userId", "productId", "quantity", "totalPrice"],
              example: {
                userId: "66e564ff7ae7ede0def32ffb",
                productId: "55e123ff7ae7ede0def32ffb",
                quantity: 2,
                totalPrice: 49.99,
                status: "pending",
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Order successfully created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  data: {
                    type: "object",
                    properties: {
                      order: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          userId: { type: "string" },
                          productId: { type: "string" },
                          quantity: { type: "integer" },
                          totalPrice: { type: "number", format: "float" },
                          status: { type: "string" },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                          __v: { type: "integer" },
                          id: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
              example: {
                status: "success",
                data: {
                  order: {
                    _id: "77e564ff7ae7ede0def32abc",
                    userId: "66e564ff7ae7ede0def32ffb",
                    productId: "55e123ff7ae7ede0def32ffb",
                    quantity: 2,
                    totalPrice: 49.99,
                    status: "pending",
                    createdAt: "2024-09-14T10:27:11.023Z",
                    updatedAt: "2024-09-14T10:27:11.023Z",
                    __v: 0,
                    id: "77e564ff7ae7ede0def32abc",
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Order could not be created",
        },
      },
    },
  },

  "/orders/{id}": {
    get: {
      tags: ["Order"],
      summary: "Get order by ID",
      description: "Retrieve order details by ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "The ID of the order to retrieve",
        },
      ],
      responses: {
        "200": {
          description: "Order details retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  order: {
                    type: "object",
                    properties: {
                      _id: { type: "string" },
                      userId: { type: "string" },
                      productId: { type: "string" },
                      quantity: { type: "integer" },
                      totalPrice: { type: "number", format: "float" },
                      status: { type: "string" },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                      __v: { type: "integer" },
                      id: { type: "string" },
                    },
                  },
                },
                example: {
                  status: "success",
                  order: {
                    _id: "77e564ff7ae7ede0def32abc",
                    userId: "66e564ff7ae7ede0def32ffb",
                    productId: "55e123ff7ae7ede0def32ffb",
                    quantity: 2,
                    totalPrice: 49.99,
                    status: "pending",
                    createdAt: "2024-09-14T10:27:11.023Z",
                    updatedAt: "2024-09-14T10:27:11.023Z",
                    __v: 0,
                    id: "77e564ff7ae7ede0def32abc",
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Order not found",
        },
      },
    },

    patch: {
      tags: ["Order"],
      summary: "Update order by ID",
      description: "Update details of an order by ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "The ID of the order to update",
        },
      ],
      requestBody: {
        description:
          "Order object with updated details. You can update only `status` and `quantity`.",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["pending", "completed", "canceled"],
                },
                quantity: { type: "integer" },
              },
              example: {
                status: "completed",
                quantity: 3,
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Order successfully updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  message: { type: "string" },
                  data: {
                    type: "object",
                    properties: {
                      updatedOrder: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          userId: { type: "string" },
                          productId: { type: "string" },
                          quantity: { type: "integer" },
                          totalPrice: { type: "number", format: "float" },
                          status: { type: "string" },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                          __v: { type: "integer" },
                          id: { type: "string" },
                        },
                      },
                    },
                  },
                },
                example: {
                  status: "success",
                  message: "Order updated successfully",
                  data: {
                    updatedOrder: {
                      _id: "77e564ff7ae7ede0def32abc",
                      userId: "66e564ff7ae7ede0def32ffb",
                      productId: "55e123ff7ae7ede0def32ffb",
                      quantity: 3,
                      totalPrice: 74.99,
                      status: "completed",
                      createdAt: "2024-09-14T10:27:11.023Z",
                      updatedAt: "2024-09-14T11:30:00.000Z",
                      __v: 1,
                      id: "77e564ff7ae7ede0def32abc",
                    },
                  },
                },
              },
            },
          },
        },
        "404": {
          description: "Order could not be updated",
        },
      },
    },

    delete: {
      tags: ["Order"],
      summary: "Cancel order by ID",
      description:
        "Cancel an order by ID, marking the order as canceled instead of fully deleting it.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
          description: "The ID of the order to cancel",
        },
      ],
      responses: {
        "200": {
          description: "Order successfully canceled",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  message: { type: "string" },
                  data: { type: "null" },
                },
                example: {
                  status: "success",
                  message: "Order canceled successfully",
                  data: null,
                },
              },
            },
          },
        },
        "404": {
          description: "Order could not be canceled",
        },
      },
    },
  },
};
