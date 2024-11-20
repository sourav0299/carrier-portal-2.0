import './globals.css';
import ClientLayout from './ClientLayout';
import { headers } from 'next/headers';
import MobileMaintenance from '../app/components/MobileMaintenance';

export const metadata = {
  title: 'Career Portal',
  description: 'Find your dream job here!',
};

function isMobile(userAgent: string) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobileDevice = isMobile(userAgent);

  return (
    <html lang="en">
      <body>
        {isMobileDevice ? (
          <MobileMaintenance />
        ) : (
          <ClientLayout>{children}</ClientLayout>
        )}
      </body>
    </html>
  );
}