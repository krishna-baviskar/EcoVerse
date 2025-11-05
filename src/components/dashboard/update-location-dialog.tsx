'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Globe, X } from 'lucide-react';
import { Loader } from '../ui/loader';
import { Button } from '@/components/ui/button';

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
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoading) {
        setIsSubmitting(true);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsSubmitting(true);
    const fullLocation = [address, city, state, country].filter(Boolean).join(', ');
    
    await onLocationSubmit(fullLocation);
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const isSubmitDisabled = isSubmitting || !city.trim();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-scaleIn"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>

        <div className="relative p-8 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center mb-6 shadow-2xl"
             style={{ boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}
          >
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Update Your Location</h2>
          <p className="text-gray-400 text-sm">
            Enter your location details to get a personalized EcoScore and relevant challenges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative px-8 pb-8 space-y-5">
            <div className="relative group/input">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Address <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 123 Main St"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                />
            </div>

            <div className="relative group/input">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group/input">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State <span className="text-gray-500 text-xs">(Opt.)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., CA"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                />
              </div>
              <div className="relative group/input">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country <span className="text-gray-500 text-xs">(Opt.)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., USA"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-all duration-300 hover:bg-white/10 disabled:opacity-50"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="relative w-full mt-6 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden group/btn bg-gradient-to-r from-emerald-500 to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-2xl"
              style={{
                boxShadow: !isSubmitDisabled ? '0 10px 40px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              {!isSubmitDisabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              )}
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                    <>
                      <Loader className="h-5 w-5 border-white/30 border-t-white" />
                      Updating...
                    </>
                ) : (
                    <>
                      <MapPin className="w-5 h-5" />
                      Set Location
                    </>
                )}
              </span>
            </Button>
        </form>

        <div className="h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
      </div>
       <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}
