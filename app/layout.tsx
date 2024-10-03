// layout.tsx
import './globals.css';  // Import Tailwind global styles
import NavBar from '../app/components/NavBar';  // Import NavBar

export const metadata = {
  title: 'Career Portal',
  description: 'Find your dream job here!',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="text-center p-4">
          © 2024 Career Portal
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
