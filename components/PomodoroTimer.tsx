
import React, { useState, useEffect } from 'react';
import Icon from './Icon';

const PomodoroTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  
  const totalSeconds = minutes * 60 + seconds;
  const initialTime = (mode === 'study' ? 25 : 5) * 60;
  const progress = (totalSeconds / initialTime) * 100;

  useEffect(() => {
    let interval: number | undefined = undefined;
    if (isActive && totalSeconds > 0) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes !== 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (totalSeconds === 0) {
      // Timer finished, switch mode
      const newMode = mode === 'study' ? 'break' : 'study';
      setMode(newMode);
      setMinutes(newMode === 'study' ? 25 : 5);
      setSeconds(0);
      setIsActive(false);
      // Optional: Add a sound notification here
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, totalSeconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'study' ? 25 : 5);
    setSeconds(0);
  };
  
  const switchMode = (newMode: 'study' | 'break') => {
      setMode(newMode);
      setIsActive(false);
      setMinutes(newMode === 'study' ? 25 : 5);
      setSeconds(0);
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl p-6">
      <h2 className="text-xl font-bold mb-4">Study Timer</h2>
      <div className="flex justify-center space-x-2 mb-6">
        <button onClick={() => switchMode('study')} className={`px-4 py-1 rounded-full text-sm ${mode === 'study' ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}>Pomodoro</button>
        <button onClick={() => switchMode('break')} className={`px-4 py-1 rounded-full text-sm ${mode === 'break' ? 'bg-green-600 text-white' : 'bg-gray-700'}`}>Short Break</button>
      </div>
      <div className="relative w-40 h-40 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-gray-700" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className={mode === 'study' ? 'text-blue-500' : 'text-green-500'}
            strokeWidth="7"
            strokeDasharray="283"
            strokeDashoffset={283 - (progress / 100) * 283}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl font-bold">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        <button onClick={toggleTimer} className="w-24 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          {isActive ? <Icon name="fa-pause"/> : <Icon name="fa-play"/>}
        </button>
        <button onClick={resetTimer} className="w-24 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <Icon name="fa-rotate-right"/>
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
