export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, toName, subject, htmlContent } = req.body;

  if (!to || !subject || !htmlContent) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: 'DB Studio', email: 'db_studio@outlook.fr' },
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.message || 'Erreur Brevo' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
