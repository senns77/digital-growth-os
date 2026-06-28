import { useState } from "react";

const AUDIT_DATA = {
  url: "720i.com",
  score: 3,
  maxScore: 10,
  grade: "Needs Urgent Attention",
  summary: "720 Instruments has 11 years of real expertise and a strong product lineup — but the website communicates almost none of it. Three of the four AI readiness checks are failing, meaning this business is invisible to the next generation of search. The good news: every single issue here is fixable without a developer.",
  sections: [
    {
      label: "Traditional Website",
      icon: "🌐",
      criteria: [
        {
          name: "Clear Value Proposition",
          status: "warn",
          finding: "The homepage opens with 'We sell and service Trimble, Leica, Topcon, and more...' — it says what you sell but not why a stranger should buy from you instead of anyone else online.",
          why: "You have about 5 seconds before a visitor decides to stay or leave. If your headline doesn't immediately communicate what makes you different, most people bounce — and you never get a second chance.",
          steps: [
            "Go to your Shopify admin and click Online Store → Themes → Customize",
            "Find the homepage hero section or banner text",
            "Replace your current headline with: 'Certified Used Surveying Equipment — Inspected, Calibrated & Shipped Worldwide'",
            "Below that add one line: '11 Years in Business · 14-Day Returns · 90-Day Warranty'",
            "Save and publish"
          ]
        },
        {
          name: "Trust Signals",
          status: "fail",
          finding: "No customer reviews, no testimonials, no client logos, and no visible social proof anywhere on the site. Rudy's photo appears but with no story or credibility statement attached.",
          why: "When someone is about to spend $5,000–$20,000 on used equipment from a website they've never bought from, they need reasons to trust you. Without social proof, many buyers will find a competitor just to feel safer.",
          steps: [
            "Go to Google and search your business name — claim and verify your Google Business Profile if you haven't already",
            "Email your last 10 customers and ask them to leave a Google review — a simple one-line ask works",
            "In Shopify, add a text section to your homepage with 2–3 short customer quotes (even paraphrased from emails you've received)",
            "Under Rudy's photo, add: 'I personally inspect every piece of equipment before it ships. — Rudy Enns, Founder, 720 Instruments'",
            "Add a simple trust bar near the top: '✓ Inspected & Calibrated  ✓ 14-Day Returns  ✓ 90-Day Warranty  ✓ Shipped Worldwide'"
          ]
        },
        {
          name: "Lead Capture",
          status: "fail",
          finding: "There is no way for a visitor to raise their hand without buying. No email signup, no quote request, no notify me option — if someone visits and leaves, they are gone forever.",
          why: "Most visitors are not ready to buy today. Without a way to capture their contact information, you lose every single person who is researching or waiting for the right equipment.",
          steps: [
            "In Shopify, go to Online Store → Themes → Customize and add a new section",
            "Add a simple contact form with three fields: Name, Email, and 'What equipment are you looking for?'",
            "Give it a headline: 'Don't see what you need? Tell us — we'll find it.'",
            "Set it to email you at info@720i.com every time someone fills it out",
            "Optional: connect a free Mailchimp account to follow up with these leads over time"
          ]
        },
        {
          name: "Buyer-Ready Descriptions",
          status: "warn",
          finding: "Product listings have a name, price, and photo — but most lack condition details, kit contents, or who the equipment is suited for.",
          why: "A surveyor deciding between a $6,000 Leica and a $5,600 Trimble needs to know exactly what they are getting. Thin descriptions create doubt, and doubt kills the sale.",
          steps: [
            "In Shopify, go to Products and open your top 10 best-selling items",
            "For each one add: condition notes, exactly what is included, who it is best for, and why buying used from 720 makes sense",
            "Example: 'This Leica TS06 is in excellent condition. Fully calibrated. Kit includes instrument, tribrach, charger, and battery. Ideal for small survey firms.'",
            "Add to every listing: 'Not sure if this is right for you? Call Rudy at 604-249-4137 — we'll help you decide.'",
            "Repeat for all 71 products over the next 4 weeks — do 2 to 3 per day"
          ]
        },
        {
          name: "Mobile Readable",
          status: "pass",
          finding: "The site is built on Shopify which is mobile-responsive by default. The viewport meta tag is correctly set and the layout adapts to smaller screens.",
          why: "More than half of all web traffic now comes from phones. A site that breaks on mobile loses those visitors immediately and ranks lower on Google.",
          steps: [
            "You are in good shape here — Shopify handles this automatically",
            "Once a month, pull up your site on your phone and click through a product listing to the cart",
            "If anything looks broken or hard to tap, take a screenshot and flag it to a Shopify developer",
            "Check that your phone number is clickable on mobile so visitors can tap to call directly"
          ]
        },
        {
          name: "SEO Basics",
          status: "fail",
          finding: "No blog, no articles, no educational content. Page titles are generic. No meta descriptions on collection pages. No keyword strategy visible anywhere.",
          why: "Google ranks sites that have helpful relevant content. Right now 720 Instruments is almost certainly not appearing for searches like 'buy used Leica total station Canada'. That is free traffic being lost every single day.",
          steps: [
            "In Shopify go to Online Store → Preferences and update your homepage title to: 'Used Surveying Equipment — Trimble, Leica, Topcon | 720 Instruments Canada'",
            "Add a meta description: 'Buy certified used land surveying equipment. Trimble, Leica, Topcon and more. Inspected, calibrated, 90-day warranty. Ships worldwide.'",
            "Update each collection page title to include the product type and the word used",
            "Write your first blog article: 'Used vs New Surveying Equipment: What You Actually Get For the Price' — 600 words in Rudy's voice",
            "Publish one article per week on topics surveyors actually search for"
          ]
        }
      ]
    },
    {
      label: "AI Search Readiness",
      icon: "🤖",
      criteria: [
        {
          name: "AI Discoverability",
          status: "fail",
          finding: "The site has very little text-based content. AI tools like ChatGPT, Claude, and Perplexity need factual descriptive content to reference a business — right now there is almost nothing to reference.",
          why: "When a surveyor asks ChatGPT where to buy used Leica equipment in Canada, AI tools pull from sites with clear detailed content. Sites with thin content do not get mentioned. This is the new version of not showing up on Google.",
          steps: [
            "Write a dedicated About page stating: what you sell, who you serve, where you ship, how long you have been in business, and what your inspection process looks like",
            "Add a FAQ page with at least 10 questions and answers covering shipping, warranty, inspection, and payment",
            "Submit your site to Bing Webmaster Tools at bing.com/webmasters — Bing powers several AI search tools including ChatGPT",
            "The blog articles you write for SEO also directly improve AI discoverability — one effort, two results",
            "Make sure every page has descriptive text not just images and product names"
          ]
        },
        {
          name: "Structured Content for AI",
          status: "fail",
          finding: "There are no FAQ sections, no comparison content, no question-and-answer formatted pages anywhere on the site.",
          why: "AI tools are question-answering machines. They favour content written in a question-and-answer format. A page titled 'Trimble vs Leica: Which Total Station Is Right For You?' is far more likely to be cited than a plain product listing.",
          steps: [
            "Add an FAQ section to your homepage with 5 to 8 questions written exactly how a customer would ask them",
            "Suggested questions: Do you ship outside Canada? What condition is your used equipment in? Can I speak to someone before I buy? What happens if something breaks after purchase?",
            "Write one comparison article: 'Trimble vs Leica Total Stations — What Is the Difference and Which Should You Buy?'",
            "On each product page add a short Q&A at the bottom: 'Is this right for me?' with a 2 to 3 sentence answer",
            "Format all blog articles with H2 headings written as questions — AI tools scan headings to find answers"
          ]
        },
        {
          name: "Google Business Profile",
          status: "warn",
          finding: "720 Instruments has some online presence but a fully optimized Google Business Profile with recent reviews and complete information was not confirmed.",
          why: "Google Business Profile is how AI tools like Google AI and Perplexity find and verify local businesses. A complete profile with reviews significantly increases the chance of being mentioned in AI-generated answers.",
          steps: [
            "Go to business.google.com and search for 720 Instruments — claim the listing if unclaimed",
            "Fill in every field: business category as Surveying Equipment Supplier, hours, phone, website, and description",
            "Write your description: 'Certified used land surveying equipment — Trimble, Leica, Topcon and more. Inspected, calibrated, shipped worldwide. 11 years in business. 14-day returns, 90-day warranty.'",
            "Upload at least 10 photos: workspace, equipment, Rudy at work, packaged shipments",
            "Ask every customer for a Google review — even 10 genuine reviews will dramatically improve visibility"
          ]
        },
        {
          name: "Citation Footprint",
          status: "warn",
          finding: "720 Instruments appears on ZoomInfo and Alignable but has minimal presence across industry directories or third-party mentions that AI tools use to verify businesses.",
          why: "AI tools look at whether other websites mention and validate you. A business appearing on 20 directories and referenced in forum discussions is far more likely to be cited in an AI answer than one with only its own website.",
          steps: [
            "Submit your business to these free directories this week: Yellow Pages Canada, Canada411, BBB Canada, Alignable, Thomasnet",
            "Find 2 to 3 land surveying communities online such as Reddit r/Surveying — participate genuinely and mention 720 Instruments where naturally relevant",
            "Search for YouTube channels that review surveying equipment and offer to provide equipment for an honest review with a link to your site",
            "Get listed in Canadian construction or geomatics industry association directories",
            "When a customer emails saying they are happy, ask them to post about their experience on LinkedIn or in a surveying community"
          ]
        }
      ]
    }
  ]
};

