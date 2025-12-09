import React from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Hotel } from 'lucide-react';

export default function SearchLoadingDialog({ open }) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="w-[700px] h-[260px] flex flex-col items-center justify-center text-center p-8"
      >
        <div className="mb-6">
          <Hotel className="w-16 h-16 text-[#3b82f6] mx-auto mb-4" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Please wait, the best deals are on their way!
        </h2>
        <p className="text-white/70">
          We're searching through thousands of options to find you the perfect stay.
        </p>
        <div className="mt-6 flex space-x-1">
          <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

