import {ReactElement, JSXElementConstructor} from 'react';
import {render} from '@react-email/render';
import nodemailer from 'nodemailer';
import env from './env';
import {Ratelimit} from '@upstash/ratelimit';
import {kv} from '@vercel/kv';

export function generateInvoiceNumber() {
  // Generate a random number between 1000 and 9999
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  // Generate the current date in the format YYYYMMDD
  const currentDate = new Date();
  const formattedDate =
    currentDate.getFullYear() +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) +
    ('0' + currentDate.getDate()).slice(-2);

  // Concatenate the date and random number to create the invoice number
  const invoiceNumber = formattedDate + randomNumber;

  return invoiceNumber;
}

export function generateInvoiceWithId(id: string) {
  const currentDate = new Date();
  const formattedDate =
    currentDate.getFullYear() +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) +
    ('0' + currentDate.getDate()).slice(-2);

  return id + formattedDate;
}

interface AnyObject {
  [key: string]: any;
}

export function replaceKeys<T extends AnyObject>(
  obj: T,
  keyMap: {[key: string]: string},
  additionalKeys: {[key: string]: any}
): T {
  const newObj: Partial<T> = {};

  // Copy original object with replaced keys
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = keyMap[key] || key;
      newObj[newKey as keyof T] = obj[key];
    }
  }

  // Add additional keys and values
  for (const key in additionalKeys) {
    if (Object.prototype.hasOwnProperty.call(additionalKeys, key)) {
      newObj[key as keyof T] = additionalKeys[key];
    }
  }

  return newObj as T;
}

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

type Unit = 'ms' | 's' | 'm' | 'h' | 'd';
type Duration = `${number} ${Unit}` | `${number}${Unit}`;

export const rateLimiter = (numberOfRequest: number, timeFrame: Duration) => {
  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(numberOfRequest, timeFrame)
  });

  return ratelimit;
};