const colors = {
  black: "#0D0D0D", white: "#FAFAF8", accent: "#E85A1C",
  accentLight: "#FFF0E8", gray: "#6B6B6B", grayLight: "#F0EFED",
  border: "#E2E0DC", pass: "#1A7F4E", passBg: "#EDFAF3",
  fail: "#C0392B", failBg: "#FEF0EE", warn: "#C47A1A", warnBg: "#FEF8EC",
  aiAccent: "#4A3AE8", aiBg: "#F0EFFE"
};

function StatusBadge({ status }) {
  const map = {
    pass: ["PASS", colors.pass, colors.passBg],
    warn: ["NEEDS WORK", colors.warn, colors.warnBg],
    fail: ["MISSING", colors.fail, colors.failBg]
  };
  const [label, color, bg] = map[status] || map.fail;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: bg, color, letterSpacing: 0.3 }}>
      {label}
    </span>
  );
}

function CriterionCard({ c }) {
  const [open, setOpen] = useState(false);
  const dotColor = { pass: colors.pass, warn: colors.warn, fail: colors.fail }[c.status];
  const fixLabel = c.status === "pass" ? "WHAT'S WORKING" : "HOW TO FIX IT YOURSELF";
  return (
    <div style={{ border: `1.5px solid ${open ? dotColor : colors.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 10, transition: "border-color 0.2s" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "white", cursor: "pointer" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: colors.black }}>{c.name}</div>
        <StatusBadge status={c.status} />
        <span style={{ fontSize: 11, color: colors.gray, marginLeft: 4, display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </div>
      {open && (
        <div style={{ background: "white", borderTop: `1px solid ${colors.border}` }}>
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: colors.gray, marginBottom: 6 }}>What We Found</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: colors.black }}>{c.finding}</div>
          </div>
          <div style={{ padding: "14px 16px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: colors.gray, marginBottom: 6 }}>Why This Matters</div>
            <div style={{ fontSize: 13, lineHeight: 1.65, color: colors.gray }}>{c.why}</div>
          </div>
          <div style={{ padding: "14px 16px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: dotColor, marginBottom: 10 }}>{fixLabel}</div>
            {c.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < c.steps.length - 1 ? 10 : 0, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: c.status === "pass" ? colors.passBg : colors.grayLight, color: c.status === "pass" ? colors.pass : colors.black, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div style={{ fontSize: 13, lineHeight: 1.65, color: colors.black }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const data = AUDIT_DATA;
  const passCount = data.sections.flatMap(s => s.criteria).filter(c => c.status === "pass").length;
  const gradeColor = { "Needs Urgent Attention": colors.fail, "Needs Work": colors.warn, "Getting There": colors.warn, "Strong Foundation": colors.pass }[data.grade] || colors.accent;
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: colors.white, minHeight: "100vh" }}>
      <div style={{ background: colors.black, padding: "18px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, background: colors.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: 15, flexShrink: 0 }}>DG</div>
        <div>
          <div style={{ fontWeight: 700, color: "white", fontSize: 15 }}>Digital Growth OS</div>
          <div style={{ fontSize: 10, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>Website Audit Report</div>
        </div>
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 60px" }}>
        <div style={{ background: colors.black, borderRadius: 16, padding: 24, marginBottom: 16, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: `4px solid ${gradeColor}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 26, color: "white", lineHeight: 1 }}>{passCount}</div>
            <div style={{ fontSize: 11, color: "#888" }}>/ {data.maxScore}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{data.url}</div>
            <div style={{ fontWeight: 800, fontSize: 19, color: gradeColor, marginBottom: 8 }}>{data.grade}</div>
            <div style={{ fontSize: 13, color: "#AAAAAA", lineHeight: 1.6 }}>{data.summary}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, marginBottom: 28 }}>
          {[...Array(data.maxScore)].map((_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < passCount ? gradeColor : colors.border }} />
          ))}
        </div>
        {data.sections.map((section, si) => (
          <div key={si} style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>{section.icon}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: si === 1 ? colors.aiAccent : colors.gray }}>{section.label}</div>
                {si === 1 && <div style={{ fontSize: 11, color: colors.aiAccent, marginTop: 2 }}>How you appear in ChatGPT, Claude & Perplexity searches</div>}
              </div>
            </div>
            {section.criteria.map((c, ci) => <CriterionCard key={ci} c={c} />)}
          </div>
        ))}
        <div style={{ background: colors.accentLight, border: `1.5px solid #F5CDB4`, borderRadius: 14, padding: 22, marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16, color: colors.black }}>Your Top 3 Priorities Right Now</div>
          {[
            "Rewrite your homepage headline to include your warranty, inspection process, and global shipping — takes 30 minutes and immediately changes how visitors perceive the business.",
            "Add a 'Don't see what you need? Tell us' lead capture form — this single change turns browsers into leads and opens conversations where Rudy wins every time.",
            "Write one article per week answering a question surveyors actually ask — the single most powerful thing you can do for both Google and AI search visibility simultaneously."
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 2 ? 14 : 0, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, background: colors.accent, color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: colors.black }}>{p}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#F0EFFE", border: `1.5px solid #C5BEFA`, borderRadius: 14, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.aiAccent, marginBottom: 8 }}>🤖 Why AI Search Matters Right Now</div>
          <div style={{ fontSize: 13, lineHeight: 1.65, color: "#333" }}>More than 30% of people now use AI tools like ChatGPT, Claude, or Perplexity instead of Google to find products and services. If your business does not appear in AI answers, you are already invisible to a growing segment of buyers — and this number is increasing every month.</div>
        </div>
        <div style={{ fontSize: 12, color: colors.gray, lineHeight: 1.6, textAlign: "center" }}>
          To audit your own website, ask Claude: <span style={{ fontStyle: "italic" }}>"Run a Digital Growth OS audit on [yourwebsite.com]"</span>
        </div>
      </div>
    </div>
  );
}