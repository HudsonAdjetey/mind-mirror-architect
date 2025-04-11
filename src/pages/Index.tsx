
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { TopBar } from '@/components/TopBar';
import { ThoughtMap } from '@/components/ThoughtMap';

const Index = () => {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-grow">
        <ReactFlowProvider>
          <ThoughtMap />
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default Index;
