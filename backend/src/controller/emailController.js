import xlsx from 'xlsx';
import fs from 'fs';
import { sendMail } from '../utils/email.js';
import email from '../models/email.js';

export async function sendEmailsFromExcel(req, res) {
  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath, { raw: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    let sentCount = 0;

    for (const row of data) {
      const { Email, Name, Message } = row;

      if (!Email || !Name || !Message) continue;

      const personalizedMessage = `<p>Dear ${Name},</p><p>${Message}</p>`;

      await sendMail({
        from: process.env.EMAIL_USER,
        to: Email,
        subject: 'Personalized Email from Our App',
        html: personalizedMessage,
      });

      await email.create({
        to: Email,
        subject: 'Personalized Email from Our App',
        message: personalizedMessage,
      });

      sentCount++;
    }

    fs.unlinkSync(filePath); // delete uploaded file
    res.status(200).json({ success: true, message: `${sentCount} emails sent.` });
  } catch (error) {
    console.error('❌ Error processing file:', error);
    res.status(500).json({ error: 'Failed to send emails from uploaded file.' });
  }
}