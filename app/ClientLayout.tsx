"use client"
import NavBar from './components/NavBar';
import { usePathname } from 'next/navigation';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <NavBar />}
      <main className={`container mx-auto`}>
        {children}
      </main>
    </>
  );
};

export default ClientLayout;