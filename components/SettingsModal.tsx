import React, { useState } from 'react';
import { SessionSettings } from '../types';
import Icon from './Icon';

interface SettingsModalProps {
  settings: SessionSettings;
  onSave: (settings: SessionSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [currentSettings, setCurrentSettings] = useState<SessionSettings>(settings);

  const handleToggle = (key: keyof SessionSettings) => {
    setCurrentSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSettings(prev => ({
      ...prev,
      maxParticipants: parseInt(e.target.value, 10),
    }));
  };

  const handleSave = () => {
    onSave(currentSettings);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl w-full max-w-lg">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Session Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
            <Icon name="fa-xmark" className="h-5 w-5" />
          </button>
        </header>
        
        <main className="p-6 space-y-6">
          {/* Mute on Join */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Mute all on join</h3>
              <p className="text-sm text-gray-400">New participants will be automatically muted upon entry.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={currentSettings.muteOnJoin} onChange={() => handleToggle('muteOnJoin')} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Auto Record */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Enable auto-recording</h3>
              <p className="text-sm text-gray-400">The session will start recording automatically.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={currentSettings.autoRecord} onChange={() => handleToggle('autoRecord')} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          {/* Max Participants */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Set max participants</h3>
              <span className="font-bold text-blue-400 bg-gray-700 px-3 py-1 rounded-full text-sm">
                {currentSettings.maxParticipants}
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="100"
              step="1"
              value={currentSettings.maxParticipants}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
            />
          </div>
        </main>

        <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-600 hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white">
            Save Settings
          </button>
        </footer>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
        .range-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #3B82F6;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid #fff;
        }
        .range-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #3B82F6;
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid #fff;
        }
      `}</style>
    </div>
  );
};

export default SettingsModal;
