'use server';

import prisma from '@/lib/prisma';
import axios from 'axios';
import env from '@/lib/env';
import {VerificationResponse} from '../../../@types/paystack';

export async function verifyTransaction(txref: string) {
  try {
    const {data} = await axios.get<VerificationResponse>(
      `https://api.paystack.co/transaction/verify/${txref}`,
      {headers: {Authorization: 'Bearer ' + env.PT_SECRET_KEY}}
    );

    if (data.status) {
      const txDetails = data.data;

      const user = await prisma.user.findUnique({
        where: {email: txDetails.customer.email},
        include: {referrer: true}
      });

      if (!user) throw Error('User not found');

      const transaction = await prisma.transaction.create({
        data: {
          type: 'Deposit',
          userId: user.id,
          amount: txDetails.amount / 100,
          txRef: txref,
          status: txDetails.status,
          paidAt: new Date(data.data.paidAt)
        }
      });

      if (transaction.status === 'success' && user.referrer) {
        const paidReferrer = await prisma.user.update({
          where: {id: user.referrer.id},
          data: {walletBalance: {increment: 500}}
        });
      }

      return transaction.status
        ? {message: 'Transaction success'}
        : {message: 'Transaction failure'};
    }

    throw Error('Unable to verify, retry payment later');
  } catch (error: any) {
    return {message: error.message || 'Cannot verify transaction at the time'};
  }
}
