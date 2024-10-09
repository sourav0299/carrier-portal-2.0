'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';
import { onAuthStateChanged, Auth } from 'firebase/auth';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function WithAuth(props: any) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (auth) {
        const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
          if (user) {
            setIsAuthenticated(true);
          } else {
            router.push('/login');
          }
          setIsLoading(false);
        });

        return () => unsubscribe();
      } else {
        console.error("Firebase auth is not initialized");
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>; // Or any loading indicator
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;