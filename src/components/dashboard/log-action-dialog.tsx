'use client';
import { useState, type ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { doc, increment } from 'firebase/firestore';


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
import { CheckCircle, Info, Loader2, XCircle, Paperclip, Video } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { updateDocumentNonBlocking } from '@/firebase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];


const formSchema = z.object({
  action: z.string().min(5, {
    message: 'Action must be at least 5 characters.',
  }),
  evidence: z.string().optional(),
  ecoPoints: z.coerce.number().optional(),
  media: z
    .any()
    .optional()
    .refine(
        (files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`
    )
    .refine(
        (files) => !files || files.length === 0 || ACCEPTED_MEDIA_TYPES.includes(files?.[0]?.type),
        'Only .jpg, .png, .webp, .mp4 and .webm formats are supported.'
    )
});

type ValidationResult = {
    isValid: boolean;
    ecoPoints?: number;
    reason?: string;
}

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

interface LogActionDialogProps {
  children: ReactNode;
  challenge?: { title: string; ecoPoints: number } | null;
  onOpenChange?: (open: boolean) => void;
}


export function LogActionDialog({ children, challenge, onOpenChange }: LogActionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: '',
      evidence: '',
      ecoPoints: undefined,
    },
  });

  useEffect(() => {
    if (challenge) {
      form.setValue('action', challenge.title);
      form.setValue('ecoPoints', challenge.ecoPoints);
      setOpen(true);
    }
  }, [challenge, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to log an action.',
      });
      setIsLoading(false);
      return;
    }

    if (challenge) {
        const userRef = doc(firestore, 'users', user.uid);
        updateDocumentNonBlocking(userRef, {
            ecoPoints: increment(challenge.ecoPoints),
        });
        setResult({ isValid: true, ecoPoints: challenge.ecoPoints });
        toast({
            title: "Challenge Logged!",
            description: `You've earned ${challenge.ecoPoints} eco-points.`,
        });
        setIsLoading(false);
        return;
    }


    let mediaDataUri: string | undefined;
    if (values.media && values.media.length > 0) {
        try {
            mediaDataUri = await fileToDataUri(values.media[0]);
        } catch (error) {
            console.error('Failed to convert file to data URI:', error);
            toast({
                variant: 'destructive',
                title: 'File Processing Error',
                description: 'Could not process the uploaded file.',
            });
            setIsLoading(false);
            return;
        }
    }


    try {
      const validationResult = await validateSustainableAction({
        action: values.action,
        supportingEvidence: mediaDataUri || values.evidence,
      });

      setResult(validationResult);
      
      if(validationResult.isValid && validationResult.ecoPoints){
          toast({
            title: "Action Validated!",
            description: `You've earned ${validationResult.ecoPoints} eco-points.`,
          });
          const userRef = doc(firestore, 'users', user.uid);
          updateDocumentNonBlocking(userRef, {
            ecoPoints: increment(validationResult.ecoPoints),
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
    onOpenChange?.(isOpen);
    if (!isOpen) {
        form.reset({ action: '', evidence: '', ecoPoints: undefined });
        setResult(null);
        setIsLoading(false);
        setPreview(null);
        setMediaType(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Log Sustainable Action</DialogTitle>
          <DialogDescription>
             {challenge ? `Log your completion of the challenge: "${challenge.title}"` : "Tell us about a sustainable action you've taken to earn eco-points."}
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
                    <Input placeholder="e.g., Carpooled to work" {...field} disabled={!!challenge || isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {challenge ? (
                 <FormField
                    control={form.control}
                    name="ecoPoints"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>EcoPoints</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            ) : (
                <>
                    <FormField
                    control={form.control}
                    name="evidence"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
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
                    <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Evidence (Image/Video) (Optional)</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept={ACCEPTED_MEDIA_TYPES.join(',')}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    field.onChange(e.target.files);
                                    if (file) {
                                        setMediaType(file.type);
                                        setPreview(URL.createObjectURL(file));
                                    } else {
                                        setPreview(null);
                                        setMediaType(null);
                                    }
                                }}
                                className="file:text-primary file:font-medium"
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </>
            )}

            {preview && (
                 <div className="mt-4 rounded-md border p-2">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    {mediaType?.startsWith('image/') ? (
                        <Image src={preview} alt="Preview" width={400} height={300} className="rounded-md w-full object-cover" />
                    ) : mediaType?.startsWith('video/') ? (
                        <video src={preview} controls className="w-full rounded-md" />
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Paperclip className="h-4 w-4" />
                            <span>File ready for upload.</span>
                        </div>
                    )}
                </div>
            )}


            <DialogFooter>
                <Button type="submit" disabled={isLoading || !user}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    { !user ? 'Login to Log' : challenge ? 'Log Challenge' : 'Validate Action' }
                </Button>
            </DialogFooter>
          </form>
        </Form>
        {result && (
            <Alert variant={result.isValid ? "default" : "destructive"} className="mt-4 bg-card">
                 {result.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.isValid ? (challenge ? 'Challenge Logged!' : 'Action Approved!') : 'Action Not Approved'}</AlertTitle>
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
