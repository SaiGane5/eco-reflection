// screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DAILY_ACTIONS } from '../constants/actions';
import firestoreService from '../services/firestoreService';

const HistoryScreen = ({ userId, navigate }) => {
  const [loading, setLoading] = useState(true);
  const [reflections, setReflections] = useState([]);
  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return;
      try {
        const data = await firestoreService.getReflections(userId);
        setReflections(data);
      } catch (error) { 
        console.error("Error fetching history:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchHistory();
  }, [userId]);

  const getProgressColor = (completed, total) => {
    const percentage = (completed / total) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressEmoji = (completed, total) => {
    const percentage = (completed / total) * 100;
    if (percentage >= 80) return '🏆';
    if (percentage >= 60) return '🌟';
    if (percentage >= 40) return '👍';
    return '💪';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex items-center mb-8">
        <button 
          onClick={() => navigate('home')} 
          className="mr-4 p-3 rounded hover:bg-green-50 transition-colors border border-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-green-800">Progress History</h1>
          <p className="text-gray-600 mt-1">Track your eco-friendly journey</p>
        </div>
      </header>
      <div className="bg-white rounded-xl shadow p-8 border border-gray-100">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your history...</p>
          </div>
        ) : reflections.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No History Yet</h3>
            <p className="text-gray-500 text-lg mb-8">
              Your progress history will appear here after you complete your first checklist.
            </p>
            <button 
              onClick={() => navigate('home')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded shadow transition-colors"
            >
              Start Your First Checklist
            </button>
          </div>
        ) : (
          <div>
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 rounded p-6 text-center">
                <div className="text-3xl font-bold text-green-600">{reflections.length}</div>
                <div className="text-green-700 font-medium">Total Days</div>
              </div>
              <div className="bg-green-50 rounded p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {reflections.reduce((total, item) => {
                    return total + Object.values(item.answers || {}).filter(Boolean).length;
                  }, 0)}
                </div>
                <div className="text-green-700 font-medium">Total Actions</div>
              </div>
              <div className="bg-green-50 rounded p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(
                    reflections.reduce((total, item) => {
                      const completed = Object.values(item.answers || {}).filter(Boolean).length;
                      return total + (completed / (item.totalActions || DAILY_ACTIONS.length)) * 100;
                    }, 0) / reflections.length
                  )}%
                </div>
                <div className="text-green-700 font-medium">Avg Completion</div>
              </div>
            </div>
            {/* History list */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Progress</h3>
              {reflections.map(item => {
                const completedCount = Object.values(item.answers || {}).filter(Boolean).length;
                const total = item.totalActions || DAILY_ACTIONS.length;
                const progressColor = getProgressColor(completedCount, total);
                const emoji = getProgressEmoji(completedCount, total);
                return (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{emoji}</div>
                        <div>
                          <p className="font-bold text-gray-800 text-lg">
                            {format(item.date.toDate(), 'MMMM d, yyyy')}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {format(item.date.toDate(), 'EEEE')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-4 py-2 rounded font-bold text-lg ${progressColor}`}>
                          {completedCount} / {total}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                          {Math.round((completedCount / total) * 100)}% complete
                        </p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(completedCount / total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;