import React from 'react';
import { Resource } from '../types';
import Icon from './Icon';

interface ResourceLibraryProps {
  resources: Resource[];
  onAddResource: () => void;
  onDeleteResource: (id: number) => void;
}

const getFileIcon = (type: Resource['type']) => {
  switch (type) {
    case 'PDF':
      return { icon: 'fa-file-pdf', color: 'text-red-500' };
    case 'Image':
      return { icon: 'fa-file-image', color: 'text-green-500' };
    case 'Document':
      return { icon: 'fa-file-word', color: 'text-blue-500' };
    default:
      return { icon: 'fa-file', color: 'text-gray-500' };
  }
};

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ resources, onAddResource, onDeleteResource }) => {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shared Resources</h2>
        <button
          onClick={onAddResource}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Icon name="fa-upload" className="h-4 w-4" />
          <span>Upload File</span>
        </button>
      </div>

      {resources.length > 0 ? (
        <div className="space-y-3">
          {resources.map((res) => {
            const fileIcon = getFileIcon(res.type);
            return (
              <div key={res.id} className="bg-gray-900 p-4 rounded-lg flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center space-x-4 flex-1 min-w-[200px]">
                  <Icon name={fileIcon.icon} className={`h-8 w-8 ${fileIcon.color}`} />
                  <div>
                    <h3 className="font-semibold truncate" title={res.name}>{res.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <img src={res.avatar} alt={res.uploader} className="h-5 w-5 rounded-full"/>
                        <span>{res.uploader} &middot; {res.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-green-600/20 hover:bg-green-600/40 text-green-400 font-semibold py-2 px-3 rounded-lg text-sm transition-colors flex items-center space-x-1.5">
                     <Icon name="fa-download" className="h-4 w-4" />
                     <span>Download</span>
                  </button>
                  <button 
                    onClick={() => onDeleteResource(res.id)}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 font-semibold py-2 px-3 rounded-lg text-sm transition-colors flex items-center space-x-1.5"
                  >
                     <Icon name="fa-trash" className="h-4 w-4" />
                     <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
          <Icon name="fa-folder-open" className="h-16 w-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold">No Resources Shared</h3>
          <p className="text-gray-400 mt-2">Upload a file to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
