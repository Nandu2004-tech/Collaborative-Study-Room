import React from 'react';
import { Recording } from '../types';
import Icon from './Icon';

interface RecordingsProps {
  recordings: Recording[];
  onPlay: (recording: Recording) => void;
}

const Recordings: React.FC<RecordingsProps> = ({ recordings, onPlay }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Session Recordings</h2>
      {recordings.length > 0 ? (
        <div className="space-y-4">
          {recordings.map((rec) => (
            <div key={rec.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/20 p-3 rounded-full">
                  <Icon name="fa-video" className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{rec.title}</h3>
                  <p className="text-sm text-gray-400">{rec.date} &middot; {rec.duration}</p>
                </div>
              </div>
              <button
                onClick={() => onPlay(rec)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Icon name="fa-play" className="h-4 w-4" />
                <span>Playback</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="fa-video-slash" className="h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold">No Recordings Found</h3>
          <p className="text-gray-400 mt-2">Start a recording during a session to save it here.</p>
        </div>
      )}
    </div>
  );
};

export default Recordings;
