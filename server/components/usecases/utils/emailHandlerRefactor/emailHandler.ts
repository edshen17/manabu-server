// // class EmailHandler {
// //   private _NODE_MAILER_OPTIONS = Object.freeze({
// //     host: 'mail.privateemail.com',
// //     port: 587,
// //     secure: false,
// //   });
// //   private _MAIL_SEND_FROM_OPTIONS: { [key: string]: any } = {
// //     SUPPORT: {
// //       emailName: 'manabu.sg <support@manabu.sg>',
// //       user: 'support@manabu.sg',
// //       pass: process.env.MANABU_EMAIL_SUPPORT_PASS!,
// //     },
// //     NOREPLY: {
// //       emailName: 'manabu.sg <no-reply@manabu.sg>',
// //       user: 'no-reply@manabu.sg',
// //       pass: process.env.MANABU_EMAIL_NOREPLY_PASS!,
// //     },
// //   };
// //   private _nodemailer!: any;
// //   private _handlebars!: any;
// //   private _fs!: any;

// //   public sendEmail = (
// //     recipientEmails: string | string[],
// //     sendFrom: string,
// //     subjectLine: string,
// //     htmlFileName: string,
// //     templateStrings: any
// //   ) => {
// //     const nodeMailerOptions: any = {
// //       ...this._NODE_MAILER_OPTIONS,
// //     };

// //     nodeMailerOptions.auth = this._MAIL_SEND_FROM_OPTIONS[sendFrom];

// //     const transporter = this._nodemailer.createTransport(nodeMailerOptions);
// //     const self = this;

// //     this._readHTMLFile(`${__dirname}/templates/${htmlFileName}.html`, (err, html) => {
// //       if (err) {
// //         console.log(err);
// //       }
// //       const template = self._handlebars.compile(html);
// //       const htmlToSend = template(templateStrings);
// //       const mailOptions = {
// //         from: self._MAIL_SEND_FROM_OPTIONS[sendFrom]['emailName'],
// //         to: recipientEmails,
// //         subject: subjectLine,
// //         html: htmlToSend,
// //       };

// //       transporter.sendMail(mailOptions, function (err: Error) {
// //         // if (err) console.log(err);
// //       });
// //     });
// //   };

// //   private _readHTMLFile = (path: string, callback: (...args: any[]) => any) => {
// //     this._fs.readFile(path, { encoding: 'utf-8' }, function (err: Error, html: string) {
// //       if (err) {
// //         console.log(err);
// //       } else {
// //         callback(null, html);
// //       }
// //     });
// //   };

// //   public init = (props: { handlebars: any; nodemailer: any; fs: any }): this => {
// //     const { handlebars, nodemailer, fs } = props;
// //     this._handlebars = handlebars;
// //     this._nodemailer = nodemailer;
// //     this._fs = fs;
// //     return this;
// //   };
// // }

// // export { EmailHandler };
