import { useState, useEffect } from 'react';
import { MENU_SECTIONS as DEFAULT_MENU } from '@/config';
import { Pencil, X, Plus, Trash2 } from 'lucide-react';

type MenuItem = { id: number; name: string; description?: string; tags?: string[] };
type MenuSection = { id: string; title: string; icon: string; items: MenuItem[] };

/**
 * Сливает дефолтное меню (из кода) с сохранённым (из бота).
 *
 * Правила:
 *  - Разделы/блюда из DEFAULT_MENU всегда присутствуют (их нельзя потерять).
 *  - Правки из бота (название, описание, теги) накладываются поверх дефолта.
 *  - Новые разделы/блюда, добавленные в боте, сохраняются.
 *  - Удаления из бота учитываются через tombstones (deletedSectionIds / deletedItemIds).
 */
function mergeMenu(
  defaultMenu: MenuSection[],
  savedMenu: MenuSection[] | undefined,
  deletedSectionIds: string[] = [],
  deletedItemIds: Record<string, number[]> = {}
): MenuSection[] {
  const deletedSections = new Set(deletedSectionIds);

  const savedSections = Array.isArray(savedMenu) ? savedMenu : [];
  const savedSectionMap = new Map(savedSections.map(s => [s.id, s]));

  // 1. Дефолтные разделы (кроме удалённых админом)
  const mergedDefault: MenuSection[] = defaultMenu
    .filter(defSec => !deletedSections.has(defSec.id))
    .map(defSec => {
      const savedSec = savedSectionMap.get(defSec.id);
      const deletedItems = new Set(deletedItemIds[defSec.id] || []);

      // Дефолтные блюда (кроме удалённых) + правки из бота
      const savedItemMap = new Map((savedSec?.items || []).map(i => [i.id, i]));

      const itemsFromDefault: MenuItem[] = defSec.items
        .filter(defItem => !deletedItems.has(defItem.id))
        .map(defItem => {
          const savedItem = savedItemMap.get(defItem.id);
          // Правки из бота поверх дефолта
          return savedItem ? { ...defItem, ...savedItem } : defItem;
        });

      // Блюда, которые админ добавил в боте (их нет в дефолте)
      const defaultItemIds = new Set(defSec.items.map(i => i.id));
      const extraItems = (savedSec?.items || []).filter(
        i => !defaultItemIds.has(i.id) && !deletedItems.has(i.id)
      );

      return {
        // title/icon — из кода (их админ не меняет, если хочешь — поменяй на savedSec)
        ...defSec,
        items: [...itemsFromDefault, ...extraItems],
      };
    });

  // 2. Разделы, которые админ добавил в боте (их нет в дефолте)
  const defaultSectionIds = new Set(defaultMenu.map(s => s.id));
  const extraSections = savedSections.filter(
    s => !defaultSectionIds.has(s.id) && !deletedSections.has(s.id)
  );

  return [...mergedDefault, ...extraSections];
}

