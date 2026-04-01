const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Configure Nodemailer with Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Nodemailer Verification Error:', error);
  } else {
    console.log('Nodemailer is ready to send messages');
  }
});

app.post('/api/send-ticket', async (req, res) => {
  const { recipientEmail, recipientName, eventTitle, ticketId, section, description, venue, date, time } = req.body;

  console.log(`[${new Date().toISOString()}] Incoming request to send ticket to: ${recipientEmail}`);

  if (!recipientEmail || !recipientName || !eventTitle || !ticketId) {
    console.error('Missing required fields:', req.body);
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Generate QR Code as Data URL
    const qrDataUrl = await QRCode.toDataURL(ticketId, {
      margin: 2,
      scale: 10,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Create PDF In Memory
    const doc = new PDFDocument({ size: [400, 700], margin: 0 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      let pdfData = Buffer.concat(buffers);

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: recipientEmail,
        subject: `Your Bhakti Sandhya Ticket: ${recipientName}`,
        text: ` ${recipientName}, please find your official ticket for ${eventTitle} attached to this email. \n\nTicket ID: ${ticketId}\nVenue: ${venue}\nDate: ${date}`,
        attachments: [
          {
            filename: `${recipientName.replace(/\s+/g, '_')}_Ticket.pdf`,
            content: pdfData
          }
        ]
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Professional PDF Email sent to ${recipientEmail}`);
        res.json({ message: 'Email with Professional PDF sent successfully!' });
      } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ error: 'Failed to send email' });
      }
    });

    // --- Redesigned PDF Content (Matching Frontend GoldenTicket) ---
    // Dark Background for the whole card
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#050505');

    // Outer Gold Border (frontend style)
    doc.rect(5, 5, doc.page.width - 10, doc.page.height - 10).lineWidth(3).stroke('#D4AF37');

    // Logo (Centered Top)
    const logoPath = path.join(__dirname, 'src/assets/img/jyf_logo.jpg');
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

    // Date & Venue Section (Matching Grid Layout)
    doc.fontSize(10).fillColor('#888').text('DATE:', 60, 340).text('VENUE:', doc.page.width / 2 + 20, 340);
    doc.fontSize(12).fillColor('#FFFFFF').font('Helvetica-Bold').text(date || '12/04/2026', 60, 355, { width: 120 });
    doc.text(venue || 'Kalidas Auditorium\nMulund West, Mumbai', doc.page.width / 2 + 20, 355, { width: 150 });

    // Separator Line
    doc.lineWidth(0.5).strokeColor('rgba(212, 175, 55, 0.3)').moveTo(40, 410).lineTo(doc.page.width - 40, 410).stroke();

    // QR Code Section
    // Yellow/White Frame for QR
    doc.rect(doc.page.width / 2 - 75, 440, 150, 150).fillAndStroke('#D4AF37', '#D4AF37');
    doc.rect(doc.page.width / 2 - 70, 445, 140, 140).fill('#FFFFFF');
    // Actual QR Image
    doc.image(qrDataUrl, doc.page.width / 2 - 65, 450, { width: 130 });

    // Section Button (Rectangular Gold - Matching Frontend)
    let displaySection = section;
    // Treat "GENERAL" or empty or any casing of it as a trigger for fallback (fixing old registrations)
    if ((!displaySection || displaySection.toString().toUpperCase() === "GENERAL") && description && description.startsWith("SECTIONS:")) {
      try {
        const metadataPart = description.split(" | CONTENT: ")[0];
        const sectionsString = metadataPart.split("SECTIONS: ")[1].split(" | ")[0];
        const parsed = JSON.parse(sectionsString);
        const names = Array.isArray(parsed) ? parsed.map(s => typeof s === 'string' ? s : s.name) : Object.keys(parsed);
        if (names.length > 0) displaySection = names[0];
      } catch (e) {
        console.error("PDF Fallback Error:", e);
      }
    }
    
    // Final check: if still empty or General, force it to 'GOLD' for Antarnaad event context
    const finalSectionName = (displaySection && displaySection.toString().toUpperCase() !== "GENERAL") ? displaySection.toUpperCase() : 'GOLD';

    // Rectangular Yellow Box
    doc.rect(doc.page.width / 2 - 75, 610, 150, 40).fill('#FFCC00');
    // Section Text
    doc.fillColor('#000000').fontSize(18).font('Helvetica-Bold').text(finalSectionName, 0, 622, { align: 'center' });

    // Footer Text
    doc.fillColor('#888').fontSize(9).font('Helvetica').text('Scan this at the entrance • Entry on First come basis', 0, 670, { align: 'center' });

    doc.end();

  } catch (err) {
    console.error("Internal PDF Error:", err);
    res.status(500).json({ error: 'Internal Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Email Designer Server running on port ${PORT}`);
});
