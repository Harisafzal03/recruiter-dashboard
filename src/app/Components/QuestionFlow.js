import React, { useRef, useCallback, useState, forwardRef, useImperativeHandle, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  getViewport
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

export const QuestionFlow = forwardRef(({ onFlowChange, fileInputRef }, ref) => {
  const dropRef = useRef(null);
  const reactFlowRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [firstOptionsNodeId, setFirstOptionsNodeId] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

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
    setTimeout(() => handleFlowChange(), 0);
  };

  const handleEdgesChange = (changes) => {
    onEdgesChange(changes);
    setTimeout(() => handleFlowChange(), 0);
  };

  // Get the next node ID in sequence
  const getNextNodeId = useCallback(() => {
    const nextId = nodeIdCounter + 1;
    setNodeIdCounter(nextId);
    return `node_${nextId}`;
  }, [nodeIdCounter]);

  const createNode = (item, position) => {
    const newNodeId = getNextNodeId();
    const questionId = `question_${nodeIdCounter}`;
    
    let isFirstNode = false;
    if (item.type === "options" && !firstOptionsNodeId) {
      isFirstNode = true;
      setFirstOptionsNodeId(newNodeId);
    }

    const newNode = {
      id: newNodeId,
      type: "questionNode",
      position,
      data: {
        ...item,
        id: questionId,
        options: item.options || [{ id: `opt1_${questionId}`, text: "Option 1" }],
        isFirstNode: isFirstNode,
        updateNodeData: updateNodeData,
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
      if (!reactFlowRef.current) return;
      
      // Get client offset where the item was dropped
      const clientOffset = monitor.getClientOffset();
      
      // Get ReactFlow container bounds
      const reactFlowBounds = reactFlowRef.current.getBoundingClientRect();
      
      // Calculate position relative to the ReactFlow container
      const position = {
        x: clientOffset.x - reactFlowBounds.left,
        y: clientOffset.y - reactFlowBounds.top
      };
      
      // Adjust based on viewport zoom and pan
      if (reactFlowRef.current.viewportRef) {
        const { zoom, x: panX, y: panY } = reactFlowRef.current.viewportRef.current.getViewport();
        position.x = (position.x - panX) / zoom;
        position.y = (position.y - panY) / zoom;
      }

      createNode(item, position);
    }
  });

  const simplifyFlowData = (nodes, edges) => {
    const simplifiedNodes = nodes.map(node => ({
      id: node.id,
      position: node.position,
      data: {
        type: node.data.type,
        title: node.data.title,
        isFirstNode: node.data.isFirstNode,
        options: node.data.options ? node.data.options.map(opt => ({
          id: opt.id,
          text: opt.text
        })) : undefined,
        answerText: node.data.answerText,
        endText: node.data.endText
      }
    }));

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

  const importFlow = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Find the highest node number to continue the sequence
          let highestNodeNum = 0;
          importedData.nodes.forEach(node => {
            const nodeNumMatch = node.id.match(/node_(\d+)/);
            if (nodeNumMatch && parseInt(nodeNumMatch[1]) > highestNodeNum) {
              highestNodeNum = parseInt(nodeNumMatch[1]);
            }
          });
          setNodeIdCounter(highestNodeNum);

          let firstOptionsId = null;
          for (const node of importedData.nodes) {
            if (node.data.type === "options" && node.data.isFirstNode) {
              firstOptionsId = node.id;
              break;
            }
          }
          setFirstOptionsNodeId(firstOptionsId);

          const restoredNodes = importedData.nodes.map(node => ({
            id: node.id,
            type: "questionNode",
            position: node.position,
            data: {
              id: node.data.id || `question_${node.id.split('_')[1]}`,
              type: node.data.type,
              title: node.data.title,
              options: node.data.options,
              isFirstNode: node.data.isFirstNode || false,
              answerText: node.data.answerText,
              endText: node.data.endText,
              updateNodeData: updateNodeData,
            }
          }));

          const restoredEdges = importedData.edges.map((edge, index) => ({
            id: edge.id || `edge_${index}`,
            source: edge.source,
            sourceHandle: edge.sourceHandle,
            target: edge.target,
            targetHandle: edge.targetHandle || null,
            ...edgeOptions
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

  useImperativeHandle(ref, () => ({
    exportFlow,
  }));

  React.useEffect(() => {
    if (fileInputRef?.current) {
      fileInputRef.current.addEventListener('change', importFlow);
      
      return () => {
        if (fileInputRef?.current) {
          fileInputRef.current.removeEventListener('change', importFlow);
        }
      };
    }
  }, [fileInputRef]);

  drop(dropRef);

  return (
    <div className="relative flex-1 h-[calc(90vh-4rem)] bg-white ml-14 max-xl:ml-0 rounded-lg">
      <div ref={dropRef} className="h-full border rounded-[16px] overflow-hidden border-[#F1EAF6]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={edgeOptions}
          proOptions={{ hideAttribution: true }}
          ref={reactFlowRef}
        >
        </ReactFlow>
      </div>
    </div>
  );
});