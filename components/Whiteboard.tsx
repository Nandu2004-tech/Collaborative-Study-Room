import React, { useRef, useEffect, useState } from 'react';
import Icon from './Icon';

type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'text' | 'polygon';
const colors = ['#FFFFFF', '#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'];

const participants = [
    { name: 'Alex Ryder (You)', avatar: 'https://picsum.photos/40', isYou: true },
    { name: 'Dr. Anya Sharma', avatar: 'https://picsum.photos/seed/anya/40', isYou: false },
    { name: 'Ben Carter', avatar: 'https://picsum.photos/seed/ben/40', isYou: false },
];

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#FFFFFF');
  const [lineWidth, setLineWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [textInputValue, setTextInputValue] = useState('');

  const [polygonPoints, setPolygonPoints] = useState<{x: number, y: number}[]>([]);

  // Helper to convert hex color to rgba for opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = window.devicePixelRatio;
    canvas.width = canvas.offsetWidth * scale;
    canvas.height = canvas.offsetHeight * scale;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(scale, scale);
    contextRef.current = context;
    
    // Save initial blank state
    saveHistory();
  }, []);

  // Update context properties when tool/color/width/opacity changes
  useEffect(() => {
    const context = contextRef.current;
    if (!context) return;
    const strokeColor = hexToRgba(color, opacity);
    context.strokeStyle = strokeColor;
    context.fillStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.font = "16px sans-serif";
    context.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
  }, [color, lineWidth, tool, opacity]);

  const saveHistory = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const restoreHistory = (index: number) => {
      const context = contextRef.current;
      const canvas = canvasRef.current;
      if (!context || !canvas || index < 0 || index >= history.length) return;
      context.putImageData(history[index], 0, 0);
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreHistory(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreHistory(newIndex);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        saveHistory();
    }
  };
  
  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): {x: number, y: number} => {
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;
    
    const { x, y } = getMousePos(e);

    if (tool === 'text') {
        setTextInputPosition({ x, y });
        setIsTextInputVisible(true);
        return;
    }
    
    if (tool === 'polygon') {
      if (polygonPoints.length === 0) {
        setSnapshot(context.getImageData(0, 0, canvas.width, canvas.height));
      }
      const newPoints = [...polygonPoints, { x, y }];
      setPolygonPoints(newPoints);

      if (snapshot) context.putImageData(snapshot, 0, 0);
      context.beginPath();
      context.moveTo(newPoints[0].x, newPoints[0].y);
      newPoints.forEach(p => context.lineTo(p.x, p.y));
      context.stroke();
      return;
    }

    setIsDrawing(true);
    setStartPoint({ x, y });
    context.beginPath();
    context.moveTo(x, y);

    if (tool === 'pen' || tool === 'eraser') {
      context.lineTo(x, y);
      context.stroke();
    } else {
       setSnapshot(context.getImageData(0, 0, e.currentTarget.width, e.currentTarget.height));
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const context = contextRef.current;
    if (!context) return;

    if (tool === 'polygon' && polygonPoints.length > 0 && snapshot) {
      const { x, y } = getMousePos(e);
      context.putImageData(snapshot, 0, 0);
      
      context.beginPath();
      context.moveTo(polygonPoints[0].x, polygonPoints[0].y);
      polygonPoints.forEach(p => context.lineTo(p.x, p.y));
      context.lineTo(x, y);
      context.stroke();
      return;
    }
    
    if (!isDrawing) return;
    if (!snapshot && tool !== 'pen' && tool !== 'eraser') return;

    const { x, y } = getMousePos(e);

    if (snapshot) {
       context.putImageData(snapshot, 0, 0);
    }
    
    context.beginPath();
    switch(tool) {
        case 'pen':
        case 'eraser':
            context.lineTo(x, y);
            context.stroke();
            break;
        case 'rectangle':
            context.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
            break;
        case 'circle':
            const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
            context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
            break;
        case 'line':
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(x, y);
            break;
    }
    context.stroke();
  };

  const finishDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (tool !== 'polygon' && contextRef.current) {
        contextRef.current.closePath();
        saveHistory();
    }
    setSnapshot(null);
  };
  
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const context = contextRef.current;
    if (tool !== 'polygon' || polygonPoints.length < 2 || !context) return;
    e.preventDefault();
    if (snapshot) context.putImageData(snapshot, 0, 0);
    context.beginPath();
    context.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    polygonPoints.forEach(p => context.lineTo(p.x, p.y));
    context.closePath();
    context.stroke();
    setPolygonPoints([]);
    setSnapshot(null);
    saveHistory();
  };

  const handleTextSubmit = () => {
    const context = contextRef.current;
    if (context && textInputValue.trim() !== '') {
        context.fillText(textInputValue, textInputPosition.x, textInputPosition.y);
        saveHistory();
    }
    setTextInputValue('');
    setIsTextInputVisible(false);
  };
  
  const selectTool = (selectedTool: Tool) => {
    if (tool === 'polygon' && polygonPoints.length > 0) {
      if (snapshot) contextRef.current?.putImageData(snapshot, 0, 0);
      setPolygonPoints([]);
      setSnapshot(null);
    }
    setTool(selectedTool);
  };
  
  const ToolbarButton = ({ currentTool, name, icon, onClick }: { currentTool: Tool, name: Tool, icon: string, onClick: () => void }) => (
      <button 
        title={name.charAt(0).toUpperCase() + name.slice(1)}
        onClick={onClick} 
        className={`p-2 rounded-lg w-full ${currentTool === name ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
      >
        <Icon name={icon} className="h-5 w-5"/>
      </button>
  );

  return (
    <div className="flex h-full bg-gray-900 rounded-lg border border-gray-700 shadow-xl overflow-hidden">
        {/* Toolbar */}
        <aside className="w-16 bg-gray-800 p-2 flex flex-col items-center space-y-2 border-r border-gray-700">
            <ToolbarButton currentTool={tool} name="pen" icon="fa-pencil" onClick={() => selectTool('pen')} />
            <ToolbarButton currentTool={tool} name="text" icon="fa-font" onClick={() => selectTool('text')} />
            <ToolbarButton currentTool={tool} name="line" icon="fa-minus" onClick={() => selectTool('line')} />
            <ToolbarButton currentTool={tool} name="rectangle" icon="fa-square" onClick={() => selectTool('rectangle')} />
            <ToolbarButton currentTool={tool} name="circle" icon="fa-circle" onClick={() => selectTool('circle')} />
            <ToolbarButton currentTool={tool} name="polygon" icon="fa-draw-polygon" onClick={() => selectTool('polygon')} />
            <ToolbarButton currentTool={tool} name="eraser" icon="fa-eraser" onClick={() => selectTool('eraser')} />
            
            <div className="border-t border-gray-600 w-full my-2"></div>
            
            <div className="flex flex-wrap gap-1 justify-center">
                {colors.map(c => (
                    <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-5 h-5 rounded-full cursor-pointer ${color === c ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`}></button>
                ))}
            </div>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 bg-transparent border-none cursor-pointer mt-1" />
            
            <div className="border-t border-gray-600 w-full my-2"></div>

            <div className="w-full px-1 space-y-3 text-center">
                <div className="w-full">
                    <label className="text-xs text-gray-400">Thickness</label>
                    <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="w-full">
                    <label className="text-xs text-gray-400">Opacity</label>
                    <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                </div>
            </div>
            
            <div className="border-t border-gray-600 w-full my-2"></div>
            
            <button title="Undo" onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 rounded-lg w-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon name="fa-rotate-left" className="h-5 w-5"/>
            </button>
            <button title="Redo" onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 rounded-lg w-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon name="fa-rotate-right" className="h-5 w-5"/>
            </button>
            <button title="Clear All" onClick={clearCanvas} className="p-2 rounded-lg w-full hover:bg-gray-700">
                <Icon name="fa-trash" className="h-5 w-5 text-red-500"/>
            </button>
            <button title="Export PNG" onClick={exportCanvas} className="p-2 rounded-lg w-full hover:bg-gray-700">
                <Icon name="fa-download" className="h-5 w-5 text-green-500"/>
            </button>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 p-2 bg-gray-900/50 relative">
         <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseOut={finishDrawing}
            onMouseMove={draw}
            onDoubleClick={handleDoubleClick}
            className="w-full h-full bg-white rounded-md cursor-crosshair"
        />
        {isTextInputVisible && (
            <input
                type="text"
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                onBlur={handleTextSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                autoFocus
                style={{
                    position: 'absolute',
                    left: `${textInputPosition.x}px`,
                    top: `${textInputPosition.y}px`,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #3B82F6',
                    color: '#000',
                    padding: '4px',
                    borderRadius: '4px',
                    outline: 'none',
                    font: '16px sans-serif',
                }}
            />
        )}
        </main>

        {/* Participants Panel */}
        <aside className="w-48 bg-gray-800 border-l border-gray-700 p-3 hidden sm:block">
            <h3 className="font-semibold mb-4 text-white">Participants ({participants.length})</h3>
            <ul className="space-y-3">
                {participants.map((p, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <img src={p.avatar} alt={p.name} className={`h-8 w-8 rounded-full ${p.isYou ? 'ring-2 ring-blue-500' : ''}`} />
                        <span className={`text-sm ${p.isYou ? 'text-gray-300' : 'text-gray-400'}`}>{p.name}</span>
                    </li>
                ))}
            </ul>
        </aside>
    </div>
  );
};

export default Whiteboard;