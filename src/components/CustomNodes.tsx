import { Handle, Position } from 'reactflow';
import { memo } from 'react';

interface NodeData {
  label: string;
  value: unknown;
  path: string;
  type: 'object' | 'array' | 'primitive';
  childCount?: number;
  isHighlighted?: boolean;
}

// Object Node - for JSON objects
export const ObjectNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div
      className={`
        min-w-[150px] rounded-2xl shadow-lg overflow-hidden
        transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1
        bg-white border-2
        ${data.isHighlighted 
          ? 'border-rose-400 ring-4 ring-rose-400/30 shadow-rose-500/30' 
          : 'border-emerald-200 hover:border-emerald-400'}
      `}
    >
      <div className="bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg">📦</span>
          <span className="font-bold text-white text-sm truncate max-w-[100px]">
            {data.label}
          </span>
        </div>
      </div>
      <div className="bg-emerald-50 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">
            Object
          </span>
          {data.childCount !== undefined && (
            <span className="bg-emerald-200 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {data.childCount} keys
            </span>
          )}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-white !shadow-md"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-white !shadow-md"
      />
    </div>
  );
});

// Array Node - for JSON arrays
export const ArrayNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div
      className={`
        min-w-[150px] rounded-2xl shadow-lg overflow-hidden
        transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1
        bg-white border-2
        ${data.isHighlighted 
          ? 'border-rose-400 ring-4 ring-rose-400/30 shadow-rose-500/30' 
          : 'border-amber-200 hover:border-amber-400'}
      `}
    >
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg">📋</span>
          <span className="font-bold text-white text-sm truncate max-w-[100px]">
            {data.label}
          </span>
        </div>
      </div>
      <div className="bg-amber-50 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-wider">
            Array
          </span>
          {data.childCount !== undefined && (
            <span className="bg-amber-200 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {data.childCount} items
            </span>
          )}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white !shadow-md"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white !shadow-md"
      />
    </div>
  );
});

// Primitive Node - for strings, numbers, booleans, null
export const PrimitiveNode = memo(({ data }: { data: NodeData }) => {
  const value = data.value;
  const valueType = value === null ? 'null' : typeof value;
  
  const getValueDisplay = () => {
    if (value === null) return 'null';
    if (typeof value === 'string') {
      return value.length > 15 ? `"${value.substring(0, 15)}..."` : `"${value}"`;
    }
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };

  const getTypeConfig = () => {
    switch (valueType) {
      case 'string': 
        return { 
          gradient: 'from-cyan-400 to-sky-400', 
          bg: 'bg-cyan-50', 
          text: 'text-cyan-600',
          badge: 'bg-cyan-200 text-cyan-700',
          border: 'border-cyan-200 hover:border-cyan-400',
          handle: '!bg-cyan-400',
          icon: '📝'
        };
      case 'number': 
        return { 
          gradient: 'from-blue-400 to-indigo-400', 
          bg: 'bg-blue-50', 
          text: 'text-blue-600',
          badge: 'bg-blue-200 text-blue-700',
          border: 'border-blue-200 hover:border-blue-400',
          handle: '!bg-blue-400',
          icon: '🔢'
        };
      case 'boolean': 
        return { 
          gradient: 'from-pink-400 to-rose-400', 
          bg: 'bg-pink-50', 
          text: 'text-pink-600',
          badge: 'bg-pink-200 text-pink-700',
          border: 'border-pink-200 hover:border-pink-400',
          handle: '!bg-pink-400',
          icon: value ? '✅' : '❌'
        };
      case 'null': 
        return { 
          gradient: 'from-slate-400 to-gray-400', 
          bg: 'bg-slate-50', 
          text: 'text-slate-600',
          badge: 'bg-slate-200 text-slate-700',
          border: 'border-slate-200 hover:border-slate-400',
          handle: '!bg-slate-400',
          icon: '∅'
        };
      default: 
        return { 
          gradient: 'from-gray-400 to-gray-500', 
          bg: 'bg-gray-50', 
          text: 'text-gray-600',
          badge: 'bg-gray-200 text-gray-700',
          border: 'border-gray-200 hover:border-gray-400',
          handle: '!bg-gray-400',
          icon: '❓'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className={`
        min-w-[130px] max-w-[200px] rounded-2xl shadow-lg overflow-hidden
        transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1
        bg-white border-2
        ${data.isHighlighted 
          ? 'border-rose-400 ring-4 ring-rose-400/30 shadow-rose-500/30' 
          : config.border}
      `}
    >
      <div className={`bg-gradient-to-r ${config.gradient} px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <span className="text-white text-lg">{config.icon}</span>
          <span className="font-bold text-white text-sm truncate max-w-[100px]">
            {data.label}
          </span>
        </div>
      </div>
      <div className={`${config.bg} px-4 py-2.5`}>
        <div className="flex flex-col gap-1">
          <span className={`${config.text} text-xs font-bold uppercase tracking-wider`}>
            {valueType}
          </span>
          <span className={`font-mono text-sm font-bold truncate ${config.text}`}>
            {getValueDisplay()}
          </span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className={`!w-3 !h-3 ${config.handle} !border-2 !border-white !shadow-md`}
      />
    </div>
  );
});

// Root Node - special styling for the root
export const RootNode = memo(({ data }: { data: NodeData }) => {
  return (
    <div
      className={`
        min-w-[170px] rounded-2xl shadow-xl overflow-hidden
        transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1
        bg-white border-2
        ${data.isHighlighted 
          ? 'border-rose-400 ring-4 ring-rose-400/30 shadow-rose-500/30' 
          : 'border-violet-300 hover:border-violet-500'}
      `}
    >
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-white text-2xl">🌳</span>
          <span className="font-extrabold text-white text-base">
            {data.label}
          </span>
        </div>
      </div>
      <div className="bg-violet-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <span className="text-violet-600 text-xs font-bold uppercase tracking-wider">
            Root {data.type === 'array' ? 'Array' : 'Object'}
          </span>
          {data.childCount !== undefined && (
            <span className="bg-violet-200 text-violet-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {data.childCount} {data.type === 'array' ? 'items' : 'keys'}
            </span>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-4 !h-4 !bg-violet-500 !border-2 !border-white !shadow-lg"
      />
    </div>
  );
});

export const nodeTypes = {
  objectNode: ObjectNode,
  arrayNode: ArrayNode,
  primitiveNode: PrimitiveNode,
  rootNode: RootNode,
};
