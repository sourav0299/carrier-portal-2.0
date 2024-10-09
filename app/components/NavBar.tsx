"use client"
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from "../firebase";
import LogoutButton from "./LogoutButton";

const NavBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let unsubscribe: () => void;

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    } else {
      setError("Firebase auth is not initialized");
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (loading) {
    return <nav className="p-4 bg-gray-800 text-white"><p>Loading...</p></nav>;
  }

  if (error) {
    return <nav className="p-4 bg-gray-800 text-white"><p>Error: {error}</p></nav>;
  }

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Career Portal</Link>
      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.displayName || user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;