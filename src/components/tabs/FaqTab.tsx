import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '@/config';

export function FaqTab() {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="space-y-3 fade-in-up">
      <p className="text-xs text-white/40 px-1">
        Частые вопросы — нажмите, чтобы развернуть ответ
      </p>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="glass-card rounded-2xl overflow-hidden">
          <button
            onClick={() => setOpenId(openId === i ? null : i)}
            className="flex w-full items-start justify-between gap-3 p-4 text-left"
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <HelpCircle size={16} className="text-[#a0c4ff] shrink-0 mt-0.5" />
              <span className="text-sm font-semibold text-white">{item.question}</span>
            </div>
            <ChevronDown
              size={18}
              className={`shrink-0 text-white/40 transition-transform duration-200 mt-0.5 ${
                openId === i ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openId === i && (
            <div className="px-4 pb-4 pl-11 fade-in-up">
              <p className="text-sm text-white/60 leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
