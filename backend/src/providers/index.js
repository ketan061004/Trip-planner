// AI provider selector. Swap providers with the AI_PROVIDER env var.
import * as groq from "./groq.js";
import * as gemini from "./gemini.js";

const providers = { groq, gemini };

export function getProvider() {
  const name = (process.env.AI_PROVIDER || "groq").toLowerCase();
  const provider = providers[name];
  if (!provider) {
    throw new Error(
      `Unknown AI_PROVIDER "${name}". Valid options: ${Object.keys(providers).join(", ")}`
    );
  }
  return provider;
}

/**
 * Generate a completion using the currently configured provider.
 * @param {{system: string, user: string, json?: boolean}} opts
 */
export function generate(opts) {
  return getProvider().generate(opts);
}
