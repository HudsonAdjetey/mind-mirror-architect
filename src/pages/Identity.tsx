
import React, { useMemo } from 'react';
import { TopBar } from '@/components/TopBar';
import { useThoughtStore } from '@/store/thought-store';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Anchor, 
  AlertTriangle,
  Brain,
  Lightbulb,
  Heart,
  Scales,
  Puzzle,
  UserSquare
} from 'lucide-react';
import { ThoughtType, ConnectionType } from '@/types/thought';

const Identity = () => {
  const thoughts = useThoughtStore((state) => state.thoughts);
  const connections = useThoughtStore((state) => state.connections);

  // Calculate identity metrics
  const metrics = useMemo(() => {
    // Count thoughts by type
    const thoughtsByType = thoughts.reduce<Record<ThoughtType, number>>((acc, thought) => {
      acc[thought.type] = (acc[thought.type] || 0) + 1;
      return acc;
    }, {
      idea: 0,
      belief: 0,
      question: 0,
      insight: 0,
      emotion: 0,
      contradiction: 0,
    });
    
    // Count connections by type
    const connectionsByType = connections.reduce<Record<ConnectionType, number>>((acc, connection) => {
      acc[connection.type] = (acc[connection.type] || 0) + 1;
      return acc;
    }, {
      supports: 0,
      contradicts: 0,
      relatesTo: 0,
      causes: 0,
      resolves: 0,
    });
    
    // Find most connected thoughts (to identify core beliefs)
    const thoughtConnections = thoughts.map(thought => {
      const outgoingConnections = connections.filter(c => c.sourceId === thought.id);
      const incomingConnections = connections.filter(c => c.targetId === thought.id);
      return {
        thought,
        connectionCount: outgoingConnections.length + incomingConnections.length
      };
    }).sort((a, b) => b.connectionCount - a.connectionCount);
    
    // Find contradictions
    const contradictions = connections.filter(conn => conn.type === 'contradicts');
    
    // Calculate thought patterns
    let dominantThoughtType: ThoughtType = 'idea';
    let maxCount = 0;
    
    Object.entries(thoughtsByType).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantThoughtType = type as ThoughtType;
      }
    });

    return {
      thoughtsByType,
      connectionsByType,
      coreThoughts: thoughtConnections.slice(0, 5),
      contradictions,
      dominantThoughtType,
      totalThoughts: thoughts.length,
      totalConnections: connections.length,
    };
  }, [thoughts, connections]);

  // Calculate archetype based on thought patterns
  const archetype = useMemo(() => {
    if (thoughts.length < 5) {
      return "Explorer"; // Default for new users
    }
    
    const { dominantThoughtType } = metrics;
    
    switch (dominantThoughtType) {
      case 'idea':
        return "Visionary";
      case 'belief':
        return "Architect";
      case 'question':
        return "Inquirer";
      case 'insight':
        return "Sage";
      case 'emotion':
        return "Empath";
      case 'contradiction':
        return "Dialectic";
      default:
        return "Explorer";
    }
  }, [metrics, thoughts.length]);

  if (thoughts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <div className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Identity Blueprint</CardTitle>
              <CardDescription>Start by adding thoughts to your map</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Brain className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-muted-foreground">
                  Your identity blueprint will emerge as you add thoughts and connections to your map.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Identity Blueprint</h1>
            <p className="text-muted-foreground">
              Your cognitive patterns and thought structures
            </p>
          </div>
          <Card className="w-64">
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-center text-lg">Core Archetype</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col items-center py-4">
                <UserSquare className="h-12 w-12 text-purple-600 mb-2" />
                <span className="text-2xl font-bold">{archetype}</span>
                <span className="text-xs text-muted-foreground">Based on {thoughts.length} thoughts</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Thought Patterns</TabsTrigger>
            <TabsTrigger value="contradictions">Contradictions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Thought Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <span>Ideas</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{metrics.thoughtsByType.idea}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Anchor className="h-4 w-4 text-purple-600" />
                        <span>Beliefs</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{metrics.thoughtsByType.belief}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600 rotate-180" />
                        <span>Questions</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{metrics.thoughtsByType.question}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Puzzle className="h-4 w-4 text-green-600" />
                        <span>Insights</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{metrics.thoughtsByType.insight}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-600" />
                        <span>Emotions</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{metrics.thoughtsByType.emotion}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span>Contradictions</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{metrics.thoughtsByType.contradiction}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scales className="h-5 w-5 text-purple-600" />
                    Connection Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Supports</span>
                      <span className="font-medium">{metrics.connectionsByType.supports}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Contradicts</span>
                      <span className="font-medium">{metrics.connectionsByType.contradicts}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Relates To</span>
                      <span className="font-medium">{metrics.connectionsByType.relatesTo}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Causes</span>
                      <span className="font-medium">{metrics.connectionsByType.causes}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Resolves</span>
                      <span className="font-medium">{metrics.connectionsByType.resolves}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>Core Beliefs</CardTitle>
                  <CardDescription>Your most connected thoughts</CardDescription>
                </CardHeader>
                <CardContent>
                  {metrics.coreThoughts.length > 0 ? (
                    <div className="space-y-4">
                      {metrics.coreThoughts.map(({ thought, connectionCount }) => (
                        <div key={thought.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium uppercase text-gray-500">
                              {thought.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {connectionCount} connections
                            </span>
                          </div>
                          <p className="text-sm">
                            {thought.content.length > 100 
                              ? `${thought.content.substring(0, 100)}...` 
                              : thought.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Start connecting your thoughts to see patterns emerge
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="patterns">
            <Card>
              <CardHeader>
                <CardTitle>Thought Patterns</CardTitle>
                <CardDescription>
                  Recurring themes and patterns in your thoughts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  As you add more thoughts and connections, this view will analyze patterns 
                  to provide deep insights about your mental models.
                </p>
                {thoughts.length >= 10 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Common Themes</h3>
                      <p className="text-sm text-muted-foreground">
                        Theme analysis will appear here after adding more diverse thoughts.
                      </p>
                    </div>
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2">Cognitive Biases</h3>
                      <p className="text-sm text-muted-foreground">
                        Potential biases will be identified based on your thought patterns.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Add at least 10 thoughts to unlock pattern analysis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contradictions">
            <Card>
              <CardHeader>
                <CardTitle>Contradictions</CardTitle>
                <CardDescription>
                  Identified contradictions in your thought map
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.contradictions.length > 0 ? (
                  <div className="space-y-4">
                    {metrics.contradictions.map(connection => {
                      const sourceThought = thoughts.find(t => t.id === connection.sourceId);
                      const targetThought = thoughts.find(t => t.id === connection.targetId);
                      
                      if (!sourceThought || !targetThought) return null;
                      
                      return (
                        <div key={connection.id} className="p-4 border rounded-md bg-red-50">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <h3 className="font-medium">Contradiction Found</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-white rounded-md">
                              <div className="text-xs font-medium uppercase text-gray-500 mb-1">
                                {sourceThought.type}
                              </div>
                              <p className="text-sm">{sourceThought.content}</p>
                            </div>
                            
                            <div className="p-3 bg-white rounded-md">
                              <div className="text-xs font-medium uppercase text-gray-500 mb-1">
                                {targetThought.type}
                              </div>
                              <p className="text-sm">{targetThought.content}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No contradictions have been identified in your thought map yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Identity;
