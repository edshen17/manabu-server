const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const handlebars = require('handlebars');
const fs = require('fs');

const MAIL_SEND_FROM_OPTIONS = {
    SUPPORT: {
        emailName: 'manabu.sg <support@manabu.sg>',
        user: 'support@manabu.sg',
        pass: process.env.MANABU_EMAIL_SUPPORT_PASS,
    },
    NOREPLY: {
        emailName: 'manabu.sg <no-reply@manabu.sg>',
        user: 'no-reply@manabu.sg',
        pass: process.env.MANABU_EMAIL_NOREPLY_PASS,
    },
}

const NODE_MAILER_OPTIONS = {
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
}

const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            console.log(err)
        }
        else {
            callback(null, html);
        }
    });
};


class EmailHandler {
    /**
     * 
     * @param {String || Array<String>} recipientEmails emails to send to
     * @param {String} sendFrom email to send from. Possible values are defined in MAIL_SEND_FROM_OPTIONS
     * @param {String} subjectLine subject line
     * @param {String} htmlPath html path
     * @param {Object} templateStrings template strings used in htmlContent
     */
    async sendEmail(recipientEmails, sendFrom, subjectLine, htmlPath, templateStrings) {
        const nodeMailerOptions = {
            ...NODE_MAILER_OPTIONS
        };
        nodeMailerOptions.auth = MAIL_SEND_FROM_OPTIONS[sendFrom];
        const transporter = nodemailer.createTransport(nodeMailerOptions);

        // change to htmlpath
        readHTMLFile(__dirname + '/templates/verificationEmail.html', function (err, html) {
            const template = handlebars.compile(html);
            const htmlToSend = template(templateStrings);
            const mailOptions = {
                from: MAIL_SEND_FROM_OPTIONS[sendFrom].emailName,
                to : recipientEmails,
                subject: subjectLine,
                html : htmlToSend
             };

            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    callback(error);
                }
            });
        });
    }
}

const test = new EmailHandler()
test.sendEmail('greencopter4444@gmail.com', 'NOREPLY', 'Manabu email verification', 'test', {
    name: 'bei',
    host: 'testhost',
    verificationToken: 'testtoken',
})

module.exports = EmailHandler