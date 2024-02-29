import {ReactElement, JSXElementConstructor} from 'react';
import {render} from '@react-email/render';
import nodemailer from 'nodemailer';
import env from './env';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmai.com',
  port: 465,
  secure: true,
  auth: {
    user: env.ADMIN_EMAIL,
    pass: env.ADMIN_PASSWORD
  }
});

export const sendMail = async (
  email: string,
  subject: string,
  html: ReactElement<any, string | JSXElementConstructor<any>>
) => {
  const mailResponse = await transporter.sendMail({
    from: env.ADMIN_EMAIL,
    to: email,
    subject,
    html: render(html)
  });
  return mailResponse;
};

