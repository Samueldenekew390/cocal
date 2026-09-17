import React, { useState, useMemo } from "react";
import {
  Shield,
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Globe,
  FileDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  LayoutGrid,
  List,
  Lock,
  Calendar,
  Mail,
  FileText,
  UserCheck,
  UserPlus,
  KeyRound,
  Copy,
  Check,
  Upload,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { Applicant, ApplicantStatus } from "../types";
import { COUNTRIES_LIST } from "../data/siteContent";
import { SAMPLE_AVATARS } from "../data/mockApplicants";
import { generateUniqueOtp } from "../utils/otp";

interface AdminPortalProps {
  applicants: Applicant[];
  adminEmail?: string;
  onUpdateStatus: (id: string, newStatus: ApplicantStatus) => void;
  onDeleteApplicant: (id: string) => void;
  onEditApplicant: (updated: Applicant) => void;
  onInsertApplicant: (
    applicant: Omit<Applicant, "id" | "submittedAt">,
  ) => Promise<Applicant>;
  onResetData: () => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  applicants,
  adminEmail = "admin@coca-cola.internal",
  onUpdateStatus,
  onDeleteApplicant,
  onEditApplicant,
  onInsertApplicant,
  onResetData,
  onExitAdmin,
  onLogout,
}) => {
  const [isEmailMasked, setIsEmailMasked] = useState(true);
  const maskedEmail = adminEmail.replace(
    /^(.)(.*)(@.*)$/,
    (_, first, middle, domain) =>
      `${first}${"*".repeat(Math.min(middle.length, 3))}${domain}`,
  );
  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ApplicantStatus>(
    "all",
  );
  const [countryFilter, setCountryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "age">(
    "newest",
  );

  // Pagination (12 candidates per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals state
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [recentlyRegistered, setRecentlyRegistered] =
    useState<Applicant | null>(null);
  const [copiedOtp, setCopiedOtp] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );

  const handleCopyOtp = (otp: string) => {
    navigator.clipboard?.writeText?.(otp);
    setCopiedOtp(otp);
    setTimeout(() => {
      setCopiedOtp((current) => (current === otp ? null : current));
    }, 2000);
  };

  // New applicant form state
  const [newForm, setNewForm] = useState({
    fullName: "",
    email: "",
    gender: "Female" as Applicant["gender"],
    nationality: "United States",
    birthDate: "1998-05-15",
    passportNumber: "",
    photoUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    status: "approved" as ApplicantStatus,
    notes: "Verified via Coca-Cola Global HR Administration Portal",
  });

  // Calculate high-level metrics
  const stats = useMemo(() => {
    const total = applicants.length;
    const pending = applicants.filter((a) => a.status === "pending").length;
    const approved = applicants.filter((a) => a.status === "approved").length;
    const rejected = applicants.filter((a) => a.status === "rejected").length;
    const uniqueCountries = new Set(applicants.map((a) => a.nationality)).size;
    return { total, pending, approved, rejected, uniqueCountries };
  }, [applicants]);

  // Filter and sort candidates
  const filteredApplicants = useMemo(() => {
    return applicants
      .filter((app) => {
        // Status filter
        if (statusFilter !== "all" && app.status !== statusFilter) return false;
        // Country filter
        if (countryFilter !== "all" && app.nationality !== countryFilter)
          return false;
        // Search query
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = app.fullName.toLowerCase().includes(q);
          const matchEmail = app.email.toLowerCase().includes(q);
          const matchPassport = app.passportNumber.toLowerCase().includes(q);
          const matchCountry = app.nationality.toLowerCase().includes(q);
          const matchId = app.id.toLowerCase().includes(q);
          const matchOtp = (app.otp || "").toLowerCase().includes(q);
          if (
            !matchName &&
            !matchEmail &&
            !matchPassport &&
            !matchCountry &&
            !matchId &&
            !matchOtp
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return (b.submittedAt || "").localeCompare(a.submittedAt || "");
        if (sortBy === "oldest")
          return (a.submittedAt || "").localeCompare(b.submittedAt || "");
        if (sortBy === "name") return a.fullName.localeCompare(b.fullName);
        if (sortBy === "age") return (a.age || 0) - (b.age || 0);
        return 0;
      });
  }, [applicants, statusFilter, countryFilter, searchTerm, sortBy]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, countryFilter, searchTerm, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(
    1,
    Math.ceil(filteredApplicants.length / itemsPerPage),
  );
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const currentApplicants = filteredApplicants.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Pagination pages array with windowing
  const getPaginationNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validCurrentPage > 3) pages.push("...");
      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(totalPages - 1, validCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (validCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // CSV Export handler
  const handleExportCsv = () => {
    const headers = [
      "ID",
      "Unique OTP",
      "Full Name",
      "Email",
      "Gender",
      "Nationality",
      "Birth Date",
      "Age",
      "Passport",
      "Status",
      "Submitted At",
    ];
    const rows = filteredApplicants.map((a) => [
      `"${a.id}"`,
      `"${a.otp || ""}"`,
      `"${a.fullName}"`,
      `"${a.email}"`,
      `"${a.gender}"`,
      `"${a.nationality}"`,
      `"${a.birthDate}"`,
      `"${a.age || ""}"`,
      `"${a.passportNumber}"`,
      `"${a.status}"`,
      `"${a.submittedAt || ""}"`,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `coca_cola_applicants_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submission for new candidate registration by admin
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.fullName.trim() || !newForm.email.trim() || isRegistering)
      return;

    let calculatedAge = 25;
    if (newForm.birthDate) {
      const birth = new Date(newForm.birthDate);
      const today = new Date();
      calculatedAge = today.getFullYear() - birth.getFullYear();
      if (isNaN(calculatedAge) || calculatedAge <= 0) calculatedAge = 25;
    }

    const uniqueOtp = generateUniqueOtp(applicants);
    const generatedPassport =
      newForm.passportNumber.trim() ||
      `${newForm.nationality.slice(0, 3).toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newCandidateData = {
      ...newForm,
      age: calculatedAge,
      passportNumber: generatedPassport,
      otp: uniqueOtp,
    };

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const savedApplicant = await onInsertApplicant(newCandidateData);
      setRecentlyRegistered(savedApplicant);
      setIsAddModalOpen(false);

      setNewForm({
        fullName: "",
        email: "",
        gender: "Female",
        nationality: "United States",
        birthDate: "1998-05-15",
        passportNumber: "",
        photoUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
        status: "approved",
        notes: "Verified via Coca-Cola Global HR Administration Portal",
      });
    } catch (error) {
      setRegistrationError(
        error instanceof Error
          ? error.message
          : "Candidate registration failed.",
      );
    } finally {
      setIsRegistering(false);
    }
  };

  // Save edits
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplicant) return;
    onEditApplicant(editingApplicant);
    setEditingApplicant(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white flex flex-col font-sans">
      {/* Top Enterprise Admin Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#121217]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Portal Identity */}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F40009] text-white shadow-md shadow-[#F40009]/30">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-lg font-bold tracking-wide text-white">
                    The Coca-Cola Company
                  </span>
                  <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-neutral-300">
                    HR Admin v4.2
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Global Recruitment & Candidate Governance Console
                </p>
              </div>
            </div>

            {/* Right Action: Return to Public Careers Site & Logout */}
            <div className="flex items-center space-x-2.5">
              <div className="hidden lg:flex items-center space-x-2 rounded-xl bg-neutral-900/90 border border-neutral-700/80 px-3 py-1.5 text-xs text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-white font-medium">
                  {isEmailMasked ? maskedEmail : adminEmail}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEmailMasked(!isEmailMasked)}
                  title={isEmailMasked ? "Reveal email" : "Hide / mask email"}
                  className="text-neutral-500 hover:text-white transition-colors ml-0.5"
                >
                  {isEmailMasked ? (
                    <Eye className="h-3 w-3" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                </button>
                <span className="text-neutral-500 text-[10px]">| HR Admin</span>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out / Lock Console"
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-white transition-all"
                  id="btn-admin-logout"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}

              <button
                onClick={onExitAdmin}
                className="inline-flex items-center space-x-2 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:border-neutral-500 hover:bg-neutral-700 transition-all"
                id="btn-return-careers"
              >
                <ArrowLeft className="h-4 w-4 text-[#ff4d55]" />
                <span className="hidden sm:inline">
                  Return to Careers Website
                </span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Metrics Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#16161c] p-4">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Total Candidates
                </span>
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {stats.total}
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                Across 3 full roster pages
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center justify-between text-amber-300 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Pending Review
                </span>
                <Clock className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-amber-400">
                {stats.pending}
              </div>
              <p className="text-[10px] text-amber-300/70 mt-1">
                Require vetting decision
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between text-emerald-300 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Approved
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400">
                {stats.approved}
              </div>
              <p className="text-[10px] text-emerald-300/70 mt-1">
                Ready for regional placement
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center justify-between text-red-300 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Rejected
                </span>
                <XCircle className="h-4 w-4 text-red-400" />
              </div>
              <div className="text-2xl font-extrabold text-red-400">
                {stats.rejected}
              </div>
              <p className="text-[10px] text-red-300/70 mt-1">
                Ineligible / incomplete
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-[#16161c] p-4">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider">
                  Global Reach
                </span>
                <Globe className="h-4 w-4 text-[#ff4d55]" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {stats.uniqueCountries}
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                Unique countries represented
              </p>
            </div>
          </div>

          {/* Action Toolbar: Search, Filters, Add, Batch, Export */}
          <div className="rounded-2xl border border-white/10 bg-[#16161c] p-4 sm:p-5 space-y-4 shadow-lg">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, passport number, or country..."
                  className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none"
                  id="admin-search-input"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Register New Candidate */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-[#F40009] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#F40009]/20 hover:bg-[#d60008] transition-all"
                  id="btn-admin-register-candidate"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register Candidate</span>
                </button>

                {/* Export CSV */}
                <button
                  onClick={handleExportCsv}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-xs font-semibold text-neutral-200 hover:border-neutral-500 hover:text-white transition-all"
                  title="Export filtered roster to CSV"
                >
                  <FileDown className="h-4 w-4 text-emerald-400" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                {/* Reset Data */}
                <button
                  onClick={onResetData}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-xs font-semibold text-neutral-400 hover:border-neutral-600 hover:text-neutral-200 transition-all"
                  title="Reset to default 36 international candidate seed roster"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">Reset Data</span>
                </button>

                {/* View Toggle */}
                <div className="flex items-center rounded-xl border border-neutral-700 bg-[#0e0e12] p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-1.5 transition-all ${
                      viewMode === "grid"
                        ? "bg-[#F40009] text-white shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                    title="Grid Card View (2 columns)"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`rounded-lg p-1.5 transition-all ${
                      viewMode === "table"
                        ? "bg-[#F40009] text-white shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                    title="Table Dense View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Pills & Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
              {/* Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                    statusFilter === "all"
                      ? "bg-white text-black"
                      : "bg-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  All ({stats.total})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                    statusFilter === "pending"
                      ? "bg-amber-500 text-black"
                      : "bg-neutral-800 text-neutral-400 hover:text-amber-400"
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setStatusFilter("approved")}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                    statusFilter === "approved"
                      ? "bg-emerald-500 text-black"
                      : "bg-neutral-800 text-neutral-400 hover:text-emerald-400"
                  }`}
                >
                  Approved ({stats.approved})
                </button>
                <button
                  onClick={() => setStatusFilter("rejected")}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                    statusFilter === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:text-red-400"
                  }`}
                >
                  Rejected ({stats.rejected})
                </button>
              </div>

              {/* Country and Sort Dropdowns */}
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-1.5 text-neutral-400">
                  <span className="text-[11px]">Country:</span>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="rounded-lg border border-neutral-700 bg-[#0e0e12] px-2.5 py-1 text-xs text-white focus:border-[#F40009] focus:outline-none"
                  >
                    <option value="all">All Countries</option>
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5 text-neutral-400">
                  <span className="text-[11px]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-lg border border-neutral-700 bg-[#0e0e12] px-2.5 py-1 text-xs text-white focus:border-[#F40009] focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Candidate Name (A-Z)</option>
                    <option value="age">Age</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span>
              Showing{" "}
              <strong className="text-white">
                {filteredApplicants.length === 0 ? 0 : startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-white">
                {Math.min(startIndex + itemsPerPage, filteredApplicants.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-white">
                {filteredApplicants.length}
              </strong>{" "}
              candidates
            </span>
            <span>
              Page <strong className="text-white">{validCurrentPage}</strong> of{" "}
              <strong className="text-white">{totalPages}</strong> (12 per page)
            </span>
          </div>

          {/* Candidate List - Mode 1: Grid (2 Horizontal x 6 Vertical = 12 items) */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="rounded-2xl border border-white/10 bg-[#16161d] p-4 hover:border-white/20 transition-all flex flex-col sm:flex-row gap-4 shadow-md"
                >
                  {/* Photo & ID */}
                  <div className="relative h-44 w-full sm:w-36 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
                    <img
                      src={applicant.photoUrl}
                      alt={applicant.fullName}
                      className="h-full w-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2">
                      <div className="text-[11px] font-mono text-neutral-300 truncate">
                        {applicant.id}
                      </div>
                    </div>
                  </div>

                  {/* Details and Actions */}
                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-bold text-white text-base leading-tight">
                            {applicant.fullName}
                          </h3>
                          <span className="text-xs text-neutral-400 block">
                            {applicant.email}
                          </span>
                          <div className="flex items-center space-x-1.5 mt-1.5">
                            <span className="inline-flex items-center space-x-1 rounded-md bg-[#F40009]/15 border border-[#F40009]/30 px-2 py-0.5 text-[11px] font-mono font-bold text-[#ff4d55]">
                              <KeyRound className="h-3 w-3 text-[#ff4d55] shrink-0" />
                              <span>OTP: {applicant.otp}</span>
                            </span>
                            <button
                              onClick={() => handleCopyOtp(applicant.otp)}
                              title="Copy Candidate OTP"
                              className="rounded p-1 text-neutral-400 hover:text-white transition-colors"
                            >
                              {copiedOtp === applicant.otp ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${
                            applicant.status === "approved"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : applicant.status === "rejected"
                                ? "border-red-500/30 bg-red-500/10 text-red-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-neutral-300 pt-2 border-t border-white/5">
                        <div>
                          <span className="text-neutral-500 block">
                            Nationality:
                          </span>
                          <span className="font-semibold text-white truncate block">
                            {applicant.nationality}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">
                            Passport:
                          </span>
                          <span className="font-mono text-neutral-200">
                            {applicant.passportNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">
                            Gender / Age:
                          </span>
                          <span className="text-neutral-200">
                            {applicant.gender} • {applicant.age} yrs
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500 block">
                            Submitted:
                          </span>
                          <span className="text-neutral-400">
                            {applicant.submittedAt || "2026-08-10"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Action Row: Quick Status Change & Edit/Delete */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                      {/* Status Toggle Buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() =>
                            onUpdateStatus(applicant.id, "approved")
                          }
                          title="Approve candidate"
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                            applicant.status === "approved"
                              ? "bg-emerald-500 text-black shadow-sm"
                              : "bg-neutral-800 text-neutral-400 hover:text-emerald-400"
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            onUpdateStatus(applicant.id, "pending")
                          }
                          title="Mark as pending review"
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                            applicant.status === "pending"
                              ? "bg-amber-500 text-black shadow-sm"
                              : "bg-neutral-800 text-neutral-400 hover:text-amber-400"
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() =>
                            onUpdateStatus(applicant.id, "rejected")
                          }
                          title="Reject candidate"
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-all ${
                            applicant.status === "rejected"
                              ? "bg-red-500 text-white shadow-sm"
                              : "bg-neutral-800 text-neutral-400 hover:text-red-400"
                          }`}
                        >
                          Reject
                        </button>
                      </div>

                      {/* Edit and Delete Buttons */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setEditingApplicant(applicant)}
                          className="rounded-lg border border-neutral-700 bg-neutral-800 p-1.5 text-neutral-300 hover:border-neutral-500 hover:text-white transition-all"
                          title="Edit candidate details"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(applicant.id)}
                          className="rounded-lg border border-neutral-700 bg-neutral-800 p-1.5 text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                          title="Delete candidate record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Candidate List - Mode 2: Dense Table View */}
          {viewMode === "table" && (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16161d] shadow-lg">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-[#111116] text-neutral-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Candidate</th>
                    <th className="py-3.5 px-3 font-semibold">Unique OTP</th>
                    <th className="py-3.5 px-3 font-semibold">Nationality</th>
                    <th className="py-3.5 px-3 font-semibold">Passport</th>
                    <th className="py-3.5 px-3 font-semibold">Age / Gender</th>
                    <th className="py-3.5 px-3 font-semibold">Status</th>
                    <th className="py-3.5 px-3 font-semibold">Submitted</th>
                    <th className="py-3.5 px-4 font-semibold text-right">
                      Admin Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentApplicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={applicant.photoUrl}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-white block">
                              {applicant.fullName}
                            </span>
                            <span className="text-[11px] text-neutral-400">
                              {applicant.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="inline-flex items-center space-x-1.5 rounded-lg bg-[#F40009]/10 border border-[#F40009]/30 px-2.5 py-1 text-xs font-mono font-bold text-[#ff4d55]">
                          <KeyRound className="h-3.5 w-3.5 text-[#ff4d55] shrink-0" />
                          <span>{applicant.otp}</span>
                          <button
                            onClick={() => handleCopyOtp(applicant.otp)}
                            title="Copy Candidate OTP"
                            className="rounded p-0.5 text-neutral-400 hover:text-white transition-colors"
                          >
                            {copiedOtp === applicant.otp ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-neutral-200">
                        {applicant.nationality}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-300">
                        {applicant.passportNumber}
                      </td>
                      <td className="py-3 px-3 text-neutral-300">
                        {applicant.age} yrs • {applicant.gender}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider border ${
                            applicant.status === "approved"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : applicant.status === "rejected"
                                ? "border-red-500/30 bg-red-500/10 text-red-400"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-400">
                        {applicant.submittedAt || "2026-08-10"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() =>
                              onUpdateStatus(applicant.id, "approved")
                            }
                            className="rounded px-2 py-1 text-[10px] font-bold bg-neutral-800 text-neutral-400 hover:text-emerald-400"
                            title="Approve"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() =>
                              onUpdateStatus(applicant.id, "rejected")
                            }
                            className="rounded px-2 py-1 text-[10px] font-bold bg-neutral-800 text-neutral-400 hover:text-red-400"
                            title="Reject"
                          >
                            ✕
                          </button>
                          <button
                            onClick={() => setEditingApplicant(applicant)}
                            className="rounded p-1 text-neutral-400 hover:text-white"
                            title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingId(applicant.id)}
                            className="rounded p-1 text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {filteredApplicants.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-[#16161d] p-12 text-center">
              <UserCheck className="mx-auto h-12 w-12 text-neutral-500 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">
                No Candidate Records Found
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
                No applicants match your current query or filter criteria. Try
                adjusting your search term or resetting the filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCountryFilter("all");
                }}
                className="rounded-xl bg-[#F40009] px-4 py-2 text-xs font-bold text-white hover:bg-[#d60008]"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Unlimited Pagination Controls */}
          {filteredApplicants.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <span className="text-xs text-neutral-400">
                Displaying{" "}
                <strong>
                  {startIndex + 1}–
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredApplicants.length,
                  )}
                </strong>{" "}
                of <strong>{filteredApplicants.length}</strong> applicants
              </span>

              {/* Page buttons */}
              <div className="flex items-center space-x-1.5">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={validCurrentPage === 1}
                  className="rounded-lg border border-neutral-700 bg-neutral-800/80 p-2 text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800"
                  title="First Page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={validCurrentPage === 1}
                  className="rounded-lg border border-neutral-700 bg-neutral-800/80 p-2 text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800"
                  title="Previous Page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Number buttons */}
                {getPaginationNumbers().map((num, idx) => {
                  if (num === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-xs text-neutral-500"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={`page-${num}`}
                      onClick={() => setCurrentPage(num as number)}
                      className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                        validCurrentPage === num
                          ? "bg-[#F40009] text-white shadow-md shadow-[#F40009]/30"
                          : "border border-neutral-700 bg-neutral-800/80 text-neutral-300 hover:border-neutral-500 hover:text-white"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}

                {/* Next Page */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={validCurrentPage === totalPages}
                  className="rounded-lg border border-neutral-700 bg-neutral-800/80 p-2 text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={validCurrentPage === totalPages}
                  className="rounded-lg border border-neutral-700 bg-neutral-800/80 p-2 text-neutral-300 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800"
                  title="Last Page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>

              {/* Direct Jump to Page */}
              <div className="flex items-center space-x-2 text-xs text-neutral-400">
                <span>Jump to:</span>
                <select
                  value={validCurrentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="rounded-lg border border-neutral-700 bg-[#0e0e12] px-2.5 py-1 text-xs text-white focus:border-[#F40009] focus:outline-none"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pg) => (
                      <option key={pg} value={pg}>
                        Page {pg}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit Candidate Modal */}
      {editingApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-[#16161d] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Edit Candidate Profile
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-mono text-xs text-neutral-400">
                    {editingApplicant.id}
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="inline-flex items-center space-x-1 rounded bg-[#F40009]/15 border border-[#F40009]/30 px-2 py-0.5 text-xs font-mono font-bold text-[#ff4d55]">
                    <KeyRound className="h-3 w-3 text-[#ff4d55]" />
                    <span>OTP: {editingApplicant.otp}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyOtp(editingApplicant.otp)}
                    title="Copy Candidate OTP"
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedOtp === editingApplicant.otp ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setEditingApplicant(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={editingApplicant.fullName}
                  onChange={(e) =>
                    setEditingApplicant({
                      ...editingApplicant,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2 px-3 text-white focus:border-[#F40009] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingApplicant.email}
                    onChange={(e) =>
                      setEditingApplicant({
                        ...editingApplicant,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2 px-3 text-white focus:border-[#F40009] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    value={editingApplicant.passportNumber}
                    onChange={(e) =>
                      setEditingApplicant({
                        ...editingApplicant,
                        passportNumber: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2 px-3 text-white focus:border-[#F40009] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">
                    Nationality
                  </label>
                  <select
                    value={editingApplicant.nationality}
                    onChange={(e) =>
                      setEditingApplicant({
                        ...editingApplicant,
                        nationality: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2 px-3 text-white focus:border-[#F40009] focus:outline-none"
                  >
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">
                    Application Status
                  </label>
                  <select
                    value={editingApplicant.status}
                    onChange={(e) =>
                      setEditingApplicant({
                        ...editingApplicant,
                        status: e.target.value as ApplicantStatus,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2 px-3 text-white focus:border-[#F40009] focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={editingApplicant.photoUrl}
                  onChange={(e) =>
                    setEditingApplicant({
                      ...editingApplicant,
                      photoUrl: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2 px-3 text-white focus:border-[#F40009] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingApplicant(null)}
                  className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 font-semibold text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#F40009] px-5 py-2 font-bold text-white hover:bg-[#d60008]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register New Candidate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-[#16161d] p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F40009] text-white shadow-md">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Register New Candidate
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Creates applicant file and issues unique 6-digit
                    verification OTP
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {registrationError && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-200">
                  {registrationError}
                </div>
              )}
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maria Hernandez"
                  value={newForm.fullName}
                  onChange={(e) =>
                    setNewForm({ ...newForm, fullName: e.target.value })
                  }
                  className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2.5 px-3.5 text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="maria.h@example.com"
                    value={newForm.email}
                    onChange={(e) =>
                      setNewForm({ ...newForm, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2.5 px-3.5 text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Gender
                  </label>
                  <select
                    value={newForm.gender}
                    onChange={(e) =>
                      setNewForm({
                        ...newForm,
                        gender: e.target.value as Applicant["gender"],
                      })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2.5 px-3.5 text-white focus:border-[#F40009] focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Nationality (160+ Countries)
                  </label>
                  <select
                    value={newForm.nationality}
                    onChange={(e) =>
                      setNewForm({ ...newForm, nationality: e.target.value })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2.5 px-3.5 text-white focus:border-[#F40009] focus:outline-none"
                  >
                    {COUNTRIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Passport / National ID
                  </label>
                  <div className="flex space-x-1.5">
                    <input
                      type="text"
                      placeholder="e.g. USA-9842109"
                      value={newForm.passportNumber}
                      onChange={(e) =>
                        setNewForm({
                          ...newForm,
                          passportNumber: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2.5 px-3.5 text-white font-mono placeholder-neutral-500 focus:border-[#F40009] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const code = `${newForm.nationality.slice(0, 3).toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`;
                        setNewForm({ ...newForm, passportNumber: code });
                      }}
                      title="Auto-generate passport number"
                      className="shrink-0 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-[11px] font-semibold text-neutral-300 hover:text-white"
                    >
                      Gen
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={newForm.birthDate}
                    onChange={(e) =>
                      setNewForm({ ...newForm, birthDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2.5 px-3.5 text-white focus:border-[#F40009] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">
                    Initial Application Status
                  </label>
                  <select
                    value={newForm.status}
                    onChange={(e) =>
                      setNewForm({
                        ...newForm,
                        status: e.target.value as ApplicantStatus,
                      })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2.5 px-3.5 text-white focus:border-[#F40009] focus:outline-none"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Photo selection with file upload and sample avatars */}
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Candidate Photo
                </label>
                <div className="flex gap-2 items-center">
                  <img
                    src={newForm.photoUrl}
                    alt=""
                    className="h-10 w-10 rounded-xl object-cover border border-white/20 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <input
                    type="url"
                    value={newForm.photoUrl}
                    onChange={(e) =>
                      setNewForm({ ...newForm, photoUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-neutral-700 bg-[#0e0e12] py-2 px-3 text-white focus:border-[#F40009] focus:outline-none"
                  />
                  <label
                    className="cursor-pointer shrink-0 rounded-xl border border-neutral-700 bg-neutral-800 p-2 text-neutral-300 hover:text-white"
                    title="Upload local photo"
                  >
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setNewForm({
                                ...newForm,
                                photoUrl: event.target.result as string,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Preset Avatars */}
                <div className="flex items-center space-x-1.5 mt-2 overflow-x-auto pb-1">
                  <span className="text-[10px] text-neutral-500 shrink-0">
                    Sample Photos:
                  </span>
                  {SAMPLE_AVATARS.slice(0, 6).map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setNewForm({ ...newForm, photoUrl: avatar })
                      }
                      className={`h-7 w-7 rounded-lg overflow-hidden border transition-all shrink-0 ${
                        newForm.photoUrl === avatar
                          ? "border-[#F40009] scale-105"
                          : "border-neutral-700 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={avatar}
                        alt=""
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 flex items-start space-x-2 text-[11px] text-amber-200/90">
                <KeyRound className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Automatic OTP Assignment:</strong> A unique 6-digit
                  candidate OTP code will be cryptographically generated upon
                  submission. The applicant can use this code on the main
                  website to access their candidate status and record.
                </span>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 font-semibold text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="inline-flex items-center space-x-2 rounded-xl bg-[#F40009] px-6 py-2.5 font-bold text-white hover:bg-[#d60008] transition-all shadow-lg shadow-[#F40009]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  id="btn-admin-submit-register"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>
                    {isRegistering
                      ? "Uploading & Saving..."
                      : "Register & Generate OTP"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Registered & OTP Generated Success Modal */}
      {recentlyRegistered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-emerald-500/40 bg-[#14141c] p-6 sm:p-7 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">
                    Candidate Successfully Registered!
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium">
                    Record added & unique verification OTP generated
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRecentlyRegistered(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* OTP Spotlight Card */}
              <div className="rounded-2xl border-2 border-dashed border-[#F40009]/60 bg-[#F40009]/10 p-5 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 block mb-1">
                  Candidate Unique OTP Number
                </span>
                <div className="flex items-center justify-center space-x-3 my-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-[#ff4d55]">
                    {recentlyRegistered.otp}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyOtp(recentlyRegistered.otp)}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-[#F40009] px-4 py-2 text-xs font-bold text-white hover:bg-[#d60008] transition-all shadow-md"
                    id="btn-copy-new-otp"
                  >
                    {copiedOtp === recentlyRegistered.otp ? (
                      <>
                        <Check className="h-4 w-4 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy OTP</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Provide this 6-digit OTP code to the candidate. They can now
                  visit the main page, click the <strong>OTP button</strong>,
                  and instantly view their application details and status.
                </p>
              </div>

              {/* Candidate Summary Details */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-4 items-center">
                <img
                  src={recentlyRegistered.photoUrl}
                  alt=""
                  className="h-16 w-16 rounded-xl object-cover object-top border border-white/15 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 text-xs space-y-1">
                  <h4 className="font-bold text-white text-sm truncate">
                    {recentlyRegistered.fullName}
                  </h4>
                  <p className="text-neutral-400 truncate">
                    {recentlyRegistered.email}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-neutral-300">
                      {recentlyRegistered.nationality}
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-neutral-300 font-mono">
                      {recentlyRegistered.passportNumber}
                    </span>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {recentlyRegistered.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setRecentlyRegistered(null)}
                className="rounded-xl bg-[#F40009] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#d60008] transition-colors"
                id="btn-close-registered-modal"
              >
                View in Candidate Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#16161d] p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Delete Candidate Record?
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Are you sure you want to permanently remove candidate{" "}
              <strong>{deletingId}</strong> from the recruitment database? This
              action cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteApplicant(deletingId);
                  setDeletingId(null);
                }}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="border-t border-white/10 bg-[#0e0e13] py-6 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            The Coca-Cola Company — Confidential Global HR Administration
          </span>
          <button
            onClick={onExitAdmin}
            className="text-neutral-400 hover:text-[#ff4d55] transition-colors"
          >
            ← Return to Careers Public View
          </button>
        </div>
      </footer>
    </div>
  );
};