export function MenuTab({ isAdmin }: { isAdmin?: boolean }) {
  const safeDefault = (DEFAULT_MENU || []) as unknown as MenuSection[];

  const [sections, setSections] = useState<MenuSection[]>(safeDefault);
  const [activeSection, setActiveSection] = useState<string>('');

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<MenuSection[]>(safeDefault);
  const [saving, setSaving] = useState(false);

  // Tombstones — что админ удалил
  const [deletedSectionIds, setDeletedSectionIds] = useState<string[]>([]);
  const [deletedItemIds, setDeletedItemIds] = useState<Record<string, number[]>>({});

  // Активный раздел
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0].id);
    }
  }, [sections, activeSection]);

  // Загрузка + merge
  useEffect(() => {
    fetch('/api/get-data')
      .then(r => r.json())
      .then(data => {
        const savedMenu = data?.menu as MenuSection[] | undefined;
        const savedDeletedSections = (data?.deletedSectionIds as string[]) || [];
        const savedDeletedItems =
          (data?.deletedItemIds as Record<string, number[]>) || {};

        const merged = mergeMenu(
          safeDefault,
          savedMenu,
          savedDeletedSections,
          savedDeletedItems
        );

        setSections(merged);
        setDraft(merged);
        setDeletedSectionIds(savedDeletedSections);
        setDeletedItemIds(savedDeletedItems);

        if (merged.length > 0) setActiveSection(merged[0].id);
      })
      .catch(() => {});
  }, []);

  // Сохранение + merge
  const save = async () => {
    setSaving(true);
    const initData = window.Telegram?.WebApp?.initData || '';
    const current = await fetch('/api/get-data')
      .then(r => r.json())
      .catch(() => null);

    // Мержим draft с дефолтом, чтобы дефолтные разделы/блюда не потерялись
    const menuToSave = mergeMenu(
      safeDefault,
      draft,
      deletedSectionIds,
      deletedItemIds
    );

    const payload = {
      ...(current || {}),
      menu: menuToSave,
      deletedSectionIds,
      deletedItemIds,
    };

    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData, data: payload }),
    });

    setSaving(false);
    if (res.ok) {
      setSections(menuToSave);
      setDraft(menuToSave);
      setEditing(false);
    } else {
      alert('Не удалось сохранить');
    }
  };

  // === Блюда ===
  const updateItem = (secId: string, itemId: number, field: string, value: string) => {
    setDraft(draft.map(sec => {
      if (sec.id !== secId) return sec;
      return {
        ...sec,
        items: sec.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }));
  };

  const removeItem = (secId: string, itemId: number) => {
    // Запоминаем удаление дефолтного блюда
    setDeletedItemIds(prev => {
      const list = prev[secId] || [];
      return { ...prev, [secId]: [...new Set([...list, itemId])] };
    });

    setDraft(draft.map(sec => {
      if (sec.id !== secId) return sec;
      return { ...sec, items: sec.items.filter(item => item.id !== itemId) };
    }));
  };

  const addItem = (secId: string) => {
    setDraft(draft.map(sec => {
      if (sec.id !== secId) return sec;
      const newId = Math.max(0, ...sec.items.map(i => i.id)) + 1;
      return {
        ...sec,
        items: [...sec.items, { id: newId, name: 'Новое блюдо', description: '', tags: [] }],
      };
    }));
  };

  // === Разделы (вкладки) ===
  const updateSectionTitle = (secId: string, value: string) => {
    setDraft(draft.map(sec => (sec.id === secId ? { ...sec, title: value } : sec)));
  };

  const updateSectionIcon = (secId: string, value: string) => {
    setDraft(draft.map(sec => (sec.id === secId ? { ...sec, icon: value } : sec)));
  };

  const addSection = () => {
    const id = `sec_${Date.now()}`;
    const newSection: MenuSection = {
      id,
      title: 'Новый раздел',
      icon: '🍽️',
      items: [],
    };
    setDraft([...draft, newSection]);
    setActiveSection(id);
  };

  const removeSection = (secId: string) => {
    if (draft.length <= 1) {
      alert('Нельзя удалить последний раздел');
      return;
    }
    if (!confirm('Удалить раздел вместе со всеми блюдами?')) return;

    // Если удаляется дефолтный раздел — запоминаем tombstone
    const isDefault = safeDefault.some(s => s.id === secId);
    if (isDefault) {
      setDeletedSectionIds(prev => [...new Set([...prev, secId])]);
    }

    const next = draft.filter(s => s.id !== secId);
    setDraft(next);
    if (activeSection === secId) {
      setActiveSection(next[0]?.id || '');
    }
  };

  // Пустое меню
  if (sections.length === 0) {
    return <div className="text-white/50 text-center py-10">Меню пока пустое...</div>;
  }

  const currentView = sections.find(s => s.id === activeSection) || sections[0];
  const currentDraft = draft.find(s => s.id === activeSection) || draft[0];

  return (
    <div className="space-y-4 fade-in-up">
      {isAdmin && !editing && (
        <button
          onClick={() => { setDraft(sections); setEditing(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#f83d43]/15 px-3 py-2 text-sm font-semibold text-[#f83d43]"
        >
          <Pencil size={16} /> Редактировать меню
        </button>
      )}

      {editing && currentDraft && (
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Редактирование меню</h3>
            <button onClick={() => setEditing(false)} className="text-white/60">
              <X size={18} />
            </button>
          </div>

          {/* === Редактор разделов === */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wide">
              Разделы меню
            </p>

            {draft.map(sec => (
              <div
                key={sec.id}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${
                  sec.id === currentDraft.id
                    ? 'border-[#f83d43]/40 bg-[#f83d43]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <input
                  className="w-10 rounded-lg bg-white/10 px-2 py-1 text-center text-sm text-white"
                  value={sec.icon}
                  onChange={e => updateSectionIcon(sec.id, e.target.value)}
                  maxLength={2}
                  title="Иконка (эмодзи)"
                />
                <input
                  className="flex-1 min-w-0 rounded-lg bg-white/10 px-3 py-1 text-sm text-white"
                  value={sec.title}
                  onChange={e => updateSectionTitle(sec.id, e.target.value)}
                  placeholder="Название раздела"
                />
                <button
                  onClick={() => setActiveSection(sec.id)}
                  className="text-xs text-white/60 hover:text-white px-1"
                  title="Редактировать блюда этого раздела"
                >
                  ✎
                </button>
                <button
                  onClick={() => removeSection(sec.id)}
                  className="text-red-400/60 hover:text-red-400"
                  title="Удалить раздел"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              onClick={addSection}
              className="flex items-center gap-1 text-sm text-[#f83d43] font-medium"
            >
              <Plus size={16} /> Добавить раздел
            </button>
          </div>

          <hr className="border-white/10" />

          {/* === Редактор блюд выбранного раздела === */}
          <h3 className="text-sm font-semibold text-white">
            Блюда: {currentDraft.title}
          </h3>

          <div className="space-y-4">
            {currentDraft.items.map(item => (
              <div
                key={item.id}
                className="border border-white/10 rounded-xl p-3 space-y-2 relative"
              >
                <button
                  onClick={() => removeItem(currentDraft.id, item.id)}
                  className="absolute top-2 right-2 text-red-400/50 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
                <input
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white pr-8"
                  value={item.name}
                  onChange={e =>
                    updateItem(currentDraft.id, item.id, 'name', e.target.value)
                  }
                  placeholder="Название блюда"
                />
                <textarea
                  className="w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white"
                  value={item.description || ''}
                  onChange={e =>
                    updateItem(currentDraft.id, item.id, 'description', e.target.value)
                  }
                  placeholder="Описание / кто готовит"
                  rows={2}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => addItem(currentDraft.id)}
            className="flex items-center gap-1 text-sm text-[#f83d43] font-medium"
          >
            <Plus size={16} /> Добавить блюдо
          </button>

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-xl bg-[#f83d43] py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      )}

      {/* Вкладки */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
        {sections.map(section => (
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

      {/* Блюда выбранного раздела */}
      <div className="space-y-2.5">
        {currentView.items.length === 0 && (
          <p className="text-center text-sm text-white/40 py-4">
            В этом разделе пока нет блюд
          </p>
        )}
        {currentView.items.map(item => (
          <div
            key={`${currentView.id}-${item.id}`}
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
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
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
