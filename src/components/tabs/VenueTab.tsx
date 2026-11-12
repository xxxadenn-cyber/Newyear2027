import { useEffect, useState } from 'react';
import { MapPin, Navigation, Footprints, Pencil, X } from 'lucide-react';
import { VENUE as DEFAULT_VENUE } from '@/config';
import { ExternalLinkButton } from '@/components/LinkButtons';

type VenueData = {
  name: string;
  address: string;
  mapUrl: string;
  directions: string[];
};

export function VenueTab({ isAdmin }: { isAdmin?: boolean }) {
  const [venue, setVenue] = useState<VenueData>(DEFAULT_VENUE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<VenueData>(DEFAULT_VENUE);
  const [saving, setSaving] = useState(false);

  // Загружаем актуальные данные с сервера при открытии вкладки
  useEffect(() => {
    fetch('/api/get-data')
      .then((r) => r.json())
      .then((data) => {
        if (data?.venue) {
          setVenue(data.venue);
          setDraft(data.venue);
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData || '';
    
    // Читаем остальные данные, чтобы не перезаписать другие вкладки (меню, музыку и т.д.)
    const current = await fetch('/api/get-data').then((r) => r.json()).catch(() => null);
    const payload = { ...(current || {}), venue: draft };
    
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, data: payload }),
    });
    
    setSaving(false);
    if (res.ok) {
      setVenue(draft);
      setEditing(false);
    } else {
      alert('Не удалось сохранить. Убедитесь, что вы админ.');
    }
  };

  return (
    <div className="space-y-5 fade-in-up">
      {/* Кнопка редактирования (видна только админу) */}
      {isAdmin && !editing && (
        <button
          onClick={() => { setDraft(venue); setEditing(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#f83d43]/15 px-3 py-2 text-sm font-semibold text-[#f83d43]"
        >
          <Pencil size={16} /> Редактировать
        </button>
      )}

      {/* Форма редактирования */}
      {editing && (
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Редактирование места</h3>
            <button onClick={() => setEditing(false)} className="text-white/60">
              <X size={18} />
            </button>
          </div>
          
          <input 
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white" 
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })} 
            placeholder="Название (например, Квартира Артема)" 
          />
          
          <input 
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white" 
            value={draft.address}
            onChange={(e) => setDraft({ ...draft, address: e.target.value })} 
            placeholder="Адрес" 
          />
          
          <input 
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white" 
            value={draft.mapUrl}
            onChange={(e) => setDraft({ ...draft, mapUrl: e.target.value })} 
            placeholder="Ссылка на карту" 
          />
          
          <textarea 
            className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white" 
            rows={4}
            value={draft.directions.join('\n')}
            onChange={(e) => setDraft({ ...draft, directions: e.target.value.split('\n') })}
            placeholder="Как добраться (каждый шаг с новой строки)" 
          />
          
          <button 
            onClick={save} 
            disabled={saving}
            className="w-full rounded-xl bg-[#f83d43] py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      )}

      {/* Основной контент */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="aspect-video w-full relative">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A8a0ebd254a94947cfdb17c064559f4e01c52272d7bf46171c031cbfe81f804b3&source=constructor"
            className="h-full w-full border-0"
            title={`Карта: ${venue.name}`}
            loading="lazy"
            allowFullScreen
          />
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">{venue.name}</h2>
            <p className="mt-1 text-sm text-white/60">{venue.address}</p>
          </div>
          <ExternalLinkButton href={venue.mapUrl}>
            Открыть на карте
          </ExternalLinkButton>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Footprints size={18} className="text-[#2a9d8f]" />
          <h3 className="text-sm font-semibold text-white">Как добраться</h3>
        </div>
        <ul className="space-y-3">
          {venue.directions.map((dir, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2a9d8f]/15 text-xs font-bold text-[#2a9d8f]">
                {i + 1}
              </span>
              <span className="text-sm text-white/70 leading-relaxed">{dir}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={venue.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-[#2a9d8f] to-[#26867b] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#2a9d8f]/20 transition-all active:scale-95"
      >
        <Navigation size={18} />
        Построить маршрут
      </a>
    </div>
  );
}