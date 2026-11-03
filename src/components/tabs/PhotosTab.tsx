import { Camera, Upload } from 'lucide-react';
import { PHOTOS } from '@/config';
import { TelegramLinkButton } from '@/components/LinkButtons';

export function PhotosTab() {
  return (
    <div className="space-y-4 fade-in-up">
      <div className="glass-card rounded-3xl p-5 text-center">
        <Camera size={32} className="text-[#a0c4ff] mx-auto mb-3" />
        <h2 className="text-xl font-extrabold text-white">{PHOTOS.uploadText}</h2>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          {PHOTOS.description}
        </p>
      </div>

      <div className="glass-card rounded-2xl p-5 border-[#a0c4ff]/15">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a0c4ff]/15">
            <Upload size={22} className="text-[#a0c4ff]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Загрузить фото</h3>
            <p className="text-xs text-white/50">Группа в Telegram для фото</p>
          </div>
        </div>
        <TelegramLinkButton href={PHOTOS.telegramGroup} variant="primary">
          Открыть группу фото
        </TelegramLinkButton>
        <p className="mt-3 text-xs text-white/40 text-center">
        </p>
      </div>

      <p className="text-center text-xs text-white/30 px-4">
      </p>
    </div>
  );
}
