import {NextRequest, NextResponse} from 'next/server';

export const GET = async (
  request: NextRequest,
  {params}: {params: {txref: string}}
) => {
  try {
    return NextResponse.json('Okay', {status: 201});
  } catch (error) {
    return NextResponse.json('Cannot verify transaction at the time', {
      status: 500
    });
  }
};
