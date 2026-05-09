"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-5 reveal-element opacity-0 translate-y-12 transition-all duration-700">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-medium text-white group-hover:text-[#C6FF00] transition-colors">{question}</span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C6FF00]' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400">{answer}</p>
      </div>
    </div>
  );
};
