
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCardById, saveCard, getCards } from '../utils/storage';
import { CharacterCard } from '../types';

const AddEditCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Omit<CharacterCard, 'id' | 'createdAt'>>({
    name: '',
    photo: '',
    gender: '',
    birthday: '',
    height: '',
    weight: '',
    eyeColor: '',
    hairStyle: '',
    tags: [],
    personality: '',
    hobbies: '',
    others: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [allExistingTags, setAllExistingTags] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const cards = await getCards();
      const tags = new Set<string>();
      cards.forEach(c => (c.tags || []).forEach(t => tags.add(t)));
      setAllExistingTags(Array.from(tags).sort());

      if (id) {
        const card = await getCardById(id);
        if (card) {
          setFormData({
            name: card.name,
            photo: card.photo,
            gender: card.gender || '',
            birthday: card.birthday || '',
            height: card.height || '',
            weight: card.weight || '',
            eyeColor: card.eyeColor || '',
            hairStyle: card.hairStyle || '',
            tags: card.tags || [],
            personality: card.personality,
            hobbies: card.hobbies,
            others: card.others,
          });
          setTagInput((card.tags || []).join(', '));
        }
      }
      setLoading(false);
    };
    init();
  }, [id]);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string);
        setFormData(prev => ({ ...prev, photo: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAddTag = (tag: string) => {
    const currentTags = tagInput.split(/[，,]/).map(t => t.trim()).filter(t => t !== '');
    if (!currentTags.includes(tag)) {
      const newValue = tagInput.trim() 
        ? (tagInput.trim().endsWith(',') || tagInput.trim().endsWith('，') ? `${tagInput.trim()} ${tag}` : `${tagInput.trim()}, ${tag}`)
        : tag;
      setTagInput(newValue);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('请输入名字');
      return;
    }
    
    const finalTags = tagInput.split(/[，,]/).map(t => t.trim()).filter(t => t !== '');

    const newCard: CharacterCard = {
      id: id || crypto.randomUUID(),
      ...formData,
      tags: finalTags,
      createdAt: id ? (await getCardById(id))?.createdAt || Date.now() : Date.now(),
    };
    
    try {
      await saveCard(newCard);
      navigate('/list');
    } catch (e) {
      alert('存储过程发生异常，请检查浏览器设置。');
    }
  };

  const inputClass = "w-full bg-slate-900/50 border border-slate-700 rounded px-4 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm";
  const labelClass = "block text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1 font-orbitron";

  if (loading) return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center font-orbitron text-blue-500 animate-pulse tracking-widest">
      INITIALIZING_VAULT...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0c10] py-6 md:py-12 px-4">
      <div className="max-w-4xl mx-auto tech-border tech-border-tl tech-border-tr tech-border-bl tech-border-br bg-slate-900/40 p-0.5 backdrop-blur-md">
        <div className="bg-slate-950/80 p-5 md:p-8">
          <div className="flex justify-between items-center mb-8 border-b border-blue-500/20 pb-4">
            <h2 className="text-xl font-orbitron text-slate-100 tracking-widest">
              [ {id ? 'UPDATE_ARCHIVE' : 'NEW_ENTRY'} ]
            </h2>
            <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-400 text-[10px] font-orbitron transition-colors">
              {"<< RETURN"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-6">
              <div>
                <label className={labelClass}>Subject Name</label>
                <input 
                  type="text" 
                  placeholder="IDENTIFIER" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`${inputClass} font-bold text-base`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={labelClass}>Visual Data</label>
                <div className="relative aspect-[3/4] bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden group">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-700 font-orbitron text-[9px]">NO_DATA</div>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" title="点击上传图片" />
                </div>
                <div className="mt-2">
                  <label className="text-[8px] text-slate-500 uppercase block mb-1">External Link / Base64</label>
                  <input 
                    type="text" 
                    placeholder="HTTP://... OR DATA:IMAGE/..." 
                    value={formData.photo}
                    onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                    className={`${inputClass} text-[10px] py-1 opacity-70 focus:opacity-100`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Tags</label>
                <input 
                  type="text" 
                  placeholder="TAG1, TAG2..." 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className={inputClass}
                />
                
                {allExistingTags.length > 0 && (
                  <div className="mt-3">
                    <label className="text-[8px] text-blue-500/50 uppercase block mb-2">Suggestions</label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                      {allExistingTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleQuickAddTag(tag)}
                          className="text-[8px] font-orbitron px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-500 hover:border-blue-500 hover:text-blue-400 transition-all rounded-sm uppercase"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className={labelClass}>Gender</label>
                  <input type="text" value={formData.gender} onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))} className={inputClass} placeholder="M / F / NA" />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Birthday</label>
                  <input type="text" value={formData.birthday} onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))} className={inputClass} placeholder="YYYY.MM.DD" />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Height</label>
                  <input type="text" value={formData.height} onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))} className={inputClass} placeholder="175CM" />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Weight</label>
                  <input type="text" value={formData.weight} onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))} className={inputClass} placeholder="65KG" />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Eye Color</label>
                  <input type="text" value={formData.eyeColor} onChange={(e) => setFormData(prev => ({ ...prev, eyeColor: e.target.value }))} className={inputClass} placeholder="EYES" />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Hair Style</label>
                  <input type="text" value={formData.hairStyle} onChange={(e) => setFormData(prev => ({ ...prev, hairStyle: e.target.value }))} className={inputClass} placeholder="HAIR" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Psychology</label>
                <textarea rows={3} value={formData.personality} onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Hobbies</label>
                <textarea rows={3} value={formData.hobbies} onChange={(e) => setFormData(prev => ({ ...prev, hobbies: e.target.value }))} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Notes</label>
                <textarea rows={2} value={formData.others} onChange={(e) => setFormData(prev => ({ ...prev, others: e.target.value }))} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-500/10 flex justify-end">
            <button
              onClick={handleSave}
              className="w-full md:w-auto px-10 py-3 bg-blue-600/20 border border-blue-500 text-blue-400 font-orbitron text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              COMMIT_CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditCard;
