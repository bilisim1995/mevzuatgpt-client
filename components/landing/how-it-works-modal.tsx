'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function HowItWorksModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/60 px-6 py-3.5 text-base font-semibold text-slate-800 backdrop-blur transition hover:border-slate-400 hover:bg-white/80 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60 dark:border-slate-600/60 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:bg-slate-900/60"
        >
          Nasıl Çalışır
          <span aria-hidden className="transition group-hover:translate-x-1">→</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-2xl border-slate-200 bg-white/95 p-0 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
        <DialogHeader className="sr-only">
          <DialogTitle>Nasıl Çalışır</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 pt-6">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-black dark:border-slate-700">
            <iframe
              src="https://www.youtube.com/embed/4rXdRNVtMFQ"
              title="Nasıl Çalışır"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
              >
                Kapat
              </button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
