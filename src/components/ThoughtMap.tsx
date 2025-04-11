
import React, { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge, 
  Connection, 
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useThoughtStore } from '@/store/thought-store';
import { ThoughtNode } from './ThoughtNode';
import { ConnectionLine } from './ConnectionLine';
import { ThoughtEditor } from './ThoughtEditor';
import { AddConnectionModal } from './AddConnectionModal';
import { Thought, ThoughtConnection } from '@/types/thought';
import { Button } from '@/components/ui/button';
import { PlusCircle, Link } from 'lucide-react';
import { toast } from 'sonner';

const nodeTypes = {
  thought: ThoughtNode,
};

const edgeTypes = {
  connection: ConnectionLine,
};

export function ThoughtMap() {
  const thoughts = useThoughtStore((state) => state.thoughts);
  const connections = useThoughtStore((state) => state.connections);
  
  // State for node creation
  const [isCreatingThought, setIsCreatingThought] = useState(false);
  const [creatingPosition, setCreatingPosition] = useState({ x: 0, y: 0 });
  
  // State for connection creation
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [sourceThought, setSourceThought] = useState<Thought | null>(null);
  
  // ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Convert thoughts and connections to ReactFlow nodes and edges
  React.useEffect(() => {
    const flowNodes: Node[] = thoughts.map((thought) => ({
      id: thought.id,
      type: 'thought',
      position: thought.position,
      data: { thought },
    }));
    
    setNodes(flowNodes);
    
    const flowEdges: Edge[] = connections.map((connection) => ({
      id: connection.id,
      source: connection.sourceId,
      target: connection.targetId,
      type: 'connection',
      data: { type: connection.type },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    }));
    
    setEdges(flowEdges);
  }, [thoughts, connections, setNodes, setEdges]);
  
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        setIsCreatingConnection(true);
        const sourceThought = thoughts.find(t => t.id === connection.source);
        if (sourceThought) {
          setSourceThought(sourceThought);
        }
      }
    },
    [thoughts]
  );
  
  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.detail === 2) { // Double click
        const reactFlowBounds = event.currentTarget.getBoundingClientRect();
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top
        };
        
        setCreatingPosition(position);
        setIsCreatingThought(true);
      }
    },
    []
  );
  
  const handleCreateThoughtClick = useCallback(() => {
    // Default position in the center of the viewport
    setCreatingPosition({ x: window.innerWidth / 3, y: window.innerHeight / 3 });
    setIsCreatingThought(true);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Button onClick={handleCreateThoughtClick} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Thought
        </Button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      
      {isCreatingThought && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-xl w-96">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Create New Thought</h3>
            </div>
            <ThoughtEditor
              isCreating={true}
              position={creatingPosition}
              onComplete={() => setIsCreatingThought(false)}
            />
          </div>
        </div>
      )}
      
      <AddConnectionModal
        isOpen={isCreatingConnection}
        onClose={() => {
          setIsCreatingConnection(false);
          setSourceThought(null);
        }}
        sourceThought={sourceThought}
      />
    </div>
  );
}
