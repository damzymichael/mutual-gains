import * as React from 'react';
import {Tailwind, Html, Text, Heading, Link} from '@react-email/components';

function EmailTemplate({children}: {children: React.ReactNode}) {
  return (
    <Tailwind>
      <Html lang='en'>
        <div className='text-black p-2'>{children}</div>
      </Html>
    </Tailwind>
  );
}

export function SignUp(props: {name: string; emailVerifyUrl?: string}) {
  return (
    <EmailTemplate>
      <Heading className='text-xl'>Welcome {props.name}</Heading>
      <Text className='text-lg mb-2'>
        Here at Mutual Gains, we are here to make sure you get the best
        experience
      </Text>
      <Text className='mb-5 text-lg'>
        Please lick the link below to verify your email
      </Text>
      <Link
        href={props?.emailVerifyUrl}
        className='p-3 bg-blue-800 rounded-lg text-white mb-10'
      >
        Verify Email
      </Link>

      <Text className='mb-5'>
        Ignore this email if you did not sign up for mutual gains
      </Text>
    </EmailTemplate>
  );
}

export function VerifyMail(props: {emailVerifyUrl: string}) {
  return (
    <EmailTemplate>
      <Text className='mb-5 text-lg'>
        Please click the link below to verify your email
      </Text>
      <Link
        href={props?.emailVerifyUrl}
        className='p-3 bg-blue-800 rounded-lg text-white mb-10'
      >
        Verify Email
      </Link>

      <Text className='mb-5'>
        Ignore this email if you did not sign up for mutual gains
      </Text>
    </EmailTemplate>
  );
}
