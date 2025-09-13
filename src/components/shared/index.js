// components/shared/index.js
import React from 'react';

export const Loader = ({ text = "Loading..." }) => (
  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #2e7d32', borderTop: '4px solid #43a047', animation: 'spin 1s linear infinite' }} />
    <p style={{ marginTop: 16, fontSize: '1.1rem', fontWeight: 500, color: '#5c6f60', fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif' }}>{text}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const AppHeader = ({ user, onSignOut }) => (
  <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 2px 8px rgba(46, 125, 50, 0.08)', border: '1px solid #e0e0e0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2e7d32', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif' }}>
        {user.displayName?.charAt(0) || 'U'}
      </div>
      <div>
        <span style={{ fontSize: 13, color: '#5c6f60' }}>Signed in as</span>
        <div style={{ fontWeight: 600, color: '#2e7d32', fontSize: 16 }}>{user.displayName}</div>
      </div>
    </div>
    <button 
      onClick={onSignOut}
      style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 15, fontWeight: 500, fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif', boxShadow: '0 2px 8px rgba(46, 125, 50, 0.08)', cursor: 'pointer' }}
    >
      Sign Out
    </button>
  </header>
);

export const StreakDisplay = ({ streak }) => (
  <div style={{ background: '#f5f7f4', borderRadius: 10, padding: 24, marginBottom: 24, textAlign: 'center', boxShadow: '0 2px 8px rgba(46, 125, 50, 0.08)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
      <div style={{ position: 'relative' }}>
        <svg 
          width={64} height={64}
          style={{ color: streak > 0 ? '#2e7d32' : '#cfd8dc', filter: streak > 0 ? 'drop-shadow(0 2px 8px #2e7d32)' : 'none' }}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" 
            clipRule="evenodd" 
          />
        </svg>
        {streak > 0 && (
          <div style={{ position: 'absolute', top: -10, right: -10, background: '#fff', color: '#43a047', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, boxShadow: '0 2px 8px rgba(46, 125, 50, 0.08)' }}>
            🔥
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#2e7d32', fontFamily: 'Inter, Helvetica Neue, Arial, sans-serif' }}>{streak}</div>
        <span style={{ color: '#5c6f60', fontWeight: 500, fontSize: 16 }}>Day Streak</span>
      </div>
    </div>
    {streak > 0 && (
      <div style={{ marginTop: 16, color: '#5c6f60', fontSize: 15 }}>
        {streak === 1 && "Great start! Keep it going! 🌱"}
        {streak >= 2 && streak <= 6 && "You're building momentum! 🚀"}
        {streak >= 7 && streak <= 13 && "One week strong! You're on fire! 🔥"}
        {streak >= 14 && "Eco warrior status achieved! 🌍"}
      </div>
    )}
  </div>
);

// Default export for convenience
export default {
  Loader,
  AppHeader,
  StreakDisplay,
};
