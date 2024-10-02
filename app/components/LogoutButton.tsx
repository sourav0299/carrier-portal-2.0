'use client';

import { signOut, Auth } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth } from "../firebase";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      return;
    }

    signOut(auth as Auth)
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error("Failed to log out:", error);
      });
  };

  return (
    <button className="bg-red-500 text-white p-2 rounded" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;