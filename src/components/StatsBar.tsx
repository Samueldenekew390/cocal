import React from 'react';
import { DollarSign, Users, Globe2 } from 'lucide-react';

export const StatsBar: React.FC = () => {
  return (
    <section className="relative py-6 sm:py-8 border-y border-white/10 bg-[#121216]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:divide-white/10 text-center">
          
          {/* Stat 1: Annual Revenue */}
          <div className="flex flex-col items-center justify-center py-6 px-4 group">
            <div className="flex items-center space-x-2 text-neutral-400 mb-1">
              <DollarSign className="h-4 w-4 text-[#F40009]" />
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Annual Revenue
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-serif group-hover:text-[#ff4d55] transition-colors">
              $16B
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Sustained global financial strength
            </p>
          </div>

          {/* Stat 2: Team Members */}
          <div className="flex flex-col items-center justify-center py-6 px-4 group">
            <div className="flex items-center space-x-2 text-neutral-400 mb-1">
              <Users className="h-4 w-4 text-[#F40009]" />
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Team Members
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-serif group-hover:text-[#ff4d55] transition-colors">
              20k+
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Passionate professionals worldwide
            </p>
          </div>

          {/* Stat 3: Countries */}
          <div className="flex flex-col items-center justify-center py-6 px-4 group">
            <div className="flex items-center space-x-2 text-neutral-400 mb-1">
              <Globe2 className="h-4 w-4 text-[#F40009]" />
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Countries
              </span>
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-serif group-hover:text-[#ff4d55] transition-colors">
              160+
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              International operational reach
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
