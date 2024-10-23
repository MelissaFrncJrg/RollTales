import nodemailer from "nodemailer";

// Gérer l'envoi des mails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMail = async (options) => {
  try {
    await transporter.sendMail(options);
  } catch (error) {
    throw error;
  }
};
