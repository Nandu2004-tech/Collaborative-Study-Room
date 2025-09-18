import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import Whiteboard from './components/Whiteboard';
import Quiz from './components/Quiz';
import Flashcards from './components/Flashcards';
import Schedule from './components/Schedule';
import PomodoroTimer from './components/PomodoroTimer';
import AdminPanel from './components/AdminPanel';
import Icon from './components/Icon';
import VideoCall from './components/VideoCall';
import CodeEditor from './components/CodeEditor';
import Recordings from './components/Recordings';
import Player from './components/Player';
import SettingsModal from './components/SettingsModal';
import ResourceLibrary from './components/ResourceLibrary';
import TaskManager from './components/TaskManager';
import Registration from './components/Registration';
import { Recording, SessionSettings, Resource, Task, TaskStatus, User } from './types';

// Extend Feature type
type Feature = 'dashboard' | 'whiteboard' | 'quiz' | 'flashcards' | 'live-coding' | 'recordings' | 'resources' | 'tasks';

const sampleCode = `function factorial(n) {
  // Base case: if n is 0 or 1, the factorial is 1
  if (n === 0 || n === 1) {
    return 1;
  }
  
  // Recursive step: n * factorial of (n-1)
  return n * factorial(n - 1);
}

// Example usage:
const number = 5;
const result = factorial(number);
console.log(\`The factorial of \${number} is \${result}.\`);
`;

