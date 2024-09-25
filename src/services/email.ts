import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as SMTPTransport.Options);

  //   2 mail options

  const mailOptions = {
    from: "ferhat mohamed tahar <ferhattaher00@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //  html:
  };

  // 3/send the email
  await transporter.sendMail(mailOptions);
};
