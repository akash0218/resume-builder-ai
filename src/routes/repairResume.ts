import { Router, Request, Response, NextFunction } from "express";
import { callGemini } from "../lib/geminiClient";
import { RepairResumeRequestSchema } from "../schemas";
import {
  RepairResumeRequest,
  RepairResumeResponse,
  ResumeOutputJSON,
  ErrorResponse,
} from "../types";
import { REPAIR_RESUME_SYSTEM_PROMPT } from "../prompts";

const router = Router();

/**
 * @swagger
 * /v1/repair-resume:
 *   post:
 *     summary: Repair Resume
 *     description: Repairs validation failures in resume output by regenerating with corrections
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bad_output
 *               - validation_errors
 *             properties:
 *               bad_output:
 *                 type: object
 *               validation_errors:
 *                 type: array
 *               allowed_tech:
 *                 type: array
 *               ecosystem_baseline:
 *                 type: array
 *               bucket_targets:
 *                 type: object
 *     responses:
 *       200:
 *         description: Resume repaired successfully
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
 * POST /v1/repair-resume
 * Repairs validation failures in resume output
 */
router.post(
  "/repair-resume",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const validated = RepairResumeRequestSchema.parse(req.body);
      const request = validated as RepairResumeRequest;

      console.log("Repairing resume...");

      // Prepare user payload
      const userPayload = `VALIDATION_ERRORS:\n${JSON.stringify(request.validation_errors, null, 2)}

ALLOWED_TECH:\n${JSON.stringify(request.allowed_tech, null, 2)}

ECOSYSTEM_BASELINE:\n${JSON.stringify(request.ecosystem_baseline, null, 2)}

BUCKET_TARGETS:\n${JSON.stringify(request.bucket_targets, null, 2)}

BAD_OUTPUT:\n${JSON.stringify(request.bad_output, null, 2)}`;

      // Call Gemini
      const repairedOutput = await callGemini({
        model: "gemini-2.5-flash",
        systemPrompt: REPAIR_RESUME_SYSTEM_PROMPT,
        userPayload,
      });

      // Validate output structure
      if (!repairedOutput.summary_bullets || repairedOutput.summary_bullets.length !== 10) {
        throw new Error("Repair failed: summary must have exactly 10 bullets");
      }

      if (!repairedOutput.experiences_out || !Array.isArray(repairedOutput.experiences_out)) {
        throw new Error("Repair failed: experiences_out must be an array");
      }

      for (const exp of repairedOutput.experiences_out) {
        if (!exp.bullets || exp.bullets.length !== 15) {
          throw new Error(
            `Repair failed: experience ${exp.index} must have exactly 15 bullets`
          );
        }
      }

      const response: RepairResumeResponse = {
        resume_output: repairedOutput as ResumeOutputJSON,
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
