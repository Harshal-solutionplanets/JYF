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
    user: process.env.GMAIL_USER || 'donotreply@jainyouth.in',
    pass: process.env.GMAIL_PASS || 'fona izov qhkg uwhy'
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
  const { recipientEmail, recipientName, eventTitle, ticketId, section, venue, date, time } = req.body;

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
        from: process.env.GMAIL_USER || 'donotreply@jainyouth.in',
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

    // --- Redesigned PDF Content ---
    // Dark Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#050505');

    // Logo (Centered Top)
    const logoPath = path.join(__dirname, 'src/assets/img/jyf_logo.jpg');
    try {
      doc.image(logoPath, doc.page.width / 2 - 45, 15, { width: 90 });
    } catch (e) { console.error("Logo missing:", logoPath); }

    // Presents text
    doc.fillColor('#D4AF37').fontSize(10).text('JAIN YOUTH FOUNDATION PRESENTS', 0, 125, { align: 'center' });

    // Dynamic Title (Gold)
    doc.fillColor('#FFEE00').fontSize(18).font('Helvetica-Bold').text(eventTitle.toUpperCase(), 0, 155, { align: 'center' });

    // Separator Line
    doc.lineWidth(0.5).strokeColor('#333').moveTo(40, 225).lineTo(doc.page.width - 40, 225).stroke();

    // User Name (White)
    doc.fillColor('#FFFFFF').fontSize(26).font('Helvetica-Bold').text(recipientName, 0, 260, { align: 'center' });

    // Date & Venue Labels
    doc.fontSize(10).fillColor('#888').text('DATE:', 40, 310).text('VENUE:', doc.page.width / 2 + 20, 310);

    // Date & Venue Details (White)
    doc.fontSize(11).fillColor('#FFFFFF').text(date || '12/04/2026', 40, 330, { width: 120 });
    doc.text(venue || 'Kalidas Auditorium\nMulund West, Mumbai', doc.page.width / 2 + 20, 330, { width: 150 });

    // Separator Line
    doc.lineWidth(0.5).strokeColor('#333').moveTo(40, 385).lineTo(doc.page.width - 40, 385).stroke();

    // QR Code Section
    // White Box for QR
    doc.rect(doc.page.width / 2 - 75, 415, 150, 150).fillAndStroke('#D4AF37', '#D4AF37');
    doc.rect(doc.page.width / 2 - 70, 420, 140, 140).fill('#FFFFFF');
    // Actual QR Image
    doc.image(qrDataUrl, doc.page.width / 2 - 65, 425, { width: 130 });

    // Section Button (SILVER)
    doc.roundedRect(doc.page.width / 2 - 65, 595, 130, 35, 17.5).fill('#FFCC00');
    doc.fillColor('#000000').fontSize(15).font('Helvetica-Bold').text(section.toUpperCase() || 'SILVER', 0, 606, { align: 'center' });

    // Footer Text
    doc.fillColor('#888').fontSize(9).font('Helvetica').text('Scan this at the entrance • Entry on First come basis', 0, 655, { align: 'center' });
    doc.fillColor('#D4AF37').fontSize(12).font('Helvetica-Bold').text('Jain Youth Foundation', 0, 675, { align: 'center' });

    doc.end();

  } catch (err) {
    console.error("Internal PDF Error:", err);
    res.status(500).json({ error: 'Internal Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Email Designer Server running on port ${PORT}`);
});
