import React from 'react';
import { Recording } from '../types';
import Icon from './Icon';

interface PlayerProps {
  recording: Recording;
  onClose: () => void;
}

const Player: React.FC<PlayerProps> = ({ recording, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <div>
            <h3 className="text-lg font-bold">{recording.title}</h3>
            <p className="text-sm text-gray-400">{recording.date}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
            <Icon name="fa-xmark" className="h-6 w-6" />
          </button>
        </header>

        {/* Mock Player Screen */}
        <main className="bg-black aspect-video flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Icon name="fa-play-circle" className="h-20 w-20 mb-4" />
            <p>Session playback mock</p>
          </div>
        </main>

        {/* Controls */}
        <footer className="p-4 bg-gray-800">
            {/* Timeline */}
            <div className="flex items-center space-x-3">
                <span className="text-sm">00:00</span>
                <div className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer">
                    <div className="w-1/4 h-full bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm">{recording.duration}</span>
            </div>

            {/* Buttons */}
            <div className="flex justify-center items-center space-x-6 mt-4">
                <button className="text-gray-300 hover:text-white"><Icon name="fa-backward-step" className="h-5 w-5"/></button>
                <button className="text-gray-300 hover:text-white bg-blue-600 w-14 h-14 flex items-center justify-center rounded-full text-2xl">
                    <Icon name="fa-play" className="h-6 w-6"/>
                </button>
                <button className="text-gray-300 hover:text-white"><Icon name="fa-forward-step" className="h-5 w-5"/></button>
            </div>
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
      `}</style>
    </div>
  );
};

export default Player;
