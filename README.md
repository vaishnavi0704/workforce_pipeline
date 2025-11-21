# Dynamic Workforce Planning Agent

> A compact frontend for an AI-powered workforce forecasting agent. This repository contains a single static HTML app (`project2.html`) that collects project and skills inputs, sends them to an n8n webhook (or similar automation/orchestration flow), and displays a comprehensive workforce forecast and recommendations.



## What this project does (end-to-end pipeline)

1. User interaction
   - The user opens `project2.html` in a browser.
   - They can either click "Start Quick Analysis" (a lightweight flow) or fill the detailed form (project name, type, duration, complexity, start date, and required skills).
   - The UI includes a small interactive particle background and a skill tag input component (enter skills and press Enter or comma).

2. Frontend -> Webhook
   - The frontend posts JSON to n8n webhook endpoints defined in `project2.html`:
     - QUICK analysis webhook: `QUICK_ANALYSIS_WEBHOOK_URL` (small payload, returns a PDF link)
     - DETAILED form webhook: `DETAILED_FORM_WEBHOOK_URL` (detailed JSON including `skills` array and `trigger: 'detailed_forecast_v1'`)
   - These constants are at the top of the script section in `project2.html` — update them to change endpoints.

3. n8n / Automation Flow (server-side)
   - The webhook receives the request and triggers the orchestration flow (n8n, Zapier, custom API, or a serverless function).
   - Typical tasks performed by the flow:
     - Validate and sanitize input payload
     - Fetch historical data (HR systems, ATS, time series pipeline data) — or call an AI model
     - Run predictive models (attrition risk scoring, pipeline capacity forecasting)
     - Build aggregated outputs: `executive_summary`, `pipeline_forecast`, `attrition_risks`, `upskilling_recommendations`, `hiring_plan`
     - Optionally generate a PDF report and return a `pdf_url` for the quick analysis flow
     - Return the result JSON to the frontend

4. Frontend result rendering
   - On success the UI displays:
     - Executive summary (key recommendations)
     - Metrics (team size, internal allocation, new hires, upskilling required, days to readiness)
     - Dynamic cards: 6-month pipeline forecast, attrition risks, upskilling recommendations, hiring plan
   - The quick analysis button expects a `pdf_url` and displays a download link when available.

---

## Files of interest

- `project2.html` — single-page frontend app. Edit this file to change webhook URLs, UI text, or add front-end logic. The webhook constants are near the top of the inline script:

  - QUICK_ANALYSIS_WEBHOOK_URL
  - DETAILED_FORM_WEBHOOK_URL

  Example (current values in the file):
  - Quick: `https://n8n.solutionspace.in/webhook-test/c599ba9f-2b93-4cff-85bb-ce3ff1ef8150`
  - Detailed: `https://n8n.solutionspace.in/webhook-test/14d07caa-9a4e-4226-96aa-b12623c618bf`

---

## JSON shapes expected / returned (contract)

Detailed form POST (frontend -> webhook) — sample shape:

```
{
  "project_name": "AI Chatbot Development",
  "project_type": "Software Development",
  "duration_months": 8,
  "complexity": "High",
  "start_date": "2025-11-20",
  "skills": ["python","nlp","aws"],
  "trigger": "detailed_forecast_v1"
}
```

Expected successful response (example fields used by the frontend):

```
{
  "status": "success",
  "executive_summary": {
    "overall_risk_level": "High",
    "key_recommendations": ["Hire 3 ML engineers","Start upskilling program for backend engineers"],
    "recommended_team_size": 12,
    "internal_allocation": 8,
    "new_hires_needed": 4,
    "upskilling_required": 2,
    "timeline_to_readiness_days": 45
  },
  "pipeline_forecast": [ /* array of monthly forecast objects */ ],
  "attrition_risks": [ /* array of risk objects */ ],
  "upskilling_recommendations": [ /* array of upskill objects */ ],
  "hiring_plan": [ /* array of hires */ ]
}
```

Quick analysis response example (expects `pdf_url`):

```
{
  "pdf_url": "https://mybucket.s3.amazonaws.com/reports/report_1234.pdf"
}
```

Notes: the frontend validates `pdf_url` (must start with `http` and not contain templating placeholders like `{{`). If the JSON is missing expected keys the frontend shows an error.

---

## How to run locally / test

1. This is a static HTML page — easiest way to run locally:

   - From the project directory run:

```
python3 -m http.server 8000
```

   - Open http://localhost:8000/project2.html in your browser.

2. Important: if your n8n/webhook endpoint is not publicly reachable, the frontend running locally cannot call it directly.
   - For development, expose your local server or use a tunnel (ngrok) so the webhook can call back, or use a publicly reachable n8n instance.

3. CORS note: webhook endpoints called directly from the browser must allow cross-origin POST requests. If your webhook rejects CORS, test via a server-side proxy or use the detailed form testing tool inside n8n.


Generated: README for preparing a PPT and for quick onboarding of designers / engineers.
