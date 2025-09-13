// screens/LoginScreen.js
import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/config';

const LoginScreen = () => {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Could not sign in with Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center shadow border border-green-200">
            <span className="text-5xl" role="img" aria-label="earth">🌍</span>
          </div>
        </div>
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
          Welcome to the
        </h1>
        <h2 className="text-3xl md:text-4xl font-extrabold text-green-600 mb-6">
          Green Game-Changer
        </h2>
        {/* Subtitle with features */}
        <div className="bg-green-50 rounded p-6 mb-8 border border-green-100">
          <p className="text-green-700 text-lg mb-4 leading-relaxed">
            Transform your daily habits into environmental impact at IIT Madras
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-green-700">
              <span>🏆</span>
              <span>Build Streaks</span>
            </div>
            <div className="flex items-center space-x-2 text-green-700">
              <span>📊</span>
              <span>Track Progress</span>
            </div>
            <div className="flex items-center space-x-2 text-green-700">
              <span>🌱</span>
              <span>Daily Actions</span>
            </div>
            <div className="flex items-center space-x-2 text-green-700">
              <span>🎯</span>
              <span>Real Impact</span>
            </div>
          </div>
        </div>
        {/* Sign in button */}
        <button 
          onClick={handleGoogleSignIn} 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded shadow transition-colors flex items-center justify-center space-x-3 border border-green-700"
        >
          <svg width="24" height="24" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
            <path fill="#FF3D00" d="M6.306 14.691l6.057 4.844C14.655 15.108 18.96 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.49 44 30.861 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
          </svg>
          <span className="text-lg">Continue with Google</span>
        </button>
        {/* Footer note */}
        <p className="mt-6 text-green-600 text-sm">
          Join the sustainability movement • Make every action count
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;