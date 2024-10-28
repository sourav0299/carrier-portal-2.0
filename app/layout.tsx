import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Career Portal',
  description: 'Find your dream job here!',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
};

export default RootLayout;