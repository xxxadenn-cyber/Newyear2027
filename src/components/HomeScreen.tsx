import { Calendar, MapPin, Clock } from 'lucide-react';
import { EVENT_CONFIG, VENUE } from '@/config';
import type { TabConfig } from '@/config';

interface HomeScreenProps {
  onNavigate: (tabId: string) => void;
  tabs: TabConfig[];
}

export function HomeScreen({ onNavigate, tabs }: HomeScreenProps) {
  const quickActions = [
    { id: 'venue', icon: '📍', label: 'Место' },
    { id: 'menu', icon: '🍽', label: 'Меню' },
    { id: 'music', icon: '🎵', label: 'Музыка' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f83d43] via-[#fb4d50] to-[#e72f3b] px-5 py-7 text-center shadow-xl shadow-[#f83d43]/20 fade-in-up">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18px] border-white/10" />
        <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full border-[22px] border-white/10" />
        <div className="relative">
          <div className="mb-3 text-5xl animate-float">🎄</div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-white/75"></p>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Новый год
          </h1>
          <p className="mt-2 text-sm font-medium text-white/80">{EVENT_CONFIG.subtitle}</p>
        </div>
      </div>

      {/* Event card */}
      <div className="glass-card animate-glow rounded-3xl p-5 fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f83d43]/10">
              <Calendar size={20} className="text-[#f83d43]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-white/40">Дата</p>
              <p className="text-sm font-semibold text-white">31 декабря 2026</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16a36f]/10">
              <MapPin size={20} className="text-[#16a36f]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-wider text-white/40">Место</p>
              <p className="text-sm font-semibold text-white">{VENUE.name}</p>
              <p className="text-xs text-white/50">{VENUE.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-white/40">Быстрый доступ</h2>
          <span className="h-px w-16 bg-[#f83d43]/20" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="glass-card flex flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-200 active:scale-95 hover:-translate-y-0.5 hover:border-[#f83d43]/30"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-medium text-white/70">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* All tabs list */}
      <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-white/40">Все разделы</h2>
          <span className="h-px w-16 bg-[#f83d43]/20" />
        </div>
        <div className="space-y-2">
          {tabs
            .filter((t) => t.id !== 'home')
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-4 py-3.5 transition-all duration-200 active:scale-[0.98] hover:bg-white/8 hover:translate-x-0.5"
              >
                <span className="text-sm font-medium text-white/80">{tab.label}</span>
                <span className="text-white/30">→</span>
              </button>
            ))}
        </div>
      </div>

      <p className="pt-2 text-center text-xs text-white/30">
        С Новым годом! 🎅
      </p>
    </div>
  );
}
