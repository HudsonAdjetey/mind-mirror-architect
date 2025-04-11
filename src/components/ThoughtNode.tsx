
import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Thought, ThoughtType } from '@/types/thought';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  Anchor, 
  HelpCircle, 
  Zap, 
  Heart, 
  AlertTriangle,
  Pencil,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useThoughtStore } from '@/store/thought-store';
import { ThoughtEditor } from './ThoughtEditor';

interface ThoughtNodeProps {
  data: {
    thought: Thought;
  };
}

const typeIcons: Record<ThoughtType, React.ReactNode> = {
  idea: <Lightbulb className="h-4 w-4" />,
  belief: <Anchor className="h-4 w-4" />,
  question: <HelpCircle className="h-4 w-4" />,
  insight: <Zap className="h-4 w-4" />,
  emotion: <Heart className="h-4 w-4" />,
  contradiction: <AlertTriangle className="h-4 w-4" />,
};

const typeColors: Record<ThoughtType, string> = {
  idea: 'bg-blue-100 text-blue-800',
  belief: 'bg-purple-100 text-purple-800',
  question: 'bg-yellow-100 text-yellow-800',
  insight: 'bg-green-100 text-green-800',
  emotion: 'bg-pink-100 text-pink-800',
  contradiction: 'bg-red-100 text-red-800',
};

export function ThoughtNode({ data }: ThoughtNodeProps) {
  const { thought } = data;
  const removeThought = useThoughtStore((state) => state.removeThought);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    removeThought(thought.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="p-2 bg-white rounded-lg shadow-md w-64">
        <ThoughtEditor 
          thought={thought}
          onComplete={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-64 p-0 overflow-hidden">
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-gray-400" />
      
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
        <Badge variant="outline" className={cn("flex gap-1 items-center", typeColors[thought.type])}>
          {typeIcons[thought.type]}
          <span className="capitalize">{thought.type}</span>
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="px-4 py-3">
        <p className="text-sm break-words">{thought.content}</p>
      </div>
      
      <div className="px-4 py-2 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {new Date(thought.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
