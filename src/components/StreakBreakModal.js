// components/StreakBreakModal.js
import React, { useState } from 'react';
import { format } from 'date-fns';

const StreakBreakModal = ({ show, streak, lastDate, onLog }) => {
  const [reason, setReason] = useState('');

  if (!show) return null;

  const handleSubmit = () => {
    if (reason.trim() === '') {
      alert('Please provide a brief reason.');
      return;
    }
    onLog(reason);
    setReason('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center border border-red-100">
        {/* Sustainability Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl" role="img" aria-label="sustainability">🌱</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-600 mb-4">Streak Broken!</h2>
        
        {/* Message */}
        <div className="bg-red-50 rounded p-4 mb-6">
          <p className="text-gray-700 text-lg mb-2">
            You broke your <span className="font-bold text-red-600">{streak}-day</span> streak! 
          </p>
          <p className="text-gray-600">
            Your last reflection was on{' '}
            <span className="font-semibold">{format(lastDate, 'MMMM d')}</span>
          </p>
        </div>

        {/* Encouragement */}
        <div className="bg-green-50 rounded p-4 mb-6">
          <p className="text-green-800 font-medium">
            It's okay! Every champion faces setbacks. What matters is getting back up! 💪
          </p>
        </div>

        {/* Reason input */}
        <div className="text-left mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            What happened? (This helps you learn and improve)
          </label>
          <textarea 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
            className="w-full p-4 border border-gray-200 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none" 
            rows="4" 
            placeholder="e.g., Was too busy with exams, forgot to check the app, traveling..."
            maxLength={200}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {reason.length}/200
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleSubmit} 
            disabled={!reason.trim()}
            className={`
              w-full font-bold py-4 px-6 rounded bg-green-600 text-white transition-colors text-lg
              ${reason.trim() ? 'hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
            `}
          >
            Log Reason & Start Fresh 🚀
          </button>
          <p className="text-gray-500 text-sm">
            Your new streak begins with your next checklist!
          </p>
        </div>

        {/* Motivational quote */}
        <div className="mt-6 bg-green-50 rounded p-4">
          <p className="text-gray-700 italic text-sm">
            "Success is not final, failure is not fatal: it is the courage to continue that counts." 
            <br />
            <span className="text-green-600 font-medium">- Winston Churchill</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakBreakModal;