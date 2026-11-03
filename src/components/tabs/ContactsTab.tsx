import { Send } from 'lucide-react';
import { CONTACTS } from '@/config';

export function ContactsTab() {
  return (
    <div className="space-y-3 fade-in-up">
      <p className="text-xs text-white/40 px-1">
        Организаторы — на связи по любым вопросам
      </p>
      {CONTACTS.map((contact, i) => (
        <div key={i} className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#e63946]/20 text-sm font-bold text-white">
                {contact.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  {contact.name}
                </h3>
                <p className="text-xs text-white/50">{contact.role}</p>
              </div>
            </div>
            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-10 w-10 shrink-0 rounded-xl bg-[#2a9d8f]/15 text-[#2a9d8f] transition-all active:scale-90 hover:bg-[#2a9d8f]/25"
            >
              <Send size={18} />
            </a>
          </div>
        </div>
      ))}
      <p className="text-center text-xs text-white/30 pt-2">
        Не стесняйтесь писать — мы поможем! 🎄
      </p>
    </div>
  );
}
