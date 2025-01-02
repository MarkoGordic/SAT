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
        title: "OTISAK API",
        version: "1.0.0",
        description: "API documentation for the OTISAK",
      },
      servers: [
        {
          url: `http://localhost:11000/api/v1`,
          description: "Development server",
        },
      ],
    },
    apis: [
      path.join(__dirname, "../routes/auth/*.yaml"),
      path.join(__dirname, "../routes/user/*.yaml"),
    ],
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  return router;
};

export default setupSwagger;
