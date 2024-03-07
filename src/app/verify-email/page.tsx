import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import {redirect} from 'next/navigation';
import SendMailButton from './SendMailButton';
import Link from 'next/link';
import env from '@/lib/env';

interface searchParamsProps {
  searchParams: {userId: string; token: string};
}

//! Add password entry
export default async function VerifyEmail({searchParams}: searchParamsProps) {
  const {userId, token} = searchParams;

  const user = await prisma.user.findUnique({
    where: {id: userId}
  });

  if (!user) redirect('/');

  if (user.emailVerified) {
    return (
      <div className='p-4 pt-10 text-center'>
        <h1 className='text-2xl mb-5 font-semibold'>
          This account is already verified
        </h1>
        <p className='mb-5 text-xl font-medium'>
          Click the link below to complete your payment
        </p>
        <Link
          href={'/payment?userId=' + user.id}
          className='p-3 bg-blue-400 rounded-md text-blue-950'
          replace
        >
          Complete Payment
        </Link>
      </div>
    );
  }

  const secret = env.JWT_SECRET + user.password;

  let decodedValue: jwt.JwtPayload | undefined;

  jwt.verify(token, secret, function (error, decoded) {
    decodedValue = decoded as jwt.JwtPayload;
  });

  if (!decodedValue) {
    return (
      <div className='p-4 pt-10 text-center'>
        <h1 className='text-2xl mb-5 font-semibold text-red-900'>
          Link expired, please request a new link!!
        </h1>
        <SendMailButton email={user.email} />
      </div>
    );
  }

  const updatedUser = await prisma.user.update({
    where: {id: decodedValue.id as string},
    data: {emailVerified: true}
  });

  if (!updatedUser) {
    return (
      <div className='p-4 pt-10 text-center'>
        <h1 className='text-2xl mb-5 font-semibold text-red-900'>
          Sorry, there was an error while updating user information,
        </h1>
        <h2 className='text-2xl font-semibold mb-5'>
          Please click the link in your email to try again or request new link
        </h2>
        <SendMailButton email={user.email} />
      </div>
    );
  }

  return (
    <main className='p-4 pt-10 text-center'>
      <h1 className='font-bold text-3xl mb-5'>Email verfication</h1>
      <p className='font-semibold text-lg mb-6'>Email verified successfully</p>
      <Link
        href={'/payment?userId=' + user.id}
        className='p-3 bg-blue-400 rounded-md text-blue-950'
        replace
      >
        Continue to payment
      </Link>
    </main>
  );
}
