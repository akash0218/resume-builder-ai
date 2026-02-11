import { Router, Request, Response, NextFunction } from "express";
import { callGemini } from "../lib/geminiClient";
import { AnalyzeJDRequestSchema } from "../schemas";
import {
  AnalyzeJDRequest,
  AnalyzeJDResponse,
  JDAnalysisJSON,
  ErrorResponse,
} from "../types";
import { ANALYZE_JD_SYSTEM_PROMPT } from "../prompts";

const router = Router();

/**
 * @swagger
 * /v1/analyze-jd:
 *   post:
 *     summary: Analyze Job Description
 *     description: Analyzes a job description and returns structured analysis including required skills, experience level, and tech stack
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jd_text
 *               - jd_role
 *             properties:
 *               jd_text:
 *                 type: string
 *                 example: "Senior React Developer needed. 5+ years experience with React, TypeScript, Node.js required."
 *               jd_role:
 *                 type: string
 *                 example: "Senior React Developer"
 *     responses:
 *       200:
 *         description: Job description analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jd_analysis:
 *                   $ref: '#/components/schemas/JDAnalysis'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Missing or invalid API key
 *       500:
 *         description: Internal server error
 */
/**
 * POST /v1/analyze-jd
 * Analyzes a job description and returns structured JDAnalysisJSON
 */
router.post(
  "/analyze-jd",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const validated = AnalyzeJDRequestSchema.parse(req.body);
      const request = validated as AnalyzeJDRequest;

      console.log("Analyzing JD...");

      // Call Gemini
      const jdAnalysis = await callGemini({
        model: "gemini-2.5-flash",
        systemPrompt: ANALYZE_JD_SYSTEM_PROMPT,
        userPayload: {
          user_message: `JOB_ROLE:\n${request.jd_role}\n\nJOB_DESCRIPTION_OR_ROLE_TEXT:\n<<<\n${request.jd_text}\n>>>`,
        },
      });

      // Validate output structure
      if (!jdAnalysis.detected_role_family || !jdAnalysis.domain) {
        throw new Error("Invalid JD analysis structure from Gemini");
      }

      const response: AnalyzeJDResponse = {
        jd_analysis: jdAnalysis as JDAnalysisJSON,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;