'use client';

import {useTransition} from 'react';
import {resendVerificationMail} from './actions';

export default function SendMailButton({email}: {email: string}) {
  const [isPending, startTransition] = useTransition();
  //!Disable sending after two clicks
  return (
    <>
      <button
        className='p-2 bg-blue-900 rounded-md text-white mb-2 mx-auto block'
        onClick={async () => {
          startTransition(async () => {
            const response = await resendVerificationMail(email);
          });
        }}
        disabled={isPending}
      >
        {isPending ? 'Sending...' : 'Request new link'}
      </button>
    </>
  );
}
