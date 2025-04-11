
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Thought, ThoughtConnection, ThoughtType, ConnectionType } from '@/types/thought';

interface ThoughtState {
  thoughts: Thought[];
  connections: ThoughtConnection[];
  addThought: (content: string, type: ThoughtType, position: { x: number; y: number }) => Thought;
  updateThought: (id: string, content: string, type: ThoughtType) => void;
  removeThought: (id: string) => void;
  addConnection: (sourceId: string, targetId: string, type: ConnectionType) => ThoughtConnection;
  updateConnection: (id: string, type: ConnectionType) => void;
  removeConnection: (id: string) => void;
}

export const useThoughtStore = create<ThoughtState>()(
  persist(
    (set) => ({
      thoughts: [],
      connections: [],
      
      addThought: (content, type, position) => {
        const newThought: Thought = {
          id: uuidv4(),
          content,
          type,
          createdAt: new Date().toISOString(),
          position,
        };
        
        set((state) => ({
          thoughts: [...state.thoughts, newThought]
        }));
        
        return newThought;
      },
      
      updateThought: (id, content, type) => {
        set((state) => ({
          thoughts: state.thoughts.map(thought => 
            thought.id === id ? { ...thought, content, type } : thought
          )
        }));
      },
      
      removeThought: (id) => {
        set((state) => ({
          thoughts: state.thoughts.filter(thought => thought.id !== id),
          connections: state.connections.filter(
            connection => connection.sourceId !== id && connection.targetId !== id
          )
        }));
      },
      
      addConnection: (sourceId, targetId, type) => {
        const newConnection: ThoughtConnection = {
          id: uuidv4(),
          sourceId,
          targetId,
          type,
        };
        
        set((state) => ({
          connections: [...state.connections, newConnection]
        }));
        
        return newConnection;
      },
      
      updateConnection: (id, type) => {
        set((state) => ({
          connections: state.connections.map(connection => 
            connection.id === id ? { ...connection, type } : connection
          )
        }));
      },
      
      removeConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter(connection => connection.id !== id)
        }));
      },
    }),
    {
      name: 'thought-map-storage',
    }
  )
);
