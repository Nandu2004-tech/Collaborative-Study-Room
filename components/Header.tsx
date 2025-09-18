import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { User } from '../types';

interface HeaderProps {
  user: User;
  isRecording: boolean;
  recordingStartTime: Date | null;
  onToggleRecording: () => void;
  onToggleMobileChat: () => void;
  onToggleSettings: () => void;
  onLogout: () => void;
}

const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Header: React.FC<HeaderProps> = ({
    user,
    isRecording,
    recordingStartTime,
    onToggleRecording,
    onToggleMobileChat,
    onToggleSettings,
    onLogout,
}) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isRecording && recordingStartTime) {
            const interval = setInterval(() => {
                const now = new Date();
                const diff = Math.floor((now.getTime() - recordingStartTime.getTime()) / 1000);
                setElapsedSeconds(diff);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setElapsedSeconds(0);
        }
    }, [isRecording, recordingStartTime]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center z-10 shrink-0">
            <div className="flex items-center space-x-3">
                <Icon name="fa-users-rectangle" className="h-8 w-8 text-blue-500" />
                <h1 className="text-xl font-bold text-white">Collaborative Study Room</h1>
            </div>
            <div className="flex items-center space-x-4">
                {isRecording && (
                    <div className="hidden sm:flex items-center space-x-2 bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-sm">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                        <span>REC</span>
                        <span className="font-mono">{formatTime(elapsedSeconds)}</span>
                    </div>
                )}
                <button
                    onClick={onToggleRecording}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-colors ${
                        isRecording 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                >
                    <Icon name={isRecording ? "fa-stop" : "fa-record-vinyl"} className="h-4 w-4" />
                    <span>{isRecording ? 'Stop' : 'Record'}</span>
                </button>
                 <button className="p-2 rounded-full hover:bg-gray-700 transition-colors lg:hidden" onClick={onToggleMobileChat}>
                    <Icon name="fa-comments" className="h-5 w-5 text-gray-400" />
                </button>
                <button onClick={onToggleSettings} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <Icon name="fa-cog" className="h-5 w-5 text-gray-400" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <Icon name="fa-bell" className="h-5 w-5 text-gray-400" />
                </button>
                
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-700 transition-colors"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        <img src={user.avatar} alt="User Avatar" className="h-8 w-8 rounded-full" />
                        <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
                        <Icon name="fa-chevron-down" className={`h-3 w-3 text-gray-400 transition-transform hidden sm:inline ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20 py-1 animate-fade-in-fast">
                            <div className="px-4 py-3 border-b border-gray-700">
                                <p className="text-sm font-semibold truncate">{user.name}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/50 flex items-center space-x-3 transition-colors"
                            >
                                <Icon name="fa-right-from-bracket" className="h-4 w-4" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes fade-in-fast {
                    from { opacity: 0; transform: translateY(-10px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-fast {
                    animation: fade-in-fast 0.15s ease-out forwards;
                }
            `}</style>
        </header>
    );
};

export default Header;