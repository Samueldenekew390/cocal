import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Lock,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Search,
  Copy,
  Check,
  ExternalLink,
  X,
  User
} from 'lucide-react';
import { Applicant, ApplicantStatus } from '../types';
import { findApplicantByOtp } from '../utils/otp';

interface ApplicantStatusSectionProps {
  applicants: Applicant[];
  onOpenOtp?: (otp?: string) => void;
}

export const ApplicantStatusSection: React.FC<ApplicantStatusSectionProps> = ({
  applicants,
  onOpenOtp,
}) => {
  const [filter, setFilter] = useState<'all' | ApplicantStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Exactly 2 applicants horizontal x 6 applicants vertical = 12 per page

  // Direct OTP Search in Section
  const [otpSearchQuery, setOtpSearchQuery] = useState('');
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Find candidate by OTP if searched
  const matchedCandidate = useMemo(() => {
    if (!otpSearchQuery.trim()) return null;
    return findApplicantByOtp(applicants, otpSearchQuery) || null;
  }, [applicants, otpSearchQuery]);

  // Filter applicants according to active tab or search
  const filteredApplicants = useMemo(() => {
    if (otpSearchQuery.trim() && matchedCandidate) {
      return [matchedCandidate];
    }
    if (filter === 'all') return applicants;
    return applicants.filter((a) => a.status === filter);
  }, [applicants, filter, otpSearchQuery, matchedCandidate]);

  // Total pages
  const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / itemsPerPage));

  // Reset page when filter changes or if out of bounds
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, otpSearchQuery]);

  // Sliced items for current page
  const currentApplicants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplicants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplicants, currentPage, itemsPerPage]);

  // Counts for each category
  const counts = useMemo(() => {
    return {
      all: applicants.length,
      pending: applicants.filter((a) => a.status === 'pending').length,
      approved: applicants.filter((a) => a.status === 'approved').length,
      rejected: applicants.filter((a) => a.status === 'rejected').length,
    };
  }, [applicants]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const getStatusBadge = (status: ApplicantStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
            <CheckCircle className="h-3 w-3" />
            <span>Approved</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-xs font-bold text-amber-400">
            <Clock className="h-3 w-3" />
            <span>Pending Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-xs font-bold text-rose-400">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </span>
        );
    }
  };

  return (
    <section id="application-status-section" className="py-16 sm:py-20 border-t border-white/10 bg-[#0e0e12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Application status in small font */}
        <div className="mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono">
            Application status
          </p>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              International Candidates & Application Status
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              Enter any valid candidate's unique OTP number below to instantly reveal their specific photograph and official details.
            </p>
          </div>

          {onOpenOtp && (
            <button
              onClick={() => onOpenOtp()}
              className="inline-flex items-center space-x-2 rounded-xl bg-[#F40009] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#F40009]/30 hover:bg-[#d60008] transition-all shrink-0"
              id="btn-status-section-otp"
            >
              <KeyRound className="h-4 w-4" />
              <span>Verify My Status (Enter OTP)</span>
            </button>
          )}
        </div>

        {/* PROMINENT DIRECT OTP SEARCH BAR */}
        <div className="mb-8 rounded-2xl border-2 border-white/15 bg-[#14141d] p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={otpSearchQuery}
                onChange={(e) => setOtpSearchQuery(e.target.value)}
                placeholder="Enter 6-digit candidate OTP number (e.g. 849201)..."
                className="w-full rounded-xl border border-neutral-700 bg-[#0a0a0e] py-3 pl-11 pr-24 text-sm sm:text-base font-mono font-bold tracking-wider text-white placeholder-neutral-500 focus:border-[#F40009] focus:ring-2 focus:ring-[#F40009]/20 focus:outline-none"
                id="inline-otp-search-input"
              />
              {otpSearchQuery && (
                <button
                  type="button"
                  onClick={() => setOtpSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onOpenOtp) onOpenOtp(otpSearchQuery);
                }}
                className="inline-flex items-center space-x-2 rounded-xl bg-[#F40009] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#F40009]/20 hover:bg-[#d60008] transition-all"
              >
                <span>Check Status</span>
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick sample OTP clicks */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500 font-medium mr-1">Quick Sample OTPs:</span>
            <button
              type="button"
              onClick={() => setOtpSearchQuery('987555')}
              className={`inline-flex items-center space-x-1 rounded-lg border px-2.5 py-1 text-[11px] font-mono transition-colors ${
                otpSearchQuery.trim() === '987555'
                  ? 'border-[#F40009] bg-[#F40009]/20 text-white font-bold'
                  : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/30 hover:text-white'
              }`}
            >
              <span className="text-[#ff4d55] font-bold">987555</span>
              <span className="text-neutral-400">(Samuel D.)</span>
            </button>
            {applicants
              .filter((a) => a.otp !== '987555')
              .slice(0, 3)
              .map((cand) => (
                <button
                  key={cand.id}
                  type="button"
                  onClick={() => setOtpSearchQuery(cand.otp)}
                  className={`inline-flex items-center space-x-1 rounded-lg border px-2.5 py-1 text-[11px] font-mono transition-colors ${
                    otpSearchQuery.trim() === cand.otp
                      ? 'border-[#F40009] bg-[#F40009]/20 text-white font-bold'
                      : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <span className="text-[#ff4d55] font-bold">{cand.otp}</span>
                  <span className="text-neutral-400">({cand.fullName.split(' ')[0]})</span>
                </button>
              ))}
          </div>

          {/* INSTANT CANDIDATE PHOTO & DETAILS PREVIEW WHEN OTP IS FOUND */}
          {matchedCandidate && (
            <div className="mt-5 rounded-2xl border-2 border-emerald-500/50 bg-[#161622] p-4 sm:p-6 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Verified Candidate Dossier for OTP: {matchedCandidate.otp}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(matchedCandidate.status)}
                  {onOpenOtp && (
                    <button
                      type="button"
                      onClick={() => onOpenOtp(matchedCandidate.otp)}
                      className="inline-flex items-center space-x-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-semibold text-white transition-colors"
                    >
                      <span>Full Window</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Photo & Complete Candidate Details */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0 rounded-2xl overflow-hidden border-2 border-[#F40009]/40 bg-neutral-900 shadow-md">
                  <img
                    src={matchedCandidate.photoUrl}
                    alt={matchedCandidate.fullName}
                    className="h-full w-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 py-0.5 text-center text-[9px] font-bold uppercase text-white tracking-wide">
                    Specific Photo
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-left w-full">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                        {matchedCandidate.fullName}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Country: <strong className="text-white">{matchedCandidate.nationality}</strong> • Application ID: <span className="font-mono text-neutral-300">{matchedCandidate.id}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1.5 rounded-lg bg-[#F40009]/20 border border-[#F40009]/40 px-2.5 py-1 text-xs font-mono font-bold text-[#ff4d55]">
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>OTP: {matchedCandidate.otp}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(matchedCandidate.otp)}
                        className="p-0.5 text-white hover:text-[#ff6b71]"
                        title="Copy OTP"
                      >
                        {copiedOtp ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="rounded-lg bg-white/5 border border-white/5 p-2.5">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Passport / Document</span>
                      <span className="font-mono font-bold text-white text-xs sm:text-sm">{matchedCandidate.passportNumber}</span>
                    </div>

                    <div className="rounded-lg bg-white/5 border border-white/5 p-2.5">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Age & Gender</span>
                      <span className="font-semibold text-white text-xs sm:text-sm">{matchedCandidate.age} yrs • {matchedCandidate.gender}</span>
                    </div>

                    <div className="rounded-lg bg-white/5 border border-white/5 p-2.5 sm:col-span-2">
                      <span className="text-neutral-400 block text-[10px] uppercase font-bold">Registered Email</span>
                      <span className="font-mono text-neutral-200 text-xs">{matchedCandidate.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* If OTP search is entered but no match found */}
          {otpSearchQuery.trim() && !matchedCandidate && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-center">
              <p className="text-xs text-rose-300">
                No candidate dossier found matching OTP <strong className="font-mono text-white bg-black/40 px-1.5 py-0.5 rounded">{otpSearchQuery}</strong>. Please verify the 6 digits or test one of the sample OTPs above.
              </p>
            </div>
          )}
        </div>

        {/* Status Filter Buttons: All, Pending, Approved, Rejected */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#F40009] text-white shadow-lg shadow-[#F40009]/30'
                : 'border border-white/10 bg-[#18181e] text-neutral-300 hover:border-white/20 hover:text-white'
            }`}
            id="filter-all-btn"
          >
            <span>All Applicants</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${filter === 'all' ? 'bg-black/30' : 'bg-white/10'}`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              filter === 'pending'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-extrabold'
                : 'border border-white/10 bg-[#18181e] text-neutral-300 hover:border-amber-500/40 hover:text-amber-300'
            }`}
            id="filter-pending-btn"
          >
            <span>Pending</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${filter === 'pending' ? 'bg-black/30' : 'bg-white/10'}`}>
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              filter === 'approved'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'border border-white/10 bg-[#18181e] text-neutral-300 hover:border-emerald-500/40 hover:text-emerald-300'
            }`}
            id="filter-approved-btn"
          >
            <span>Approved</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${filter === 'approved' ? 'bg-black/30' : 'bg-white/10'}`}>
              {counts.approved}
            </span>
          </button>

          <button
            onClick={() => setFilter('rejected')}
            className={`inline-flex items-center space-x-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
              filter === 'rejected'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'border border-white/10 bg-[#18181e] text-neutral-300 hover:border-rose-500/40 hover:text-rose-300'
            }`}
            id="filter-rejected-btn"
          >
            <span>Rejected</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${filter === 'rejected' ? 'bg-black/30' : 'bg-white/10'}`}>
              {counts.rejected}
            </span>
          </button>
        </div>

        {/* Applicants Section: 2 horizontal and 6 vertical (12 applicants per page) */}
        {currentApplicants.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-[#141418] p-12 text-center">
            <UserCheck className="mx-auto h-12 w-12 text-neutral-500" />
            <h3 className="mt-3 text-lg font-bold text-white">No applicants found</h3>
            <p className="mt-1 text-sm text-neutral-400">
              There are currently no candidates under the "{filter}" filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#18181f] p-4 transition-all duration-200 hover:border-white/25 flex flex-col sm:flex-row gap-4 items-center sm:items-stretch shadow-md"
              >
                {/* Applicant Picture with Name overlaying on the bottom of their picture */}
                <div className="relative h-44 w-full sm:w-36 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                  <img
                    src={applicant.photoUrl}
                    alt={applicant.fullName}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Name overlaying on the bottom of their picture */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-2.5 pt-6 text-left">
                    <span className="block text-xs font-bold text-white truncate leading-tight drop-shadow">
                      {applicant.fullName}
                    </span>
                    <span className="block text-[10px] text-[#ff6b71] font-medium truncate">
                      {applicant.nationality}
                    </span>
                  </div>
                </div>

                {/* Details Section: Gender, Age, Phone Private, Passport, OTP */}
                <div className="flex-1 flex flex-col justify-between w-full py-1 text-left">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {getStatusBadge(applicant.status)}
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSearchQuery(applicant.otp);
                            if (onOpenOtp) onOpenOtp(applicant.otp);
                          }}
                          className="inline-flex items-center space-x-1 rounded-md bg-[#F40009]/20 border border-[#F40009]/40 px-2 py-0.5 text-[10px] font-mono font-bold text-[#ff6b71] hover:bg-[#F40009]/30 transition-colors"
                          title="Click to verify this OTP"
                        >
                          <KeyRound className="h-2.5 w-2.5" />
                          <span>OTP: {applicant.otp}</span>
                        </button>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          ID: {applicant.id.replace('coke-app-', '#')}
                        </span>
                      </div>
                    </div>

                    {/* Detailed info grid */}
                    <div className="space-y-1.5 text-xs text-neutral-300 mt-2">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1">
                        <span className="text-neutral-400">Gender (Admin verified):</span>
                        <span className="font-semibold text-white">{applicant.gender}</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 pb-1">
                        <span className="text-neutral-400">Age (Admin verified):</span>
                        <span className="font-semibold text-white">{applicant.age} yrs</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/5 pb-1">
                        <span className="text-neutral-400">Phone Number:</span>
                        <span className="inline-flex items-center space-x-1 text-neutral-400 font-medium text-[11px]">
                          <Lock className="h-3 w-3 text-amber-400" />
                          <span className="italic">Private for all applicants</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-neutral-400">Passport Number:</span>
                        <span className="font-mono font-bold text-neutral-200">
                          {applicant.passportNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Unlimited Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col lg:flex-row items-center justify-between gap-5 border-t border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-neutral-400">
              <p>
                Showing page <strong className="text-white">{currentPage}</strong> of{' '}
                <strong className="text-white">{totalPages}</strong> ({filteredApplicants.length} candidates total, 12 per page)
              </p>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span className="inline-flex items-center text-[11px] text-emerald-400/90 font-medium">
                Unlimited pages enabled
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* Jump to First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg border border-neutral-700 bg-neutral-800 text-xs font-semibold text-white transition-all hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Go to First Page"
                id="btn-first-page"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1 text-[11px]">First</span>
              </button>

              {/* Previous Page */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center space-x-1 h-8 px-3 rounded-lg border border-neutral-700 bg-neutral-800 text-xs font-semibold text-white transition-all hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                id="btn-prev-page"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </button>

              {/* Dynamic Windowed Page Numbers (Supports unlimited pages cleanly) */}
              <div className="flex items-center space-x-1">
                {(() => {
                  const pages: (number | string)[] = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 3) {
                      pages.push('ellipsis-start');
                    }
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }
                    if (currentPage < totalPages - 2) {
                      pages.push('ellipsis-end');
                    }
                    pages.push(totalPages);
                  }

                  return pages.map((p, idx) => {
                    if (typeof p === 'string') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-1 text-xs text-neutral-500 select-none">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition-all ${
                          currentPage === p
                            ? 'bg-[#F40009] text-white shadow-md shadow-[#F40009]/30'
                            : 'bg-neutral-800/80 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  });
                })()}
              </div>

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center space-x-1 h-8 px-3 rounded-lg border border-neutral-700 bg-neutral-800 text-xs font-semibold text-white transition-all hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                id="btn-next-page"
                title="Next Page"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Jump to Last Page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg border border-neutral-700 bg-neutral-800 text-xs font-semibold text-white transition-all hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Go to Last Page"
                id="btn-last-page"
              >
                <span className="hidden sm:inline mr-1 text-[11px]">Last</span>
                <ChevronsRight className="h-4 w-4" />
              </button>

              {/* Direct Jump to Page Input */}
              {totalPages > 3 && (
                <div className="hidden sm:flex items-center space-x-1.5 ml-2 pl-2 border-l border-white/10 text-xs text-neutral-400">
                  <span>Page:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1 && val <= totalPages) {
                        setCurrentPage(val);
                      }
                    }}
                    className="w-12 h-8 rounded-lg border border-neutral-700 bg-neutral-900 px-1.5 text-center text-xs font-bold text-white focus:border-[#F40009] focus:outline-none"
                    title="Jump directly to page number"
                  />
                  <span className="text-neutral-500">/ {totalPages}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
