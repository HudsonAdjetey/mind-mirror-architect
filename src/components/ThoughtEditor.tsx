
import React, { useState } from 'react';
import { Thought, ThoughtType } from '@/types/thought';
import { useThoughtStore } from '@/store/thought-store';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ThoughtEditorProps {
  thought?: Thought;
  onComplete: () => void;
  position?: { x: number; y: number };
  isCreating?: boolean;
}

export function ThoughtEditor({ 
  thought, 
  onComplete, 
  position,
  isCreating = false
}: ThoughtEditorProps) {
  const addThought = useThoughtStore((state) => state.addThought);
  const updateThought = useThoughtStore((state) => state.updateThought);
  
  const [content, setContent] = useState(thought?.content || '');
  const [type, setType] = useState<ThoughtType>(thought?.type || 'idea');
  
  const handleSave = () => {
    if (content.trim() === '') return;
    
    if (isCreating && position) {
      addThought(content, type, position);
    } else if (thought) {
      updateThought(thought.id, content, type);
    }
    
    onComplete();
  };
  
  return (
    <div className="p-3 space-y-3">
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[100px]"
          autoFocus
        />
      </div>
      
      <div className="space-y-2">
        <Select value={type} onValueChange={(value) => setType(value as ThoughtType)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="idea">Idea</SelectItem>
            <SelectItem value="belief">Belief</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="insight">Insight</SelectItem>
            <SelectItem value="emotion">Emotion</SelectItem>
            <SelectItem value="contradiction">Contradiction</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" onClick={onComplete}>Cancel</Button>
        <Button onClick={handleSave}>{isCreating ? 'Create' : 'Save'}</Button>
      </div>
    </div>
  );
}
