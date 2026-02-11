export type RoleFamily =
  | "mainframe"
  | "java_fullstack"
  | "react_frontend"
  | "angular_fullstack"
  | "frontend_general"
  | "backend_general"
  | "data_engineer"
  | "etl_developer"
  | "bi_powerbi"
  | "data_scientist"
  | "python_backend"
  | "dotnet"
  | "embedded"
  | "mulesoft"
  | "unknown";

export type Domain =
  | "banking"
  | "healthcare"
  | "insurance"
  | "retail"
  | "utilities"
  | "technology"
  | "unknown";

export type RoleEmphasisType =
  | "frontend"
  | "backend"
  | "cloud"
  | "data"
  | "analytics"
  | "integration"
  | "mainframe"
  | "embedded";

export type BucketType =
  | "UI"
  | "Backend"
  | "Cloud"
  | "CI_CD"
  | "Data"
  | "Analytics"
  | "SDLC";

export interface JDAnalysisJSON {
  detected_role_family: RoleFamily;
  domain: Domain;
  domain_keywords: string[];
  stream_scores: Record<RoleFamily, number>;
  role_emphasis: {
    type: RoleEmphasisType;
    ratio: "70/30" | "60/40" | "50/50";
  };
  primary_skills: string[];
  secondary_skills: string[];
  tooling: string[];
  weighted_keywords: Array<{
    keyword: string;
    weight: number;
    type: "skill" | "tool" | "cloud" | "process" | "domain";
  }>;
}

export interface BulletOutput {
  bucket: BucketType;
  text: string;
}

export interface ExperienceOutput {
  index: number;
  company: string;
  title: string;
  start: string;
  end: string;
  domain: string;
  alignment_percent: number;
  stack_used: {
    primary: string[];
    secondary: string[];
    cloud_and_devops: string[];
    data_or_analytics: string[];
  };
  bullets: BulletOutput[];
}

export interface ResumeOutputJSON {
  headline_title: string;
  summary_bullets: string[];
  experiences_out: ExperienceOutput[];
  skills_compact: {
    primary: string[];
    secondary: string[];
    cloud_and_devops: string[];
    data_or_analytics: string[];
  };
  warnings: Array<{
    type:
      | "missing_jd_tech"
      | "thin_experience"
      | "constraint";
    message: string;
  }>;
}

export interface RoleProfile {
  headline_title_templates: string[];
  ecosystem_baseline: string[];
  bucket_targets: Record<BucketType, number>;
  alt_stacks: Array<{
    name: string;
    primary: string[];
    secondary: string[];
    cloud_and_devops: string[];
    data_or_analytics: string[];
  }>;
}

export interface RolesConfig {
  [key: string]: RoleProfile;
}

// API Request/Response types
export interface AnalyzeJDRequest {
  jd_text: string;
  jd_role: string;
}

export interface AnalyzeJDResponse {
  jd_analysis: JDAnalysisJSON;
}

export interface Experience {
  company: string;
  position?: string;
  duration_years?: number;
  /** Tech stack with number of bullets for each technology (should sum to at least 15). Example: { 'Angular': 8, 'Spring Boot': 3, 'AWS': 2, 'CI/CD': 1, 'SDLC': 1 } */
  tech_stack?: Record<string, number>;
}

export interface GenerateResumeRequest {
  jd_role: string;
  summary_bullet_count?: number;
  experiences: Experience[];
}

export interface GenerateResumeResponse {
  resume_output: ResumeOutputJSON;
}

export interface RepairResumeRequest {
  bad_output: ResumeOutputJSON;
  validation_errors: string[];
  allowed_tech: string[];
  ecosystem_baseline: string[];
  bucket_targets: Record<BucketType, number>;
}

export interface RepairResumeResponse {
  resume_output: ResumeOutputJSON;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
