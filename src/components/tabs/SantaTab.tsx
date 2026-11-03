import { Gift, CheckCircle2, Clock, Wallet } from 'lucide-react';
import { EVENT_CONFIG } from '@/config';

export function SantaTab() {
  const { secretSanta } = EVENT_CONFIG;

  return (
    <div className="space-y-4 fade-in-up">
      {/* Hero */}
      <div className="glass-card rounded-3xl p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(230,57,70,0.3), transparent 70%)'
        }} />
        <div className="relative">
          <div className="text-4xl mb-3 animate-float">🎁</div>
          <h2 className="text-xl font-extrabold text-white">Тайный Санта</h2>
          <p className="mt-2 text-sm text-white/60 leading-relaxed">
            {secretSanta.description}
          </p>
        </div>
      </div>

      {/* Key info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4">
          <Wallet size={20} className="text-[#d4af37] mb-2" />
          <p className="text-xs text-white/40 mb-0.5">Лимит подарка</p>
          <p className="text-lg font-bold text-white">{secretSanta.limit}</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <Clock size={20} className="text-[#e63946] mb-2" />
          <p className="text-xs text-white/40 mb-0.5">Дедлайн</p>
          <p className="text-lg font-bold text-white">{secretSanta.deadline}</p>
        </div>
      </div>

      {/* Rules */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Gift size={18} className="text-[#d4af37]" />
          <h3 className="text-sm font-semibold text-white">Правила</h3>
        </div>
        <ul className="space-y-3">
          {secretSanta.rules.map((rule, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/15 text-xs font-bold text-[#d4af37]">
                {i + 1}
              </span>
              <span className="text-sm text-white/70 leading-relaxed">{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card rounded-2xl p-4 border-[#2a9d8f]/20">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className="text-[#2a9d8f] shrink-0 mt-0.5" />
          <p className="text-sm text-white/70 leading-relaxed">
            Обмен подарками состоится во время вечеринки в 22:15. Не забудьте упаковку и подпись!
          </p>
        </div>
      </div>
    </div>
  );
}
