import { useState, useEffect, useMemo } from 'react';

interface SearchBarProps {
  onSearch: (path: string) => void;
  jsonData: unknown;
}

// Extract all paths from JSON data
const extractPaths = (data: unknown, currentPath: string = '$'): string[] => {
  const paths: string[] = [currentPath];
  
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      paths.push(...extractPaths(item, `${currentPath}[${index}]`));
    });
  } else if (typeof data === 'object' && data !== null) {
    Object.entries(data).forEach(([key, value]) => {
      paths.push(...extractPaths(value, `${currentPath}.${key}`));
    });
  }
  
  return paths;
};

export default function SearchBar({ onSearch, jsonData }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Get all available paths from JSON
  const allPaths = useMemo(() => extractPaths(jsonData), [jsonData]);
  
  // Filter suggestions based on query
  const suggestions = useMemo(() => {
    if (!query) return allPaths.slice(0, 8);
    return allPaths.filter(path => 
      path.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
  }, [query, allPaths]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSearch = () => {
    onSearch(query.trim());
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
    if (e.key === 'Escape') {
      handleClear();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (path: string) => {
    setQuery(path);
    onSearch(path);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-6xl">
      {/* Search Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg shadow-purple-500/5">
        {/* Header with instructions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🔍</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Search Node by Path</h3>
              <p className="text-slate-500 text-xs">Click suggestions or type a path to highlight the node</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500 font-mono">Enter</kbd>
            <span className="text-slate-400 text-xs">to search</span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type path like $.user.name or click a suggestion below..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="
                  w-full bg-slate-50 text-slate-800 
                  pl-5 pr-12 py-4 rounded-xl
                  border-2 border-slate-200 
                  focus:border-violet-400 focus:ring-4 focus:ring-violet-100
                  transition-all duration-200
                  placeholder:text-slate-400 text-sm font-mono font-medium
                "
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-slate-200 hover:bg-red-100 hover:text-red-500 rounded-lg flex items-center justify-center text-slate-500 transition-all duration-200 text-sm font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="
                px-8 py-4 rounded-xl font-bold text-sm
                bg-gradient-to-r from-violet-500 to-purple-500 
                text-white shadow-lg shadow-violet-500/25
                hover:shadow-violet-500/40 hover:scale-105
                active:scale-95 transition-all duration-200
                whitespace-nowrap
              "
            >
              🔍 Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl shadow-purple-500/10 z-50 overflow-hidden">
              <div className="p-2 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  📍 Available Paths (click to search)
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((path, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(path)}
                    className="w-full text-left px-4 py-3 hover:bg-violet-50 transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3 group"
                  >
                    <span className={`
                      w-2 h-2 rounded-full flex-shrink-0
                      ${path === '$' ? 'bg-violet-500' : 
                        path.includes('[') ? 'bg-amber-500' : 
                        path.split('.').length <= 2 ? 'bg-emerald-500' : 'bg-cyan-500'}
                    `}></span>
                    <span className="font-mono text-sm text-slate-700 group-hover:text-violet-600 transition-colors">
                      {path}
                    </span>
                    <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to search →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Examples */}
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <span className="text-slate-500 text-xs font-semibold">Quick paths:</span>
          {allPaths.slice(1, 6).map((path, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(path)}
              className="
                text-xs px-3 py-1.5 rounded-lg
                bg-violet-50 text-violet-600 font-mono font-medium
                hover:bg-violet-100 border border-violet-100
                transition-all duration-200
              "
            >
              {path}
            </button>
          ))}
        </div>

        {/* Status indicator */}
        {query && (
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              allPaths.includes(query) ? 'bg-emerald-500' : 'bg-amber-500'
            }`}></div>
            <span className={`text-xs font-medium ${
              allPaths.includes(query) ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {allPaths.includes(query) 
                ? '✓ Valid path - Node will be highlighted' 
                : '⚠ Path not found - Try clicking a suggestion'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
