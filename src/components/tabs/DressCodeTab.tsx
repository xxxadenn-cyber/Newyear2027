import { Sparkles, Check, X } from 'lucide-react';
import { DRESS_CODE } from '@/config';

export function DressCodeTab() {
  return (
    <div className="space-y-4 fade-in-up">
      {/* Theme card */}
      <div className="glass-card rounded-3xl p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.3), transparent 70%)'
        }} />
        <div className="relative">
          <Sparkles size={28} className="text-[#d4af37] mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Тема вечера</p>
          <h2 className="text-2xl font-extrabold gold-grad-text">{DRESS_CODE.theme}</h2>
          <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
            {DRESS_CODE.description}
          </p>
        </div>
      </div>

      {/* Color palette */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3">Цветовая палитра</h3>
        <div className="flex gap-3">
          <div className="flex-1 text-center">
            <div className="h-12 rounded-xl bg-[#d4af37] mb-1" />
            <span className="text-xs text-white/50">Золото</span>
          </div>
          <div className="flex-1 text-center">
            <div className="h-12 rounded-xl bg-[#0a0a1a] border border-white/10 mb-1" />
            <span className="text-xs text-white/50">Чёрный</span>
          </div>
          <div className="flex-1 text-center">
            <div className="h-12 rounded-xl bg-[#8b1a1a] mb-1" />
            <span className="text-xs text-white/50">Бордо</span>
          </div>
          <div className="flex-1 text-center">
            <div className="h-12 rounded-xl bg-[#1a2a4a] mb-1" />
            <span className="text-xs text-white/50">Синий</span>
          </div>
        </div>
      </div>

      {/* Men tips */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-lg">👨</span> Мужчинам
        </h3>
        <ul className="space-y-2">
          {DRESS_CODE.menTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check size={16} className="text-[#2a9d8f] shrink-0 mt-0.5" />
              <span className="text-sm text-white/70 leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Women tips */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-lg">👩</span> Женщинам
        </h3>
        <ul className="space-y-2">
          {DRESS_CODE.womenTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check size={16} className="text-[#2a9d8f] shrink-0 mt-0.5" />
              <span className="text-sm text-white/70 leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Not recommended */}
      <div className="glass-card rounded-2xl p-4 border-[#e63946]/20">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <X size={16} className="text-[#e63946]" /> Не рекомендуется
        </h3>
        <ul className="space-y-2">
          {DRESS_CODE.notRecommended.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <X size={16} className="text-[#e63946]/60 shrink-0 mt-0.5" />
              <span className="text-sm text-white/50 leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
