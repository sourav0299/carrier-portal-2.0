"use client"
import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, Auth } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from 'next/navigation';

const Login = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError("Firebase authentication is not initialized");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth as Auth, provider);
      router.push('/'); 
    } catch (err) {
      setError("Failed to log in with Google. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button 
        onClick={handleGoogleLogin} 
        className="bg-red-500 text-white p-2 rounded flex items-center justify-center w-full"
      >
        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;