
import React, { useState } from 'react';
import { ConnectionType, Thought } from '@/types/thought';
import { useThoughtStore } from '@/store/thought-store';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceThought: Thought | null;
}

export function AddConnectionModal({ isOpen, onClose, sourceThought }: AddConnectionModalProps) {
  const [targetId, setTargetId] = useState<string>('');
  const [connectionType, setConnectionType] = useState<ConnectionType>('relatesTo');
  
  const thoughts = useThoughtStore((state) => state.thoughts);
  const addConnection = useThoughtStore((state) => state.addConnection);
  
  // Filter out the source thought and get available targets
  const availableTargets = thoughts.filter(
    thought => !sourceThought || thought.id !== sourceThought.id
  );

  const handleAddConnection = () => {
    if (!sourceThought || !targetId) return;
    
    addConnection(sourceThought.id, targetId, connectionType);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Connection</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {sourceThought && (
            <div className="space-y-2">
              <div className="text-sm font-medium">From</div>
              <div className="p-2 bg-gray-100 rounded-md text-sm">
                {sourceThought.content.length > 50 
                  ? `${sourceThought.content.substring(0, 50)}...` 
                  : sourceThought.content}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="text-sm font-medium">To</div>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a thought" />
              </SelectTrigger>
              <SelectContent>
                {availableTargets.map((thought) => (
                  <SelectItem key={thought.id} value={thought.id}>
                    {thought.content.length > 30 
                      ? `${thought.content.substring(0, 30)}...` 
                      : thought.content}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">Connection Type</div>
            <Select 
              value={connectionType} 
              onValueChange={(value) => setConnectionType(value as ConnectionType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Connection type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supports">Supports</SelectItem>
                <SelectItem value="contradicts">Contradicts</SelectItem>
                <SelectItem value="relatesTo">Relates To</SelectItem>
                <SelectItem value="causes">Causes</SelectItem>
                <SelectItem value="resolves">Resolves</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddConnection}>
            Create Connection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
