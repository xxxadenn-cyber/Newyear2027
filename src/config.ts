export interface Announcement {
  id: number;
  date: string;
  title: string;
  text: string;
  pinned?: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  tags?: string[];
}

export interface MenuSection {
  id: string;
  title: string;
  icon: string;
  items: MenuItem[];
}

export interface Activity {
  id: number;
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

export const EVENT_CONFIG = {
  title: 'Новый год 2026',
  subtitle: '31 декабря 2026',
  companyName: 'Компания',
} as const;

export const VENUE = {
  name: 'Квартира Кукандина Артема',
  address: 'г. Екатеринбург, ул. Чкалова, 231',
  mapUrl: 'https://yandex.ru/maps/geo/ulitsa_chkalova_231_podyezd_5/2051402280/?ll=60.547363%2C56.786396&z=19.78',
  directions: [
    '5 подъезд прямо возле остановки',
    'Квартира 667',
    'Этаж 23',
  ],
};

export const ANNOUNCEMENTS: Announcement[] = [
 
];

export const MENU_SECTIONS: MenuSection[] = [
 
];

export const ACTIVITIES: Activity[] = [
  {
  },
];

export const PHOTOS = {
  uploadText: 'Скидываем фото сюда!',
  description: 'Создаём общую фотогалерею праздника. Загружайте свои фото и видео - поделимся впечатлениями и сохраним лучшие моменты вечера.',
  telegramGroup: 'https://t.me/+kKvuvAXN1Yo3ZTEy',
};

export const MUSIC = {
  playlistText: 'Плейлист Яндекс Музыки',
  playlistDescription: 'Слушайте новогодний плейлист, который мы собрали специально для вечеринки. Включает классические новогодние хиты и современные треки.',
  yandexPlaylist: 'https://music.yandex.ru/playlists/052d839d-e327-525b-9370-828092047e8f?ref_id=094CA935-D856-4DFD-94C2-142C4081F11D&utm_medium=copy_link',
  suggestText: 'Предложить свой трек',
  suggestDescription: 'Хотите добавить свой трек в плейлист вечера? Кидайте варианты в нашу Telegram-группу — организаторы добавят ваши треки в плейлист.',
  telegramGroup: 'https://t.me/+X7rsnHm5M843NTcy',
};

export const TABS: TabConfig[] = [
  { id: 'home', label: 'Главная', icon: 'home' },
  { id: 'venue', label: 'Место', icon: 'map-pin' },
  { id: 'news', label: 'Инфо', icon: 'megaphone' },
  { id: 'menu', label: 'Меню', icon: 'utensils' },
  { id: 'activities', label: 'Активности', icon: 'party-popper' },
];