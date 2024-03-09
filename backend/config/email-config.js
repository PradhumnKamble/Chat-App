const nodemailer = require('nodemailer');


const mailsender = nodemailer.createTransport({
    service : 'gmail',
    auth:{
        user : process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS
    },
})
module.exports = mailsender;