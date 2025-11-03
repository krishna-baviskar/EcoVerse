'use client';

import {
  ecoGptTutorInitialExplanation,
  suggestEcoActions,
  generateQuiz,
} from '@/ai/flows';
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
import { Bot, Send, User, BrainCircuit, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'tutor';
  actions?: TutorAction[];
}

interface TutorAction {
  label: string;
  action: () => Promise<void>;
}

export function EcoTutorChat({ location }: { location: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const handleActionClick = async (action: () => Promise<void>) => {
    await action();
  };

  const getQuiz = async () => {
    setIsLoading(true);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: 'Give me a quiz about sustainability.',
        sender: 'user',
      },
    ]);
    try {
      const res = await generateQuiz({
        topic: 'sustainability',
        questionCount: 3,
      });
      const quizText =
        "Here's a quick quiz for you:\n\n" +
        res.questions
          .map(
            (q, i) =>
              `${i + 1}. ${q.question}\n` +
              q.options.map(o => `   - ${o}`).join('\n') +
              `\nAnswer: ${q.answer}`
          )
          .join('\n\n');
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: quizText, sender: 'tutor' },
      ]);
    } catch (error) {
      console.error('Failed to get quiz:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'I apologize, but I am unable to generate a quiz right now. Please try again later.',
          sender: 'tutor',
        },
      ]);
    }
    setIsLoading(false);
  };

  const getChallenges = async () => {
    setIsLoading(true);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        text: 'Suggest some eco-challenges for me.',
        sender: 'user',
      },
    ]);
    try {
      const res = await suggestEcoActions({
        userProfile:
          'A person interested in sustainability, living in an urban area, looking for challenges.',
        ecoScore: 850,
        location: location,
      });
      const suggestionsText =
        'Here are some challenges for you:\n- ' +
        res.suggestions.join('\n- ');
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: suggestionsText, sender: 'tutor' },
      ]);
    } catch (error) {
      console.error('Failed to get challenges:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'I apologize, but I am unable to provide challenges at this moment. Please try again later.',
          sender: 'tutor',
        },
      ]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const getInitialMessage = () => {
      setIsLoading(true);
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your EcoGPT Tutor. How can I help you today?",
          sender: 'tutor',
          actions: [
            {
              label: 'Give me a quiz',
              action: getQuiz,
            },
            {
              label: 'Suggest a challenge',
              action: getChallenges,
            },
          ],
        },
      ]);
      setIsLoading(false);
    };

    getInitialMessage();
  }, []);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        userProfile:
          'A person interested in sustainability, living in an urban area.',
        ecoScore: 850,
        location: location,
      });

      const suggestionsText =
        'Here are some suggestions for you:\n- ' +
        res.suggestions.join('\n- ');

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
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Bot /> EcoGPT Tutor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}
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
                <div className="flex flex-col gap-2">
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
                  {message.sender === 'tutor' && message.actions && (
                    <div className="flex gap-2">
                      {message.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleActionClick(action.action)}
                          disabled={isLoading}
                          className="bg-card"
                        >
                          {action.label === 'Give me a quiz' ? (
                            <BrainCircuit className="mr-2 h-4 w-4" />
                          ) : (
                            <Zap className="mr-2 h-4 w-4" />
                          )}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
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
