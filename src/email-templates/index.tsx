import * as React from 'react';
import {Tailwind, Html, Text, Heading} from '@react-email/components';

export function SignUp(props: {name: string}) {
  return (
    <Tailwind>
      <Html lang='en'>
        <Heading className='underline'>Welcome {props.name}</Heading>
        <Text className='text-lg'>
          Here at Mutual Gains, we are here to make sure you get the best
          experience
        </Text>
      </Html>
    </Tailwind>
  );
}
