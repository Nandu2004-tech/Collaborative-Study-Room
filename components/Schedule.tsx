
import React from 'react';
import { CalendarEvent } from '../types';

const sampleEvents: CalendarEvent[] = [
    { day: 3, title: 'Biology Review', color: 'bg-blue-500' },
    { day: 10, title: 'Calculus Practice', color: 'bg-green-500' },
    { day: 11, title: 'History Mid-term Prep', color: 'bg-yellow-500' },
    { day: 22, title: 'Final Project Kick-off', color: 'bg-red-500' },
    { day: 25, title: 'Chemistry Lab Report', color: 'bg-indigo-500' },
];

const Schedule: React.FC = () => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
        <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Session Schedule</h2>
                <span className="font-semibold">{today.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {emptyCells.map(i => <div key={`empty-${i}`} className="h-24"></div>)}
                {calendarDays.map(day => {
                    const event = sampleEvents.find(e => e.day === day);
                    const isToday = day === today.getDate();
                    return (
                        <div key={day} className={`h-24 p-2 border border-gray-700 rounded-md flex flex-col ${isToday ? 'bg-blue-900/50' : 'bg-gray-800'}`}>
                            <span className={`font-bold ${isToday ? 'text-blue-400' : ''}`}>{day}</span>
                            {event && (
                                <div className={`mt-1 p-1 rounded-md text-xs truncate ${event.color} text-white`}>
                                    {event.title}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Schedule;
