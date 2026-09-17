import React, { useState, useEffect } from "react";
import {
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  ShieldCheck,
  User,
  Mail,
  Globe,
  Calendar,
  FileText,
  Lock,
  Search,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Applicant, ApplicantStatus } from "../types";
import { findApplicantByOtp } from "../utils/otp";
import { findApplicantByOtpInSupabase } from "../lib/supabase";

interface OtpLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
  initialOtp?: string;
}

export const OtpLookupModal: React.FC<OtpLookupModalProps> = ({
  isOpen,
  onClose,
  applicants,
  initialOtp = "",
}) => {
  const [otpInput, setOtpInput] = useState(initialOtp);
  const [searchedOtp, setSearchedOtp] = useState(initialOtp);
  const [matchedApplicant, setMatchedApplicant] = useState<Applicant | null>(
    null,
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  // Sync when modal opens or initialOtp changes
  useEffect(() => {
    if (isOpen) {
      const target = (initialOtp || "").trim();
      setOtpInput(target);
      if (target) {
        setSearchedOtp(target);
        let cancelled = false;
        void findApplicantByOtpInSupabase(target)
          .then((found) => {
            if (cancelled) return;
            setMatchedApplicant(found || null);
            setHasSearched(true);
            setImageLoaded(true);
          })
          .catch((error) => {
            if (cancelled) return;
            console.error(
              "Error checking initial candidate OTP in Supabase:",
              error,
            );
            setMatchedApplicant(null);
            setHasSearched(true);
          });
        return () => {
          cancelled = true;
        };
      } else {
        setMatchedApplicant(null);
        setHasSearched(false);
      }
    }
  }, [isOpen, initialOtp, applicants]);

  if (!isOpen) return null;

  // Real-time & Verified Lookup upon typing or submitting
  const performLookup = async (codeToTest: string) => {
    const clean = codeToTest.trim();
    setSearchedOtp(clean);
    if (!clean) {
      setMatchedApplicant(null);
      setHasSearched(false);
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);
    setHasSearched(false);

    try {
      const found = await findApplicantByOtpInSupabase(clean);
      setMatchedApplicant(found || null);
      setHasSearched(true);
      setIsVerifying(false);
      setImageLoaded(true);
    } catch (error) {
      console.error("Error checking candidate OTP in Supabase:", error);
      setMatchedApplicant(null);
      setHasSearched(true);
      setIsVerifying(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOtpInput(val);
    // Real-time detection: if user types or pastes an exact OTP match, show details immediately
    const clean = val.trim();
    if (clean.length >= 4) {
      const found = findApplicantByOtp(applicants, clean);
      if (found) {
        setSearchedOtp(clean);
        setMatchedApplicant(found);
        setHasSearched(true);
        setImageLoaded(true);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void performLookup(otpInput);
  };

  const handleQuickSelect = (otp: string) => {
    setOtpInput(otp);
    performLookup(otp);
  };

  const handleReset = () => {
    setOtpInput("");
    setSearchedOtp("");
    setMatchedApplicant(null);
    setHasSearched(false);
  };

  const handleCopyOtp = (text: string) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const getStatusBadge = (status: ApplicantStatus) => {
    switch (status) {
      case "approved":
        return (
          <div className="inline-flex items-center space-x-2 rounded-xl bg-emerald-500/20 border border-emerald-500/50 px-3.5 py-1.5 text-xs font-bold text-emerald-300 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>APPROVED • Coca-Cola Global Offer</span>
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center space-x-2 rounded-xl bg-amber-500/20 border border-amber-500/50 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-sm">
            <Clock className="h-4 w-4 text-amber-400 shrink-0" />
            <span>PENDING REVIEW • HR Committee Assessment</span>
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center space-x-2 rounded-xl bg-rose-500/20 border border-rose-500/50 px-3.5 py-1.5 text-xs font-bold text-rose-300 shadow-sm">
            <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>REVIEW CONCLUDED • Not Selected</span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#121218] p-5 sm:p-8 shadow-2xl text-white z-10 my-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 rounded-full p-2 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          id="btn-close-otp-modal"
          title="Close verification dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pr-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F40009] text-white shadow-lg shadow-[#F40009]/30 shrink-0">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-tight">
                Candidate OTP Verification
              </h2>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wide shrink-0">
                Official
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Enter your unique 6-digit OTP code to view your specific candidate
              photo, credentials, and verification status.
            </p>
          </div>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label
              htmlFor="candidate-otp-input"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2"
            >
              Enter Your Unique OTP Number
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                <KeyRound className="h-5 w-5" />
              </div>
              <input
                id="candidate-otp-input"
                type="text"
                value={otpInput}
                onChange={handleInputChange}
                placeholder="e.g. 849201"
                maxLength={16}
                autoFocus
                className="w-full rounded-2xl border-2 border-neutral-700 bg-[#0a0a0e] py-3.5 pl-12 pr-32 text-lg sm:text-xl font-mono font-bold tracking-widest text-white placeholder-neutral-600 focus:border-[#F40009] focus:ring-2 focus:ring-[#F40009]/20 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!otpInput.trim() || isVerifying}
                className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-[#F40009] text-xs sm:text-sm font-bold text-white shadow-md shadow-[#F40009]/30 hover:bg-[#d60008] transition-all disabled:opacity-50 flex items-center space-x-1.5"
                id="btn-verify-otp"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick-Test OTP Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
            <span className="text-[11px] text-neutral-500 font-medium mr-1 shrink-0">
              Try Sample OTPs:
            </span>
            {/* Primary sample chip: 987555 */}
            <button
              type="button"
              onClick={() => handleQuickSelect("987555")}
              className={`inline-flex items-center space-x-1 rounded-lg border px-2.5 py-1 text-[11px] font-mono transition-all ${
                otpInput.trim() === "987555"
                  ? "border-[#F40009] bg-[#F40009]/20 text-white font-bold"
                  : "border-white/10 bg-white/5 text-neutral-300 hover:border-[#F40009]/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-[#ff4d55] font-bold">987555</span>
              <span className="text-neutral-400">(Samuel D.)</span>
            </button>
            {applicants
              .filter((a) => a.otp !== "987555")
              .slice(0, 3)
              .map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleQuickSelect(sample.otp)}
                  className={`inline-flex items-center space-x-1 rounded-lg border px-2.5 py-1 text-[11px] font-mono transition-all ${
                    otpInput.trim() === sample.otp
                      ? "border-[#F40009] bg-[#F40009]/20 text-white font-bold"
                      : "border-white/10 bg-white/5 text-neutral-300 hover:border-[#F40009]/50 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-[#ff4d55] font-bold">{sample.otp}</span>
                  <span className="text-neutral-400">
                    ({sample.fullName.split(" ")[0]})
                  </span>
                </button>
              ))}
          </div>
        </form>

        {/* VERIFICATION IN PROGRESS ANIMATION */}
        {isVerifying && (
          <div className="border-t border-white/10 pt-6">
            <div className="rounded-3xl border border-white/15 bg-[#14141d] p-8 text-center space-y-4 shadow-2xl">
              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F40009]/20 border border-[#F40009]/40 text-[#ff4d55]">
                <Loader2 className="h-7 w-7 animate-spin text-[#ff4d55]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Querying Coca-Cola Global Talent Directory...
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Authenticating security certificate and dossier for OTP{" "}
                  <strong className="font-mono text-white bg-black/50 px-2 py-0.5 rounded border border-white/10">
                    {searchedOtp || otpInput}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SECTION: Shows the specific photo and details related to the entered OTP */}
        {!isVerifying && hasSearched && (
          <div className="border-t border-white/10 pt-6">
            {matchedApplicant ? (
              <div
                className="rounded-3xl border-2 border-emerald-500/40 bg-[#161622] p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden"
                id="verified-candidate-card"
              >
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Verified Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider block">
                        Verified Official Dossier
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        Coca-Cola Global Talent Administration
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(matchedApplicant.status)}
                </div>

                {/* Main Candidate Dossier: Specific Photo + Complete Details */}
                <div className="flex flex-col sm:flex-row gap-6 items-start relative z-10">
                  {/* Candidate Specific Photo */}
                  <div className="flex flex-col items-center shrink-0 w-full sm:w-auto">
                    <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl overflow-hidden border-2 border-[#F40009]/40 shadow-xl bg-neutral-900 ring-4 ring-white/5">
                      {imageLoaded ? (
                        <img
                          src={matchedApplicant.photoUrl}
                          alt={matchedApplicant.fullName}
                          onError={() => setImageLoaded(false)}
                          className="h-full w-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-neutral-800 text-neutral-400">
                          <User className="h-16 w-16 text-neutral-500 mb-1" />
                          <span className="text-[10px] uppercase font-bold">
                            Candidate Photo
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-sm py-1 px-2 text-center text-[10px] font-bold text-white uppercase tracking-wider">
                        Official Photo
                      </div>
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-2 font-mono">
                      File: {matchedApplicant.id}
                    </span>
                  </div>

                  {/* Candidate Specific Details */}
                  <div className="flex-1 space-y-3.5 text-left w-full">
                    {/* Name & OTP */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                          {matchedApplicant.fullName}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Nationality:{" "}
                          <strong className="text-white font-semibold">
                            {matchedApplicant.nationality}
                          </strong>
                        </p>
                      </div>

                      {/* Verified OTP Tag */}
                      <div className="flex items-center space-x-1.5 rounded-xl bg-[#F40009]/20 border border-[#F40009]/50 px-3 py-1.5 text-xs font-mono font-black text-[#ff4d55] shadow-sm">
                        <KeyRound className="h-4 w-4 shrink-0" />
                        <span>OTP: {matchedApplicant.otp}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyOtp(matchedApplicant.otp)}
                          title="Copy unique OTP"
                          className="ml-1 rounded p-1 hover:bg-white/10 text-white transition-colors"
                        >
                          {copiedOtp ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Detailed Information Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                      {/* Passport */}
                      <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Passport / National ID
                        </span>
                        <span className="font-mono font-extrabold text-white text-sm">
                          {matchedApplicant.passportNumber}
                        </span>
                      </div>

                      {/* Age & Gender */}
                      <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Age & Gender
                        </span>
                        <span className="font-semibold text-white text-sm">
                          {matchedApplicant.age} years •{" "}
                          {matchedApplicant.gender}
                        </span>
                      </div>

                      {/* Registered Email */}
                      <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 sm:col-span-2">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Registered Candidate Email
                        </span>
                        <span className="font-mono font-medium text-neutral-200 text-xs sm:text-sm truncate block">
                          {matchedApplicant.email}
                        </span>
                      </div>

                      {/* Application Date & Phone Status */}
                      <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Date Submitted
                        </span>
                        <span className="font-mono text-neutral-300 text-xs">
                          {matchedApplicant.submittedAt}
                        </span>
                      </div>

                      <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Contact Security
                        </span>
                        <span className="inline-flex items-center space-x-1.5 text-neutral-400 text-xs">
                          <Lock className="h-3 w-3 text-amber-400" />
                          <span>Phone private per policy</span>
                        </span>
                      </div>

                      {/* Admin Notes if available */}
                      {matchedApplicant.notes && (
                        <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 sm:col-span-2">
                          <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                            Official HR Committee Notes
                          </span>
                          <span className="text-neutral-300 text-xs italic">
                            "{matchedApplicant.notes}"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 relative z-10">
                  <div className="flex items-center space-x-2 text-[11px] text-neutral-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      This candidate dossier is officially registered with
                      Coca-Cola.
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                    >
                      Enter Another OTP
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-xl bg-[#F40009] px-5 py-2 text-xs font-bold text-white hover:bg-[#d60008] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Error State: No candidate matched */
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 sm:p-8 text-center space-y-3">
                <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />
                <h4 className="text-lg font-bold text-white">
                  No Candidate Dossier Found
                </h4>
                <p className="text-xs sm:text-sm text-rose-200/90 max-w-md mx-auto">
                  We could not find an international candidate record matching
                  OTP{" "}
                  <strong className="font-mono text-white bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    {searchedOtp}
                  </strong>
                  . Please ensure you entered the exact 6-digit OTP provided by
                  Coca-Cola Administration.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-neutral-800 border border-neutral-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-700 transition-colors"
                  >
                    <span>Try Another OTP Code</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
