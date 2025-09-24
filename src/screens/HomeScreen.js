// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { StreakDisplay } from '../components/shared';
import ActionItem from '../components/ActionItem';
import StreakBreakModal from '../components/StreakBreakModal';
import CalendarButton from '../components/CalendarButton';
import { DAILY_ACTIONS } from '../constants/actions';
import firestoreService from '../services/firestoreService';

const HomeScreen = ({ user, navigate, userData, refreshUserData }) => {
  const [checkedActions, setCheckedActions] = useState({});
  const [isStreakModalOpen, setStreakModalOpen] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (userData.lastReflectionDate) {
      const lastDate = userData.lastReflectionDate.toDate();
      if (firestoreService.isStreakBroken(lastDate, userData.streak)) {
        setStreakModalOpen(true);
      }
    }
  }, [userData]);

  const handleToggleAction = (actionId) => {
    setCheckedActions(prev => ({ ...prev, [actionId]: !prev[actionId] }));
  };
  
  const handleSubmit = async () => {
    try {
      await firestoreService.saveReflection(
        user.uid,
        checkedActions,
        DAILY_ACTIONS.length,
        userData.streak,
        userData.lastReflectionDate,
        comment // Pass comment to service
      );
      alert('Success! Your checklist has been saved.');
      refreshUserData();
      setCheckedActions({});
      setComment("");
    } catch (error) {
      console.error("Error saving reflection:", error);
      alert('Error: Could not save your checklist.');
    }
  };
  
  const handleLogStreakBreak = async (reason) => {
    try {
      await firestoreService.logStreakBreak(user.uid, { 
        reason, 
        streakBroken: userData.streak, 
        date: new Date(), 
        lastReflectionDate: userData.lastReflectionDate.toDate() 
      });
      await firestoreService.resetStreak(user.uid);
      setStreakModalOpen(false);
      refreshUserData();
    } catch (error) { 
      console.error("Error logging streak break:", error); 
    }
  };

  const hasReflectedToday = userData.lastReflectionDate && 
    differenceInCalendarDays(new Date(), userData.lastReflectionDate.toDate()) === 0;
  
  const completedCount = Object.values(checkedActions).filter(Boolean).length;

  return (
    <div className="animate-fadeIn flex flex-col md:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow p-8 border border-gray-100">
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
              The Green Game-Changer Checklist
            </h1>
            <p className="text-gray-600 text-lg">
              Complete these actions today to build your streak!
            </p>
            {!hasReflectedToday && completedCount > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
                <span className="text-green-700 font-medium">
                  Progress: {completedCount}/{DAILY_ACTIONS.length} actions completed 🌱
                </span>
              </div>
            )}
          </header>
          {hasReflectedToday ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-3xl font-bold text-green-700 mb-4">Well Done!</h2>
              <p className="text-gray-600 text-lg mb-6">
                You've completed your checklist for today. Come back tomorrow!
              </p>
              <div className="bg-green-50 rounded p-6">
                <p className="text-gray-700 font-medium">
                  Your actions today made a real difference! 🌍
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-4 mb-8">
                {DAILY_ACTIONS.map((action) => (
                  <ActionItem 
                    key={action.id} 
                    action={action} 
                    isChecked={!!checkedActions[action.id]} 
                    onToggle={() => handleToggleAction(action.id)} 
                  />
                ))}
              </div>
              {/* Comment input */}
              <div className="mb-6">
                <label htmlFor="reflection-comment" className="block text-gray-700 font-semibold mb-2">
                  Comments (optional):
                </label>
                <textarea
                  id="reflection-comment"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                  placeholder="Share your thoughts or feedback..."
                  maxLength={300}
                />
                <div className="text-right text-sm text-gray-500 mt-1">{comment.length}/300</div>
              </div>
              <button 
                onClick={handleSubmit}
                className={`
                  w-full font-bold py-4 px-6 rounded shadow transition-colors text-lg
                  bg-green-600 hover:bg-green-700 text-white
                `}
              >
                {completedCount === 0 
                  ? 'Reflect for Today (No actions selected)' 
                  : `Complete ${completedCount} Action${completedCount !== 1 ? 's' : ''} for Today`}
              </button>
            </div>
          )}
        </div>
        <button 
          onClick={() => navigate('history')} 
          className="w-full text-center text-green-700 hover:text-green-900 font-semibold py-3 px-4 rounded hover:bg-green-50 transition-colors mt-8"
        >
          📊 View My Progress History
        </button>
      </div>
      {/* Sidebar */}
      <div className="md:w-80 flex flex-col gap-8 md:sticky md:top-8">
        <StreakDisplay streak={userData.streak || 0} />
        <CalendarButton />
        <button
          onClick={() => navigate('leaderboard')}
          className="w-full text-center text-green-700 hover:text-green-900 font-semibold py-3 px-4 rounded hover:bg-green-50 transition-colors"
        >
          🏆 View Leaderboard
        </button>
      </div>
      <StreakBreakModal 
        show={isStreakModalOpen} 
        streak={userData.streak} 
        lastDate={userData.lastReflectionDate?.toDate()} 
        onLog={handleLogStreakBreak} 
      />
    </div>
  );
};

export default HomeScreen;