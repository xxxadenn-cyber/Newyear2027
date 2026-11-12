import { useState, useEffect } from 'react';
import { MENU_SECTIONS as DEFAULT_MENU } from '@/config';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';

type MenuItem = { id: number; name: string; description?: string; tags?: string[] };
type MenuSection = { id: string; title: string; icon: string; items: MenuItem[] };

export function MenuTab({ isAdmin }: { isAdmin?: boolean }) {
  const [sections, setSections] = useState<MenuSection[]>(DEFAULT_MENU);
  const [activeSection, setActiveSection] = useState(DEFAULT_MENU[0].id);
  
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<MenuSection[]>(DEFAULT_MENU);
  const [saving, setSaving] = useState(false);

  // Загружаем данные с сервера
  useEffect(() => {
    fetch('/api/get-data')
      .then((r) => r.json())
      .then((data) => {
        if (data?.menu) {
          setSections(data.menu);
          setDraft(data.menu);
        }
      })
      .catch(() => {});
  }, []);

  // Сохраняем данные
  const save = async () => {
    setSaving(true);
    const initData = window.Telegram?.WebApp?.initData || '';
    const current = await fetch('/api/get-data').then((r) => r.json()).catch(() => null);
    const payload = { ...(current || {}), menu: draft };
    
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, data: payload }),
    });
    
    setSaving(false);
    if (res.ok) {
      setSections(draft);
      setEditing(false);
    } else {
      alert('Не удалось сохранить');
    }
  };

  // Функции для работы с черновиком (draft)
  const updateItem = (secId: string, itemId: number, field: string, value: string) => {
    setDraft(draft.map(sec => {
      if (sec.id !== secId) return sec;
      return {
        ...sec,
        items: sec.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
      };
    }));
  };

  const removeItem = (secId: string, itemId: number) => {
    setDraft(draft.map(sec => {
      if (sec.id !== secId) return sec;
      return { ...sec, items: sec.items.filter(item => item.id !== itemId) };
    }));
  };

  const addItem = (secId: string) => {
    setDraft(draft.map(sec => {
      if (sec.id !== secId) return sec;
      const newId = Math.max(0, ...sec.items.map(i => i.id)) + 1;
      return { ...sec, items: [...sec.items, { id: newId, name: 'Новое блюдо', description: '', tags: [] }] };
    }));
  };

  // Текущий раздел для отображения
  const currentView = sections.find((s) => s.id === activeSection)!;
  const currentDraft = draft.find((s) => s.id === activeSection)!;

  return (
    <div className="space-y-4 fade-in-up">
      {isAdmin && !editing && (
        <button
          onClick={() => { setDraft(sections); setEditing(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#f83d43]/15 px-3 py-2 text-sm font-semibold text-[#f83d43]"
        >
          <Pencil size={16} /> Редактировать меню
        </button>
      )}

      {editing && (
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Редактирование: {currentDraft.title}</h3>
            <button onClick={() => setEditing(false)} className="text-white/60"><X size={18} /></button>
          </div>
          
          <div className="space-y-4">
            {currentDraft.items.map((item) => (
              <div key={item.id} className="border border-white/10 rounded-xl p-3 space-y-2 relative">
                <button onClick={() => removeItem(currentDraft.id, item.id)} className="absolute top-2 right-2 text-red-400/50 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
                <input
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white pr-8"
                  value={item.name}
                  onChange={(e) => updateItem(currentDraft.id, item.id, 'name', e.target.value)}
                  placeholder="Название блюда"
                />
                <textarea
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
                  value={item.description || ''}
                  onChange={(e) => updateItem(currentDraft.id, item.id, 'description', e.target.value)}
                  placeholder="Описание / кто готовит"
                  rows={2}
                />
              </div>
            ))}
          </div>

          <button onClick={() => addItem(currentDraft.id)} className="flex items-center gap-1 text-sm text-[#f83d43] font-medium">
            <Plus size={16} /> Добавить блюдо
          </button>

          <button onClick={save} disabled={saving} className="w-full rounded-xl bg-[#f83d43] py-3 font-semibold text-white disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      )}

      {/* Переключатель разделов (виден всегда) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-[#d4af37] to-[#f5e6a8] text-[#0a0a1a]'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <span>{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Список блюд (виден всегда) */}
      <div className="space-y-2.5">
        {currentView.items.length === 0 && (
          <p className="text-center text-sm text-white/40 py-4">В этом разделе пока нет блюд</p>
        )}
        {currentView.items.map((item) => (
          <div key={`${currentView.id}-${item.id}`} className="glass-card rounded-2xl p-4 fade-in-up">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                {item.description && (
                  <p className="mt-1 text-xs text-white/50 leading-relaxed">{item.description}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#d4af37]/10 px-2.5 py-0.5 text-xs font-medium text-[#d4af37]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}