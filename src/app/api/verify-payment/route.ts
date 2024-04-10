import {NextRequest, NextResponse} from 'next/server';

export const POST = async (request: NextRequest) => {
  try {
    const event = await request.json();
    console.log(event);
    return NextResponse.json('Okay', {status: 200});
  } catch (error) {
    return NextResponse.json('Error occured', {status: 500});
  }
};
