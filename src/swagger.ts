import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Resume AI Backend API",
      version: "1.0.0",
      description: "REST API for resume analysis and generation using Google Gemini",
      contact: {
        name: "Resume AI Team",
      },
    },
    servers: [
      {
        url: "https://resume-builder-ai-phr2.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key for authentication",
        },
      },
      schemas: {
        JDAnalysis: {
          type: "object",
          properties: {
            job_title: {
              type: "string",
              example: "Senior React Developer",
            },
            key_skills: {
              type: "array",
              items: { type: "string" },
              example: ["React", "TypeScript", "Node.js"],
            },
            experience_level: {
              type: "string",
              enum: ["entry", "mid", "senior", "lead"],
              example: "senior",
            },
            required_tech_stack: {
              type: "array",
              items: { type: "string" },
              example: ["React", "TypeScript", "JavaScript"],
            },
            nice_to_have_tech: {
              type: "array",
              items: { type: "string" },
              example: ["AWS", "Docker"],
            },
            soft_skills: {
              type: "array",
              items: { type: "string" },
              example: ["Team collaboration", "Communication"],
            },
          },
        },
        ResumeOutput: {
          type: "object",
          properties: {
            professional_summary: {
              type: "array",
              items: { type: "string" },
              description: "10 summary bullets",
            },
            experience: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  company: { type: "string" },
                  position: { type: "string" },
                  bullets: {
                    type: "array",
                    items: { type: "string" },
                    description: "15 achievement bullets per experience",
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            details: { type: "object" },
          },
        },
      },
    },
  },
  apis: [
    "./src/routes/*.ts",   // Development
    "./dist/routes/*.js",  // Production
  ],
};

export const swaggerSpec = (swaggerJsdoc as any)(options);
