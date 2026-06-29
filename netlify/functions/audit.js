const SYSTEM_PROMPT = `You are a website auditor. Audit the given URL and return ONLY valid JSON — no markdown, no explanation, no extra text.

First, identify the business type from the website content. It must be one of: "Local Service", "Retail or Ecommerce", "Professional Services", "Real Estate", "Restaurant or Hospitality", or "Other".

Then calibrate your scoring for that business type:
- Real Estate: lead capture via contact form, valuation request, or property inquiry counts as PASS. Property listings with descriptions count as buyer-ready descriptions.
- Local Service: phone number prominently displayed in the header or hero counts as lead capture. Service pages describing what you do count as buyer-ready descriptions.
- Retail or Ecommerce: product pages with prices and add-to-cart count as buyer-ready descriptions. Cart, checkout, or buy button counts as lead capture.
- Professional Services: consultation booking link or specific contact form (not just a contact page) counts as lead capture.
- Restaurant or Hospitality: reservation system or online ordering counts as lead capture. Menu with descriptions counts as buyer-ready.
- Other: use general scoring criteria.

JSON format:
{"url":"string","businessType":"string","score":0,"grade":"string","summary":"2 sentences.","criteria":[{"name":"string","status":"pass","finding":"1-2 sentences.","why":"1 sentence.","fix":"One action.","steps":["Step 1","Step 2","Step 3"]}],"topPriorities":["Priority 1","Priority 2","Priority 3"]}

Grade: 0-3="Needs Urgent Attention" 4-5="Needs Work" 6-7="Getting There" 8-10="Strong Foundation"
Status: "pass" "warn" "fail"

Score each criterion using EXACTLY these rules:
- PASS (1 point): Clear evidence this exists and works well for this business type.
- WARN (0 points): Exists but incomplete or needs significant improvement.
- FAIL (0 points): Missing entirely.
Total score = number of PASS criteria only. Be strict.
A logo does NOT count as trust signals.
Generic page titles like "Home" do NOT count as SEO basics.
Only award PASS if the evidence is clearly present and effective.

Criteria (score all 10):
1. Clear Value Proposition — does the homepage headline instantly say what the business does and who it helps, in plain language?
2. Trust Signals — are there real reviews, testimonials, case studies, credentials, or awards visible (not just a logo)?
3. Lead Capture — calibrate by business type (see above). Must be prominent and specific.
4. Buyer-Ready Descriptions — calibrate by business type (see above). Must describe outcomes or specifics, not vague marketing copy.
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

  // Helper: fetch a URL and return cleaned text, or null on failure
  async function fetchPage(pageUrl, timeoutMs) {
    try {
      const res = await fetch(pageUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AuditBot/1.0)" },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) return null;
      const html = await res.text();
      return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    } catch {
      return null;
    }
  }

  // Fetch homepage + additional pages in parallel
  const additionalUrls = [
    url + "/about",
    url + "/about-us",
    url + "/contact",
    url + "/contact-us",
    url + "/services",
    url + "/products",
  ];

  const [homepageText, ...additionalTexts] = await Promise.all([
    fetchPage(url, 10000),
    ...additionalUrls.map(u => fetchPage(u, 5000)),
  ]);

  // Collect pages that returned content
  const pages = [];
  if (homepageText) pages.push({ label: "Homepage", text: homepageText });
  additionalUrls.forEach((u, i) => {
    if (additionalTexts[i]) pages.push({ label: u.replace(url, ""), text: additionalTexts[i] });
  });

  // Cap total at 20000 chars split evenly across pages
  const TOTAL_CAP = 20000;
  const perPage = pages.length > 0 ? Math.floor(TOTAL_CAP / pages.length) : TOTAL_CAP;
  const siteText = pages.map(p => `[${p.label}]\n${p.text.slice(0, perPage)}`).join("\n\n");
  console.log(`Pages fetched: ${pages.length}, total content length: ${siteText.length}`);

  const userMessage = siteText
    ? `Please audit this website: ${url}\n\nHere is the actual text content from ${pages.length} page(s):\n---\n${siteText}\n---\n\nUse this content to score all 10 criteria accurately. If content is missing from the page text it should be scored as FAIL or WARN, not PASS.`
    : `Please audit this website: ${url}\n\nNote: the page content could not be fetched automatically. Audit based on what you know about this URL, but be conservative — score as WARN or FAIL when you cannot confirm content is present.`;

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
        max_tokens: 6000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
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
