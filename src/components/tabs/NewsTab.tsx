import { useState, useEffect } from 'react';
import { ANNOUNCEMENTS as DEFAULT_NEWS } from '@/config';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';

type Announcement = { id: number; date: string; title: string; text: string; pinned?: boolean };

export function NewsTab({ isAdmin }: { isAdmin?: boolean }) {
  const [news, setNews] = useState<Announcement[]>(DEFAULT_NEWS);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Announcement[]>(DEFAULT_NEWS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/get-data').then((r) => r.json()).then((data) => {
      if (data?.news) { setNews(data.news); setDraft(data.news); }
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    const initData = window.Telegram?.WebApp?.initData || '';
    const current = await fetch('/api/get-data').then((r) => r.json()).catch(() => null);
    const payload = { ...(current || {}), news: draft };
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, data: payload }),
    });
    setSaving(false);
    if (res.ok) { setNews(draft); setEditing(false); } else { alert('Ошибка сохранения'); }
  };

  const updateItem = (id: number, field: string, value: string) => {
    setDraft(draft.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: number) => setDraft(draft.filter(item => item.id !== id));
  
  const addItem = () => {
    const newId = Math.max(0, ...draft.map(i => i.id)) + 1;
    setDraft([...draft, { id: newId, date: 'Дата', title: 'Заголовок', text: '' }]);
  };

  return (
    <div className="space-y-5 fade-in-up">
      {isAdmin && !editing && (
        <button onClick={() => { setDraft(news); setEditing(true); }} className="flex items-center gap-2 rounded-xl bg-[#f83d43]/15 px-3 py-2 text-sm font-semibold text-[#f83d43]">
          <Pencil size={16} /> Редактировать инфо
        </button>
      )}

      {editing && (
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Редактирование инфо</h3>
            <button onClick={() => setEditing(false)} className="text-white/60"><X size={18} /></button>
          </div>
          {draft.map(item => (
            <div key={item.id} className="border border-white/10 rounded-xl p-3 space-y-2 relative">
              <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 text-red-400/50 hover:text-red-400"><Trash2 size={16} /></button>
              <input className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white pr-8" value={item.title} onChange={(e) => updateItem(item.id, 'title', e.target.value)} placeholder="Заголовок" />
              <input className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white" value={item.date} onChange={(e) => updateItem(item.id, 'date', e.target.value)} placeholder="Дата" />
              <textarea className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white" value={item.text} onChange={(e) => updateItem(item.id, 'text', e.target.value)} placeholder="Текст" rows={3} />
            </div>
          ))}
          <button onClick={addItem} className="flex items-center gap-1 text-sm text-[#f83d43] font-medium"><Plus size={16} /> Добавить новость</button>
          <button onClick={save} disabled={saving} className="w-full rounded-xl bg-[#f83d43] py-3 font-semibold text-white disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      )}

      {news.map((item) => (
        <div key={item.id} className="glass-card rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#f83d43]">{item.date}</span>
            {item.pinned && <span className="text-xs text-white/40">📌 Закреплено</span>}
          </div>
          <h3 className="text-base font-bold text-white">{item.title}</h3>
          {item.text && <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{item.text}</p>}
        </div>
      ))}
    </div>
  );
}