"use client"

export function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-20rem)] px-6">
      <div className="text-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl p-12 border border-white/30 dark:border-slate-700/30 shadow-2xl max-w-md mx-auto">
        <div className="mb-8 flex justify-center">
          <div className="relative w-32 h-32">
            <div className="absolute inset-8 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-full shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-spin" style={{animationDuration: '4s'}}></div>
            <div className="absolute inset-3 border-2 border-blue-400/40 rounded-full animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
            <div className="absolute inset-6 border border-indigo-400/20 rounded-full animate-spin" style={{animationDuration: '5s'}}></div>
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-400/5 via-indigo-500/10 to-purple-600/5 rounded-full blur-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}