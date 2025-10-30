import { Background, Position } from "reactflow";

let counterId = 1

export const jsonToFlow = (data:any, parentId:Number, path="$")=>{
     const nodes = [];
     const edges = [];

     const nodeId = counterId++;
     let label = path.split(".").pop();
     
     const type = Array.isArray(data) 
          ? "array" : typeof data === "object" && data != null 
          ? "object": "primitive";
    
    nodes.push({
        id : nodeId.toString(),
        data : { label : `${label}`, value: data, path},
        position: {
            x: (path.split(".").length - 1) * 250, // horizontal offset by depth
            y: nodeId * 100, // vertical spacing by order
            },

        style : {
            background : type === "object" ?  "#93cf5d"
                          : type === "array" ? "#86efac"
                          : "#fbbf24",
            padding : 10,
            borderRadius: 8
        },

    });

    if(parentId){
        edges.push({
            id: `${parentId}-${nodeId}`,
            source: parentId?.toString(),
            target: nodeId?.toString()

        })
    }

    if(type == "object") {
      Object.entries(data).forEach(([key,value])=>{
        const child = jsonToFlow(value, nodeId, `${path}.${key}`);
        nodes.push(...child.nodes);
        edges.push(...child.edges);
      })
    } else if(type == "array") {
      data?.forEach((value:any, index:any)=>{
        const child = jsonToFlow(value, nodeId, `${path}.${index}`);
        nodes.push(...child.nodes);
        edges.push(...child.edges);
      })
    }

    return {nodes, edges}
}