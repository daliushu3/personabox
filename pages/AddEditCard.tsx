
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCards, saveCard } from '../utils/storage';
import { CharacterCard } from '../types';

const AddEditCard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<CharacterCard, 'id' | 'createdAt'>>({
    name: '',
    photo: '',
    gender: '',
    birthday: '',
    height: '',
    weight: '',
    eyeColor: '',
    hairStyle: '',
    personality: '',
    hobbies: '',
    others: '',
  });

  useEffect(() => {
    if (id) {
      const cards = getCards();
      const card = cards.find(c => c.id === id);
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
          personality: card.personality,
          hobbies: card.hobbies,
          others: card.others,
        });
      }
    }
  }, [id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('请输入名字');
      return;
    }
    const newCard: CharacterCard = {
      id: id || crypto.randomUUID(),
      ...formData,
      createdAt: id ? (getCards().find(c => c.id === id)?.createdAt || Date.now()) : Date.now(),
    };
    saveCard(newCard);
    navigate('/list');
  };

  const inputClass = "w-full bg-slate-900/50 border border-slate-700 rounded px-4 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm";
  const labelClass = "block text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1 font-orbitron";

  return (
    <div className="min-h-screen bg-[#0a0c10] py-6 md:py-12 px-4">
      <div className="max-w-4xl mx-auto tech-border tech-border-tl tech-border-tr tech-border-bl tech-border-br bg-slate-900/40 p-0.5 backdrop-blur-md">
        <div className="bg-slate-950/80 p-5 md:p-8">
          <div className="flex justify-between items-center mb-8 border-b border-blue-500/20 pb-4">
            <h2 className="text-xl font-orbitron text-slate-100 tracking-widest">
              [ {id ? 'EDIT_ARCHIVE' : 'NEW_ENTRY'} ]
            </h2>
            <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-400 text-[10px] font-orbitron transition-colors">
              {"<< RETURN"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column */}
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
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <input 
                  type="text" 
                  placeholder="IMAGE LINK" 
                  value={formData.photo}
                  onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                  className={`${inputClass} text-[10px] py-1`}
                />
              </div>
            </div>

            {/* Right Column */}
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
