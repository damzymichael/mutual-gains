'use client';
import React from 'react';
import {PaystackButton} from 'react-paystack';
import {PaystackProps, callback} from 'react-paystack/dist/types';
import {verifyTransaction} from './actions';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';

interface PaystackButtonProps extends PaystackProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
  onSuccess?: callback;
  onClose?: callback;
}

const MyPayStackButton = (props: PaystackButtonProps) => {
  const router = useRouter();
  const onSuccess = (response: any) => {
    console.log(response);
    verifyTransaction(response.reference)
      .then(data => {
        if (data.message === 'Transaction success') {
          toast.success(data.message);
          router.replace('/auth/login');
        }
      })
      .catch(error => toast.error(error.message));
  };
  const onClose = (response: any) => {
    console.log(response);
  };
  return (
    <PaystackButton
      {...props}
      onSuccess={onSuccess}
      onClose={onClose}
      className='text-white bg-blue-500 px-3 py-2 rounded-md'
      text='Pay now'
    />
  );
};

export default MyPayStackButton;
