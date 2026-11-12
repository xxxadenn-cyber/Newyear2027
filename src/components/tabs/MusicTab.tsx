import { useState, useEffect } from 'react';
import { Music2, Send, Pencil, X } from 'lucide-react';
import { MUSIC as DEFAULT_MUSIC } from '@/config';
import { TelegramLinkButton, ExternalLinkButton } from '@/components/LinkButtons';

type MusicData = {
  playlistText: string;
  playlistDescription: string;
  yandexPlaylist: string;
  suggestText: string;
  suggestDescription: string;
  telegramGroup: string;
};

export function MusicTab({ isAdmin }: { isAdmin?: boolean }) {
  const [music, setMusic] = useState<MusicData>(DEFAULT_MUSIC);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<MusicData>(DEFAULT_MUSIC);
  const [saving, setSaving] = useState(false);

  // Загружаем данные с сервера
  useEffect(() => {
    fetch('/api/get-data')
      .then((r) => r.json())
      .then((data) => {
        if (data?.music) {
          setMusic(data.music);
          setDraft(data.music);
        }
      })
      .catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    const initData = window.Telegram?.WebApp?.initData || '';
    const current = await fetch('/api/get-data').then((r) => r.json()).catch(() => null);
    const payload = { ...(current || {}), music: draft };
    
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, data: payload }),
    });
    
    setSaving(false);
    if (res.ok) {
      setMusic(draft);
      setEditing(false);
    } else {
      alert('Не удалось сохранить');
    }
  };

  return (
    <div className="space-y-4 fade-in-up">
      {isAdmin && !editing && (
        <button
          onClick={() => { setDraft(music); setEditing(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#f83d43]/15 px-3 py-2 text-sm font-semibold text-[#f83d43]"
        >
          <Pencil size={16} /> Редактировать музыку
        </button>
      )}

      {editing && (
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">Редактирование музыки</h3>
            <button onClick={() => setEditing(false)} className="text-white/60"><X size={18} /></button>
          </div>
          
          <input
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
            value={draft.playlistText}
            onChange={(e) => setDraft({ ...draft, playlistText: e.target.value })}
            placeholder="Заголовок плейлиста"
          />
          <textarea
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
            value={draft.playlistDescription}
            onChange={(e) => setDraft({ ...draft, playlistDescription: e.target.value })}
            placeholder="Описание плейлиста"
            rows={3}
          />
          <input
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
            value={draft.yandexPlaylist}
            onChange={(e) => setDraft({ ...draft, yandexPlaylist: e.target.value })}
            placeholder="Ссылка на плейлист Яндекса"
          />
          
          <hr className="border-white/10 my-2" />

          <input
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
            value={draft.suggestText}
            onChange={(e) => setDraft({ ...draft, suggestText: e.target.value })}
            placeholder="Заголовок 'Предложить трек'"
          />
          <textarea
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
            value={draft.suggestDescription}
            onChange={(e) => setDraft({ ...draft, suggestDescription: e.target.value })}
            placeholder="Описание предложения трека"
            rows={3}
          />
          <input
            className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
            value={draft.telegramGroup}
            onChange={(e) => setDraft({ ...draft, telegramGroup: e.target.value })}
            placeholder="Ссылка на Telegram-группу"
          />

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-xl bg-[#f83d43] py-3 font-semibold text-white disabled:opacity-50 mt-4"
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      )}

      {/* Playlist */}
      <div className="glass-card rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e63946]/15 text-2xl">
            🎵
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white">{music.playlistText}</h2>
            <p className="text-xs text-white/50">Яндекс Музыка</p>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          {music.playlistDescription}
        </p>
        <ExternalLinkButton href={music.yandexPlaylist}>
          <Music2 size={18} className="mr-2" />
          Открыть плейлист
        </ExternalLinkButton>
      </div>

      {/* Suggest tracks */}
      <div className="glass-card rounded-2xl p-5 border-[#2a9d8f]/15">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a9d8f]/15">
            <Send size={22} className="text-[#2a9d8f]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{music.suggestText}</h3>
            <p className="text-xs text-white/50">Telegram-группа</p>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          {music.suggestDescription}
        </p>
        <TelegramLinkButton href={music.telegramGroup} variant="primary">
          Предложить трек
        </TelegramLinkButton>
      </div>
    </div>
  );
}