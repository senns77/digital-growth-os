const Anthropic = require("@anthropic-ai/sdk");

const SYSTEM_PROMPT = `You are a plain-English website auditor for business owners aged 40+ who are not technical. You will be given a website URL. Fetch and analyse that site, then score it against 6 traditional criteria and 4 AI readiness criteria.

Return ONLY valid JSON — no markdown, no code fences, no explanation — in exactly this format:
{
  "url": "string",
  "score": 0,
  "grade": "Needs Urgent Attention",
  "summary": "2 sentences plain English summary.",
  "criteria": [
    {
      "name": "string",
      "status": "pass",
      "finding": "1-2 sentences describing what you found.",
      "why": "1-2 sentences explaining why this matters in plain English.",
      "fix": "One specific action they can take today.",
      "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"]
    }
  ],
  "topPriorities": ["Priority 1", "Priority 2", "Priority 3"]
}

Grade scale: score 0-3 = "Needs Urgent Attention", 4-5 = "Needs Work", 6-7 = "Getting There", 8-10 = "Strong Foundation".

The 10 criteria in this exact order:
1. Clear Value Proposition (traditional)
2. Trust Signals (traditional)
3. Lead Capture (traditional)
4. Buyer-Ready Descriptions (traditional)
5. Mobile Readable (traditional)
6. SEO Basics (traditional)
7. AI Discoverability (AI readiness)
8. Structured Content for AI (AI readiness)
9. Google Business Profile (AI readiness)
10. Citation Footprint (AI readiness)

Status values: "pass" (doing well), "warn" (needs improvement), "fail" (missing or broken).
Be specific and honest. Name actual page elements you can verify. Write at a grade-8 reading level.`;

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let url;
  try {
    ({ url } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  if (!url) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "URL is required" }) };
  }

  // Normalise URL
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Please audit this website and return the JSON report: ${url}`,
      },
    ],
  });

  let raw = message.content[0].text.trim();
  // Strip any accidental markdown fences
  raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  let report;
  try {
    report = JSON.parse(raw);
  } catch {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: "Failed to parse audit response", raw }),
    };
  }

  return { statusCode: 200, headers, body: JSON.stringify(report) };
};
