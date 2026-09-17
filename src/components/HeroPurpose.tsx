import React from 'react';
import { Sparkles, KeyRound, Heart, Globe, Users } from 'lucide-react';

interface HeroPurposeProps {
  onOpenOtp: () => void;
  onScrollToStatus: () => void;
}

export const HeroPurpose: React.FC<HeroPurposeProps> = ({
  onOpenOtp,
  onScrollToStatus,
}) => {
  return (
    <section id="hero-purpose" className="relative overflow-hidden py-12 lg:py-16">
      {/* Subtle atmospheric glow behind hero */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-[#F40009]/15 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-stretch">
          
          {/* Main Welcome Hero Card (7 columns) */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#16161b] p-8 sm:p-10 lg:col-span-7 shadow-2xl relative overflow-hidden group">
            {/* Ambient accent */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-[#F40009]/10 rounded-full blur-2xl" />
            
            <div>
              <div className="inline-flex items-center space-x-2 rounded-full border border-[#F40009]/30 bg-[#F40009]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#ff5c63]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>International Talent Recruitment 2026</span>
              </div>

              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl font-serif leading-[1.15]">
                Welcome to Coca-Cola: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#ff4d55]">
                  Join Our Team
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg leading-relaxed text-neutral-300">
                Join an extraordinary international family delivering moments of optimism and refreshment across the globe. We hire driven professionals across 160+ countries to lead sustainable manufacturing, worldwide brand innovation, global supply chain, and digital transformation.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenOtp}
                  className="inline-flex items-center space-x-2.5 rounded-xl bg-[#F40009] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#F40009]/30 transition-all hover:bg-[#d60008] hover:shadow-2xl hover:shadow-[#F40009]/40 active:scale-95"
                  id="hero-otp-btn"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>Check Status (Enter OTP)</span>
                </button>

                <button
                  onClick={onScrollToStatus}
                  className="inline-flex items-center space-x-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-5 py-3.5 text-sm font-semibold text-neutral-200 transition-all hover:border-neutral-500 hover:bg-neutral-800 hover:text-white"
                  id="hero-check-status-btn"
                >
                  <span>Check Application Status</span>
                </button>
              </div>
            </div>

            {/* Catchy Coca-Cola Related Picture */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 relative h-64 sm:h-72 w-full">
              <img
                src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1200&auto=format&fit=crop&q=80"
                alt="Catchy Coca-Cola glass bottle with refreshing chilled condensation"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#ff5c63] font-bold">Real Magic</p>
                  <p className="text-sm font-medium text-neutral-200">The world’s most loved beverage experience</p>
                </div>
                <div className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold">
                  Global Heritage
                </div>
              </div>
            </div>
          </div>

          {/* Our Purpose Card (5 columns, next to it) */}
          <div className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#16161b] p-8 sm:p-10 lg:col-span-5 shadow-2xl relative overflow-hidden group">
            {/* Visual accent badge */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-2xl" />

            <div>
              <div className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                <Heart className="h-3.5 w-3.5 text-[#F40009]" />
                <span>Our Core Identity</span>
              </div>

              <h2 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl font-serif">
                Our Purpose
              </h2>

              <blockquote className="mt-4 border-l-2 border-[#F40009] pl-4 text-lg font-serif italic text-white">
                "Refresh the world. Make a difference."
              </blockquote>

              <p className="mt-5 text-sm sm:text-base leading-relaxed text-neutral-300">
                Our purpose guides every action we take across the globe. We craft brands and beverage choices that people love, while building a more sustainable future for our business, our international colleagues, and the local communities we call home.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start space-x-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                  <Globe className="h-5 w-5 text-[#ff4d55] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Worldwide Impact</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Creating sustainable economic opportunities in over 160 countries.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
                  <Users className="h-5 w-5 text-[#ff4d55] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">International Diversity</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">Fostering an inclusive workplace where diverse minds thrive together.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual banner in Purpose card */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 relative h-48 w-full">
              <img
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80"
                alt="Coca-Cola international team celebrating shared purpose"
                className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10]/90 via-[#0e0e10]/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-xs font-semibold text-neutral-200">
                A shared passion for uplifting communities worldwide
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
