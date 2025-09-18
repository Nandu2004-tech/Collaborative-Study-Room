import React from 'react';
import Icon from './Icon';
import { SessionSettings } from '../types';

interface AdminPanelProps {
  settings: SessionSettings;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings }) => {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl p-6">
      <h2 className="text-xl font-bold mb-4">Admin Controls</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Mute all on join</span>
          <label className="relative inline-flex items-center cursor-not-allowed">
            <input type="checkbox" checked={settings.muteOnJoin} readOnly className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Enable auto-recording</span>
           <label className="relative inline-flex items-center cursor-not-allowed">
            <input type="checkbox" checked={settings.autoRecord} readOnly className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Max participants</span>
          <span className="font-semibold text-blue-400 bg-gray-700 px-3 py-1 rounded-full text-sm">{settings.maxParticipants}</span>
        </div>
        <div className="pt-4 border-t border-gray-700 flex space-x-2">
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Icon name="fa-phone-slash"/>
                <span>End Session</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;