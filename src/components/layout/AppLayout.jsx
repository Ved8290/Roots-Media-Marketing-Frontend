import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </>
  );
}
