import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import {redirect} from 'next/navigation';
import Link from 'next/link';
import env from '@/lib/env';

interface searchParamsProps {
  searchParams: {userId: string; token: string};
}

//!Add server action to request new link
export default async function VerifyEmail({searchParams}: searchParamsProps) {
  const {userId, token} = searchParams;
  const user = await prisma.user.findUnique({
    where: {id: userId}
  });
  
  if (!user) redirect('/');

  if (user.emailVerified) {
    return (
      <div>
        <h1>This account is already verified</h1>
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
      <div>
        <h1>Link expired, please request a new link</h1>
        <button>Send Link</button>
      </div>
    );
  }

  const updatedUser = await prisma.user.update({
    where: {id: decodedValue.id as string},
    data: {emailVerified: true}
  });

  if (!updatedUser) {
    return (
      <div>
        <h1>Error updating user info </h1>
      </div>
    );
  }

  return (
    <main className='p-10'>
      <h1 className='font-bold text-3xl text-center mb-5'>Verify email</h1>
      <p className='font-semibold text-lg text-center'>
        Email verified successfully
      </p>
      <Link href='/'>Home page</Link>
    </main>
  );
}
