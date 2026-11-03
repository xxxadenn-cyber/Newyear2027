import { PROGRAM } from '@/config';

export function ProgramTab() {
  return (
    <div className="space-y-0 fade-in-up">
      <p className="text-xs text-white/40 px-1 mb-3">
        Программа вечера — тайминг по часам
      </p>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[#d4af37]/40 via-[#d4af37]/20 to-transparent" />

        {PROGRAM.map((item, i) => (
          <div key={i} className="relative flex items-start gap-4 pb-4 last:pb-0">
            {/* Dot */}
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#12122a] border-2 border-[#d4af37]/30">
              <div className="h-2.5 w-2.5 rounded-full bg-[#d4af37]" />
            </div>
            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-sm font-bold text-[#d4af37] tabular-nums">
                  {item.time}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              {item.description && (
                <p className="mt-0.5 text-xs text-white/50 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
