
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCards, exportCards, importCards, deleteCard } from '../utils/storage';
import { CharacterCard, ViewMode } from '../types';

const CardList: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CharacterCard[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('name-photo');

  useEffect(() => {
    setCards(getCards());
  }, []);

  const handleExport = () => {
    const data = exportCards();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archive_vault_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (importCards(result)) {
          setCards(getCards());
          alert('数据导入成功');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300">
      <header className="sticky top-0 z-20 bg-[#0a0c10]/90 backdrop-blur-lg border-b border-blue-500/20 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Wrap text with special characters in braces to avoid JSX parser issues */}
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-blue-400 font-orbitron">{"<< HOME"}</button>
          <div className="h-6 w-px bg-slate-800"></div>
          <h2 className="font-orbitron tracking-[0.2em] text-lg text-slate-100 uppercase">Archive_System.v2</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-slate-900 rounded-sm border border-slate-800 p-0.5 font-orbitron text-[10px]">
            <button 
              onClick={() => setViewMode('name-only')}
              className={`px-3 py-1 uppercase transition-all ${viewMode === 'name-only' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Labels
            </button>
            <button 
              onClick={() => setViewMode('name-photo')}
              className={`px-3 py-1 uppercase transition-all ${viewMode === 'name-photo' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Files
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} className="text-[10px] font-orbitron border border-slate-700 px-3 py-1 hover:border-blue-500 transition-colors">EXP_JSON</button>
            <label className="text-[10px] font-orbitron border border-slate-700 px-3 py-1 hover:border-blue-500 transition-colors cursor-pointer">
              IMP_JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      <main className="p-10 max-w-7xl mx-auto">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] font-orbitron text-slate-700 space-y-4">
            <div className="text-6xl opacity-20">NULL_POINTER</div>
            <button onClick={() => navigate('/add')} className="px-6 py-2 border border-slate-700 text-xs hover:border-blue-500 transition-colors">INITIATE_NEW_ENTRY</button>
          </div>
        ) : (
          <div className={viewMode === 'name-only' 
            ? "flex flex-wrap gap-4" 
            : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          }>
            {cards.map((card) => (
              viewMode === 'name-only' ? (
                /* Archive Label Style */
                <div 
                  key={card.id}
                  onClick={() => navigate(`/detail/${card.id}`)}
                  className="group relative h-12 flex items-center bg-slate-900 border-l-4 border-blue-500 px-6 cursor-pointer hover:bg-blue-900/20 transition-all"
                >
                  <div className="absolute -top-3 left-0 bg-blue-600 text-[8px] font-orbitron px-2 py-0.5 text-white">ID-{card.id.slice(0,4)}</div>
                  <span className="font-light tracking-[0.2em] text-slate-100">{card.name}</span>
                  <div className="absolute right-2 text-[8px] opacity-0 group-hover:opacity-40 transition-opacity font-orbitron">{"READ_DATA >>"}</div>
                </div>
              ) : (
                /* Student File Style */
                <div 
                  key={card.id}
                  onClick={() => navigate(`/detail/${card.id}`)}
                  className="group tech-border tech-border-tl tech-border-br bg-slate-900/30 overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all"
                >
                  <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                    {card.photo ? (
                      <img src={card.photo} alt={card.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-orbitron text-[10px] text-slate-700">NO_IMG</div>
                    )}
                    <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
                  </div>
                  <div className="p-3 border-t border-slate-800 bg-slate-950/80">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[8px] font-orbitron text-blue-500 mb-0.5">SUBJECT_NAME</div>
                        <div className="text-sm font-bold tracking-wider text-slate-100 truncate">{card.name}</div>
                      </div>
                      <div className="text-[8px] font-orbitron text-slate-600">{card.gender || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CardList;
