'use server';
import {sendMail} from '@/lib/utils';
import {VerifyMail} from '@/email-templates';
import prisma from '@/lib/prisma';
import env from '@/lib/env';
import jwt from 'jsonwebtoken';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://mutual-gains.vercel.app';

export async function resendVerificationMail(email: string) {
  const user = await prisma.user.findUnique({where: {email}});
  if (!user) return {error: 'Could not find user'};

  const {password, id} = user;
  const secret = env.JWT_SECRET + password;

  const token = jwt.sign({id}, secret, {expiresIn: '20m'});
  const emailVerifyUrl = `${baseUrl}/verify-email?userId=${id}&token=${token}`;

  const mailResponse = await sendMail(
    email,
    'Email Verification Link',
    VerifyMail({emailVerifyUrl})
  );

  if (mailResponse.accepted.length) {
    return {message: 'Verification mail sent'};
  } else {
    return {error: 'Could not send verification link'};
  }
}
