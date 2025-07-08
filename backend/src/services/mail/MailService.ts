// import mailgunFactory from 'mailgun-js'
import Mailgun from 'mailgun.js'
import IEnvelope from './envelopes/IEnvelope'
import formData from 'form-data';
import nodemailer from 'nodemailer'
import fs from 'fs'
import sgMail from '@sendgrid/mail'

const { 
  MAILGUN_API_KEY, 
  MAILGUN_DOMAIN, 
  MAILGUN_FROM,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  FROM_MAIL,
  SUPPORT_EMAIL,
  SMTP_SECURE
} = process.env

// const mailgun = mailgunFactory({
//   apiKey: MAILGUN_API_KEY as string,
//   domain: MAILGUN_DOMAIN as string,
//   host: 'api.eu.mailgun.net',
//   testMode: false,
// })
//@ts-ignore
const mailgun = new Mailgun(formData)
const mg = mailgun.client(
  {
    url: 'https://api.eu.mailgun.net/', 
    username: 'api', 
    key: MAILGUN_API_KEY? MAILGUN_API_KEY : ''
  }
);



class MailService {
  public static async sendToEmail (email: string, envelope: IEnvelope): Promise<void> {

    console.log(">>>>>>>>>>>>>>>>", process.env.SENDGRID_API_KEY)
    //@ts-ignore
    sgMail.setApiKey(process.env.SENDGRID_API_KEY?.trim())


    const data = {
      from: MAILGUN_FROM,
      to: email,
      // cc: envelope.cc,
      subject: envelope.subject,
      // text: envelope.text,
      // inline: envelope.attachment,
      html: envelope.html,
      attachments: envelope.attachments
    }

    try{
      // mg.messages.create('beta.glocalhub.no', data)
      // .then(msg => console.log(msg))
      // .catch(err => console.log(err))
      //@ts-ignore
      sgMail.send(data)
      .then(() => {
        console.log("Email Sent!!", data.to)
      })
      .catch((err) => {
        console.error("ERROR!", err)
      })

      // let transporter = nodemailer.createTransport({
      //   host: MAIL_HOST,
      //   port: MAIL_PORT,
      //   secureConnection: SMTP_SECURE,
      //   auth: {
      //     user: MAIL_USERNAME,
      //     pass: MAIL_PASSWORD
      //   },
      //   tls: {
      //     ciphers:'SSLv3'
      //   }
      // })
      // console.log('>>>>>>>>>>>>: transporter', transporter)
      // transporter.verify(function (error, success) {
      //   if (error) {
      //     console.log('error in verifying: ', error);
      //   } else {
      //     console.log('Server is ready to take our messages');
      //   }
      // });
      // console.log(data);
      // transporter.sendMail(data, (err, info) => {
      //   if (err) {
      //     console.log('sendOTPOnEmail:>>>>>>>>>>>>>>', err);
      //     return err.message;
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //     return info.response;
      //   }
      // })
    }catch(err){
      console.log(err)
      throw new Error('Failed to send Email')
    }
  }
}

export default MailService
