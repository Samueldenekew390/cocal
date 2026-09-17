import React from 'react';
import { Briefcase, Building2, KeyRound } from 'lucide-react';

interface DiscoverSectionProps {
  onOpenOtp: () => void;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({ onOpenOtp }) => {
  return (
    <section id="discover" className="py-16 sm:py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#ff4d55]">
            Global Portfolio & Opportunities
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Discover Coca-Cola
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Explore how our international business model fuels iconic brand leadership while providing transformative global careers.
          </p>
        </div>

        {/* Two overlay cards: Our Business (overlaying Coca-Cola picture) and Careers (overlaying a person's photo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Our Business overlaying on a Coca picture */}
          <div className="group relative min-h-[440px] sm:min-h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-end p-6 sm:p-8 transition-all hover:border-[#F40009]/50">
            {/* Background Image: Coca picture */}
            <img
              src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=1000&auto=format&fit=crop&q=80"
              alt="Coca-Cola classic bottle and ice refreshment"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            {/* Deep overlay for maximum legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-[#0b0b0e]/75 to-black/30" />

            {/* Content overlay */}
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 rounded-full bg-[#F40009] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md mb-4">
                <Building2 className="h-3.5 w-3.5" />
                <span>Our Business</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                A Global Portfolio of Beloved Brands
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-200">
                From our trademark sparkling Coca-Cola beverages to premium waters, sports drinks, dairy, and botanicals, we craft choices that delight consumers in every corner of the earth. Operating with agile supply chain networks and local bottling partners, our business blends international scale with authentic local community integration.
              </p>

              <div className="mt-6 flex items-center space-x-4 text-xs font-semibold text-neutral-300">
                <span className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff4d55]" />
                  <span>2.2 Billion Servings Daily</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Sustainable Packaging Focus</span>
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Careers overlaying a person's photo */}
          <div className="group relative min-h-[440px] sm:min-h-[480px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-end p-6 sm:p-8 transition-all hover:border-[#F40009]/50">
            {/* Background Image: Person's photo */}
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80"
              alt="International professional leader at Coca-Cola"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Deep overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-[#0b0b0e]/75 to-black/30" />

            {/* Content overlay */}
            <div className="relative z-10">
              <div className="inline-flex items-center space-x-2 rounded-full bg-neutral-800/90 border border-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md mb-4">
                <Briefcase className="h-3.5 w-3.5 text-[#ff4d55]" />
                <span>Careers</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
                Shape Your Future On The World Stage
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-200">
                A career at Coca-Cola connects you to mentors, visionaries, and global leaders across continents. We provide cross-border mobility, inclusive development programs, and continuous learning opportunities that foster curiosity, agility, and purposeful career acceleration.
              </p>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs font-semibold text-neutral-300">
                  <span className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ff4d55]" />
                    <span>Global Mentorship</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    <span>Cross-Border Mobility</span>
                  </span>
                </div>

                <button
                  onClick={onOpenOtp}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-[#F40009] px-3.5 py-2 text-xs font-bold text-white shadow-lg hover:bg-[#d60008] transition-all"
                  id="btn-discover-otp"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Check Status (OTP)</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
