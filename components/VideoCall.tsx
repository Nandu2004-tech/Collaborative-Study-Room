import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

const initialParticipants = [
  { name: 'Alex Ryder (You)', avatar: 'https://i.pravatar.cc/300?u=alex', isMuted: false, isSpeaking: false },
  { name: 'Dr. Anya Sharma', avatar: 'https://i.pravatar.cc/300?u=anya', isMuted: false, isSpeaking: true },
  { name: 'Ben Carter', avatar: 'https://i.pravatar.cc/300?u=ben', isMuted: true, isSpeaking: false },
  { name: 'Chloe Davis', avatar: 'https://i.pravatar.cc/300?u=chloe', isMuted: false, isSpeaking: false },
];

const VideoCall: React.FC = () => {
  const [participants, setParticipants] = useState(initialParticipants);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Get user media
  useEffect(() => {
    let stream: MediaStream | null = null;
    const getMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (err) {
        console.error("Error accessing media devices.", err);
        setError("Camera and microphone access denied. Please enable permissions in your browser settings to join the call.");
      }
    };

    getMedia();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // Attach stream to video element
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  
  // Simulate other speakers
  useEffect(() => {
    const speakerInterval = setInterval(() => {
      setParticipants(currentParticipants => {
        const nonUserParticipants = currentParticipants.slice(1);
        if (nonUserParticipants.length === 0) return currentParticipants;
        const currentSpeakerIndex = nonUserParticipants.findIndex(p => p.isSpeaking);
        const nextSpeakerIndex = (currentSpeakerIndex + 1) % nonUserParticipants.length;
        
        return currentParticipants.map((p, index) => {
            if (index === 0) return { ...p, isSpeaking: false };
            return { ...p, isSpeaking: index - 1 === nextSpeakerIndex };
        });
      });
    }, 2500);

    return () => clearInterval(speakerInterval);
  }, []);
  
  // Update participant list with local mute status
   useEffect(() => {
    setParticipants(prev =>
      prev.map((p, index) => (index === 0 ? { ...p, isMuted } : p))
    );
  }, [isMuted]);

  const handleToggleMute = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(prev => !prev);
  };

  const handleToggleCamera = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsCameraOff(prev => !prev);
  };

  const handleEndCall = () => {
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setCallEnded(true);
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-xl h-full flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4">Live Session</h2>
      {error && !callEnded && (
        <div className="bg-red-900/50 text-red-400 p-3 rounded-md mb-4 text-sm" role="alert">
          {error}
        </div>
      )}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {participants.map((p, index) => (
          <div key={p.name} className="relative rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
            {index === 0 ? ( // Local User
                callEnded ? (
                    <div className="text-center">
                        <Icon name="fa-phone-slash" className="h-8 w-8 text-gray-500 mb-2"/>
                        <p className="font-semibold">You left the call.</p>
                    </div>
                ) : localStream && !isCameraOff ? (
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover"/>
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      {error ? <Icon name="fa-video-slash" className="h-8 w-8 text-red-400"/> : <img src={p.avatar} alt={p.name} className="w-20 h-20 rounded-full"/>}
                    </div>
                )
            ) : ( // Remote Participants
              <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
            )}
            
            {!callEnded || index !== 0 ? (
                <>
                    <div className={`absolute inset-0 border-2 ${p.isSpeaking ? 'border-green-500' : 'border-transparent'} rounded-lg transition-all duration-300 pointer-events-none`}></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <span className="text-white text-sm font-medium truncate">{p.name}</span>
                    </div>
                    {p.isMuted && (
                    <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full">
                        <Icon name="fa-microphone-slash" className="h-4 w-4 text-white" />
                    </div>
                    )}
                </>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-center items-center space-x-4">
        <button 
            onClick={handleToggleMute}
            disabled={callEnded || !!error}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`} 
            aria-label="Toggle Microphone"
        >
          <Icon name={isMuted ? "fa-microphone-slash" : "fa-microphone"} className="h-5 w-5" />
        </button>
        <button 
            onClick={handleToggleCamera}
            disabled={callEnded || !!error}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed ${isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`} 
            aria-label="Toggle Camera"
        >
          <Icon name={isCameraOff ? "fa-video-slash" : "fa-video"} className="h-5 w-5" />
        </button>
        <button 
            onClick={handleEndCall}
            disabled={callEnded}
            className="bg-red-600 hover:bg-red-700 text-white w-16 h-12 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:bg-gray-700" 
            aria-label="End Call"
        >
          <Icon name="fa-phone-slash" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
