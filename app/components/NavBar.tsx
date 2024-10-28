"use client"
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

  if (error) {
    return <nav className="p-4 bg-[#1e1e1e] text-white h-[85px]"><p>Error: {error}</p></nav>;
  }

  return (
    <nav className="p-4 bg-[#1e1e1e] text-white flex justify-center items-center h-[85px]">
      <div className="w-full max-w-[1400px] flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          <img
            src="https://res.cloudinary.com/dzxx6craw/image/upload/v1730015044/bd7894313133eb84efc2c7974b095307_yvpliu.png"
            alt="Logo"
            width={302}
            height={79}
          />
        </Link>
        <div className="flex items-center justify-center gap-5">
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="w-[60px] h-[60px] rounded overflow-hidden bg-gray-200">
                  <Image
                    src={user.photoURL || 'https://via.placeholder.com/60x60?text=User'}
                    alt={user.displayName || "User"}
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[#9c9ca3]">Welcome,</span>
                  <span className="">{user.displayName || user.email}</span>
                </div>
                <LogoutButton />
              </div>
            ) : (
              <Link href="/login" className="bg-white text-[#1e1e1e] rounded-md px-4 py-2 font-bold">
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;