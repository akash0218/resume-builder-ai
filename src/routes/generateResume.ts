import { Router, Request, Response, NextFunction } from "express";
import { callGemini } from "../lib/geminiClient";
import { GenerateResumeRequestSchema } from "../schemas";
import {
  GenerateResumeRequest,
  GenerateResumeResponse,
  ResumeOutputJSON,
  ErrorResponse,
} from "../types";
import { GENERATE_RESUME_SYSTEM_PROMPT } from "../prompts";

const router = Router();

/**
 * @swagger
 * /v1/generate-resume:
 *   post:
 *     summary: Generate Resume
 *     description: Generates resume content with customizable summary bullets and 15+ bullets per experience based on tech_stack distribution
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jd_role
 *               - experiences
 *             properties:
 *               jd_role:
 *                 type: string
 *                 description: The job role/title being targeted (e.g., "Senior Angular Developer")
 *                 example: "Senior Angular Developer"
 *               summary_bullet_count:
 *                 type: number
 *                 description: Number of summary bullets to generate (minimum 10)
 *                 minimum: 10
 *                 default: 10
 *                 example: 12
 *               experiences:
 *                 type: array
 *                 description: List of work experiences with tech_stack specifying bullet counts per technology
 *                 items:
 *                   type: object
 *                   required:
 *                     - company
 *                     - tech_stack
 *                   properties:
 *                     company:
 *                       type: string
 *                       example: "Tech Corp"
 *                     position:
 *                       type: string
 *                       example: "Senior Frontend Engineer"
 *                     duration_years:
 *                       type: number
 *                       example: 5
 *                     tech_stack:
 *                       type: object
 *                       description: Technology to bullet count mapping (sum should be >= 15)
 *                       example: { "Angular": 6, "Spring Boot": 4, "AWS": 2, "PostgreSQL": 1, "Jenkins": 1, "Agile": 1 }
 *     responses:
 *       200:
 *         description: Resume generated successfully with 10 summary bullets and 15 bullets per experience
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume_output:
 *                   $ref: '#/components/schemas/ResumeOutput'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Missing or invalid API key
 *       500:
 *         description: Internal server error
 */
/**
 * POST /v1/generate-resume
 * Generates resume content with strict bullet counts and buckets
 */
router.post(
  "/generate-resume",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const validated = GenerateResumeRequestSchema.parse(req.body);
      const request = validated as any;

      console.log("Generating resume...");


      // Remove key_accomplishments if present in experiences (for backward compatibility)
      const cleanedExperiences = (request.experiences || []).map((exp: any) => {
        const { company, position, duration_years, tech_stack } = exp;
        return { company, position, duration_years, tech_stack };
      });

      const cleanedRequest = { ...request, experiences: cleanedExperiences };

      // Prepare the input payload as a string for Gemini
      const userPayload = `INPUT_JSON:\n${JSON.stringify(cleanedRequest, null, 2)}`;

      // Call Gemini
      const resumeOutput = await callGemini({
        model: "gemini-2.5-pro",
        systemPrompt: GENERATE_RESUME_SYSTEM_PROMPT,
        userPayload,
      });

      // Validate output structure
      const expectedSummaryCount = request.summary_bullet_count || 10;
      if (
        !resumeOutput.summary_bullets ||
        resumeOutput.summary_bullets.length !== expectedSummaryCount
      ) {
        throw new Error(`Invalid resume output: summary must have exactly ${expectedSummaryCount} bullets`);
      }

      if (!resumeOutput.experiences_out || !Array.isArray(resumeOutput.experiences_out)) {
        throw new Error("Invalid resume output: experiences_out must be an array");
      }

      // Validate experiences
      for (const exp of resumeOutput.experiences_out) {
        if (!exp.bullets || exp.bullets.length < 15) {
          throw new Error(
            `Invalid resume output: experience ${exp.company || exp.index} must have at least 15 bullets`
          );
        }
      }

      const response: GenerateResumeResponse = {
        resume_output: resumeOutput as ResumeOutputJSON,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
