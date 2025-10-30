import ReactFlow, { Background, Controls, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";

import { useEffect } from "react";
import { jsonToFlow } from "../utils/jsonToFlow";


export const TreeVisulizer = (props: any) => {

    const { nodes: initialNodes, edges: initialEdges } = jsonToFlow(props.data, 0, "$");

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    useEffect(() => {
        if (!props.searchPath) return;

        const updated = nodes.map((n: any) => ({
            ...n,
            style: {
                ...n.style,
                border:
                    n.data.path === props.searchPath ? '3px solid red' : '1px solid transperent'
            }
        }));
        setNodes(updated);

    }, [props.searchPath]);

    useEffect(() => {
        const { nodes: newNodes, edges: newEdges } = jsonToFlow(props.data, 0, "$");
        setNodes(newNodes);
        setEdges(newEdges);
    }, [props.data]);


    return (
        <div className="w-full h-[600px] bg-white rounded shadow mt-4">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}