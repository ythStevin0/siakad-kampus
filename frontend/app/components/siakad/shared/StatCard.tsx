import { type ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  icon: ReactNode;
  link: string;
  shadow: string;
}

export function StatCard({ label, value, color, icon, link, shadow }: StatCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl ${color} p-5 text-white shadow-lg ${shadow} transition-all hover:scale-[1.02] active:scale-[0.98]`}>
      <div className="relative z-10 flex flex-col items-end text-right">
        <span className={`${typeof value === 'number' ? 'text-4xl' : 'text-xl'} font-black`}>{value}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-tight">{label}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-black/10 px-4 py-2 flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter cursor-pointer hover:bg-black/20 transition-colors">
        {link}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
      </div>
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="absolute top-4 left-4 opacity-20">
        {icon}
      </svg>
    </div>
  );
}
