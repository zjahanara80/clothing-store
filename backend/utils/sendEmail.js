// // utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zeynabjahanara705@gmail.com',
    pass: 'zslavwlcbkzznbhq'  
}
})

const sendAnswerEmail = (to, subject, message) => {
  console.log("ارسال پیام ایمیل:", message);
  return transporter.sendMail({
    from: '"پشتیبانی لاوین" <zeynabjahanara705@gmail.com>',
    to,
    subject,
    html: `
      <div style="direction: rtl; font-family: sans-serif;">
        <p>پاسخ شما:</p>
        <blockquote style="border-right: 3px solid #ccc; padding-right: 10px; margin: 10px 0;">${message}</blockquote>
        <p>با احترام<br>تیم لاوین</p>
      </div>
    `
  });
};

module.exports = sendAnswerEmail;