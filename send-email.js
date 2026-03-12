export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const MON_EMAIL = 'db_studio@outlook.fr';

  const { to, toName, subject, htmlContent } = req.body;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: 'DB Studio', email: MON_EMAIL },
        to: [{ email: to, name: toName }],
        subject,
        htmlContent
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
