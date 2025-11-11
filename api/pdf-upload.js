// api/quick-analysis.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const webhookUrl = process.env.PDF_UPLOAD_WEBHOOK_URL;
    if (!webhookUrl) throw new Error('Missing PDF_UPLOAD_WEBHOOK_URL');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.ok ? 200 : 502).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
