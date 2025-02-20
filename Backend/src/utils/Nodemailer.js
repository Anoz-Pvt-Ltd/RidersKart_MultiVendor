import nodemailer from "nodemailer";

function SendMail() {
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const transporter = nodemailer.createTransport({
      //  host: "smtp.ethereal.email",
      service: "gmail",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "",
        pass: "",
      },
    });

    const info = await transporter.sendMail({
      from: "vivekkrishan440@gmail.com", // sender address
      to: "kshitijsaxena9@gmail.com", // list of receivers
      subject: "Hello ✔, For testing", // Subject line
      text: "Wow, It's working fine!", // plain text body
      html: "<b><h1>Holy fuck! It's working</h1></b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    return info;
  }

  const MailDetails = main().catch(console.error);

  return MailDetails;
}

export default SendMail;
