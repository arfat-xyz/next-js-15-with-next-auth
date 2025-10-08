import nodeMailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

const transporter = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendEmailViaNodemailer = ({
  template,
  to,
  subject,
}: {
  template: string;
  to: string;
  subject: string;
}) => {
  const mailOption: MailOptions = {
    from: `Arfatur Rahman <arfat.app>`,
    to: to,
    subject: subject || "Email by arfat.app",
    html: template,
  };
  transporter.sendMail(mailOption, function (error) {
    if (error) {
      console.log("Nodemailer Error", error);
    } else {
      console.log(`Message sent successfully.`);
    }
  });
};
