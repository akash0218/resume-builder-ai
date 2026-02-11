import { z } from "zod";

export const AnalyzeJDRequestSchema = z.object({
  jd_text: z
    .string()
    .min(10, "JD text must be at least 10 characters")
    .max(10000, "JD text must not exceed 10000 characters"),
  jd_role: z
    .string()
    .min(1, "JD role/title is required")
    .describe("The job role or title being described in the JD (e.g., 'Senior Angular Developer')"),
});

export const ExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().optional(),
  duration_years: z.number().positive("Duration must be positive").optional(),
  tech_stack: z.record(z.number()).optional().describe(
    "Tech stack with number of bullets for each technology (should sum to at least 15). Example: { 'Angular': 8, 'Spring Boot': 3, 'AWS': 2, 'CI/CD': 1, 'SDLC': 1 }"
  ),
});

export const RoleProfileSchema = z.object({
  headline_title_templates: z.array(z.string()),
  ecosystem_baseline: z.array(z.string()),
  bucket_targets: z.record(z.number()),
  alt_stacks: z.array(
    z.object({
      name: z.string(),
      primary: z.array(z.string()),
      secondary: z.array(z.string()),
      cloud_and_devops: z.array(z.string()),
      data_or_analytics: z.array(z.string()),
    })
  ),
});

export const GenerateResumeRequestSchema = z.object({
  jd_role: z.string().min(1, "Job role is required"),
  summary_bullet_count: z.number().min(10, "Minimum 10 summary bullets required").default(10),
  experiences: z.array(ExperienceSchema).min(1, "At least one experience is required"),
});

export const RepairResumeRequestSchema = z.object({
  bad_output: z.record(z.any()),
  validation_errors: z.array(z.string()),
  allowed_tech: z.array(z.string()),
  ecosystem_baseline: z.array(z.string()),
  bucket_targets: z.record(z.number()),
});
