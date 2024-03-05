import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {NextRequest, NextResponse} from 'next/server';
import {sendMail, ratelimit} from '@/lib/utils';
import {SignUp} from '@/email-templates';
import jwt from 'jsonwebtoken';
import env from '@/lib/env';

interface UserDetails {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
}

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://mutual-gains.vercel.app';

//Register User
//This Sends an email to verify their email address
export const POST = async (request: NextRequest) => {
  const ip = request.ip ?? '127.0.0.1';
  //remaining shows retries
  const {success, reset, remaining} = await ratelimit.limit(ip);
  if (!success) {
    const resetTime = new Date(reset);
    const timeDifferenceSec = Math.ceil(
      (resetTime.getTime() - new Date().getTime()) / 1000
    );
    // const timeDifferenceMinutes = Math.ceil(
    //   (resetTime.getTime() - new Date().getTime()) / (1000 * 60)
    // );
    return NextResponse.json(`Please retry in ${timeDifferenceSec}s`, {
      status: 429
    });
  }

  const userDetails: UserDetails = await request.json();
  const referrer = request.nextUrl.searchParams.get('referrer');
  //!Do password length verification on frontend
  try {
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{email: userDetails.email}, {phoneNumber: userDetails.phoneNumber}]
      }
    });

    if (userExists)
      return NextResponse.json(
        'User exists, Sign in with your email or phone number',
        {status: 400}
      );
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const newUser = await prisma.user.create({
      data: {
        ...userDetails,
        password: hashedPassword,
        referredBy: referrer || null
      }
    });
    const {id, password, fullName} = newUser;

    //send email verification link
    const secret = env.JWT_SECRET + password;
    const token = jwt.sign({id}, secret, {expiresIn: '20m'});
    const emailVerifyUrl = `${baseUrl}/verify-email?userId=${id}&token=${token}`;

    await sendMail(
      newUser.email,
      'Welcome to mutual earnings',
      SignUp({name: fullName.split(' ')[0], emailVerifyUrl})
    );

    return NextResponse.json('Sign up successful', {status: 200});
  } catch (error: any) {
    return NextResponse.json('Could not sign you up ' + error.message, {
      status: 500
    });
  }
};

//Verify Payment
export const PATCH = async (request: NextRequest) => {};