const App: React.FC = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
      name: 'Alex Ryder',
      avatar: 'https://picsum.photos/40'
  });

  const [activeFeature, setActiveFeature] = useState<Feature>('dashboard');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([
    { id: 1, title: 'Cellular Respiration Recap', date: 'October 26, 2023', duration: '45:12' }
  ]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);
  const [liveCode, setLiveCode] = useState(sampleCode);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sessionSettings, setSessionSettings] = useState<SessionSettings>({
    muteOnJoin: false,
    autoRecord: true,
    maxParticipants: 50,
  });

  useEffect(() => {
    // Initialize sample data that depends on the current user
    const initialResources: Resource[] = [
      { id: 1, name: 'Cellular Biology Notes.pdf', type: 'PDF', size: '2.5 MB', uploader: 'Dr. Anya Sharma', avatar: 'https://picsum.photos/seed/anya/40' },
      { id: 2, name: 'Krebs Cycle Diagram.png', type: 'Image', size: '800 KB', uploader: 'Ben Carter', avatar: 'https://picsum.photos/seed/ben/40' },
    ];

    const initialTasks: Task[] = [
      { id: 1, title: 'Outline Chapter 3', description: 'Create a detailed outline for the Cellular Respiration chapter.', assignee: { name: currentUser.name, avatar: currentUser.avatar }, priority: 'high', status: 'inprogress' },
      { id: 2, title: 'Research Photosynthesis', description: 'Gather sources and key facts about the process of photosynthesis.', assignee: { name: 'Ben Carter', avatar: 'https://picsum.photos/seed/ben/40' }, priority: 'medium', status: 'todo' },
      { id: 3, title: 'Prepare Quiz Questions', description: 'Draft 10 multiple-choice questions for the upcoming study session.', assignee: { name: 'Dr. Anya Sharma', avatar: 'https://picsum.photos/seed/anya/40' }, priority: 'medium', status: 'todo' },
      { id: 4, title: 'Finalize Presentation Slides', description: 'Complete the design and content for the group presentation.', assignee: { name: currentUser.name, avatar: currentUser.avatar }, priority: 'low', status: 'done' },
    ];
    
    setResources(initialResources);
    setTasks(initialTasks);
  }, [currentUser]);


  // Simulate real-time collaboration in the code editor
  useEffect(() => {
    let collaborationInterval: number | undefined;
    if (activeFeature === 'live-coding') {
      collaborationInterval = setInterval(() => {
        setLiveCode(prevCode => prevCode + `\n// Dr. Sharma added a comment just now.`);
      }, 5000);
    }
    return () => clearInterval(collaborationInterval);
  }, [activeFeature]);

  const handleRegister = (name: string) => {
    if (name.trim()) {
        setCurrentUser(prev => ({ ...prev, name: name.trim() }));
        setIsRegistered(true);
    }
  };
  
  const handleLogout = () => {
      setIsRegistered(false);
      setCurrentUser({ name: '', avatar: 'https://picsum.photos/40' });
  };

  const formatDuration = (start: Date, end: Date): string => {
      const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = () => {
    if (isRecording && recordingStartTime) {
      // Stop recording
      const newRecording: Recording = {
        id: recordings.length + 2,
        title: `Session Recording - ${new Date().toLocaleDateString()}`,
        date: new Date().toDateString(),
        duration: formatDuration(recordingStartTime, new Date()),
      };
      setRecordings(prev => [newRecording, ...prev]);
      setIsRecording(false);
      setRecordingStartTime(null);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingStartTime(new Date());
    }
  };
  
  const handleSaveSettings = (newSettings: SessionSettings) => {
    setSessionSettings(newSettings);
    setShowSettingsModal(false);
  };
  
  const handleAddResource = () => {
    const newResource: Resource = {
      id: Date.now(),
      name: 'New Study Guide.docx',
      type: 'Document',
      size: '1.2 MB',
      uploader: currentUser.name,
      avatar: currentUser.avatar,
    };
    setResources(prev => [newResource, ...prev]);
  };

  const handleDeleteResource = (id: number) => {
    setResources(prev => prev.filter(res => res.id !== id));
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      status: 'todo',
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'whiteboard':
        return <Whiteboard />;
      case 'quiz':
        return <Quiz />;
      case 'flashcards':
        return <Flashcards />;
      case 'tasks':
        return <TaskManager tasks={tasks} onAddTask={handleAddTask} onUpdateTaskStatus={handleUpdateTaskStatus} currentUser={currentUser} />;
      case 'resources':
        return <ResourceLibrary resources={resources} onAddResource={handleAddResource} onDeleteResource={handleDeleteResource} />;
      case 'recordings':
        return <Recordings recordings={recordings} onPlay={setPlayingRecording} />;
      case 'live-coding':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
            <div className="lg:col-span-1 h-full">
              <VideoCall />
            </div>
            <div className="lg:col-span-2 h-full">
              <CodeEditor code={liveCode} onCodeChange={setLiveCode} />
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Schedule />
            <div className="space-y-6">
              <PomodoroTimer />
              <AdminPanel settings={sessionSettings} />
            </div>
          </div>
        );
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: 'fa-table-columns', label: 'Dashboard' },
    { id: 'tasks', icon: 'fa-tasks', label: 'Tasks' },
    { id: 'whiteboard', icon: 'fa-chalkboard-user', label: 'Whiteboard' },
    { id: 'quiz', icon: 'fa-file-circle-question', label: 'Quiz' },
    { id: 'flashcards', icon: 'fa-layer-group', label: 'Flashcards' },
    { id: 'resources', icon: 'fa-folder-open', label: 'Resources' },
    { id: 'live-coding', icon: 'fa-code', label: 'Live Coding' },
    { id: 'recordings', icon: 'fa-video', label: 'Recordings' },
  ];

  if (!isRegistered) {
    return <Registration onRegister={handleRegister} />;
  }

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header
        user={currentUser}
        isRecording={isRecording}
        recordingStartTime={recordingStartTime}
        onToggleRecording={handleToggleRecording}
        onToggleMobileChat={() => setShowMobileChat(!showMobileChat)}
        onToggleSettings={() => setShowSettingsModal(true)}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-16 md:w-64 bg-gray-900 p-2 md:p-4 flex flex-col transition-all duration-300 shrink-0">
          <nav className="flex-1 space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveFeature(item.id as Feature)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeFeature === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon name={item.icon} className="h-6 w-6" />
                <span className="ml-4 hidden md:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-800">
          {renderFeature()}
        </main>
        
        {/* Desktop Chat */}
        <aside className="w-96 bg-gray-900 hidden lg:flex flex-col shrink-0">
          <Chat currentUser={currentUser} />
        </aside>
        
        {/* Mobile Chat Overlay */}
        {showMobileChat && (
          <div className="lg:hidden fixed inset-0 bg-black/60 z-20" onClick={() => setShowMobileChat(false)}>
              <aside 
                className="absolute right-0 top-0 h-full w-80 bg-gray-900 flex flex-col shadow-2xl animate-slide-in"
                onClick={e => e.stopPropagation()}
              >
                  <Chat currentUser={currentUser} />
              </aside>
          </div>
        )}
      </div>
      
      {playingRecording && (
        <Player recording={playingRecording} onClose={() => setPlayingRecording(null)} />
      )}
      
      {showSettingsModal && (
        <SettingsModal
            settings={sessionSettings}
            onSave={handleSaveSettings}
            onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Embedded styles for animations */}
      <style>{`
        @keyframes slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        .animate-slide-in {
            animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;