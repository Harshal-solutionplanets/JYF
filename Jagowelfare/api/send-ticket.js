require('dotenv').config({ override: true });
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { recipientEmail, recipientName, eventTitle, ticketId, section, description, venue, date, time } = req.body;

  const SENDER_EMAIL = process.env.GMAIL_USER;
  const SENDER_PASS = process.env.GMAIL_PASS;

  console.log("-----------------------------------------");
  console.log("API ACTIVE EMAIL SENDER:", SENDER_EMAIL);
  console.log("-----------------------------------------");

  if (!recipientEmail || !recipientName || !eventTitle || !ticketId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Generate QR Code
    const qrDataUrl = await QRCode.toDataURL(ticketId, {
      margin: 2,
      scale: 10,
      color: { dark: '#000000', light: '#ffffff' }
    });

    // 2. Generate PDF in memory
    const doc = new PDFDocument({ size: [400, 700], margin: 0 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    // Promise to handle PDF completion
    const pdfBufferPromise = new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });

    // --- Redesigned PDF Content (Matching server.js/Resend Design) ---
    // Dark Background for the whole card
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#050505');

    // Outer Gold Border
    doc.rect(5, 5, doc.page.width - 10, doc.page.height - 10).lineWidth(3).stroke('#D4AF37');

    // Logo (Centered Top) - Using new .png version
    const logoPath = path.join(__dirname, 'jyf_logo.png');
    try {
      doc.image(logoPath, doc.page.width / 2 - 50, 25, { width: 100 });
    } catch (e) { console.error("Logo missing:", logoPath); }

    // Presents text
    doc.fillColor('#D4AF37').fontSize(11).font('Helvetica-Bold').text('JAIN YOUTH FOUNDATION PRESENTS', 0, 140, { align: 'center' });

    // Dynamic Title (Gold/Yellow)
    doc.fillColor('#FFEE00').fontSize(22).font('Helvetica-Bold').text(eventTitle.toUpperCase(), 0, 175, { align: 'center', width: doc.page.width - 40, x: 20 });

    // Separator Line
    doc.lineWidth(0.5).strokeColor('rgba(212, 175, 55, 0.3)').moveTo(40, 245).lineTo(doc.page.width - 40, 245).stroke();

    // User Name (White, Centered, Large)
    doc.fillColor('#FFFFFF').fontSize(28).font('Helvetica-Bold').text(recipientName, 0, 280, { align: 'center' });

    // Date & Venue Section
    doc.fontSize(10).fillColor('#888').text('DATE:', 60, 340).text('VENUE:', doc.page.width / 2 + 20, 340);
    doc.fontSize(12).fillColor('#FFFFFF').font('Helvetica-Bold').text(date || '---', 60, 355, { width: 120 });
    doc.text(venue || 'Kalidas Auditorium\nMulund West, Mumbai', doc.page.width / 2 + 20, 355, { width: 150 });

    // Separator Line
    doc.lineWidth(0.5).strokeColor('rgba(212, 175, 55, 0.3)').moveTo(40, 410).lineTo(doc.page.width - 40, 410).stroke();

    // QR Code Section
    doc.rect(doc.page.width / 2 - 75, 440, 150, 150).fillAndStroke('#D4AF37', '#D4AF37');
    doc.rect(doc.page.width / 2 - 70, 445, 140, 140).fill('#FFFFFF');
    doc.image(qrDataUrl, doc.page.width / 2 - 65, 450, { width: 130 });

    // Section Button (Rectangular Gold - Matching Resend Logic)
    let displaySection = section;
    if ((!displaySection || (displaySection && displaySection.toString().toUpperCase() === "GENERAL")) && description && description.startsWith("SECTIONS:")) {
      try {
        const metadataPart = description.split(" | CONTENT: ")[0];
        const sectionsString = metadataPart.split("SECTIONS: ")[1].split(" | ")[0];
        const parsed = JSON.parse(sectionsString);
        const names = Array.isArray(parsed) ? parsed.map(s => typeof s === 'string' ? s : s.name) : Object.keys(parsed);
        if (names.length > 0) displaySection = names[0];
      } catch (e) { console.error("PDF Fallback Error:", e); }
    }
    const finalSectionName = (displaySection || "GENERAL").toString().toUpperCase().trim();

    // Rectangular Yellow Box
    doc.rect(doc.page.width / 2 - 75, 610, 150, 40).fill('#FFCC00');
    // Section Text
    doc.fillColor('#000000').fontSize(18).font('Helvetica-Bold').text(finalSectionName, 0, 622, { align: 'center' });

    // Footer Text with Website Link (Split into two lines to avoid overlap)
    doc.fillColor('#888').fontSize(9).font('Helvetica').text('Scan this at the entrance • Entry on First come basis', 0, 670, { align: 'center' });
    doc.fillColor('#D4AF37').text('jainyouthfoundation.org', 0, 682, { align: 'center', link: 'https://jainyouthfoundation.org' });


    doc.end();

    // 3. Wait for PDF data and send email
    const pdfData = await pdfBufferPromise;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASS
      }
    });

    await transporter.sendMail({
      from: `"Jain Youth Foundation" <${SENDER_EMAIL}>`,
      to: recipientEmail,
      subject: `Your Official Ticket: ${eventTitle} - ${recipientName}`,
      text: `Pranam ${recipientName},\n\nPlease find your official ticket for ${eventTitle} attached.\n\nEvent: ${eventTitle}\nTicket ID: ${ticketId}\n\nThank you,\nJain Youth Foundation`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Pranam ${recipientName},</h2>
          <p>Thank you for choosing <strong>Jain Youth Foundation</strong>. Your ticket for <strong>${eventTitle}</strong> is ready!</p>
          <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Date:</strong> ${date || '---'}</p>
            <p><strong>Venue:</strong> ${venue || '---'}</p>
            <p><strong>Ticket ID:</strong> ${ticketId}</p>
          </div>
          <p>Please find your ticket PDF attached to this email. You will need to scan it at the entrance.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">This is an automated message from Jain Youth Foundation.</p>
        </div>
      `,
      attachments: [
        {
          filename: `${recipientName.replace(/\s+/g, '_')}_Ticket.pdf`,
          content: pdfData
        }
      ]
    });

    return res.status(200).json({ message: 'Email with PDF ticket sent successfully!' });

  } catch (error) {
    console.error('Vercel API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
