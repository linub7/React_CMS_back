import nodemailer from 'nodemailer';
import validator from 'email-validator';

require('dotenv').config();

export const contact = async (req, res) => {
  try {
    // form to subject body
    const {
      body: { name, email, message },
    } = req;

    const isValidEmail = validator.validate(email);
    if (!isValidEmail) return res.json({ error: 'Email is invalid' });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: 'Email received from contact form',
      html: `<div style=" padding: 1rem 0; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; color: #141823; font-size: 17px; font-family: Roboto; "> <h3>Contact from message</h3> <p> <u>Name</u> </p> <p>${name}</p> <p> <u>Email</u> </p> <p>${email}</p> <p><u>Message</u></p> <p>${message}</p></div>`,
    };

    // create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail(emailData);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
