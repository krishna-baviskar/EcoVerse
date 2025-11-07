
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { 
  X, CheckCircle2, XCircle, Upload, Camera, Sparkles, Award, Zap, 
  Leaf, Target, Info, AlertCircle, Loader2, FileText, Coins
} from 'lucide-react';
import { useForm, zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, increment, arrayUnion } from 'firebase/firestore';
import Image from 'next/image';

import { useToast } from '@/hooks/use-toast';
import { validateSustainableAction } from '@/ai/flows';
import { useUser, useFirestore, updateDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/types';

interface LogActionDialogProps {
  children: ReactNode;
  challenge?: { title: string; ecoPoints: number } | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};

export function LogActionDialog({ children, challenge: passedChallenge, open: controlledOpen, onOpenChange }: LogActionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange : setInternalOpen;
  
  const [step, setStep] = useState(1); // 1: Form, 2: Validating, 3: Result
  const [actionType, setActionType] = useState('custom'); // 'custom' or 'challenge'
  const [formData, setFormData] = useState({
    action: '',
    description: '',
    file: null as File | null
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    ecoPoints: number;
    reason: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  const challenge = passedChallenge || {
    title: 'Car-Free Day Challenge',
    ecoPoints: 50,
    description: 'Use public transport or bike for all trips today'
  };

  useEffect(() => {
    if (passedChallenge) {
        setActionType('challenge');
        setFormData(prev => ({ ...prev, action: passedChallenge.title }));
    } else {
        setActionType('custom');
        setFormData(prev => ({ ...prev, action: '' }));
    }
  }, [passedChallenge, isOpen]);


  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File too large', description: 'Maximum file size is 5MB.' });
        return;
      }
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast({ variant: 'destructive', title: 'Invalid file type', description: 'Only images and videos are supported.' });
        return;
      }
      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleSubmit = async () => {
    setStep(2);
    
    if (!user || !userDocRef) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in." });
        setStep(1);
        return;
    }

    const actionToValidate = actionType === 'challenge' ? challenge.title : formData.action;

    // Client-side duplicate check
    if (userProfile?.completedActions?.includes(actionToValidate)) {
        setValidationResult({ isValid: false, ecoPoints: 0, reason: 'You have already earned points for this activity.' });
        setStep(3);
        return; // Stop here, no AI call needed
    }

    try {
        const mediaDataUri = formData.file ? await fileToDataUri(formData.file) : undefined;
        const descriptionOrEvidence = actionType === 'challenge' 
            ? (mediaDataUri || challenge.description)
            : (mediaDataUri || formData.description);

        const result = await validateSustainableAction({
            action: actionToValidate,
            supportingEvidence: descriptionOrEvidence
        });
        
        const pointsToAward = actionType === 'challenge' ? challenge.ecoPoints : (result.ecoPoints || 0);

        if (result.isValid) {
            const updates: any = {
                ecoPoints: increment(pointsToAward)
            };
            updates.completedActions = arrayUnion(actionToValidate);

            updateDocumentNonBlocking(userDocRef, updates);
            setValidationResult({ ...result, ecoPoints: pointsToAward, reason: result.reason || 'Great eco-friendly action!' });
        } else {
            setValidationResult({ isValid: false, ecoPoints: 0, reason: result.reason || 'Validation failed.' });
        }
    } catch (e) {
        console.error("Validation error:", e);
        setValidationResult({ isValid: false, ecoPoints: 0, reason: 'An error occurred during validation.' });
    }

    setStep(3);
  };


  const handleClose = () => {
    setOpen(false);
    // Reset state after a delay to allow for closing animation
    setTimeout(() => {
        setStep(1);
        setFormData({ action: '', description: '', file: null });
        setPreview(null);
        setValidationResult(null);
        setActionType(passedChallenge ? 'challenge' : 'custom');
    }, 300);
  };

  if (!isOpen) {
    if (React.Children.count(children) > 0) {
        return <div onClick={() => setOpen(true)}>{children}</div>
    }
    return null;
  }


  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
        >
          <X className="h-5 w-5 group-hover:rotate-90 transition-transform" />
        </button>

        {/* Content */}
        <div className="relative z-10 max-h-[90vh] overflow-y-auto p-8">
          {/* Step 1: Form */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl mb-4 animate-bounce">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-white">Log Sustainable Action</h2>
                <p className="text-gray-400">
                  {actionType === 'challenge' 
                    ? `Complete: "${challenge.title}"`
                    : 'Share your eco-friendly activity and earn points!'}
                </p>
              </div>

              {/* Action Type Toggle */}
              <div className="flex gap-3 p-2 bg-white/5 rounded-xl">
                <button
                  onClick={() => setActionType('custom')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    actionType === 'custom'
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Custom Action
                </button>
                <button
                  onClick={() => setActionType('challenge')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    actionType === 'challenge'
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Challenge
                </button>
              </div>

              {/* Challenge Info */}
              {actionType === 'challenge' && (
                <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1 text-white">{challenge.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold">{challenge.ecoPoints} EcoPoints</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  Action Taken
                </label>
                <input
                  type="text"
                  value={actionType === 'challenge' ? challenge.title : formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  disabled={actionType === 'challenge'}
                  placeholder="Your Action Here..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all disabled:opacity-50"
                />
              </div>

              {/* Description */}
              {actionType === 'custom' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    Description 
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide more details about your action..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all resize-none"
                  />
                </div>
              )}

              {/* File Upload Area */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-purple-400" />
                  Image/Video
                </label>
                
                {!preview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-white/20 hover:border-emerald-500/50 hover:bg-white/5'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="space-y-3">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl">
                        <Upload className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1 text-white">Drop your file here or click to browse</p>
                        <p className="text-sm text-gray-400">Support: JPG, PNG, WebP, MP4, WebM (Max 5MB)</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="relative rounded-xl overflow-hidden border border-white/10">
                      {formData.file?.type.startsWith('image/') ? (
                        <Image src={preview} alt="Preview" width={400} height={240} className="w-full h-64 object-cover" />
                      ) : (
                        <video src={preview} controls className="w-full h-64 object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          <button
                            onClick={() => {
                              setPreview(null);
                              setFormData({ ...formData, file: null });
                            }}
                            className="flex-1 px-4 py-2 bg-red-500 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                          <label className="flex-1 px-4 py-2 bg-emerald-500 rounded-lg font-semibold hover:bg-emerald-600 transition-colors text-center cursor-pointer">
                            Change
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold mb-1">AI Validation</p>
                  <p className="text-gray-400">Your action will be validated by our AI to ensure authenticity and award appropriate EcoPoints.</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!formData.action && actionType === 'custom'}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
              >
                {actionType === 'challenge' ? 'Log Action' : 'Validate Action'}
                <Zap className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          )}

          {/* Step 2: Validating */}
          {step === 2 && (
            <div className="py-12 text-center">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-emerald-400 animate-pulse" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">Validating Your Action...</h3>
              <p className="text-gray-400 mb-8">Our AI is analyzing your submission</p>
              
              <div className="space-y-3 max-w-md mx-auto">
                {[
                  { label: 'Analyzing content', delay: 1 },
                  { label: 'Checking authenticity', delay: 1 },
                  { label: 'Calculating EcoPoints', delay: 5 }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg animate-slideInLeft"
                    style={{ animationDelay: `${item.delay}s` }}
                  >
                    <Loader2 className="h-4 w-4 text-emerald-400 animate-spin" />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && validationResult && (
            <div className="py-8">
              {validationResult.isValid ? (
                <div className="text-center space-y-6">
                  {/* Success Animation */}
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-50 animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center animate-scaleIn">
                      <CheckCircle2 className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-white">Action Approved! 🎉</h3>
                    <p className="text-gray-400">{validationResult.reason}</p>
                  </div>

                  {/* Points Display */}
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-30"></div>
                    <div className="relative px-8 py-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl">
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <Coins className="h-8 w-8 text-yellow-400" />
                        <span className="text-5xl font-bold text-yellow-400">+{validationResult.ecoPoints}</span>
                      </div>
                      <p className="text-sm text-gray-400">EcoPoints Earned</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    {[
                      { label: 'New Total', value: (userProfile?.ecoPoints || 0) + validationResult.ecoPoints, icon: Award },
                      { label: 'Rank', value: '#2', icon: Target },
                      { label: 'Level', value: 'Sparkles', icon: Sparkles }
                    ].map((stat, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <stat.icon className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setStep(1);
                        setFormData({ action: '', description: '', file: null });
                        setPreview(null);
                        setValidationResult(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Log Another
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  {/* Error Animation */}
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-red-500 blur-3xl opacity-50 animate-pulse"></div>
                    <div className="relative w-32 h-32 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center animate-scaleIn">
                      <XCircle className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-white">Action Not Approved</h3>
                    <p className="text-gray-400">{validationResult.reason}</p>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-left max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-2 text-white">Tips for approval:</p>
                        <ul className="space-y-1 text-gray-400">
                          <li>• Provide clear evidence (photos/videos)</li>
                          <li>• Be specific in your description</li>
                          <li>• Ensure action is eco-friendly</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setStep(1);
                        setValidationResult(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
