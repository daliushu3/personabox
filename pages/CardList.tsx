
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCards, exportCards, importCards, deleteCard } from '../utils/storage';
import { CharacterCard, ViewMode, SortType } from '../types';

const CardList: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CharacterCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('name-only');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchCards = async () => {
    setLoading(true);
    const data = await getCards();
    setCards(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    cards.forEach(c => (c.tags || []).forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [cards]);

  const filteredAndSortedCards = useMemo(() => {
    let result = [...cards];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        (c.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    if (selectedTag) {
      result = result.filter(c => (c.tags || []).includes(selectedTag));
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'alpha') return a.name.localeCompare(b.name, 'zh');
      return 0;
    });

    return result;
  }, [cards, searchQuery, sortBy, selectedTag]);

  const handleExport = async () => {
    const data = await exportCards();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archive_vault_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const result = ev.target?.result as string;
        const success = await importCards(result);
        if (success) {
          fetchCards();
          alert('数据同步成功');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要从数据库中抹除该档案吗？')) {
      await deleteCard(id);
      fetchCards();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300">
      <header className="sticky top-0 z-20 bg-[#0a0c10]/95 backdrop-blur-lg border-b border-blue-500/20 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="text-slate-500 hover:text-blue-400 font-orbitron">{"<< HOME"}</button>
              <div className="h-4 w-px bg-slate-800"></div>
              <h2 className="font-orbitron tracking-widest text-sm md:text-lg text-slate-100 uppercase">Vault_Index</h2>
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

          <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-2 border border-slate-800 rounded">
            <div className="flex-1 min-w-[150px] relative">
              <input 
                type="text" 
                placeholder="QUERY ARCHIVE..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-8 py-1.5 text-[10px] font-orbitron focus:outline-none focus:border-blue-500"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 text-[10px]">🔍</span>
            </div>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-[9px] font-orbitron text-slate-400 focus:outline-none focus:border-blue-500"
            >
              <option value="newest">TIMESTAMP_DESC</option>
              <option value="oldest">TIMESTAMP_ASC</option>
              <option value="alpha">ALPHA_SORT</option>
            </select>

            <div className="flex bg-slate-950 rounded border border-slate-800 p-0.5 font-orbitron text-[9px]">
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
          </div>

          {allTags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button 
                onClick={() => setSelectedTag(null)}
                className={`text-[8px] font-orbitron px-2 py-0.5 border rounded-full whitespace-nowrap transition-all ${!selectedTag ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-slate-800 text-slate-600 hover:border-slate-600'}`}
              >
                CLEAR_FILTER
              </button>
              {allTags.map(tag => (
                <button 
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`text-[8px] font-orbitron px-2 py-0.5 border rounded-full whitespace-nowrap transition-all ${selectedTag === tag ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-slate-800 text-slate-600 hover:border-slate-600'}`}
                >
                  {tag.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="p-4 md:p-10 max-w-7xl mx-auto min-h-[60vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[40vh] font-orbitron text-blue-500 animate-pulse">
            ACCESSING_REMOTE_STORAGE...
          </div>
        ) : filteredAndSortedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] font-orbitron text-slate-700 space-y-4">
            <div className="text-4xl md:text-6xl opacity-20">NULL_ARCHIVE</div>
          </div>
        ) : (
          <div className={viewMode === 'name-only' 
            ? "flex flex-wrap gap-3 justify-center md:justify-start" 
            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
          }>
            {filteredAndSortedCards.map((card) => (
              viewMode === 'name-only' ? (
                <div 
                  key={card.id}
                  onClick={() => navigate(`/detail/${card.id}`)}
                  className="group relative h-10 flex items-center bg-slate-900 border-l-2 border-blue-500 px-4 cursor-pointer hover:bg-blue-900/20 transition-all w-full sm:w-auto min-w-[140px]"
                >
                  <div className="absolute -top-2 left-0 bg-blue-600 text-[6px] font-orbitron px-1.5 py-0.5 text-white">REF_{card.id.slice(0,4)}</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-light tracking-widest text-slate-100 truncate">{card.name}</span>
                    <div className="flex gap-1">
                      {(card.tags || []).slice(0, 2).map(t => (
                        <span key={t} className="text-[6px] text-blue-500/60 uppercase">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  key={card.id}
                  onClick={() => navigate(`/detail/${card.id}`)}
                  className="group tech-border tech-border-tl tech-border-br bg-slate-900/30 overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all"
                >
                  <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden">
                    {card.photo ? (
                      <img src={card.photo} alt={card.name} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-orbitron text-[8px] text-slate-700">MISSING_VISUAL</div>
                    )}
                    <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
                  </div>
                  <div className="p-2 md:p-3 border-t border-slate-800 bg-slate-950/80">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 truncate">
                        <div className="text-[7px] font-orbitron text-blue-500 mb-0.5">IDENTIFIER</div>
                        <div className="text-[11px] md:text-sm font-bold tracking-wider text-slate-100 truncate">{card.name}</div>
                        <div className="flex gap-1 overflow-hidden h-3">
                          {(card.tags || []).map(t => (
                            <span key={t} className="text-[6px] text-slate-600 uppercase">#{t}</span>
                          ))}
                        </div>
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
