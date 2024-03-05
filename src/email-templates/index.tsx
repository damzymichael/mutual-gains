import * as React from 'react';
import {Tailwind, Html, Text, Heading, Link} from '@react-email/components';

export function SignUp(props: {name: string; emailVerifyUrl?: string}) {
  return (
    <Tailwind>
      <Html lang='en' className='pb-5'>
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
          className='p-3 bg-blue-800 rounded-lg text-white mb-5'
        >
          Verify Email
        </Link>
      </Html>
    </Tailwind>
  );
}
