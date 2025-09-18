import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, TaskPriority, User } from '../types';
import Icon from './Icon';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'status'>) => void;
  onUpdateTaskStatus: (taskId: number, newStatus: TaskStatus) => void;
  currentUser: User;
}

const staticParticipants = [
  { name: 'Dr. Anya Sharma', avatar: 'https://picsum.photos/seed/anya/40' },
  { name: 'Ben Carter', avatar: 'https://picsum.photos/seed/ben/40' },
  { name: 'Chloe Davis', avatar: 'https://picsum.photos/seed/chloe/40' },
];

const priorityConfig = {
    high: { label: 'High', color: 'bg-red-500', icon: 'fa-flag' },
    medium: { label: 'Medium', color: 'bg-yellow-500', icon: 'fa-flag' },
    low: { label: 'Low', color: 'bg-green-500', icon: 'fa-flag' },
};

const AddTaskModal: React.FC<{ onSave: (task: Omit<Task, 'id' | 'status'>) => void; onClose: () => void; participants: User[] }> = ({ onSave, onClose, participants }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignee, setAssignee] = useState(participants[0]);
    const [priority, setPriority] = useState<TaskPriority>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({ title, description, assignee, priority });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl w-full max-w-lg animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Add New Task</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700"><Icon name="fa-xmark" /></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <main className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="assignee" className="block text-sm font-medium text-gray-400 mb-1">Assignee</label>
                                <select id="assignee" value={assignee.name} onChange={e => setAssignee(participants.find(p => p.name === e.target.value)!)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    {participants.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                                <select id="priority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                    </main>
                    <footer className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-600 hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white">Add Task</button>
                    </footer>
                </form>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const priority = priorityConfig[task.priority];
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id.toString());
    };

    return (
        <div 
            draggable
            onDragStart={handleDragStart}
            className="bg-gray-800 p-3 rounded-lg border border-gray-700 cursor-grab active:cursor-grabbing"
        >
            <h4 className="font-semibold text-sm mb-2">{task.title}</h4>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className={`w-5 h-5 flex items-center justify-center rounded-sm ${priority.color}`}>
                        <Icon name={priority.icon} className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-400">{priority.label}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded-full ring-2 ring-gray-700" />
                </div>
            </div>
        </div>
    );
};

// FIX: Update onDrop prop to accept the DragEvent to avoid using window.event
const TaskColumn: React.FC<{ title: string; status: TaskStatus; tasks: Task[]; onDrop: (e: React.DragEvent<HTMLDivElement>) => void }> = ({ title, status, tasks, onDrop }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => setIsOver(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        // FIX: Pass the event object to the onDrop handler.
        onDrop(e);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 bg-gray-900/50 p-3 rounded-lg transition-colors ${isOver ? 'bg-blue-900/50' : ''}`}
        >
            <h3 className="font-bold mb-4 px-2 text-gray-300 flex justify-between items-center">
                <span>{title}</span>
                <span className="text-sm bg-gray-700 text-gray-400 rounded-full px-2 py-0.5">{tasks.length}</span>
            </h3>
            <div className="space-y-3 h-full overflow-y-auto">
                {tasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
        </div>
    );
};

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onAddTask, onUpdateTaskStatus, currentUser }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const participants = useMemo(() => [currentUser, ...staticParticipants], [currentUser]);

  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'inprogress' },
    { title: 'Done', status: 'done' },
  ];

  const handleDrop = (status: TaskStatus) => (e: React.DragEvent<HTMLDivElement>) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
    if (taskId) {
        onUpdateTaskStatus(taskId, status);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Task Board</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Icon name="fa-plus" className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
        <div className="flex-1 flex gap-6 overflow-x-auto">
          {columns.map(col => (
            <TaskColumn
              key={col.status}
              title={col.title}
              status={col.status}
              tasks={tasks.filter(t => t.status === col.status)}
              // FIX: Use the handleDrop handler which correctly captures the column status and receives the event.
              onDrop={handleDrop(col.status)}
            />
          ))}
        </div>
      </div>
      {showAddModal && <AddTaskModal onSave={onAddTask} onClose={() => setShowAddModal(false)} participants={participants} />}
    </>
  );
};

export default TaskManager;