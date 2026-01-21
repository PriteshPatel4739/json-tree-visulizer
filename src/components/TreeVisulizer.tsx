import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useEffect, useCallback } from 'react';
import { jsonToFlow } from '../utils/jsonToFlow';
import { nodeTypes } from './CustomNodes';

interface TreeVisulizerProps {
  data: unknown;
  searchPath: string;
}

const TreeVisulizerInner = ({ data, searchPath }: TreeVisulizerProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView, setCenter } = useReactFlow();

  // Update tree when data changes
  useEffect(() => {
    if (data) {
      const { nodes: newNodes, edges: newEdges } = jsonToFlow(data);
      setNodes(newNodes);
      setEdges(newEdges);
      
      // Fit view after nodes are set
      setTimeout(() => {
        fitView({ padding: 0.2, maxZoom: 1.2 });
      }, 100);
    }
  }, [data, setNodes, setEdges, fitView]);

  // Handle search highlighting - update nodes when searchPath changes
  useEffect(() => {
    if (nodes.length === 0) return;
    
    const updatedNodes = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isHighlighted: searchPath ? node.data.path === searchPath : false,
      },
    }));
    
    setNodes(updatedNodes);

    // If search path matches, center on that node
    if (searchPath) {
      const targetNode = nodes.find((n) => n.data.path === searchPath);
      if (targetNode) {
        setTimeout(() => {
          setCenter(
            targetNode.position.x + 90,
            targetNode.position.y + 40,
            { zoom: 1.2, duration: 500 }
          );
        }, 100);
      }
    }
  }, [searchPath]);

  // Custom minimap node color
  const getMinimapNodeColor = useCallback((node: Node) => {
    if (node.data?.isHighlighted) return '#f43f5e';
    switch (node.type) {
      case 'rootNode':
        return '#8b5cf6';
      case 'objectNode':
        return '#10b981';
      case 'arrayNode':
        return '#f59e0b';
      case 'primitiveNode':
        return '#06b6d4';
      default:
        return '#94a3b8';
    }
  }, []);

  return (
    <div className="w-full h-[700px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/10 overflow-hidden border border-white/50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-white/30"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-white/30"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-white/30"></div>
          </div>
          <span className="text-white/90 text-sm font-semibold ml-2">Tree Visualization</span>
          {searchPath && (
            <span className="ml-3 px-3 py-1 bg-white/20 rounded-lg text-white text-xs font-mono">
              Searching: {searchPath}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <div className="w-3 h-3 rounded-md bg-violet-300"></div>
            <span>Root</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <div className="w-3 h-3 rounded-md bg-emerald-300"></div>
            <span>Object</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <div className="w-3 h-3 rounded-md bg-amber-300"></div>
            <span>Array</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <div className="w-3 h-3 rounded-md bg-cyan-300"></div>
            <span>Value</span>
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="h-[calc(100%-56px)] bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
            maxZoom: 1.5,
          }}
          minZoom={0.1}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false,
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color="#c4b5fd"
          />
          <Controls
            showInteractive={false}
          />
          <MiniMap
            nodeColor={getMinimapNodeColor}
            maskColor="rgba(250, 245, 255, 0.9)"
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </div>
  );
};

// Wrap with ReactFlowProvider for useReactFlow hook
export const TreeVisulizer = (props: TreeVisulizerProps) => {
  return (
    <ReactFlowProvider>
      <TreeVisulizerInner {...props} />
    </ReactFlowProvider>
  );
};
