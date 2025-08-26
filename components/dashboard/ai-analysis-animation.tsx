"use client"

import { Brain, Search, Database, Shield, Zap } from 'lucide-react'

export function AIAnalysisAnimation() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-20rem)] px-6">
      <div className="relative w-full max-w-xl mx-auto">
        
        {/* Ana Konteyner */}
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-slate-700/30 shadow-xl overflow-hidden">
          
          {/* Arka Plan Grid */}
          <div className="absolute inset-0 opacity-10 dark:opacity-20">
            <div className="grid-pattern"></div>
          </div>
          
        
          
          {/* İşlem Aşamaları */}
          <div className="grid grid-cols-4 gap-3">
            <div className="process-stage stage-1">
              <div className="stage-icon">
                <Search className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              </div>
              <div className="stage-label">Arama</div>
              <div className="stage-progress"></div>
            </div>
            
            <div className="process-stage stage-2">
              <div className="stage-icon">
                <Database className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              </div>
              <div className="stage-label">Sorgulama</div>
              <div className="stage-progress"></div>
            </div>
            
            <div className="process-stage stage-3">
              <div className="stage-icon">
                <Shield className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              </div>
              <div className="stage-label">Doğrulama</div>
              <div className="stage-progress"></div>
            </div>
            
            <div className="process-stage stage-4">
              <div className="stage-icon">
                <Zap className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              </div>
              <div className="stage-label">Derleme</div>
              <div className="stage-progress"></div>
            </div>
          </div>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="progress-dot dot-1"></div>
            <div className="progress-dot dot-2"></div>
            <div className="progress-dot dot-3"></div>
            <div className="progress-dot dot-4"></div>
            <div className="progress-dot dot-5"></div>
          </div>
        </div>
        
        {/* CSS Styles */}
        <style jsx>{`
          .grid-pattern {
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            width: 100%;
            height: 100%;
            animation: grid-move 15s linear infinite;
          }
          
          .dark .grid-pattern {
            background-image: 
              linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px);
          }
          
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(20px, 20px); }
          }
          
          .ring-1, .ring-2 {
            animation: ring-rotate 8s linear infinite;
          }
          
          .ring-2 {
            animation-direction: reverse;
            animation-duration: 12s;
          }
          
          @keyframes ring-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .brain-glow {
            animation: brain-glow 2s ease-in-out infinite;
          }
          
          @keyframes brain-glow {
            0%, 100% { 
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
            }
            50% { 
              box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);
            }
          }
          
          .dark .brain-glow {
            animation: brain-glow-dark 2s ease-in-out infinite;
          }
          
          @keyframes brain-glow-dark {
            0%, 100% { 
              box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
            }
            50% { 
              box-shadow: 0 0 25px rgba(6, 182, 212, 0.5);
            }
          }
          
          .brain-pulse {
            animation: brain-pulse 1.5s ease-in-out infinite;
          }
          
          @keyframes brain-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          
          .process-stage {
            background: rgba(59, 130, 246, 0.05);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 8px;
            padding: 8px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .dark .process-stage {
            background: rgba(6, 182, 212, 0.1);
            border: 1px solid rgba(6, 182, 212, 0.3);
          }
          
          .stage-icon {
            margin-bottom: 4px;
            display: flex;
            justify-content: center;
            animation: stage-bounce 2s ease-in-out infinite;
          }
          
          .stage-2 .stage-icon { animation-delay: 0.5s; }
          .stage-3 .stage-icon { animation-delay: 1s; }
          .stage-4 .stage-icon { animation-delay: 1.5s; }
          
          @keyframes stage-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          
          .stage-label {
            font-size: 10px;
            font-weight: 500;
            color: rgba(59, 130, 246, 0.8);
            margin-bottom: 4px;
          }
          
          .dark .stage-label {
            color: rgba(6, 182, 212, 0.8);
          }
          
          .stage-progress {
            height: 2px;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 1px;
            overflow: hidden;
            position: relative;
          }
          
          .dark .stage-progress {
            background: rgba(6, 182, 212, 0.3);
          }
          
          .stage-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.8), transparent);
            animation: progress-sweep 3s ease-in-out infinite;
          }
          
          .dark .stage-progress::after {
            background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.8), transparent);
          }
          
          .stage-1 .stage-progress::after { animation-delay: 0s; }
          .stage-2 .stage-progress::after { animation-delay: 0.5s; }
          .stage-3 .stage-progress::after { animation-delay: 1s; }
          .stage-4 .stage-progress::after { animation-delay: 1.5s; }
          
          @keyframes progress-sweep {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          .progress-dot {
            width: 6px;
            height: 6px;
            background: rgba(59, 130, 246, 0.4);
            border-radius: 50%;
            animation: dot-pulse 1.5s ease-in-out infinite;
          }
          
          .dark .progress-dot {
            background: rgba(6, 182, 212, 0.6);
          }
          
          .dot-1 { animation-delay: 0s; }
          .dot-2 { animation-delay: 0.2s; }
          .dot-3 { animation-delay: 0.4s; }
          .dot-4 { animation-delay: 0.6s; }
          .dot-5 { animation-delay: 0.8s; }
          
          @keyframes dot-pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    </div>
  )
}