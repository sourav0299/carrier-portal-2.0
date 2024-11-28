'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import Loader from "../components/Loader";

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      router.push("/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <Loader />;

  if (!user) return null; 

  return <div>Admin Page Content</div>;
};

export default AdminPage;