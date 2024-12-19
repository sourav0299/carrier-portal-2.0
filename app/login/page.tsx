"use client"
import { signInWithPopup, GoogleAuthProvider, Auth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from 'next/navigation';
import { FaGoogle } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from "react";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.error('Firebase auth is not initialized');
      return;
    }
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
  
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast.error("Firebase authentication is not initialized");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth as Auth, provider);
      router.push('/'); 
    } catch (err) {
      toast.error("Failed to log in with Google. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute top-5 left-5">
        <img
          src="https://res.cloudinary.com/dzxx6craw/image/upload/v1734631568/4b9f9453991fbc560058da9bcc0f169e_uwfeie.png"
          alt=""
          className="h-[52px] w-[52px]"
        />
      </div>

        <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-center text-center gap-5">
          <p className="text-3xl text-[#1e1e1e] font-bold">
            Login to your account
          </p>
          <p className="text-[15px] text-[#727272] font-bold">
            Begin Your Journey to a Better Experience
          </p>
          <button
            className="flex border-[3px] px-20 py-2 text-[#2F455C] border-[#2F455C] rounded-full"
            onClick={handleGoogleLogin}
          >
            <div className="flex items-center justify-center gap-2">
              <FaGoogle className="w-[19px] h-[19px]" />
              <p className="font-semibold">Sign up with google</p>
            </div>
          </button>
        </div>
      </div>

      <div className="flex pt-5">
        <img
          src="https://res.cloudinary.com/dzxx6craw/image/upload/v1734631119/0364f2cf65cca8d0737dee39900d431d_a6jcpz.jpg"
          className="rounded-[20px] w-[840px] h-[700px]"
          alt="login-img-banner"
        />
      </div>
    </div>
  );
};

export default Login;