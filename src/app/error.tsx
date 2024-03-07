'use client';

type ErrorProps = {
  error: Error & {digest?: string};
  reset: () => void;
};

export default function Error({error, reset}: ErrorProps) {
  return (
    <div className='grid h-screen place-content-center text-center'>
      <h2 className='text-6xl font-black text-gray-200'>
        Something went wrong!
      </h2>

      <p className='mt-4 text-gray-500 text-3xl'>Please try again</p>
      <button
        onClick={() => reset()}
        className='mt-6 w-max mx-auto rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring'
      >
        Try again
      </button>
    </div>
  );
}
