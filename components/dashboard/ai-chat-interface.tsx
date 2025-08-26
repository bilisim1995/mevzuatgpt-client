"use client";

import { Bot, MessageSquare, User, Sparkles } from 'lucide-react';
import { Card } from "@/components/ui/card";

export function AIChatInterface() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <Card className="relative w-full max-w-xl mx-auto bg-transparent border-0 shadow-none">
        <div className="w-full max-w-lg mx-auto transition-all duration-500 transform hover:scale-[1.02]">
          <div className="relative bg-gradient-to-b from-primary/5 via-primary/10 to-transparent p-8 rounded-3xl">
            {/* Üst Dekoratif Elementler */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/20 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-75" />
              <div className="w-3 h-3 rounded-full bg-primary/40 animate-pulse delay-150" />
            </div>

            {/* Sohbet Arayüzü */}
            <div className="space-y-6 mb-12">
              {/* Bot Mesajı */}
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Merhaba! Ben MevzuatGPT, size mevzuat konularında yardımcı olmak için buradayım.
                  </p>
                </div>
              </div>

              {/* Kullanıcı Mesajı */}
              <div className="flex items-start gap-3 max-w-[80%] ml-auto">
                <div className="bg-primary/10 rounded-2xl rounded-tr-none p-4">
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    Merhaba! Bana yardımcı olabilir misiniz?
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary/70" />
                </div>
              </div>

              {/* Bot Yanıtı */}
              <div className="flex items-start gap-3 max-w-[80%] group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-lg relative">
                  <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Elbette! Mevzuat ile ilgili tüm sorularınızı yanıtlamaya hazırım.
                  </p>
                </div>
              </div>
            </div>

            {/* Alt Dekoratif Elementler */}
            <div className="absolute bottom-6 left-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary/40" />
              <div className="text-xs text-primary/40">Yapay Zeka Destekli Mevzuat Asistanı</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}