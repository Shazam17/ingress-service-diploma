import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import { config } from '../config';

@Injectable()
export class MailingService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.VERIFY_EMAIL,
        pass: config.VERIFY_EMAIL_PASSWORD,
      },
    });
  }

  sendEmail(emailAddress: string, content) {
    const message = {
      from: 'superpozitiv@gmail.com',
      to: emailAddress,
      subject: 'Email verification',
      text: `<a href="${content}">verify your email</a>`,
    };
    this.transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}
