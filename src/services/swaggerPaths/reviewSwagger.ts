export const reviewSwagger = {
  // Create a review
  "/reviews": {
    post: {
      tags: ["reviews"],
      summary: "Create a review",
      description: "Allows users to submit a review for a tour.",
      requestBody: {
        description: "Review object that needs to be added.",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                content: { type: "string" },
                rating: { type: "integer", minimum: 1, maximum: 5 },
                productId: { type: "string" },
              },
              required: ["review", "rating", "productId"],
              example: {
                content: "Great tour, enjoyed it a lot!",
                rating: 5,
                productId: "66f7e113b6eb679322d637b1",
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Review successfully created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  data: {
                    type: "object",
                    properties: {
                      review: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          review: { type: "string" },
                          rating: { type: "integer" },
                          tourId: { type: "string" },
                          userId: { type: "string" },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
              example: {
                status: "success",
                data: {
                  review: {
                    _id: "66f7e113b6eb679322d637b2",
                    content: "Great tour, enjoyed it a lot!",
                    rating: 5,
                    productId: "66f7e113b6eb679322d637b1",
                    userId: "66f7e113b6eb679322d637b3",
                    createdAt: "2024-09-28T12:00:00.000Z",
                    updatedAt: "2024-09-28T12:00:00.000Z",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid input data",
        },
      },
    },
    // Get all reviews
    get: {
      tags: ["reviews"],
      summary: "Retrieve all reviews",
      description: "Fetch all reviews for all tours.",
      responses: {
        "200": {
          description: "A list of reviews",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string" },
                    review: { type: "string" },
                    rating: { type: "integer" },
                    productId: { type: "string" },
                    userId: { type: "string" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
              example: [
                {
                  _id: "66f7e113b6eb679322d637b2",
                  review: "Amazing experience!",
                  rating: 5,
                  productId: "66f7e113b6eb679322d637b1",
                  userId: "66f7e113b6eb679322d637b3",
                  createdAt: "2024-09-28T12:00:00.000Z",
                  updatedAt: "2024-09-28T12:00:00.000Z",
                },
              ],
            },
          },
        },
      },
    },
  },

  // Get a specific review by ID
  "/reviews/{id}": {
    get: {
      tags: ["reviews"],
      summary: "Retrieve a specific review",
      description: "Fetch a review by its ID.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "Review ID",
        },
      ],
      responses: {
        "200": {
          description: "Review details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  review: { type: "string" },
                  rating: { type: "integer" },
                  productId: { type: "string" },
                  userId: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                },
              },
              example: {
                _id: "66f7e113b6eb679322d637b2",
                review: "Amazing experience!",
                rating: 5,
                productId: "66f7e113b6eb679322d637b1",
                userId: "66f7e113b6eb679322d637b3",
                createdAt: "2024-09-28T12:00:00.000Z",
                updatedAt: "2024-09-28T12:00:00.000Z",
              },
            },
          },
        },
        "404": {
          description: "Review not found",
        },
      },
    },

    // Update a review

    patch: {
      tags: ["reviews"],
      summary: "Update a review",
      description: "Update the content or rating of a review by its ID.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "Review ID",
        },
      ],
      requestBody: {
        description: "Updated review object.",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                content: { type: "string" },
                rating: { type: "integer", minimum: 1, maximum: 5 },
              },
              example: {
                content: "Updated review content",
                rating: 4,
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Review successfully updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  data: {
                    type: "object",
                    properties: {
                      review: {
                        type: "object",
                        properties: {
                          _id: { type: "string" },
                          review: { type: "string" },
                          rating: { type: "integer" },
                          productId: { type: "string" },
                          userId: { type: "string" },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
              example: {
                status: "success",
                data: {
                  review: {
                    _id: "66f7e113b6eb679322d637b2",
                    review: "Updated review content",
                    rating: 4,
                    productId: "66f7e113b6eb679322d637b1",
                    userId: "66f7e113b6eb679322d637b3",
                    createdAt: "2024-09-28T12:00:00.000Z",
                    updatedAt: "2024-09-28T12:15:00.000Z",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid input data",
        },
        "404": {
          description: "Review not found",
        },
      },
    },

    // Delete a review

    delete: {
      tags: ["reviews"],
      summary: "Delete a review",
      description: "Delete a review by its ID.",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "Review ID",
        },
      ],
      responses: {
        "204": {
          description: "Review successfully deleted",
        },
        "404": {
          description: "Review not found",
        },
      },
    },
  },
};
