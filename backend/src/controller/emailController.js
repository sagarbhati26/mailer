import { sendMail } from '../utils/email.js';
import email from '../models/email.js';

export async function sendEmailsFromExcel(req, res) {
  try {
    const data = req.body; // expecting an array of email objects

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'Request body must be an array of email data' });
    }

    let sentCount = 0;

    for (const row of data) {
      const { Email, Name, Message, Subject } = row;

      if (!Email || !Name || !Message) continue;

      const personalizedMessage = `<p>Dear ${Name},</p><p>${Message}</p>`;
      const emailSubject = Subject || 'Personalized Email from Our App';

      await sendMail({
        from: process.env.EMAIL_USER,
        to: Email,
        subject: emailSubject,
        html: personalizedMessage,
      });

      await email.create({
        to: Email,
        subject: emailSubject,
        message: personalizedMessage,
      });

      sentCount++;
    }

    res.status(200).json({ success: true, message: `${sentCount} emails sent.` });
  } catch (error) {
    console.error('❌ Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails.' });
  }
}