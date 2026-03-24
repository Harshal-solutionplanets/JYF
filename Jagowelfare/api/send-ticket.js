const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { recipientEmail, recipientName, eventTitle, ticketId, section, venue, date, time } = req.body;

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

    // --- PDF Content (Rich Design from server.js) ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#050505');

    // Logo (Using __dirname for Vercel path mapping since it's now in the api folder)
    const logoPath = path.join(__dirname, 'jyf_logo.jpg');
    try {
      doc.image(logoPath, doc.page.width / 2 - 45, 15, { width: 90 });
    } catch (e) { console.error("Logo missing in Vercel environment:", logoPath); }

    doc.fillColor('#D4AF37').fontSize(10).text('JAIN YOUTH FOUNDATION PRESENTS', 0, 125, { align: 'center' });
    doc.fillColor('#FFEE00').fontSize(18).font('Helvetica-Bold').text(eventTitle.toUpperCase(), 0, 155, { align: 'center' });
    doc.lineWidth(0.5).strokeColor('#333').moveTo(40, 225).lineTo(doc.page.width - 40, 225).stroke();
    doc.fillColor('#FFFFFF').fontSize(26).font('Helvetica-Bold').text(recipientName, 0, 260, { align: 'center' });
    doc.fontSize(10).fillColor('#888').text('DATE:', 40, 310).text('VENUE:', doc.page.width / 2 + 20, 310);
    doc.fontSize(11).fillColor('#FFFFFF').text(date || '---', 40, 330, { width: 120 });
    doc.text(venue || 'Kalidas Auditorium\nMulund West, Mumbai', doc.page.width / 2 + 20, 330, { width: 150 });
    doc.lineWidth(0.5).strokeColor('#333').moveTo(40, 385).lineTo(doc.page.width - 40, 385).stroke();

    // QR Code Section
    doc.rect(doc.page.width / 2 - 75, 415, 150, 150).fillAndStroke('#D4AF37', '#D4AF37');
    doc.rect(doc.page.width / 2 - 70, 420, 140, 140).fill('#FFFFFF');
    doc.image(qrDataUrl, doc.page.width / 2 - 65, 425, { width: 130 });

    // Section Button
    doc.rect(doc.page.width / 2 - 65, 595, 130, 35).fill('#FFCC00'); // Changed from roundedRect to rect as PDFKit older versions/environments can be picky
    doc.fillColor('#000000').fontSize(15).font('Helvetica-Bold').text(section?.toUpperCase() || 'GENERAL', 0, 606, { align: 'center' });

    doc.fillColor('#888').fontSize(9).font('Helvetica').text('Scan this at the entrance • Entry on First come basis', 0, 655, { align: 'center' });
    doc.fillColor('#D4AF37').fontSize(12).font('Helvetica-Bold').text('Jain Youth Foundation', 0, 675, { align: 'center' });

    doc.end();

    // 3. Wait for PDF data and send email
    const pdfData = await pdfBufferPromise;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Jain Youth Foundation" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `Official Ticket: ${eventTitle}`,
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
