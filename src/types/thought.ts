
export type ThoughtType = "idea" | "belief" | "question" | "insight" | "emotion" | "contradiction";

export type ConnectionType = 
  | "supports" 
  | "contradicts" 
  | "relatesTo" 
  | "causes" 
  | "resolves";

export interface ThoughtConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
}

export interface Thought {
  id: string;
  content: string;
  type: ThoughtType;
  createdAt: string;
  position: {
    x: number;
    y: number;
  };
}

export interface ThoughtMapState {
  thoughts: Thought[];
  connections: ThoughtConnection[];
}
