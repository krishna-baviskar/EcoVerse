
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
import { Label } from '@/components/ui/label';
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
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Construct the full location string for display and storage.
    const profileLocation = [address, city, state, country].filter(part => part.trim() !== '').join(', ');

    if (!city.trim()) return;

    // The `onLocationSubmit` function in page.tsx will handle both saving to the DB and fetching data.
    // The fetching logic should be smart enough to extract the city for API calls.
    await onLocationSubmit(profileLocation);
    onOpenChange(false); // Close the dialog after submission
    setAddress('');
    setCity('');
    setState('');
    setCountry('');
  };

  const isSubmitDisabled = isLoading || !city.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Update Your Location</DialogTitle>
          <DialogDescription>
            Enter your location details to get a personalized EcoScore and relevant challenges.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              placeholder="e.g., 123 Main St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g., San Francisco"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State / Province (Optional)</Label>
            <Input
              id="state"
              placeholder="e.g., CA"
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country (Optional)</Label>
            <Input
              id="country"
              placeholder="e.g., USA"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Updating...' : 'Set Location'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
