
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface UpdateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSubmit: (location: string) => Promise<void>;
  isLoading: boolean;
}

export function UpdateLocationDialog({
  open,
  onOpenChange,
  onLocationSubmit,
  isLoading,
}: UpdateLocationDialogProps) {
  const [locationInput, setLocationInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput.trim()) return;

    await onLocationSubmit(locationInput.trim());
    onOpenChange(false); // Close the dialog after submission
    setLocationInput('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Update Your Location</DialogTitle>
          <DialogDescription>
            Enter your city to get a personalized EcoScore and relevant challenges.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <Input
            placeholder="Enter your city"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            disabled={isLoading}
          />
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !locationInput.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Updating...' : 'Set Location'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    