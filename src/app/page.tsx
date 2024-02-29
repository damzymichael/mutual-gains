export default function Home() {
  const text = ' This app is an api made with next js, move along :)';
  return (
    <main className='flex min-h-screen flex-col items-center gap-4 p-10'>
      <h1 className='font-bold text-3xl'>Mutual Gains</h1>
      <p className='font-semibold text-lg'>{text}</p>
    </main>
  );
}
