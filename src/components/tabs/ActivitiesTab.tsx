import { useState, useEffect } from 'react';
import { ACTIVITIES as DEFAULT_ACTIVITIES } from '@/config';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';

type Activity = { id: number; time: string; title: string; description: string; icon: string };

export function ActivitiesTab({ isAdmin }: { isAdmin?: boolean }) {
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/get-data').then((r) => r.json()).then((data) => {
      if (data?.activities) { setActivities(data.activities); setDraft(data.activities); }
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    const initData = window.Telegram?.WebApp?.initData || '';
    const current = await fetch('/api/get-data').then((r) => r.json()).catch(() => null);
    const payload = { ...(current || {}), activities: draft };
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, data: payload }),
    });
    setSaving(false);
    if (res.ok) { setActivities(draft); setEditing(false); } else { alert('Ошибка сохранения'); }
  };

  const updateItem = (id: number, field: string, value: string) => {
    setDraft(draft.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: number) => setDraft(draft.filter(item => item.id !== id));
  
  const addItem = () => {
    const newId = Math.max(0, ...draft.map(i => i.id)) + 1;
    setDraft([...draft, { id: newId, time: 'Время', title: 'Название', description: '', icon: '🎉' }]);
  };

  return (
    <div className="space-y-5 fade-in-up">
      {isAdmin && !editing && (
        <button onClick={() => { setDraft(activities); setEditing(true); }} className="flex items-center gap-2 rounded-xl bg-[#f83d43]/15 px-3 py-2 text-sm font-semibold text-[#f83d43]">
          <Pencil size={16} /> Редактировать активности
        </button>
      )}

      {editing && (
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Редактирование активностей</h3>
            <button onClick={() => setEditing(false)} className="text-white/60"><X size={18} /></button>
          </div>
          {draft.map(item => (
            <div key={item.id} className="border border-white/10 rounded-xl p-3 space-y-2 relative">
              <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-red-400/50 hover:text-red-400"><Trash2 size={16} /></button>
              <div className="flex gap-2">
                <input className="w-16 rounded-lg bg-white/5 px-3 py-2 text-sm text-white text-center" value={item.icon} onChange={(e) => updateItem(item.id, 'icon', e.target.value)} placeholder="Эмодзи" />
                <input className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm text-white" value={item.title} onChange={(e) => updateItem(item.id, 'title', e.target.value)} placeholder="Название" />
              </div>
              <input className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white" value={item.time} onChange={(e) => updateItem(item.id, 'time', e.target.value)} placeholder="Время (например, 20:00)" />
              <textarea className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Описание" rows={2} />
            </div>
          ))}
          <button onClick={addItem} className="flex items-center gap-1 text-sm text-[#f83d43] font-medium"><Plus size={16} /> Добавить активность</button>
          <button onClick={save} disabled={saving} className="w-full rounded-xl bg-[#f83d43] py-3 font-semibold text-white disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      )}

      {activities.map((item) => (
        <div key={item.id} className="glass-card rounded-3xl p-5 flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f83d43]/10 text-2xl">
            {item.icon}
          </div>
          <div>
            <span className="text-xs font-semibold text-[#f83d43]">{item.time}</span>
            <h3 className="text-base font-bold text-white mt-0.5">{item.title}</h3>
            <p className="mt-1 text-sm text-white/60 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}