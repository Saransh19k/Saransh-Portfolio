const nodemailer = require('nodemailer');

// Create transporter (in production, use real SMTP settings)
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email function
const sendEmail = async (emailData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html || emailData.content,
      text: emailData.text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Contact form notification email
const sendContactNotification = async (contactData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #4f46e5;">
          ${contactData.message}
        </p>
        <p><strong>Submitted:</strong> ${contactData.timestamp}</p>
        <p><strong>IP Address:</strong> ${contactData.ipAddress}</p>
      </div>
      <p style="color: #666; font-size: 14px;">
        This is an automated notification from your portfolio contact form.
      </p>
    </div>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: `New Contact Form Submission: ${contactData.subject}`,
    html
  });
};

// Contact confirmation email
const sendContactConfirmation = async (contactData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Thank you for contacting me!</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>Hi ${contactData.name},</p>
        <p>Thank you for reaching out! I've received your message about <strong>${contactData.subject}</strong> and will get back to you as soon as possible.</p>
        <p>In the meantime, feel free to check out my latest projects and blog posts on my portfolio.</p>
      </div>
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        Saransh Nimje<br>
        saranshnimje19@gmail.com
      </p>
    </div>
  `;

  return sendEmail({
    to: contactData.email,
    subject: 'Thank you for contacting me!',
    html
  });
};

module.exports = {
  sendEmail,
  sendContactNotification,
  sendContactConfirmation
}; 