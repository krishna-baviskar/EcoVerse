'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Challenge } from '@/ai/flows';
import { ScrollArea } from '@/components/ui/scroll-area';

// Simple Markdown to React component renderer
const MarkdownContent = ({ content }: { content: string }) => {
    // If content is not a string (i.e., it's undefined or null), return null to render nothing.
    if (typeof content !== 'string') {
        return null;
    }
    const lines = content.split('\\n');
    return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
            {lines.map((line, index) => {
                if (line.startsWith('# ')) {
                    return <h2 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(2)}</h2>;
                }
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-4 list-disc">{line.substring(2)}</li>;
                }
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};


interface ChallengeDetailDialogProps {
  challenge: Challenge | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChallengeDetailDialog({ challenge, open, onOpenChange }: ChallengeDetailDialogProps) {
  if (!challenge) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{challenge.title}</DialogTitle>
          <DialogDescription>
            {challenge.description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-6">
            <div className="my-4 text-sm">
                <MarkdownContent content={challenge.detailedExplanation} />
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
