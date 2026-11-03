import { Pin } from 'lucide-react';
import { ANNOUNCEMENTS } from '@/config';

export function NewsTab() {
  return (
    <div className="space-y-3 fade-in-up">
      <p className="text-xs text-white/40 px-1">
        Лента объявлений — актуальная информация о вечеринке
      </p>
      {ANNOUNCEMENTS.map((item) => (
        <div
          key={item.id}
          className={`glass-card rounded-2xl p-4 ${
            item.pinned ? 'border-[#d4af37]/30 bg-[#d4af37]/5' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              {item.pinned && (
                <Pin size={14} className="text-[#d4af37] fill-[#d4af37]" />
              )}
              <span className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">
                {item.date}
              </span>
            </div>
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
          <p className="text-sm text-white/60 leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
