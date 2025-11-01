'use client';

import { ecoGptTutorInitialExplanation, suggestEcoActions } from '@/ai/flows';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'tutor';
}

export function EcoTutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getInitialMessage = async () => {
      setIsLoading(true);
      try {
        const res = await ecoGptTutorInitialExplanation({
          ecoScore: 850,
          comparisonGroup: 'your city',
          averageScore: 720,
        });
        setMessages([
          { id: 1, text: res.explanation, sender: 'tutor' },
        ]);
      } catch (error) {
        console.error('Failed to get initial explanation:', error);
        setMessages([
          {
            id: 1,
            text: 'Hello! I am having trouble fetching your data right now, but I can still help. How can I assist you with your eco-journey today?',
            sender: 'tutor',
          },
        ]);
      }
      setIsLoading(false);
    };

    getInitialMessage();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A simple way to scroll to the bottom.
        setTimeout(() => {
            if(scrollAreaRef.current) {
                scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
            }
        }, 100);
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        const res = await suggestEcoActions({
            userProfile: 'A person interested in sustainability, living in an urban area.',
            ecoScore: 850,
            location: 'New York City'
        });

        const suggestionsText = "Here are some suggestions for you:\n- " + res.suggestions.join('\n- ');

        const tutorResponse: Message = {
            id: Date.now() + 1,
            text: suggestionsText,
            sender: 'tutor',
        };
        setMessages(prev => [...prev, tutorResponse]);

    } catch (error) {
      console.error('Failed to get suggestions:', error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: 'I apologize, but I am unable to provide suggestions at this moment. Please try again later.',
        sender: 'tutor',
      };
      setMessages(prev => [...prev, errorResponse]);
    }
    setIsLoading(false);
  };

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot /> EcoGPT Tutor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'tutor' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 text-sm whitespace-pre-wrap',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.text}
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-accent-foreground">
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && messages.length > 0 && (
                 <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot size={20} />
                        </AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs rounded-lg p-3 text-sm bg-muted flex items-center space-x-1">
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse delay-300"></span>
                    </div>
                 </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask for eco-friendly tips..."
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
