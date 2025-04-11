
import React from 'react';
import { ConnectionType } from '@/types/thought';
import { cn } from '@/lib/utils';
import { EdgeLabelRenderer, BaseEdge, EdgeProps } from '@xyflow/react';

interface ConnectionLineProps extends EdgeProps {
  data?: {
    type: ConnectionType;
  };
}

const connectionColors: Record<ConnectionType, string> = {
  supports: 'stroke-green-500',
  contradicts: 'stroke-red-500',
  relatesTo: 'stroke-blue-500',
  causes: 'stroke-purple-500',
  resolves: 'stroke-yellow-500',
};

const connectionLabels: Record<ConnectionType, string> = {
  supports: 'Supports',
  contradicts: 'Contradicts',
  relatesTo: 'Relates To',
  causes: 'Causes',
  resolves: 'Resolves',
};

export function ConnectionLine({ 
  id, 
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: ConnectionLineProps) {
  const connectionType = data?.type || 'relatesTo';
  
  return (
    <>
      <BaseEdge 
        id={id}
        path={`M ${sourceX},${sourceY} C ${sourceX} ${sourceY + 50}, ${targetX} ${targetY - 50}, ${targetX} ${targetY}`}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: connectionType === 'supports' ? '#22c55e' : 
                  connectionType === 'contradicts' ? '#ef4444' :
                  connectionType === 'relatesTo' ? '#3b82f6' :
                  connectionType === 'causes' ? '#a855f7' : '#eab308',
        }}
        markerEnd={markerEnd}
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px, ${(sourceY + targetY) / 2}px)`,
            pointerEvents: 'all',
          }}
          className="px-2 py-1 bg-white rounded-md shadow-sm border text-xs font-medium cursor-pointer select-none"
        >
          {connectionLabels[connectionType]}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
