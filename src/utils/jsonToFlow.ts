import dagre from 'dagre';
import { Node, Edge } from 'reactflow';

interface NodeData {
  label: string;
  value: unknown;
  path: string;
  type: 'object' | 'array' | 'primitive';
  childCount?: number;
  isHighlighted?: boolean;
}

interface FlowResult {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

// Get the type of JSON value
const getJsonType = (data: unknown): 'object' | 'array' | 'primitive' => {
  if (Array.isArray(data)) return 'array';
  if (typeof data === 'object' && data !== null) return 'object';
  return 'primitive';
};

// Build nodes and edges recursively
const buildNodesAndEdges = (
  data: unknown,
  parentId: string | null,
  path: string,
  nodes: Node<NodeData>[],
  edges: Edge[],
  idCounter: { current: number },
  isRoot: boolean = false
): void => {
  const nodeId = `node-${idCounter.current++}`;
  const label = path === '$' ? 'root' : path.split('.').pop() || '';
  const type = getJsonType(data);

  // Determine node type for custom rendering
  let nodeType = 'primitiveNode';
  if (isRoot) {
    nodeType = 'rootNode';
  } else if (type === 'object') {
    nodeType = 'objectNode';
  } else if (type === 'array') {
    nodeType = 'arrayNode';
  }

  // Calculate child count for objects and arrays
  let childCount: number | undefined;
  if (type === 'object' && data !== null) {
    childCount = Object.keys(data as object).length;
  } else if (type === 'array') {
    childCount = (data as unknown[]).length;
  }

  nodes.push({
    id: nodeId,
    type: nodeType,
    data: {
      label,
      value: type === 'primitive' ? data : undefined,
      path,
      type,
      childCount,
      isHighlighted: false,
    },
    position: { x: 0, y: 0 }, // Will be calculated by dagre
  });

  if (parentId) {
    edges.push({
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#94a3b8',
        strokeWidth: 2,
      },
    });
  }

  // Process children for objects and arrays
  if (type === 'object' && data !== null) {
    Object.entries(data as object).forEach(([key, value]) => {
      buildNodesAndEdges(value, nodeId, `${path}.${key}`, nodes, edges, idCounter);
    });
  } else if (type === 'array') {
    (data as unknown[]).forEach((item, index) => {
      buildNodesAndEdges(item, nodeId, `${path}[${index}]`, nodes, edges, idCounter);
    });
  }
};

// Apply dagre layout to position nodes
const applyDagreLayout = (nodes: Node[], edges: Edge[]): void => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: 'TB', // Top to Bottom
    nodesep: 60,   // Horizontal spacing between nodes
    ranksep: 80,   // Vertical spacing between ranks
    marginx: 20,
    marginy: 20,
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - NODE_WIDTH / 2,
      y: nodeWithPosition.y - NODE_HEIGHT / 2,
    };
  });
};

// Main export function - converts JSON to React Flow format
export const jsonToFlow = (data: unknown, searchPath?: string): FlowResult => {
  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];
  const idCounter = { current: 0 };

  // Build the tree structure
  buildNodesAndEdges(data, null, '$', nodes, edges, idCounter, true);

  // Apply layout
  applyDagreLayout(nodes, edges);

  // Apply search highlighting
  if (searchPath) {
    nodes.forEach((node) => {
      node.data.isHighlighted = node.data.path === searchPath;
    });
  }

  return { nodes, edges };
};

// Export for highlighting updates
export const highlightNodes = (
  nodes: Node<NodeData>[],
  searchPath: string
): Node<NodeData>[] => {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      isHighlighted: node.data.path === searchPath,
    },
  }));
};
