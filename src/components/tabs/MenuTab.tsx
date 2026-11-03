import { useState } from 'react';
import { MENU_SECTIONS } from '@/config';

export function MenuTab() {
  const [activeSection, setActiveSection] = useState(MENU_SECTIONS[0].id);

  const current = MENU_SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="space-y-4 fade-in-up">
      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
        {MENU_SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-gradient-to-r from-[#d4af37] to-[#f5e6a8] text-[#0a0a1a]'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <span>{section.icon}</span>
            {section.title}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2.5">
        {current.items.map((item) => (
          <div
            key={`${current.id}-${item.id}`}
            className="glass-card rounded-2xl p-4 fade-in-up"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                {item.description && (
                  <p className="mt-1 text-xs text-white/50 leading-relaxed">
                    {item.description}
                  </p>
                )}
                {item.tags && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#d4af37]/10 px-2.5 py-0.5 text-xs font-medium text-[#d4af37]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
