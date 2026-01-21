import { useState } from 'react';
import './App.css';
import JsonInput from './components/JsonInput';
import { TreeVisulizer } from './components/TreeVisulizer';
import SearchBar from './components/SearchBar';

function App() {
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [searchPath, setSearchPath] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-violet-100 text-slate-800 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-300/40 to-purple-300/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-300/40 to-blue-300/40 rounded-full blur-3xl translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl translate-y-1/2"></div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg shadow-purple-500/10 border border-white/50">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-2xl">🌳</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              JSON Tree <span className="text-violet-600">Visualizer</span>
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-xl mx-auto font-medium">
            Transform your JSON data into beautiful, interactive tree diagrams
          </p>
        </header>

        {/* JSON Input */}
        <JsonInput onVisualize={(data: unknown) => setJsonData(data)} />

        {/* Tree Visualization */}
        {jsonData && (
          <div className="w-full max-w-6xl mt-8 space-y-5 animate-fade-in">
            {/* Search Bar */}
            <SearchBar onSearch={setSearchPath} jsonData={jsonData} />

            {/* Tree View */}
            <TreeVisulizer data={jsonData} searchPath={searchPath} />

            {/* Info Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 px-5 py-4 flex items-center justify-between shadow-lg shadow-purple-500/5">
              <div className="flex items-center gap-6 text-sm text-slate-600 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">🖱️</span>
                  <span>Drag to pan</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">🔍</span>
                  <span>Scroll to zoom</span>
                </span>
                <span className="hidden md:flex items-center gap-2">
                  <span className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">👆</span>
                  <span>Click to select</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-3 py-1.5 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full font-semibold text-purple-600">
                  Powered by React Flow
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!jsonData && (
          <div className="mt-16 text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-500/10">
              <span className="text-6xl">🌲</span>
            </div>
            <p className="text-slate-500 text-lg font-medium">
              Enter JSON above and click <span className="text-violet-600 font-semibold">"Visualize Tree"</span> to begin
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50">
            <span className="text-slate-500 text-sm">Built with</span>
            <span className="text-lg">⚛️</span>
            <span className="text-slate-600 text-sm font-medium">React + TypeScript + Tailwind</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
