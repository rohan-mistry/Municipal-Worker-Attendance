const nodemailer = require('nodemailer')

const sendMail = (mailInfo) => {
    const { senderEmail, password, to, subject, body } = mailInfo

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${senderEmail}`,
            pass: `${password}`
        }
    });

    let mailOptions = {
        from: `${senderEmail}`,
        to: `${to}`,
        subject: `${subject}`,
        text: `${body}`
    };

    return transporter.sendMail(mailOptions)
}

module.exports = sendMail