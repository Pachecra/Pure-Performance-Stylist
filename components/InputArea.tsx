import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Sparkles, Activity, Ruler, Palette, ChevronDown } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string, image?: string) => void;
  disabled: boolean;
}

type ToolMode = 'none' | 'fit' | 'style';
type Stature = 'Schmal' | 'Athletisch' | 'Kräftig';
type Fit = 'Kompression' | 'Komfort';

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolMode>('none');
  
  // Fit Tool State
  const [height, setHeight] = useState(165);
  const [stature, setStature] = useState<Stature>('Athletisch');
  const [fitPreference, setFitPreference] = useState<Fit>('Kompression');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if ((!text.trim() && !selectedImage) || disabled) return;
    onSend(text, selectedImage || undefined);
    setText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitFitData = () => {
    const dataString = `[AUTO-DATA] User Stats: Height: ${height}cm, Stature: ${stature}, Fit: ${fitPreference}. Bitte berechne meine Pure-Größe und empfiehl einen Schnitt.`;
    onSend(dataString);
    setActiveTool('none');
  };

  const submitColorChoice = (colorName: string, hex: string) => {
    const dataString = `[AUTO-DATA] Color Preference: ${colorName}. Bitte zeige Sets in dieser Farbe oder passenden Kombinationen.`;
    onSend(dataString);
    setActiveTool('none');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl pb-6 pt-2 px-4 sticky bottom-0 z-20 border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        
        {/* --- SMART TOOLS AREA --- */}
        
        {/* Tool Toggles (Tabs) */}
        {!selectedImage && activeTool === 'none' && !text && (
            <div className="flex gap-2 pb-1 justify-center sm:justify-start">
                <button 
                    onClick={() => setActiveTool('fit')}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                >
                    <Ruler size={14} className="group-hover:stroke-white text-gray-400 group-hover:text-white transition-colors" />
                    FIT CALCULATOR
                </button>
                <button 
                    onClick={() => setActiveTool('style')}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                >
                    <Palette size={14} className="group-hover:stroke-white text-gray-400 group-hover:text-white transition-colors" />
                    COLOR MATCH
                </button>
            </div>
        )}

        {/* TOOL 1: FIT CALCULATOR UI */}
        {activeTool === 'fit' && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 animate-fade-in-up shadow-inner relative">
                <button onClick={() => setActiveTool('none')} className="absolute top-3 right-3 text-gray-400 hover:text-black"><X size={16}/></button>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <Activity size={12} /> Body Analysis
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Height Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold text-brand-black">
                            <span>Körpergröße</span>
                            <span className="text-brand-accent">{height} cm</span>
                        </div>
                        <input 
                            type="range" min="140" max="190" value={height} 
                            onChange={(e) => setHeight(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-black"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            <span>140cm</span>
                            <span>190cm</span>
                        </div>
                    </div>

                    {/* Stature Selection */}
                    <div className="space-y-2">
                        <span className="text-sm font-bold text-brand-black">Statur</span>
                        <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200">
                            {(['Schmal', 'Athletisch', 'Kräftig'] as Stature[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStature(s)}
                                    className={`flex-1 py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-all ${stature === s ? 'bg-brand-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={submitFitData}
                        className="bg-brand-black text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 flex items-center gap-2"
                    >
                        Größe Berechnen <Ruler size={12} />
                    </button>
                </div>
            </div>
        )}

        {/* TOOL 2: COLOR PICKER UI */}
        {activeTool === 'style' && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 animate-fade-in-up shadow-inner relative">
                 <button onClick={() => setActiveTool('none')} className="absolute top-3 right-3 text-gray-400 hover:text-black"><X size={16}/></button>
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <Sparkles size={12} /> Select Preference
                </h3>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {[
                        { name: 'Midnight', hex: '#000000' },
                        { name: 'Titanium', hex: '#3b82f6' },
                        { name: 'Magenta', hex: '#d946ef' },
                        { name: 'Ice', hex: '#e2e8f0' },
                        { name: 'Emerald', hex: '#10b981' },
                        { name: 'Ruby', hex: '#ef4444' },
                    ].map((color) => (
                        <button
                            key={color.name}
                            onClick={() => submitColorChoice(color.name, color.hex)}
                            className="group flex flex-col items-center gap-2"
                        >
                            <div 
                                className="w-10 h-10 rounded-full shadow-sm border-2 border-white ring-1 ring-gray-100 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-[9px] font-bold uppercase text-gray-500 group-hover:text-brand-black">{color.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* --- STANDARD INPUT --- */}

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative w-fit animate-fade-in-up">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="h-16 w-auto rounded-md border border-gray-200 shadow-sm" 
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
            >
              <X size={10} />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="flex items-end gap-2 bg-white rounded-2xl p-1.5 border-2 border-gray-100 focus-within:border-brand-black transition-colors shadow-sm">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-black transition-colors rounded-xl hover:bg-gray-50 disabled:opacity-50"
            disabled={disabled}
            title="Upload photo"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeTool !== 'none' ? "Benutze das Tool oben..." : "Beschreibe deinen Wunsch..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-brand-black placeholder-gray-400 resize-none max-h-32 min-h-[44px] py-3 text-sm scrollbar-hide font-medium"
            rows={1}
            disabled={disabled}
          />

          <button
            onClick={handleSend}
            disabled={disabled || (!text.trim() && !selectedImage)}
            className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
              !text.trim() && !selectedImage
                ? 'bg-gray-100 text-gray-300'
                : 'bg-brand-black text-white hover:bg-brand-accent shadow-md hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};