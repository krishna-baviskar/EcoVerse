'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bot, X } from 'lucide-react'; 
import { EcoTutorChat } from './eco-tutor-chat';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function FloatingEcoTutor({ location }: { location: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="primary"
                    size="icon"
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
                >
                    <Bot size={28} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className={cn(
                    "w-96 rounded-xl shadow-lg mr-2 mb-2 p-0 border-0",
                    "sm:w-[550px]"
                )}
            >
                <EcoTutorChat location={location} />
            </PopoverContent>
        </Popover>
    );
}
