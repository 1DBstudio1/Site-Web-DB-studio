module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('envoyer-email called');

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }

  const { to, toName, subject, htmlContent } = body || {};

  if (!to || !subject || !htmlContent) {
    console.log('Params manquants:', { to, subject: !!subject, htmlContent: !!htmlContent });
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  console.log('API Key présente:', !!apiKey);

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: 'DB Studio', email: 'db_studio@outlook.fr' },
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent
      })
    });

    const data = await response.json();
    console.log('Brevo réponse:', response.status, JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Erreur Brevo' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
