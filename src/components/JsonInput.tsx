import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonData = Record<string, any> | any[];

interface JsonInputProps {
  onVisualize: (data: JsonData) => void;
}

const SAMPLE_JSON = {
  user: {
    name: 'Pritesh',
    age: 25,
    isActive: true,
    address: {
      city: 'Mumbai',
      area: 'Navi Mumbai',
      pincode: 400001,
    },
  },
  items: [
    { name: 'iPad', price: 600, inStock: true },
    { name: 'Mobile', price: 500, inStock: false },
  ],
  metadata: {
    version: '1.0',
    lastUpdated: null,
  },
};

export const JsonInput = ({ onVisualize }: JsonInputProps) => {
  const [inputText, setInputText] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);

    // Real-time validation
    try {
      JSON.parse(value);
      setError('');
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  const handleVisualize = () => {
    try {
      const parsedJson = JSON.parse(inputText);
      onVisualize(parsedJson);
      setError('');
      setIsValid(true);
    } catch {
      setError('Invalid JSON - Please check your syntax');
      setIsValid(false);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputText);
      setInputText(JSON.stringify(parsed, null, 2));
      setError('');
      setIsValid(true);
    } catch {
      setError('Cannot format - Invalid JSON');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputText);
      setInputText(JSON.stringify(parsed));
      setError('');
      setIsValid(true);
    } catch {
      setError('Cannot minify - Invalid JSON');
    }
  };

  const handleClear = () => {
    setInputText('');
    setError('');
    setIsValid(true);
  };

  const handleSample = () => {
    setInputText(JSON.stringify(SAMPLE_JSON, null, 2));
    setError('');
    setIsValid(true);
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Editor Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 overflow-hidden shadow-xl shadow-purple-500/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-white/30 hover:bg-red-400 transition-colors cursor-pointer"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-white/30 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-white/30 hover:bg-green-400 transition-colors cursor-pointer"></div>
            </div>
            <span className="text-white/90 text-sm font-semibold ml-2">JSON Editor</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-300 ${
                isValid
                  ? 'bg-white/20 text-white'
                  : 'bg-red-500/80 text-white'
              }`}
            >
              {isValid ? '✓ Valid' : '✗ Invalid'}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-50/80 border-b border-slate-200/50 px-4 py-2.5 flex items-center gap-2">
          <button
            onClick={handleFormat}
            className="text-xs px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-all duration-200 flex items-center gap-2 shadow-sm border border-slate-200/50 font-medium"
          >
            <span>✨</span> Format
          </button>
          <button
            onClick={handleMinify}
            className="text-xs px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-all duration-200 flex items-center gap-2 shadow-sm border border-slate-200/50 font-medium"
          >
            <span>📦</span> Minify
          </button>
          <button
            onClick={handleSample}
            className="text-xs px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-all duration-200 flex items-center gap-2 shadow-sm border border-slate-200/50 font-medium"
          >
            <span>📄</span> Sample
          </button>
          <button
            onClick={handleClear}
            className="text-xs px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex items-center gap-2 shadow-sm border border-slate-200/50 font-medium"
          >
            <span>🗑️</span> Clear
          </button>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            rows={12}
            className={`
              w-full bg-white text-slate-700 font-mono text-sm p-5 pl-14
              resize-none focus:outline-none leading-relaxed
              placeholder:text-slate-400
              ${!isValid && inputText ? 'border-l-4 border-red-400' : ''}
            `}
            placeholder='Paste your JSON here... e.g., {"key": "value"}'
            spellCheck={false}
          />
          {/* Line Numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-50 pointer-events-none border-r border-slate-100 flex flex-col items-end pr-3 pt-5 text-slate-300 text-sm font-mono leading-relaxed">
            {inputText.split('\n').slice(0, 15).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-t border-red-100 px-5 py-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500">⚠️</span>
            <span className="text-red-600 text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Footer / Action */}
        <div className="bg-slate-50/50 border-t border-slate-100 px-5 py-4 flex items-center justify-between">
          <p className="text-slate-400 text-xs font-medium">
            💡 Tip: Use <kbd>$.path.to.key</kbd> to search nodes
          </p>
          <button
            onClick={handleVisualize}
            disabled={!isValid || !inputText.trim()}
            className={`
              px-6 py-3 rounded-2xl font-bold text-sm
              transition-all duration-300 flex items-center gap-2
              ${
                isValid && inputText.trim()
                  ? 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <span className="text-lg">🌳</span>
            Visualize Tree
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonInput;
