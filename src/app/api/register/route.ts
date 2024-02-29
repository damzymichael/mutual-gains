import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {NextRequest, NextResponse} from 'next/server';
import {sendMail, ratelimit} from '@/lib/utils';
import {SignUp} from '@/email-templates';

interface UserDetails {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
}

//Register User
//This Sends an email to verify their email address
export const POST = async (request: NextRequest) => {
  const ip = request.ip ?? '127.0.0.1';
  const {success, pending, limit, reset, remaining} = await ratelimit.limit(ip);
  console.log({limit, reset, remaining, success});
  if (!success) return NextResponse.json('Please retry later');

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

    sendMail(
      newUser.email,
      'Welcome to mutual earnings',
      SignUp({name: newUser.fullName})
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

//Verify Email
export const PUT = async (request: NextRequest) => {};
