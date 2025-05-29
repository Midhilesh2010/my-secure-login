// src/app/page.js
import { redirect } from 'next/navigation';

export default function HomePage() {
  // This will redirect users from the root URL (/) to /login
  redirect('/login');
  // You can optionally add some placeholder HTML here if you ever want a non-redirecting home page
  // return (
  //   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '2em' }}>
  //     Loading...
  //   </div>
  // );
}