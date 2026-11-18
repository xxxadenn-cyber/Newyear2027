import { useState, useEffect } from 'react';
import { DEFAULT_GUESTS } from '@/config';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';

type Guest = {
  id: string;
  name: string;
  telegram?: string;
  note?: string;
};

/**
 * Сливает дефолтных гостей (из кода) с сохранёнными (из бота).
 *  - Дефолтные гости всегда присутствуют (кроме удалённых админом).
 *  - Правки из бота (name, telegram, note) накладываются поверх.
 *  - Новые гости, добавленные в боте, сохраняются.
 */
function mergeGuests(
  defaultGuests: Guest[],
  savedGuests: Guest[] | undefined,
  deletedGuestIds: string[] = []
): Guest[] {
  const deleted = new Set(deletedGuestIds);
  const saved = Array.isArray(savedGuests) ? savedGuests : [];
  const savedMap = new Map(saved.map(g => [g.id, g]));

  // Дефолтные (кроме удалённых) + правки из бота
  const mergedDefault = defaultGuests
    .filter(g => !deleted.has(g.id))
    .map(g => {
      const savedGuest = savedMap.get(g.id);
      return savedGuest ? { ...g, ...savedGuest } : g;
    });

  // Гости, добавленные в боте (их нет в дефолте)
  const defaultIds = new Set(defaultGuests.map(g => g.id));
  const extra = saved.filter(g => !defaultIds.has(g.id) && !deleted.has(g.id));

  return [...mergedDefault, ...extra];
}

export function GuestsTab({ isAdmin }: { isAdmin?: boolean }) {
  const safeDefault = (DEFAULT_GUESTS || []) as Guest[];

  const [guests, setGuests] = useState<Guest[]>(safeDefault);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Guest[]>(safeDefault);
  const [saving, setSaving] = useState(false);

  const [deletedGuestIds, setDeletedGuestIds] = useState<string[]>([]);

  // Загрузка + merge
  useEffect(() => {
    fetch('/api/get-data')
      .then(r => r.json())
      .then(data => {
        const savedGuests = data?.guests as Guest[] | undefined;
        const savedDeleted = (data?.deletedGuestIds as string[]) || [];

        const merged = mergeGuests(safeDefault, savedGuests, savedDeleted);

        setGuests(merged);
        setDraft(merged);
        setDeletedGuestIds(savedDeleted);
      })
      .catch(() => {});
  }, []);

  // Сохранение + merge
  const save = async () => {
    setSaving(true);
    const initData = window.Telegram?.WebApp?.initData || '';
    const current = await fetch('/api/get-data')
      .then(r => r.json())
      .catch(() => null);

    const guestsToSave = mergeGuests(safeDefault, draft, deletedGuestIds);

    const payload = {
      ...(current || {}),
      guests: guestsToSave,
      deletedGuestIds,
    };

    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, data: payload }),
    });

    setSaving(false);
    if (res.ok) {
      setGuests(guestsToSave);
      setDraft(guestsToSave);
      setEditing(false);
    } else {
      alert('Не удалось сохранить');
    }
  };

  const updateGuest = (id: string, field: keyof Guest, value: string) => {
    setDraft(draft.map(g => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const addGuest = () => {
    const id = `guest_${Date.now()}`;
    setDraft([
      ...draft,
      { id, name: 'Новый гость', telegram: '', note: '' },
    ]);
  };

  const removeGuest = (id: string) => {
    if (!confirm('Удалить гостя?')) return;

    const isDefault = safeDefault.some(g => g.id === id);
    if (isDefault) {
      setDeletedGuestIds(prev => [...new Set([...prev, id])]);
    }

    setDraft(draft.filter(g => g.id !== id));
  };

  // Хелпер: ссылка на телеграм
  const tgLink = (tg?: string) => {
    if (!tg) return null;
    const clean = tg.trim().replace(/^@/, '');
    if (!clean) return null;
    // если это уже ссылка — вернём как есть
    if (/^https?:\/\//i.test(tg)) return tg;
    return `https://t.me/${clean}`;
  };

  if (guests.length === 0 && !editing) {
    return (
      <div className="space-y-4">
        {isAdmin && (
          <button
            onClick={() => { setDraft(guests); setEditing(true); }}
            className="flex items-center gap-2 rounded-xl bg-[#f83d43]/15 px-3 py-2 text-sm font-semibold text-[#f83d43]"
          >
            <Pencil size={16} /> Добавить гостей
          </button>
        )}
        <div className="text-white/50 text-center py-10">Гостей пока нет...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 fade-in-up">
      {isAdmin && !editing && (
        <button
          onClick={() => { setDraft(guests); setEditing(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#f83d43]/15 px-3 py-2 text-sm font-semibold text-[#f83d43]"
        >
          <Pencil size={16} /> Редактировать гостей
        </button>
      )}

      {/* === Режим редактирования === */}
      {editing && (
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Список гостей</h3>
            <button onClick={() => setEditing(false)} className="text-white/60">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {draft.map(guest => (
              <div
                key={guest.id}
                className="border border-white/10 rounded-xl p-3 space-y-2 relative"
              >
                <button
                  onClick={() => removeGuest(guest.id)}
                  className="absolute top-2 right-2 text-red-400/50 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>

                <input
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white pr-8"
                  value={guest.name}
                  onChange={e => updateGuest(guest.id, 'name', e.target.value)}
                  placeholder="Имя гостя"
                />
                <input
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
                  value={guest.telegram || ''}
                  onChange={e => updateGuest(guest.id, 'telegram', e.target.value)}
                  placeholder="Телеграм: @username или ссылка"
                />
                <input
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
                  value={guest.note || ''}
                  onChange={e => updateGuest(guest.id, 'note', e.target.value)}
                  placeholder="Заметка (кто пригласил / сторона)"
                />
              </div>
            ))}
          </div>

          <button
            onClick={addGuest}
            className="flex items-center gap-1 text-sm text-[#f83d43] font-medium"
          >
            <Plus size={16} /> Добавить гостя
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-xl bg-[#f83d43] py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      )}

      {/* === Просмотр === */}
      <div className="space-y-2.5">
        {guests.length === 0 && (
          <p className="text-center text-sm text-white/40 py-4">Гостей пока нет</p>
        )}
        {guests.map(guest => {
          const link = tgLink(guest.telegram);
          return (
            <div
              key={guest.id}
              className="glass-card rounded-2xl p-4 fade-in-up flex items-start justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">{guest.name}</h3>

                {guest.telegram && (
                  <p className="mt-1 text-xs text-white/60">
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d4af37] hover:underline"
                      >
                        {guest.telegram}
                      </a>
                    ) : (
                      guest.telegram
                    )}
                  </p>
                )}

                {guest.note && (
                  <p className="mt-1 text-xs text-white/40">{guest.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
