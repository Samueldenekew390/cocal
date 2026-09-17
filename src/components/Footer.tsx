import React from 'react';
import { Globe2, ShieldCheck, Heart, KeyRound } from 'lucide-react';

interface FooterProps {
  onOpenOtp: () => void;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOtp,
  onNavigateAdmin,
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0d] py-12 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F40009] text-white font-serif text-2xl font-black italic shadow-md">
                C
              </div>
              <span className="text-xl font-extrabold text-white font-serif tracking-tight">
                The Coca-Cola Company
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
              A global leader in non-alcoholic beverages refreshing the world and making a difference across 160+ countries. Celebrating international talent, innovation, and diverse community leadership.
            </p>

            <div className="flex items-center space-x-4 text-xs text-neutral-500">
              <span className="flex items-center space-x-1">
                <Globe2 className="h-3.5 w-3.5 text-[#ff4d55]" />
                <span>160+ Countries</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Equal Opportunity Employer</span>
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero-purpose" className="hover:text-white transition-colors">
                  Our Purpose & Mission
                </a>
              </li>
              <li>
                <a href="#discover" className="hover:text-white transition-colors">
                  Discover Coca-Cola
                </a>
              </li>
              <li>
                <a href="#what-we-do" className="hover:text-white transition-colors">
                  What We Do & Customers
                </a>
              </li>
              <li>
                <a href="#latest-news" className="hover:text-white transition-colors">
                  Latest Global News
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-white transition-colors">
                  FAQ & Support
                </a>
              </li>
              <li>
                <a href="#application-status-section" className="text-[#ff5c63] hover:text-[#f40009] font-medium transition-colors">
                  Application Status
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Actions */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Candidate Actions
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Have you submitted an application with Coca-Cola? Enter your unique 6-digit OTP code to check your candidate file and real-time status.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                onClick={onOpenOtp}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-[#F40009] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d60008] transition-all"
                id="btn-footer-otp"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Check Status (OTP)</span>
              </button>
              {onNavigateAdmin && (
                <button
                  onClick={onNavigateAdmin}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 text-xs font-semibold text-neutral-200 hover:text-white hover:border-neutral-500 transition-all"
                  id="btn-footer-admin"
                >
                  <span>Admin Portal</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 The Coca-Cola Company. All rights reserved.</p>
          <p className="flex items-center space-x-1 text-center sm:text-right">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-[#F40009] fill-[#F40009]" />
            <span>for international candidates worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
