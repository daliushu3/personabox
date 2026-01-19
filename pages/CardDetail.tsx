
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCards } from '../utils/storage';

const CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cards = getCards();
  const card = cards.find(c => c.id === id);

  if (!card) return <div className="text-blue-500 font-orbitron p-20 flex justify-center items-center h-screen">SYSTEM_ERROR: ENTRY_NOT_FOUND</div>;

  const handleCopyMarkdown = () => {
    const md = `
# 角色档案: ${card.name}

## 基础信息
- **性别**: ${card.gender || '未知'}
- **生日**: ${card.birthday || '未知'}
- **身高**: ${card.height || '未知'}
- **体重**: ${card.weight || '未知'}
- **瞳色**: ${card.eyeColor || '未知'}
- **发型**: ${card.hairStyle || '未知'}

## 性格特点
${card.personality || '尚无记录'}

## 兴趣爱好
${card.hobbies || '尚无记录'}

## 其他备注
${card.others || '尚无记录'}
    `.trim();

    navigator.clipboard.writeText(md).then(() => {
      alert('已按Markdown格式复制到剪贴板');
    });
  };

  const labelClass = "text-[9px] md:text-[10px] font-orbitron text-blue-500 tracking-[0.2em] uppercase block mb-1";
  const dataClass = "text-base md:text-xl font-orbitron text-slate-100";

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 md:p-12 overflow-y-auto">
      <div className="max-w-5xl w-full tech-border tech-border-tl tech-border-tr tech-border-bl tech-border-br bg-slate-900/50 backdrop-blur-2xl p-0.5 relative overflow-hidden">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '20px 20px'}}></div>
        
        <div className="bg-slate-950/90 p-5 md:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-blue-500/20 pb-6">
            <div className="w-full md:w-auto">
              <div className="text-[9px] font-orbitron text-blue-400 mb-1 tracking-[0.4em]">CHARACTER_ARCHIVE_FILE</div>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-100 tracking-tighter uppercase break-words">{card.name}</h1>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button onClick={handleCopyMarkdown} className="flex-1 md:flex-none px-3 py-2 border border-blue-500/30 text-blue-400 text-[9px] font-orbitron hover:bg-blue-600 hover:text-white transition-all">COPY_MD</button>
              <button onClick={() => navigate(`/edit/${card.id}`)} className="flex-1 md:flex-none px-3 py-2 border border-slate-700 text-slate-400 text-[9px] font-orbitron hover:border-blue-500 hover:text-blue-400 transition-all">EDIT</button>
              <button onClick={() => navigate('/list')} className="flex-1 md:flex-none px-3 py-2 bg-slate-800 text-slate-300 text-[9px] font-orbitron hover:bg-slate-700 transition-all">CLOSE</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Upper Section */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[240px] md:max-w-none aspect-[3/4] bg-slate-900 tech-border tech-border-tl tech-border-br shadow-2xl overflow-hidden group self-start">
                {card.photo ? (
                  <img src={card.photo} alt={card.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-orbitron text-slate-800 text-[10px]">NO_DATA</div>
                )}
                <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 bg-blue-600/80 text-[7px] font-orbitron px-1.5 py-0.5 text-white">RECOGNITION_ON</div>
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:gap-x-12 border-l-2 border-blue-500/20 pl-4 md:pl-8">
                <div>
                  <span className={labelClass}>Gender</span>
                  <p className={dataClass}>{card.gender || 'N/A'}</p>
                </div>
                <div>
                  <span className={labelClass}>Birthday</span>
                  <p className={dataClass}>{card.birthday || 'N/A'}</p>
                </div>
                <div>
                  <span className={labelClass}>Height</span>
                  <p className={dataClass}>{card.height || 'N/A'}</p>
                </div>
                <div>
                  <span className={labelClass}>Weight</span>
                  <p className={dataClass}>{card.weight || 'N/A'}</p>
                </div>
                <div>
                  <span className={labelClass}>Eye Color</span>
                  <p className={dataClass}>{card.eyeColor || 'N/A'}</p>
                </div>
                <div>
                  <span className={labelClass}>Hair Style</span>
                  <p className={dataClass}>{card.hairStyle || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="p-4 md:p-6 border border-slate-800 bg-slate-900/30">
                <span className={labelClass}>Psychological Profile</span>
                <p className="text-slate-400 font-light text-sm leading-relaxed whitespace-pre-wrap">{card.personality || '尚无记录'}</p>
              </div>
              <div className="p-4 md:p-6 border border-slate-800 bg-slate-900/30">
                <span className={labelClass}>Interest Parameters</span>
                <p className="text-slate-400 font-light text-sm leading-relaxed whitespace-pre-wrap">{card.hobbies || '尚无记录'}</p>
              </div>
              <div className="md:col-span-2 p-4 md:p-6 border border-slate-800 bg-slate-900/30">
                <span className={labelClass}>Logs</span>
                <p className="text-slate-400 font-light text-sm leading-relaxed whitespace-pre-wrap italic">{card.others || '尚无进一步记录。'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between items-center text-[7px] font-orbitron text-slate-700 tracking-widest overflow-hidden">
            <span className="truncate">CLOCK: {new Date().toISOString()}</span>
            <span className="hidden sm:inline">// END_OF_FILE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
