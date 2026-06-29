const SYSTEM_PROMPT = `You are a website auditor. Given a URL, score it on 10 criteria and return ONLY valid JSON — no markdown, no explanation.

Format:
{"url":"string","score":0,"grade":"string","summary":"2 sentences.","criteria":[{"name":"string","status":"pass","finding":"1-2 sentences.","why":"1 sentence.","fix":"One action.","steps":["Step 1","Step 2","Step 3"]}],"topPriorities":["Priority 1","Priority 2","Priority 3"]}

Grade: 0-3="Needs Urgent Attention", 4-5="Needs Work", 6-7="Getting There", 8-10="Strong Foundation".
Status: "pass", "warn", or "fail".

10 criteria in order:
1. Clear Value Proposition
2. Trust Signals
3. Lead Capture
4. Buyer-Ready Descriptions
5. Mobile Readable
6. SEO Basics
7. AI Discoverability
8. Structured Content for AI
9. Google Business Profile
10. Citation Footprint

Write at a grade-8 reading level for non-technical business owners.`;

exports.handler = async (event) => {
  console.log("audit called, method:", event.httpMethod);
  console.log("Node version:", process.version);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let url;
  try {
    ({ url } = JSON.parse(event.body));
  } catch (e) {
    console.log("Body parse error:", e.message);
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  if (!url) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "URL is required" }) };
  }

  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log("API key present:", !!apiKey);
  console.log("Auditing URL:", url);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Audit this website and return the JSON report: ${url}` }],
      }),
    });

    const responseText = await response.text();
    console.log("Anthropic response status:", response.status);

    if (!response.ok) {
      console.log("Anthropic error body:", responseText.substring(0, 300));
      return { statusCode: 502, headers, body: JSON.stringify({ error: `Anthropic API error: ${response.status}` }) };
    }

    const data = JSON.parse(responseText);
    let raw = data.content[0].text.trim();
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    let report;
    try {
      report = JSON.parse(raw);
    } catch (parseErr) {
      console.log("JSON parse error:", parseErr.message);
      console.log("Raw response start:", raw.substring(0, 300));
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Failed to parse audit response", raw }) };
    }

    console.log("Audit complete, score:", report.score);
    return { statusCode: 200, headers, body: JSON.stringify(report) };

  } catch (err) {
    console.log("Fetch error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || "Audit failed" }) };
  }
};