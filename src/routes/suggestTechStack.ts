import { Router, Request, Response, NextFunction } from "express";
import { callGemini } from "../lib/geminiClient";
import { z } from "zod";

const router = Router();

export const SuggestTechStackRequestSchema = z.object({
  jd_analysis: z.object({
    detected_role_family: z.string(),
    domain: z.string(),
    domain_keywords: z.array(z.string()).optional(),
    primary_skills: z.array(z.string()),
    secondary_skills: z.array(z.string()).optional(),
  }),
  jd_role: z.string(),
});

export const SUGGEST_TECH_STACK_SYSTEM_PROMPT = `You are a technical expert who understands software development roles and their associated technology ecosystems.

Given a JD analysis (detected_role_family, domain, primary_skills, secondary_skills) and a job role, return a comprehensive list of all relevant technologies, frameworks, tools, and versions that someone in this role would typically use.

OUTPUT MUST be valid JSON only. No markdown. No explanations.

RULES:
1) Return technologies grouped by category
2) Include specific versions where applicable (e.g., "Angular 12", "Angular 14", "Angular 16")
3) Cover the complete lifecycle: UI frameworks, backend frameworks, databases, cloud services, CI/CD tools, testing, SDLC
4) Include both the technologies from the JD analysis AND related/complementary technologies commonly used together
5) For each category, suggest a reasonable default number of bullets (how many resume points should cover this category)

CATEGORIES TO INCLUDE:
- ui_frameworks: Frontend frameworks and libraries (Angular, React, Vue, etc. with versions)
- ui_libraries: Supporting UI libraries (RxJS, NgRx, Redux, Material, Bootstrap, etc.)
- backend_frameworks: Backend frameworks (Spring Boot, Spring MVC, Express, Django, etc.)
- backend_libraries: Backend supporting libraries (Spring Security, JPA/Hibernate, Spring Data, etc.)
- databases: Databases (PostgreSQL, MySQL, MongoDB, Redis, etc.)
- cloud_aws: AWS services (Lambda, S3, EC2, ECS, RDS, DynamoDB, CloudWatch, etc.)
- cloud_azure: Azure services (App Service, Functions, Blob Storage, Cosmos DB, etc.)
- cloud_gcp: GCP services (Cloud Functions, Cloud Storage, BigQuery, etc.)
- cicd: CI/CD tools (Jenkins, GitHub Actions, GitLab CI, Docker, Kubernetes, Terraform, etc.)
- testing: Testing frameworks (Jest, Jasmine, Karma, Cypress, JUnit, Mockito, etc.)
- sdlc: SDLC practices (Agile, Scrum, Code Reviews, Pair Programming, etc.)
- apis: API technologies (REST, GraphQL, gRPC, WebSockets, etc.)
- messaging: Messaging systems (Kafka, RabbitMQ, SQS, SNS, etc.)

OUTPUT SCHEMA:
{
  "role_family": "angular_fullstack",
  "suggested_tech_stack": {
    "ui_frameworks": {
      "technologies": ["Angular 12", "Angular 14", "Angular 16", "TypeScript 4.x", "TypeScript 5.x"],
      "suggested_bullets": 6
    },
    "ui_libraries": {
      "technologies": ["RxJS", "NgRx", "Angular Material", "Bootstrap", "Tailwind CSS"],
      "suggested_bullets": 2
    },
    "backend_frameworks": {
      "technologies": ["Spring Boot 2.x", "Spring Boot 3.x", "Spring MVC", "Node.js", "Express"],
      "suggested_bullets": 3
    },
    "backend_libraries": {
      "technologies": ["Spring Security", "Spring Data JPA", "Hibernate", "Spring Cloud"],
      "suggested_bullets": 1
    },
    "databases": {
      "technologies": ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
      "suggested_bullets": 1
    },
    "cloud_aws": {
      "technologies": ["AWS Lambda", "S3", "EC2", "ECS", "RDS", "CloudWatch", "API Gateway"],
      "suggested_bullets": 2
    },
    "cloud_azure": {
      "technologies": ["Azure App Service", "Azure Functions", "Blob Storage"],
      "suggested_bullets": 0
    },
    "cicd": {
      "technologies": ["Jenkins", "GitHub Actions", "Docker", "Kubernetes", "Terraform"],
      "suggested_bullets": 1
    },
    "testing": {
      "technologies": ["Jest", "Jasmine", "Karma", "Cypress", "JUnit", "Mockito"],
      "suggested_bullets": 1
    },
    "sdlc": {
      "technologies": ["Agile", "Scrum", "Code Reviews", "Technical Leadership"],
      "suggested_bullets": 1
    },
    "apis": {
      "technologies": ["REST APIs", "GraphQL", "WebSockets"],
      "suggested_bullets": 0
    },
    "messaging": {
      "technologies": ["Kafka", "RabbitMQ", "AWS SQS"],
      "suggested_bullets": 0
    }
  },
  "total_suggested_bullets": 18
}

CRITICAL ADDITIONAL RULES:
1) ALWAYS include ALL categories regardless of role type. Every role needs the COMPLETE lifecycle: UI, Backend, Cloud, CI/CD, Database, Testing, SDLC.
2) Cover the COMPLETE lifecycle for EVERY role: UI → Backend → Database → Cloud → CI/CD → Testing → SDLC
3) MANDATORY MINIMUMS for ALL roles (must ALWAYS have suggested_bullets >= 1):
   - ui_frameworks: at least 1 bullet (even for mainframe, data, .NET backend roles)
   - backend_frameworks: at least 1 bullet (even for pure frontend roles)
   - cloud_aws OR cloud_azure: at least 2 bullets combined
   - cicd: at least 1 bullet
   - databases: at least 1 bullet
   - testing: at least 1 bullet
   - sdlc: at least 1 bullet

4) ROLE-SPECIFIC DISTRIBUTION (adjust percentages, but ALWAYS include all categories):

   FRONTEND-HEAVY (react_frontend, angular_fullstack, frontend_general):
   - ui_frameworks: 5-7 bullets, ui_libraries: 2-3, backend_frameworks: 2-3, databases: 1-2, cloud_aws: 2, cicd: 1-2, testing: 1-2, sdlc: 1

   BACKEND-HEAVY (java_fullstack, python_backend, backend_general):
   - backend_frameworks: 5-7 bullets, ui_frameworks: 2-3, ui_libraries: 1, databases: 2-3, cloud_aws: 2-3, cicd: 1-2, messaging: 1-2, testing: 1-2, sdlc: 1

   .NET (dotnet):
   - backend_frameworks: 5-6 bullets (.NET Core, ASP.NET, Entity Framework), ui_frameworks: 2-3 (Angular/React/Blazor), databases: 2-3 (SQL Server, Azure SQL), cloud_azure: 2-3, cicd: 1-2, testing: 1-2, sdlc: 1

   DATA ENGINEER (data_engineer, etl_developer):
   - databases: 4-5 bullets, backend_frameworks: 2-3 (Python/Spark), cloud_aws: 3-4 (S3, Glue, Redshift, Athena), ui_frameworks: 1-2 (dashboards/React), cicd: 1-2, messaging: 2-3 (Kafka, Airflow), testing: 1, sdlc: 1

   BI/ANALYTICS (bi_powerbi, data_scientist):
   - databases: 3-4 bullets, backend_frameworks: 2-3 (Python), ui_frameworks: 1-2 (visualization dashboards), cloud_aws: 2-3, cicd: 1, testing: 1, sdlc: 1

   MAINFRAME (mainframe):
   - backend_frameworks: 5-6 bullets (COBOL, JCL, CICS, DB2), ui_frameworks: 1-2 (web modernization Angular/React), databases: 2-3 (DB2, IMS), cloud_aws: 1-2 (migration/integration), cicd: 1-2, testing: 1, sdlc: 1

   EMBEDDED (embedded):
   - backend_frameworks: 5-6 bullets (C/C++, RTOS, firmware), ui_frameworks: 1-2 (HMI/Qt/Electron), databases: 1-2, cloud_aws: 1-2 (IoT), cicd: 1-2, testing: 2 (unit/integration), sdlc: 1

   MULESOFT/INTEGRATION (mulesoft):
   - backend_frameworks: 5-6 bullets (MuleSoft, API design, ESB), ui_frameworks: 1-2 (API portal/React), databases: 2, cloud_aws: 2-3, cicd: 1-2, messaging: 2, testing: 1, sdlc: 1

   FULLSTACK (50/50, 60/40):
   - Balanced: ui_frameworks: 3-4, ui_libraries: 2, backend_frameworks: 3-4, databases: 2, cloud_aws: 2, cicd: 1-2, testing: 1, sdlc: 1

5) Include specific versions (Angular 14/15/16, Spring Boot 3.x, React 18, Node.js 18/20, .NET 6/7/8, Python 3.10/3.11, etc.)

6) Include role-appropriate complementary technologies:
   - Angular developers: Spring Boot/Node.js, AWS/Azure, Jenkins, PostgreSQL
   - Spring Boot developers: Angular/React, AWS, Jenkins, PostgreSQL, Kafka
   - React developers: Node.js/Express, AWS, Docker, MongoDB
   - .NET developers: Angular/React/Blazor, Azure, Azure DevOps, SQL Server
   - Data engineers: Python/Spark, AWS Glue/Redshift, Airflow, Snowflake
   - Mainframe developers: COBOL, JCL, DB2, Angular/React (modernization)
   - MuleSoft developers: Anypoint Platform, AWS/Azure, Kafka, REST/SOAP APIs
`;

