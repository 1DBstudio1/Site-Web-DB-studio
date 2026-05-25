module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }

  const { to, toName, subject, htmlContent } = body || {};

  if (!to || !subject || !htmlContent) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'DB Studio <onboarding@resend.dev>',
        to: [to],
        subject,
        html: htmlContent
      })
    });

    const data = await response.json();
    console.log('Resend réponse:', response.status, JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Erreur Resend' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
