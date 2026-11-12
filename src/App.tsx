import { useState, useEffect } from 'react';
import {
  Home, MapPin, Megaphone, Utensils, PartyPopper,
  Camera, Music,
  ArrowLeft, type LucideIcon,
} from 'lucide-react';
import { TABS } from '@/config';
import type { TabConfig } from '@/config';
import { SnowOverlay } from '@/components/SnowOverlay';
import { HomeScreen } from '@/components/HomeScreen';
import { VenueTab } from '@/components/tabs/VenueTab';
import { NewsTab } from '@/components/tabs/NewsTab';
import { MenuTab } from '@/components/tabs/MenuTab';
import { ActivitiesTab } from '@/components/tabs/ActivitiesTab';
import { MusicTab } from '@/components/tabs/MusicTab';

const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  'map-pin': MapPin,
  megaphone: Megaphone,
  utensils: Utensils,
  'party-popper': PartyPopper,
  camera: Camera,
  music: Music,
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation?: () => void;
        initData?: string;
        initDataUnsafe?: { user?: { id?: number } };
        HapticFeedback?: {
          impactOccurred: (type: string) => void;
          selectionChanged: () => void;
        };
        themeParams?: Record<string, string>;
      };
    };
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#f4f8fb');
      tg.setBackgroundColor('#f4f8fb');
    }

    // Проверяем, админ ли пользователь
    const initData = tg?.initData || '';
    fetch('/api/check-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data?.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveTab('home');
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onNavigate={handleNavigate} tabs={TABS} />;
      case 'venue': return <VenueTab isAdmin={isAdmin} />;
      case 'news': return <NewsTab />;
      case 'menu': return <MenuTab isAdmin={isAdmin} />;
      case 'activities': return <ActivitiesTab isAdmin={isAdmin} />;
      case 'music': return <MusicTab isAdmin={isAdmin} />;
      default: return <HomeScreen onNavigate={handleNavigate} tabs={TABS} />;
    }
  };

  const isHome = activeTab === 'home';

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SnowOverlay />

      {/* Background gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f4f8fb] via-[#eef5f8] to-[#f8fafc]" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[280px] bg-[#f83d43]/8 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[360px] h-[240px] bg-[#e7a52b]/10 blur-[90px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 glass border-b border-white/5">
        <div className="flex items-center gap-3 px-5 h-14" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          {isHome ? (
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f83d43] text-base shadow-sm shadow-[#f83d43]/25">🎄</span>
              <span className="text-sm font-extrabold tracking-tight text-white">Новый год 2027</span>
            </div>
          ) : (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-[#f83d43] active:scale-95"
            >
              <ArrowLeft size={18} />
              Назад
            </button>
          )}
          <div className="ml-auto">
            <span className="text-xs text-white/30 tabular-nums">
              {isHome ? '31 дек' : ''}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-5 pb-24 pt-4 max-w-md mx-auto">
        {renderContent()}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 glass border-t border-white/5">
        <div className="max-w-md mx-auto px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
            {TABS.map((tab: TabConfig) => {
              const Icon = ICON_MAP[tab.icon];
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavigate(tab.id)}
                  className={`flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#f83d43]/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? 'text-[#f83d43]' : 'text-white/40'}
                  />
                  <span
                    className={`text-[10px] font-medium leading-none whitespace-nowrap ${
                      isActive ? 'text-[#f83d43]' : 'text-white/40'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;