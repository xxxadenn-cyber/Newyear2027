import { ACTIVITIES } from '@/config';

export function ActivitiesTab() {
  return (
    <div className="space-y-3 fade-in-up">
      <p className="text-xs text-white/40 px-1">
        Развлечения и конкурсы — участие по желанию, призы обеспечены!
      </p>
      {ACTIVITIES.map((activity) => (
        <div key={activity.id} className="glass-card rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl">
              {activity.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-[#e63946]/15 px-2 py-0.5 text-xs font-bold text-[#e63946]">
                  {activity.time}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{activity.title}</h3>
              <p className="mt-1 text-xs text-white/60 leading-relaxed">
                {activity.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
