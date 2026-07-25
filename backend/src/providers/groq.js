// Groq provider — OpenAI-compatible chat completions API.
// Docs: https://console.groq.com/docs/api-reference

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * @param {{system: string, user: string, json?: boolean}} opts
 * @returns {Promise<string>} raw assistant text
 */
export async function generate({ system, user, json = true }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const body = {
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    temperature: 0.7,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  };
  if (json) body.response_format = { type: "json_object" };

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq API error ${res.status}: ${detail}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
