export interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
  reactions: { [key: string]: number };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export interface CalendarEvent {
  day: number;
  title: string;
  color: string;
}

export interface Recording {
  id: number;
  title: string;
  date: string;
  duration: string;
}

export interface SessionSettings {
  muteOnJoin: boolean;
  autoRecord: boolean;
  maxParticipants: number;
}

export interface Resource {
  id: number;
  name: string;
  type: 'PDF' | 'Image' | 'Document';
  size: string;
  uploader: string;
  avatar: string;
}

export type TaskStatus = 'todo' | 'inprogress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatar: string;
  };
  priority: TaskPriority;
  status: TaskStatus;
}

export interface User {
    name: string;
    avatar: string;
}