import { Music2, Send } from 'lucide-react';
import { MUSIC } from '@/config';
import { TelegramLinkButton, ExternalLinkButton } from '@/components/LinkButtons';

export function MusicTab() {
  return (
    <div className="space-y-4 fade-in-up">
      {/* Playlist */}
      <div className="glass-card rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e63946]/15 text-2xl">
            🎵
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-white">{MUSIC.playlistText}</h2>
            <p className="text-xs text-white/50">Яндекс Музыка</p>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          {MUSIC.playlistDescription}
        </p>
        <a
          href={MUSIC.yandexPlaylist}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-[#e63946] to-[#c1121f] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#e63946]/20 transition-all active:scale-95"
        >
          <Music2 size={18} />
          Открыть плейлист
        </a>
        <p className="mt-3 text-xs text-white/40 text-center">
        </p>
      </div>

      {/* Suggest tracks */}
      <div className="glass-card rounded-2xl p-5 border-[#2a9d8f]/15">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a9d8f]/15">
            <Send size={22} className="text-[#2a9d8f]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{MUSIC.suggestText}</h3>
            <p className="text-xs text-white/50">Telegram-группа</p>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          {MUSIC.suggestDescription}
        </p>
        <TelegramLinkButton href={MUSIC.telegramGroup} variant="primary">
          Предложить трек
        </TelegramLinkButton>
        <p className="mt-3 text-xs text-white/40 text-center">
        </p>
      </div>
    </div>
  );
}
