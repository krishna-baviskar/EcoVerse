'use client';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { validateSustainableAction } from '@/ai/flows';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info, Loader2, XCircle } from 'lucide-react';

const formSchema = z.object({
  action: z.string().min(5, {
    message: 'Action must be at least 5 characters.',
  }),
  evidence: z.string().optional(),
});

type ValidationResult = {
    isValid: boolean;
    ecoPoints?: number;
    reason?: string;
}

export function LogActionDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: '',
      evidence: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const validationResult = await validateSustainableAction({
        action: values.action,
        supportingEvidence: values.evidence,
      });

      setResult(validationResult);
      
      if(validationResult.isValid){
          toast({
            title: "Action Validated!",
            description: `You've earned ${validationResult.ecoPoints} eco-points.`,
          });
      }

    } catch (error) {
      console.error('Failed to validate action:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        form.reset();
        setResult(null);
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Log Sustainable Action</DialogTitle>
          <DialogDescription>
            Tell us about a sustainable action you've taken to earn eco-points.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Carpooled to work" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evidence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supporting Evidence (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Described the route, mentioned car model for efficiency."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Validate Action
                </Button>
            </DialogFooter>
          </form>
        </Form>
        {result && (
            <Alert variant={result.isValid ? "default" : "destructive"} className="mt-4 bg-card">
                 {result.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.isValid ? 'Action Approved!' : 'Action Not Approved'}</AlertTitle>
                <AlertDescription>
                    {result.isValid
                     ? `Congratulations! You've been awarded ${result.ecoPoints} eco-points.`
                     : `Reason: ${result.reason || 'No specific reason provided.'}`
                    }
                </AlertDescription>
            </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
