export default function Home() {
  const text = 'This app is an api made with next js, move along :)';
  return (
    <main className='p-10'>
      <h1 className='font-bold text-3xl text-center mb-5'>Mutual Gains</h1>
      <p className='font-semibold text-lg text-center'>{text}</p>
    </main>
  );
}
