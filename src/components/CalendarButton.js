// components/CalendarButton.js
import React from 'react';

const CalendarButton = () => {
  const handleAddToCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const startTime = `${year}${month}${day}T200000`;
    const endTime = `${year}${month}${day}T203000`;

    const event = {
      title: "Daily Eco-Reflection",
      description: `Time to reflect on your daily waste reduction! Keep your streak going.\n\nClick here to open the app: ${window.location.href}`,
      location: "IIT Madras",
      startTime,
      endTime,
      recurrence: "RRULE:FREQ=DAILY"
    };
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startTime}/${event.endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&recur=${encodeURIComponent(event.recurrence)}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="bg-white border border-green-200 rounded-xl p-6 text-center shadow-sm">
      {/* Sustainability Icon */}
      <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl" role="img" aria-label="sustainability">🌱</span>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-green-800 mb-2">
          Never Miss a Day! 📅
        </h3>
        <p className="text-green-700 text-sm leading-relaxed">
          Set up daily reminders at 8 PM to maintain your streak and build lasting eco-habits
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
        <div className="flex items-center space-x-2 text-green-700">
          <span>⏰</span>
          <span>Daily at 8 PM</span>
        </div>
        <div className="flex items-center space-x-2 text-green-700">
          <span>🔔</span>
          <span>Smart Reminders</span>
        </div>
        <div className="flex items-center space-x-2 text-green-700">
          <span>📱</span>
          <span>Cross-Platform</span>
        </div>
        <div className="flex items-center space-x-2 text-green-700">
          <span>🎯</span>
          <span>Build Habits</span>
        </div>
      </div>

      {/* Button */}
      <button 
        onClick={handleAddToCalendar} 
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        <span>Add to Google Calendar</span>
      </button>

      {/* Note */}
      <p className="text-green-600 text-xs mt-3 opacity-80">
        � Private • 🎯 Goal-oriented • 🌱 Eco-friendly
      </p>
    </div>
  );
};

export default CalendarButton;