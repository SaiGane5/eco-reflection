// components/ActionItem.js
import React from 'react';

const ActionItem = ({ action, isChecked, onToggle }) => {
  return (
    <div 
      onClick={onToggle} 
      className={`
        cursor-pointer p-4 rounded-lg border transition-colors duration-200 mb-3 bg-white
        ${isChecked 
          ? 'border-green-400 bg-green-50' 
          : 'border-gray-200 hover:border-green-300'
        }
      `}
    >
      <div className="flex items-start space-x-4">
        <div className={`
          w-6 h-6 rounded border flex items-center justify-center mt-1 transition-colors
          ${isChecked 
            ? 'border-green-500 bg-green-500' 
            : 'border-gray-300 bg-white hover:border-green-400'
          }
        `}>
          {isChecked && (
            <svg width="16" height="16" className="text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        {/* Sustainability icon placeholder */}
        <span className="text-xl" role="img" aria-label="sustainability">🌱</span>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{action.icon}</span>
            <span className={`
              font-medium transition-colors
              ${isChecked ? 'text-gray-500 line-through' : 'text-gray-800'}
            `}>
              {action.text}
            </span>
          </div>
          <div className={`
            text-sm px-3 py-1 rounded inline-block
            ${isChecked 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-50 text-green-700'
            }
          `}>
            Impact: {action.impact}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionItem;