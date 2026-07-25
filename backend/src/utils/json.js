// Robustly extract a JSON object from an LLM response.
// Even with JSON mode, providers occasionally wrap output in prose or code fences.

export function parseJsonLoose(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty response from AI provider");
  }

  // Fast path: already valid JSON.
  try {
    return JSON.parse(text);
  } catch {
    // fall through
  }

  // Strip markdown code fences if present.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {
      // fall through
    }
  }

  // Last resort: grab from first "{" to last "}".
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return JSON.parse(text.slice(start, end + 1));
  }

  throw new Error("Could not parse JSON from AI response");
}
