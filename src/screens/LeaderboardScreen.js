// screens/LeaderboardScreen.js
import React, { useEffect, useState } from 'react';
import firestoreService from '../services/firestoreService';

const LeaderboardScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Ensure leaderboard is an array of user objects with streak and displayName
        const leaderboard = await firestoreService.getLeaderboardUsers();
        setUsers(Array.isArray(leaderboard) ? leaderboard.filter(u => typeof u.streak === 'number') : []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Navigation prop for going back to home
  const navigate = typeof window !== 'undefined' && window.navigateToScreen ? window.navigateToScreen : null;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Eco Streak Leaderboard</h1>
      <p className="text-gray-600 text-center mb-8">Celebrating users with the longest eco-reflection streaks!</p>
      <button
        onClick={() => (typeof navigate === 'function' ? navigate('home') : window.history.back())}
        className="mb-6 px-6 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-bold shadow"
      >
        ← Back to Home
      </button>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow p-4 border border-gray-100">
          <thead>
            <tr className="bg-green-50">
              <th className="py-3 px-4 text-left text-green-700 font-semibold">Rank</th>
              <th className="py-3 px-4 text-left text-green-700 font-semibold">Name</th>
              <th className="py-3 px-4 text-left text-green-700 font-semibold">Streak</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id || idx} className={idx === 0 ? 'bg-green-100 font-bold' : ''}>
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">{user.displayName || user.name || user.email || 'Anonymous'}</td>
                  <td className="py-3 px-4">{user.streak}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderboardScreen;
