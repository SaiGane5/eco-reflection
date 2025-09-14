// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import { Loader, AppHeader } from './components/shared';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import firestoreService from './services/firestoreService';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ streak: 0, lastReflectionDate: null });
  const [currentScreen, setCurrentScreen] = useState('home');

  const fetchUserData = useCallback(async (uid) => {
    if (!uid) return;
    setLoading(true);
    try {
      const data = await firestoreService.getUserData(uid);
      setUserData(data);
    } catch (error) { 
      console.error("Error fetching user data:", error); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [fetchUserData]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (loading) {
    return <Loader text={user ? "Loading Your Checklist..." : "Connecting..."} />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'history':
        return <HistoryScreen userId={user.uid} navigate={setCurrentScreen} />;
      case 'leaderboard':
        // Lazy import to avoid circular dependency
        const LeaderboardScreen = require('./screens/LeaderboardScreen').default;
        return <LeaderboardScreen navigate={setCurrentScreen} />;
      case 'home':
      default:
        return (
          <HomeScreen 
            user={user} 
            navigate={setCurrentScreen} 
            userData={userData} 
            refreshUserData={() => fetchUserData(user.uid)} 
          />
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--background)] p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <AppHeader user={user} onSignOut={handleSignOut} />
        {renderScreen()}
      </div>
    </div>
  );
}