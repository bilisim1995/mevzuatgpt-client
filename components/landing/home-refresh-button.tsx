"use client";

interface HomeRefreshButtonProps {
  className?: string;
}

export default function HomeRefreshButton({
  className,
}: HomeRefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className={`flex items-center gap-2 ${className ?? ''}`}
    >
      <span
        className="rounded-full border border-slate-200/70 bg-white/80 p-1.5 text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-300"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 10l8-6 8 6" />
          <path d="M6 10v8h12v-8" />
        </svg>
      </span>
      Ana Sayfa
    </button>
  );
}
