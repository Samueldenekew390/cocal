import React from 'react';
import { KeyRound, Menu, X, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenOtp: () => void;
  onNavigateAdmin?: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOtp,
  onNavigateAdmin,
  pendingCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0e0e10]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Tagline */}
        <div className="flex items-center space-x-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center space-x-3"
            id="brand-logo-link"
          >
            {/* Coca Cola Badge */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F40009] shadow-lg shadow-[#F40009]/30 transition-transform group-hover:scale-105">
              <span className="font-serif text-2xl font-black italic tracking-tighter text-white">
                C
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-extrabold tracking-tight text-white sm:text-xl font-serif">
                  Coca-Cola
                </span>
                <span className="rounded bg-[#F40009]/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ff4d55]">
                  Global
                </span>
              </div>
              <span className="text-[11px] font-medium tracking-wide text-neutral-400">
                International Careers Portal
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-6 lg:flex">
          <button
            onClick={() => scrollToSection('hero-purpose')}
            className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            id="nav-link-purpose"
          >
            Our Purpose
          </button>
          <button
            onClick={() => scrollToSection('discover')}
            className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            id="nav-link-discover"
          >
            Discover
          </button>
          <button
            onClick={() => scrollToSection('what-we-do')}
            className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            id="nav-link-what-we-do"
          >
            What We Do
          </button>
          <button
            onClick={() => scrollToSection('latest-news')}
            className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            id="nav-link-news"
          >
            News
          </button>
          <button
            onClick={() => scrollToSection('faq-section')}
            className="text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            id="nav-link-faq"
          >
            FAQ
          </button>
          <button
            onClick={() => scrollToSection('application-status-section')}
            className="text-sm font-semibold text-[#ff4d55] transition-colors hover:text-[#f40009]"
            id="nav-link-status"
          >
            Application Status
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center space-x-3 sm:flex">
          {/* Admin Portal Dedicated Link */}
          {onNavigateAdmin && (
            <button
              onClick={onNavigateAdmin}
              title="Open Dedicated Admin Portal"
              className="relative inline-flex items-center space-x-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-neutral-300 transition-all hover:border-[#F40009]/50 hover:bg-[#1b1b22] hover:text-white"
              id="btn-admin-portal"
            >
              <Shield className="h-3.5 w-3.5 text-[#ff4d55]" />
              <span>Admin Portal</span>
              {pendingCount > 0 && (
                <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#F40009] text-[9px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* OTP Verification Button */}
          <button
            onClick={onOpenOtp}
            className="inline-flex items-center space-x-2 rounded-xl bg-[#F40009] px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#F40009]/30 transition-all hover:bg-[#d60008] hover:shadow-xl hover:shadow-[#F40009]/40 active:scale-95"
            id="btn-nav-otp"
          >
            <KeyRound className="h-4 w-4" />
            <span>Enter OTP</span>
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex items-center space-x-2 sm:hidden">
          <button
            onClick={onOpenOtp}
            className="rounded-lg bg-[#F40009] px-3 py-1.5 text-xs font-bold text-white flex items-center space-x-1"
            id="btn-nav-otp-mobile"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>OTP</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-800"
            id="btn-mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#141418] px-4 py-4 sm:hidden">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => scrollToSection('hero-purpose')}
              className="text-left text-sm font-medium text-neutral-300"
            >
              Our Purpose
            </button>
            <button
              onClick={() => scrollToSection('discover')}
              className="text-left text-sm font-medium text-neutral-300"
            >
              Discover
            </button>
            <button
              onClick={() => scrollToSection('what-we-do')}
              className="text-left text-sm font-medium text-neutral-300"
            >
              What We Do
            </button>
            <button
              onClick={() => scrollToSection('latest-news')}
              className="text-left text-sm font-medium text-neutral-300"
            >
              News
            </button>
            <button
              onClick={() => scrollToSection('faq-section')}
              className="text-left text-sm font-medium text-neutral-300"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection('application-status-section')}
              className="text-left text-sm font-semibold text-[#ff4d55]"
            >
              Application Status
            </button>
            {onNavigateAdmin && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateAdmin();
                  }}
                  className="flex items-center justify-center space-x-2 rounded-lg border border-neutral-700 bg-neutral-800 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700"
                >
                  <Shield className="h-4 w-4 text-[#ff4d55]" />
                  <span>Admin Portal</span>
                  {pendingCount > 0 && (
                    <span className="ml-1 rounded-full bg-[#F40009] px-1.5 py-0.2 text-[10px]">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
