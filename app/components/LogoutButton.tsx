'use client';

import { signOut, Auth } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { auth } from "../firebase";
import { LuLogOut } from "react-icons/lu";

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
    <button
      className=" text-[#FF7B7B] flex items-center justify-center gap-3"
      onClick={handleLogout}
    >
      <LuLogOut />
      Log Out
    </button>
  );
};

export default LogoutButton;