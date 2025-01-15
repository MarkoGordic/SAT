import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";
import path from "path";

const setupSwagger = (): Router => {
  const router = Router();

  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "SAT API",
        version: "0.0.1",
        description: "API documentation for the SAT",
      },
      servers: [
        {
          url: `http://localhost:11000/api/v1`,
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: [
      path.join(__dirname, "../routes/auth/*.yaml"),
      path.join(__dirname, "../routes/user/*.yaml"),
      path.join(__dirname, "../routes/suspension/*.yaml"),
    ],
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  return router;
};

export default setupSwagger;