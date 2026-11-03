import { MapPin, Navigation, Footprints } from 'lucide-react';
import { VENUE } from '@/config';
import { ExternalLinkButton } from '@/components/LinkButtons';

export function VenueTab() {
  return (
    <div className="space-y-5 fade-in-up">
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Интерактивная карта Яндекс */}
        <div className="aspect-video w-full relative">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A8a0ebd254a94947cfdb17c064559f4e01c52272d7bf46171c031cbfe81f804b3&source=constructor"
            className="h-full w-full border-0"
            title={`Карта: ${VENUE.name}`}
            loading="lazy"
            allowFullScreen
          />
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">{VENUE.name}</h2>
            <p className="mt-1 text-sm text-white/60">{VENUE.address}</p>
          </div>
          <ExternalLinkButton href={VENUE.mapUrl}>
            Открыть на карте
          </ExternalLinkButton>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Footprints size={18} className="text-[#2a9d8f]" />
          <h3 className="text-sm font-semibold text-white">Как добраться</h3>
        </div>
        <ul className="space-y-3">
          {VENUE.directions.map((dir, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2a9d8f]/15 text-xs font-bold text-[#2a9d8f]">
                {i + 1}
              </span>
              <span className="text-sm text-white/70 leading-relaxed">{dir}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={VENUE.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-2xl bg-gradient-to-r from-[#2a9d8f] to-[#26867b] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#2a9d8f]/20 transition-all active:scale-95"
      >
        <Navigation size={18} />
        Построить маршрут
      </a>
    </div>
  );
}