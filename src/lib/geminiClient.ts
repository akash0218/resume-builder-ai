import axios from "axios";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export interface GeminiCallOptions {
  model: "gemini-2.5-flash" | "gemini-2.5-pro";
  systemPrompt: string;
  userPayload: string | Record<string, any>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Calls Google Gemini API with automatic retries and JSON parsing
 * - Retries up to 2 times on 429/5xx with exponential backoff
 * - Strips markdown code fences if present
 * - Validates JSON structure
 */
export async function callGemini(options: GeminiCallOptions): Promise<any> {
  const { model, systemPrompt, userPayload } = options;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set in environment");
  }

  console.log("Gemini API Key loaded:", apiKey.substring(0, 10) + "...");
  console.log("Model:", model);

  const userMessage =
    typeof userPayload === "string"
      ? userPayload
      : JSON.stringify(userPayload);

  const payload = {
    contents: [
      {
        parts: [
          {
            text: systemPrompt,
          },
          {
            text: userMessage,
          },
        ],
      },
    ],
  };

  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;
  console.log("Calling Gemini API:", url.replace(apiKey, "***"));
  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log("Attempt", attempt + 1, "with payload:", JSON.stringify(payload).substring(0, 100));
      const response = await axios.post<GeminiResponse>(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000,
      });

      const text = response.data.candidates[0]?.content.parts[0]?.text;

      if (!text) {
        throw new Error("No text content in Gemini response");
      }

      // Strip markdown code fences if present
      const cleanedText = stripCodeFences(text);

      // Extract the first valid JSON object from the response, even if there is stray text or line breaks
      const firstBrace = cleanedText.indexOf('{');
      const lastBrace = cleanedText.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        console.error('Gemini raw response (cleanedText):', cleanedText);
        throw new Error(`No JSON object found in Gemini response: ${cleanedText.substring(0, 100)}`);
      }
      let jsonString = cleanedText.substring(firstBrace, lastBrace + 1).trim();
      // Debug log the extracted JSON string
      console.error('Gemini extracted jsonString:', jsonString);
      // Remove line breaks and extra whitespace inside the JSON string
      jsonString = jsonString.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ');
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Gemini parse error. jsonString:', jsonString);
        throw new Error(`Failed to parse Gemini JSON response: ${jsonString.substring(0, 100)}`);
      }
      return parsedJson;
    } catch (error: any) {
      lastError = error;

      // Check if retryable
      const status = error.response?.status;
      const isRetryable = status === 429 || (status && status >= 500);

      if (attempt < maxRetries && isRetryable) {
        // Exponential backoff: 1s, 2s
        const delayMs = (attempt + 1) * 1000;
        console.warn(
          `Gemini API error (${status}), retrying in ${delayMs}ms... (attempt ${attempt + 1}/${maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      // Not retryable or out of retries
      if (status === 401 || status === 403) {
        throw new Error("Gemini API authentication failed. Check GEMINI_API_KEY.");
      }

      throw new Error(
        `Gemini API error: ${error.message || "Unknown error"}. Status: ${status || "unknown"}`
      );
    }
  }

  // This should not be reached, but for safety
  throw lastError || new Error("Gemini API call failed after retries");
}

/**
 * Strips markdown code fences (```json ... ```) from Gemini response
 */
function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();
}
