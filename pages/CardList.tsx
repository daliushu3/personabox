
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

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这张名片吗？')) {
      deleteCard(id);
      setCards(getCards());
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300">
      <header className="sticky top-0 z-20 bg-[#0a0c10]/95 backdrop-blur-lg border-b border-blue-500/20 px-4 md:px-8 py-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between md:justify-start gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-slate-500 hover:text-blue-400 font-orbitron">{"<< HOME"}</button>
            <div className="h-4 w-px bg-slate-800"></div>
            <h2 className="font-orbitron tracking-widest text-sm md:text-lg text-slate-100 uppercase">Archives</h2>
          </div>
          <span className="text-[10px] font-orbitron bg-blue-900/30 text-blue-400 px-2 py-0.5 border border-blue-500/20 rounded">
            COUNT: {cards.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end">
          <div className="flex bg-slate-900 rounded border border-slate-800 p-0.5 font-orbitron text-[9px]">
            <button 
              onClick={() => setViewMode('name-only')}
              className={`px-3 py-1 transition-all ${viewMode === 'name-only' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              LABELS
            </button>
            <button 
              onClick={() => setViewMode('name-photo')}
              className={`px-3 py-1 transition-all ${viewMode === 'name-photo' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              FILES
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExport} className="text-[9px] font-orbitron border border-slate-700 px-2 py-1.5 hover:border-blue-500 transition-colors">EXP</button>
            <label className="text-[9px] font-orbitron border border-slate-700 px-2 py-1.5 hover:border-blue-500 transition-colors cursor-pointer">
              IMP
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button 
              onClick={() => navigate('/add')}
              className="text-[9px] font-orbitron bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-500 transition-colors"
            >
              + NEW
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-10 max-w-7xl mx-auto">
        {cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] font-orbitron text-slate-700 space-y-4">
            <div className="text-4xl md:text-6xl opacity-20">NULL_ARCHIVE</div>
            <button onClick={() => navigate('/add')} className="px-6 py-2 border border-slate-700 text-[10px] hover:border-blue-500 transition-colors">INITIALIZE_ENTRY</button>
          </div>
        ) : (
          <div className={viewMode === 'name-only' 
            ? "flex flex-wrap gap-3 justify-center md:justify-start" 
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
          }>
            {cards.map((card) => (
              viewMode === 'name-only' ? (
                /* Archive Label Style */
                <div 
                  key={card.id}
                  onClick={() => navigate(`/detail/${card.id}`)}
                  className="group relative h-10 flex items-center bg-slate-900 border-l-2 border-blue-500 px-4 cursor-pointer hover:bg-blue-900/20 transition-all w-full sm:w-auto min-w-[120px]"
                >
                  <div className="absolute -top-2 left-0 bg-blue-600 text-[6px] font-orbitron px-1.5 py-0.5 text-white">ID-{card.id.slice(0,4)}</div>
                  <span className="text-xs font-light tracking-widest text-slate-100 truncate">{card.name}</span>
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
                      <div className="w-full h-full flex items-center justify-center font-orbitron text-[8px] text-slate-700">NO_IMG</div>
                    )}
                    <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
                  </div>
                  <div className="p-2 md:p-3 border-t border-slate-800 bg-slate-950/80">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 truncate">
                        <div className="text-[7px] font-orbitron text-blue-500 mb-0.5">SUBJECT</div>
                        <div className="text-[11px] md:text-sm font-bold tracking-wider text-slate-100 truncate">{card.name}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(card.id, e); }} className="text-xs text-slate-700 hover:text-red-500 ml-2">×</button>
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
