const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const handlebars = require('handlebars');
const fs = require('fs');

/**
 * Class to represent an Email Handler. This class handles all email transactions.
 */
class EmailHandler {
  /**
   *
   * @param {String || Array<String>} recipientEmails emails to send to
   * @param {String} sendFrom email to send from. Possible values are defined in MAIL_SEND_FROM_OPTIONS
   * @param {String} subjectLine subject line
   * @param {String} htmlFileName html filename (template must be inside the templates directory)
   * @param {Object} templateStrings template strings used in html
   */
  async sendEmail(
    recipientEmails: string | string[],
    sendFrom: string,
    subjectLine: string,
    htmlFileName: string,
    templateStrings: any
  ) {
    const nodeMailerOptions: any = {
      ...NODE_MAILER_OPTIONS,
    };
    nodeMailerOptions.auth =
      MAIL_SEND_FROM_OPTIONS[sendFrom as keyof typeof MAIL_SEND_FROM_OPTIONS];
    const transporter = nodemailer.createTransport(nodeMailerOptions);

    readHTMLFile(`${__dirname}/templates/${htmlFileName}.html`, function (err, html) {
      if (err) console.log(err);
      const template = handlebars.compile(html);
      const htmlToSend = template(templateStrings);
      const mailOptions = {
        from: MAIL_SEND_FROM_OPTIONS[sendFrom as keyof typeof MAIL_SEND_FROM_OPTIONS]['emailName'],
        to: recipientEmails,
        subject: subjectLine,
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, function (err: Error) {
        if (err) console.log(err);
      });
    });
  }
}

const MAIL_SEND_FROM_OPTIONS: {} = {
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
};

const NODE_MAILER_OPTIONS: {} = {
  host: 'mail.privateemail.com',
  port: 587,
  secure: false,
};

const readHTMLFile = function (path: string, callback: (...args: any[]) => any) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err: Error, html: string) {
    if (err) {
      console.log(err);
    } else {
      callback(null, html);
    }
  });
};

const emailHandler = new EmailHandler();

export { EmailHandler, emailHandler };
