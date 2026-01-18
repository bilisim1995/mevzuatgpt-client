'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function QuoteInfoDialog() {
  return (
    <Dialog>
      <div className="flex items-start gap-3">
        <p className="flex-1 text-base text-slate-600 md:text-xl dark:text-slate-300">
          İl'i tutan töredir, töreyi bilen bilgedir; Yol bilmeyene kılavuz, hak
          arayana gölgedir.
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Açıklama"
              className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold text-slate-700 align-middle transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-white"
            >
              i
            </button>
          </DialogTrigger>
        </p>
      </div>
      <DialogContent className="max-w-2xl rounded-2xl border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              İlBilge Açıklaması
            </DialogTitle>
          </DialogHeader>
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 pr-4 sm:pr-6 dark:text-gray-200">
            <p>
              Bu söz, sitenin hem devlet ciddiyetine hem de vatandaşa olan
              faydasına vurgu yapar. Kısaca anlamı şudur:
            </p>
            <div className="space-y-3">
              <p>
                <strong className="text-slate-900 dark:text-white">
                  Devletin Temeli Hukuktur:
                </strong>{' '}
                Bir devleti (İl) ayakta tutan tek güç yasalardır (Töre).
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">
                  Çözüm &quot;Bilge&quot;dedir:
                </strong>{' '}
                Yasalar karmaşıktır; onları anlayan, hafızasında tutan ve çözen
                ise bilgeliktir.
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white">
                  Vatandaşa Faydası:
                </strong>{' '}
                Hukuki süreçte ne yapacağını bilemeyene yol gösterir (rehber
                olur), hakkını arayan kişiyi ise doğru bilgiyle korur ve
                ferahlatır (gölge olur).
              </p>
            </div>
            <p className="pt-2 border-t border-slate-200 dark:border-gray-500">
              <strong className="text-slate-900 dark:text-white">Özetle:</strong>{' '}
              &quot;Devlet adaletle yaşar, adalet bilgiyle sağlanır. İlbilge;
              hukukta yolunu kaybedene pusula, hakkını arayana güç olur.&quot;
              demektir.
            </p>
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
              >
                Kapat
              </button>
            </DialogClose>
          </div>
        </DialogContent>
    </Dialog>
  );
}
