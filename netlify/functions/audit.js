const SYSTEM_PROMPT = `You are a website auditor. Audit the given URL and return ONLY valid JSON — no markdown, no explanation, no extra text.

JSON format:
{"url":"string","score":0,"grade":"string","summary":"2 sentences.","criteria":[{"name":"string","status":"pass","finding":"1-2 sentences.","why":"1 sentence.","fix":"One action.","steps":["Step 1","Step 2","Step 3"]}],"topPriorities":["Priority 1","Priority 2","Priority 3"]}

Grade: 0-3="Needs Urgent Attention" 4-5="Needs Work" 6-7="Getting There" 8-10="Strong Foundation"
Status: "pass" "warn" "fail"

Score each criterion using EXACTLY these rules:
- PASS (1 point): Clear evidence this exists and works well on the site.
- WARN (0 points): Exists but incomplete or needs significant improvement.
- FAIL (0 points): Missing entirely.
Total score = number of PASS criteria only. Be strict.
A basic contact page does NOT count as lead capture.
A logo does NOT count as trust signals.
Generic page titles like "Home" do NOT count as SEO basics.
Only award PASS if the evidence is clearly present and effective.

Criteria (score all 10):
1. Clear Value Proposition — does the homepage headline instantly say what the business does and who it helps, in plain language?
2. Trust Signals — are there real reviews, testimonials, case studies, credentials, or awards visible (not just a logo)?
3. Lead Capture — is there a prominent, specific CTA to book, buy, or request a quote (not just a generic "contact us")?
4. Buyer-Ready Descriptions — do service/product pages describe outcomes and benefits, not just a list of features?
5. Mobile Readable — does the site display and function well on a phone, with readable text and tappable buttons?
6. SEO Basics — does the site have a unique descriptive title tag, meta description, and proper H1/H2 header structure?
7. AI Discoverability — would an AI like ChatGPT mention this business when asked about relevant local services?
8. Structured Content for AI — does the site use clear headings, bullet lists, and FAQs that AI tools can easily parse?
9. Google Business Profile — does the business have a claimed, complete, and recently-updated Google Business Profile?
10. Citation Footprint — is the business listed consistently (name, address, phone) across Yelp, BBB, and relevant directories?

Write at a grade-8 reading level. Name actual page elements you observe.`;

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
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4000,
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
