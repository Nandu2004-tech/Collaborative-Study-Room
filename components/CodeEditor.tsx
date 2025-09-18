import React from 'react';
import Icon from './Icon';

interface CodeEditorProps {
  code: string;
  onCodeChange: (newCode: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange }) => {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl h-full flex flex-col">
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Icon name="fa-file-code" className="text-blue-400"/>
          <span className="font-semibold">factorial.js</span>
        </div>
        <div className="flex items-center space-x-3">
          <select className="bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>JavaScript</option>
            <option>Python</option>
            <option>HTML</option>
          </select>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-lg transition-colors flex items-center space-x-2">
            <Icon name="fa-play" className="h-3 w-3" />
            <span>Run</span>
          </button>
        </div>
      </div>
      <div className="flex-1 p-1">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          spellCheck="false"
          className="w-full h-full bg-gray-900 text-gray-300 font-mono resize-none border-none focus:outline-none p-4 text-sm leading-relaxed"
          placeholder="Start coding here..."
        />
      </div>
    </div>
  );
};

export default CodeEditor;