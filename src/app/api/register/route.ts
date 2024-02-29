import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import {NextRequest, NextResponse} from 'next/server';
import {sendMail} from '@/lib/utils';
import {SignUp} from '@/email-templates';

interface UserDetails {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
}

//Register User
export const POST = async (request: NextRequest) => {
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