/**
 * @swagger
 * /v1/suggest-tech-stack:
 *   post:
 *     summary: Suggest Tech Stack
 *     description: Given a JD analysis and role, returns a comprehensive list of relevant technologies grouped by category with suggested bullet counts
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jd_analysis
 *               - jd_role
 *             properties:
 *               jd_analysis:
 *                 type: object
 *                 description: Output from /v1/analyze-jd endpoint
 *                 properties:
 *                   detected_role_family:
 *                     type: string
 *                   domain:
 *                     type: string
 *                   primary_skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   secondary_skills:
 *                     type: array
 *                     items:
 *                       type: string
 *               jd_role:
 *                 type: string
 *                 description: The job role/title being targeted
 *     responses:
 *       200:
 *         description: Tech stack suggestions returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role_family:
 *                   type: string
 *                 suggested_tech_stack:
 *                   type: object
 *                 total_suggested_bullets:
 *                   type: number
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Missing or invalid API key
 *       500:
 *         description: Internal server error
 */
router.post(
  "/suggest-tech-stack",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const validated = SuggestTechStackRequestSchema.parse(req.body);

      console.log("Suggesting tech stack for role:", validated.jd_role);

      // Prepare the input payload as a string for Gemini
      const userPayload = `INPUT_JSON:\n${JSON.stringify(validated, null, 2)}`;

      // Call Gemini
      const techStackSuggestion = await callGemini({
        model: "gemini-2.5-flash",
        systemPrompt: SUGGEST_TECH_STACK_SYSTEM_PROMPT,
        userPayload,
      });

      // Validate output structure
      if (!techStackSuggestion.suggested_tech_stack) {
        throw new Error("Invalid output: missing suggested_tech_stack");
      }

      res.json(techStackSuggestion);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
