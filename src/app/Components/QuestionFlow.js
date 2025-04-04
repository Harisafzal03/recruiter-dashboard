import React, { useRef, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useDrop } from "react-dnd";
import { QuestionNode } from "./QuestionNode";
import "reactflow/dist/style.css";

const nodeTypes = {
  questionNode: QuestionNode,
};

const edgeOptions = {
  style: { strokeDasharray: "5,5" },
  type: "smoothstep",
  animated: true,
};

export function QuestionFlow() {
  const dropRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, ...edgeOptions }, eds)),
    [setEdges],
  );

  const createNode = (item, position) => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: "questionNode",
      position,
      data: {
        ...item,
        id: `question_${Date.now()}`,
        options: item.options || [{ id: `opt1_${Date.now()}`, text: "Option 1" }],
      },
    };
    setNodes((nds) => [...nds, newNode]);
    return newNode.id;
  };

  const [, drop] = useDrop({
    accept: "question",
    drop: (item, monitor) => {
      const position = monitor.getClientOffset();
      if (position) {
        createNode(item, {
          x: position.x - 350,
          y: position.y - 100,
        });
      }
    },
  });

  drop(dropRef);

  return (
    <div ref={dropRef} className="flex-1 h-[calc(90vh-4rem)] bg-white border-2 my-5 mr-4 rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={edgeOptions}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}