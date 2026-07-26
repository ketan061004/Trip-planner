// Local development entrypoint. On Vercel, api/index.js imports the app
// directly and no listener is started.
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Trip Planner API on http://localhost:${PORT}`);
  console.log(`   AI provider: ${process.env.AI_PROVIDER || "groq"}`);
});
