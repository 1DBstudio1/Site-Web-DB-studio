module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Function called');

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }

  const { to, toName, subject, htmlContent } = body || {};

  console.log('To:', to, 'Subject:', subject ? 'ok' : 'missing');

  if (!to || !subject || !htmlContent) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  console.log('API Key present:', !!apiKey);

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
    console.log('Brevo status:', response.status, JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({ error: data.message || 'Erreur Brevo' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
