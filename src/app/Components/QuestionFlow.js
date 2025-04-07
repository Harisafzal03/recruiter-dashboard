import React, { useRef, useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { useDrop } from "react-dnd";
import { QuestionNode } from "./QuestionNode";
import { Button } from "../../components/ui/button";
import { Download, Upload } from "lucide-react";
import "reactflow/dist/style.css";

const nodeTypes = {
  questionNode: QuestionNode,
};

const edgeOptions = {
  style: { strokeDasharray: "5,5" },
  type: "smoothstep",
  animated: true,
};

export function QuestionFlow({ onFlowChange }) {
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge({ ...params, ...edgeOptions }, edges);
      setEdges(newEdges);
      if (onFlowChange) onFlowChange({ nodes, edges: newEdges });
    },
    [setEdges, edges, nodes, onFlowChange]
  );

  const handleFlowChange = useCallback(() => {
    if (onFlowChange) onFlowChange({ nodes, edges });
  }, [nodes, edges, onFlowChange]);

  const handleNodesChange = (changes) => {
    onNodesChange(changes);
    handleFlowChange();
  };

  const handleEdgesChange = (changes) => {
    onEdgesChange(changes);
    handleFlowChange();
  };

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
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    if (onFlowChange) onFlowChange({ nodes: updatedNodes, edges });
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

  // Simplify the flow data for export
  const simplifyFlowData = (nodes, edges) => {
    // Simplify nodes
    const simplifiedNodes = nodes.map(node => ({
      id: node.id,
      position: node.position,
      data: {
        type: node.data.type,
        title: node.data.title,
        options: node.data.options ? node.data.options.map(opt => ({
          id: opt.id,
          text: opt.text
        })) : undefined
      }
    }));

    // Simplify edges - only keep essential connection info
    const simplifiedEdges = edges.map(edge => ({
      source: edge.source,
      sourceHandle: edge.sourceHandle,
      target: edge.target
    }));

    return { 
      nodes: simplifiedNodes, 
      edges: simplifiedEdges 
    };
  };

  // Export flow as simplified JSON
  const exportFlow = () => {
    const simplifiedData = simplifyFlowData(nodes, edges);
    const jsonString = JSON.stringify(simplifiedData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "flowchart.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import flow from JSON and restore to ReactFlow format
  const importFlow = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Restore nodes with required ReactFlow properties
          const restoredNodes = importedData.nodes.map(node => ({
            id: node.id,
            type: "questionNode",
            position: node.position,
            data: {
              id: node.data.id || `question_${node.id.split('_')[1]}`,
              type: node.data.type,
              title: node.data.title,
              options: node.data.options
            }
          }));
          
          // Restore edges with required ReactFlow properties
          const restoredEdges = importedData.edges.map(edge => ({
            id: `reactflow__edge-${edge.source}${edge.sourceHandle || ''}-${edge.target}`,
            source: edge.source,
            sourceHandle: edge.sourceHandle,
            target: edge.target,
            targetHandle: edge.targetHandle || null,
            ...edgeOptions  // Add back the default edge styling
          }));
          
          setNodes(restoredNodes);
          setEdges(restoredEdges);
          
          if (onFlowChange) onFlowChange({ nodes: restoredNodes, edges: restoredEdges });
        } catch (error) {
          console.error("Failed to parse flow data:", error);
          alert("Invalid flow data format.");
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="relative flex-1 h-[calc(90vh-4rem)] bg-white border-2 my-5 mr-4 rounded-lg">
      <div className="flex gap-2 p-2 bg-white border-b border-gray-200" style={{ zIndex: 5 }}>
        <Button 
          onClick={exportFlow}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export Flow
        </Button>
        <Button 
          onClick={handleImportClick}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Import Flow
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importFlow}
          className="hidden"
        />
      </div>

      <div ref={dropRef} className="h-[calc(100%-40px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={edgeOptions}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}