import prisma from '@/lib/prisma';
import {generateInvoiceNumber, replaceKeys} from '@/lib/utils';
import MyPayStackButton from './PaystackButton';
import env from '@/lib/env';

interface PaymentProps {
  searchParams: {userId: string};
}
//!TEst key exposed
export default async function Payment({searchParams}: PaymentProps) {
  const {userId} = searchParams;
  const user = await prisma.user.findUnique({
    where: {id: userId},
    select: {email: true, fullName: true, phoneNumber: true}
  });
  if (!user) throw Error('User not found');

  const InvoiceInfo = replaceKeys(
    user,
    {
      fullName: 'Bill To',
      email: 'Email Address',
      phoneNumber: 'Phone number'
    },
    {
      ['Invoice number']: '#' + generateInvoiceNumber(),
      For: 'Referral services',
      ['Total Amount']: 'N ' + 200000 / 100
    }
  );
  const fullName = user.fullName.split(' ');

  const MyPaystackProps = {
    email: user.email,
    amount: 200000,
    firstName: fullName[0],
    lastName: fullName[1],
    phone: user.phoneNumber,
    publicKey: env.PT_PUBLIC_KEY,
    metadata: {haha: 'haha', hoho: 'hoho', custom_fields: []}
  };

  return (
    <div className='p-5 pt-10 text-center'>
      <h2 className='text-2xl font-semibold mb-3'>Payment</h2>
      <div className='flex flex-col gap-4'>
        {Object.entries(InvoiceInfo).map(([key, value], i) => (
          <div className='flex gap-4 mb-3' key={i}>
            <p className='font-semibold'>{key}</p>
            <p className='font-medium'>{value}</p>
          </div>
        ))}
      </div>
      <MyPayStackButton {...MyPaystackProps} />
    </div>
  );
}
