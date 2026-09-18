import React, { useState, useEffect } from "react";
import { Applicant, ApplicantStatus } from "./types";
import { COUNTRIES_LIST } from "./data/siteContent";
import { Navbar } from "./components/Navbar";
import { HeroPurpose } from "./components/HeroPurpose";
import { StatsBar } from "./components/StatsBar";
import { DiscoverSection } from "./components/DiscoverSection";
import { WhatWeDoCustomers } from "./components/WhatWeDoCustomers";
import { LatestNews } from "./components/LatestNews";
import { FaqSection } from "./components/FaqSection";
import { ApplicantStatusSection } from "./components/ApplicantStatusSection";
import { AdminPortal } from "./components/AdminPortal";
import { AdminLoginGate } from "./components/AdminLoginGate";
import { Footer } from "./components/Footer";
import { OtpLookupModal } from "./components/OtpLookupModal";
import {
  deleteApplicantFromSupabase,
  loadApplicantsFromSupabase,
  saveApplicantToSupabase,
} from "./lib/supabase";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  // Supabase is the source of truth; an empty database starts with an empty roster.
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // Dedicated Route State: True separation between Main Public Website & Admin Portal
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash.toLowerCase().includes("admin");
  });

  // Admin Authentication State: cryptographic SHA-256 gated session
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => {
      try {
        return localStorage.getItem("coke_admin_auth") === "true";
      } catch {
        return false;
      }
    },
  );

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try {
      return (
        localStorage.getItem("coke_admin_email") || "admin@coca-cola.internal"
      );
    } catch {
      return "admin@coca-cola.internal";
    }
  });

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [activeModalOtp, setActiveModalOtp] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "info";
  } | null>(null);

  const handleOpenOtp = (otp?: string) => {
    setActiveModalOtp(otp || "");
    setIsOtpModalOpen(true);
  };

  // Sync with browser URL hash navigation (#admin)
  useEffect(() => {
    const handleHashChange = () => {
      const shouldBeAdmin = window.location.hash
        .toLowerCase()
        .includes("admin");
      setIsAdminView(shouldBeAdmin);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Load only real records from Supabase and clear any old fake local roster.
  useEffect(() => {
    loadApplicantsFromSupabase()
      .then(setApplicants)
      .catch((error) =>
        console.error("Error loading applicants from Supabase:", error),
      );
  }, []);

  const showToast = (text: string, type: "success" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Dedicated Navigation Handlers
  const navigateToAdmin = () => {
    window.location.hash = "admin";
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToMain = () => {
    window.location.hash = "";
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLoginSuccess = (email: string) => {
    setIsAdminAuthenticated(true);
    setAdminEmail(email);
    try {
      localStorage.setItem("coke_admin_auth", "true");
      localStorage.setItem("coke_admin_email", email);
    } catch (e) {
      console.error(e);
    }
    showToast(
      `Access granted! Welcome to Coca-Cola HR Admin Console, ${email}`,
    );
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem("coke_admin_auth");
    } catch (e) {
      console.error(e);
    }
    showToast("Admin session locked and logged out.", "info");
  };

  // Admin updates applicant status
  const handleUpdateStatus = (id: string, newStatus: ApplicantStatus) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)),
    );
    const target = applicants.find((a) => a.id === id);
    showToast(
      `Updated status for "${target?.fullName || "Applicant"}" to ${newStatus.toUpperCase()}`,
    );
  };

  // Admin deletes applicant
const handleDeleteApplicant = async (id: string) => {
  const target = applicants.find((a) => a.id === id);

  try {
    await deleteApplicantFromSupabase(id);
    setApplicants((prev) => prev.filter((a) => a.id !== id));
    showToast(`Deleted candidate record "${target?.fullName || id}"`, "info");
  } catch (error) {
    console.error("Error deleting applicant from Supabase:", error);
    showToast(
      "The candidate was not deleted. Apply the applicants delete policy in Supabase, then try again.",
      "info",
    );
  }
};
  // Admin edits applicant details
  const handleEditApplicant = (updated: Applicant) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === updated.id ? updated : app)),
    );
    showToast(`Saved changes for "${updated.fullName}"`);
  };

  // Admin inserts brand new applicant
  const handleInsertApplicant = async (
    newApplicant: Omit<Applicant, "id" | "submittedAt">,
  ): Promise<Applicant> => {
    const newId = `coke-app-${String(applicants.length + 1).padStart(3, "0")}`;
    const completeApplicant: Applicant = {
      ...newApplicant,
      id: newId,
      submittedAt: new Date().toISOString().split("T")[0],
    };

    const savedApplicant = await saveApplicantToSupabase(completeApplicant);
    setApplicants((prev) => [savedApplicant, ...prev]);
    showToast(
      `Inserted candidate "${completeApplicant.fullName}" directly as ${completeApplicant.status.toUpperCase()}`,
    );
    return savedApplicant;
  };

  // Clear the local roster view without restoring fake seed records.
  const handleResetData = () => {
    if (confirm("Clear the current candidate roster view?")) {
      setApplicants([]);
      showToast("Candidate roster view cleared.", "info");
    }
  };

  const pendingCount = applicants.filter((a) => a.status === "pending").length;

  const scrollToStatus = () => {
    const element = document.getElementById("application-status-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // RENDER 1: SEPARATED DEDICATED ADMIN PORTAL PAGE (PASSWORD PROTECTED)
  if (isAdminView) {
    if (!isAdminAuthenticated) {
      return (
        <>
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl border border-white/20 bg-[#1e1e26] p-4 text-xs sm:text-sm text-white shadow-2xl backdrop-blur-md">
              {toastMessage.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          )}
          <AdminLoginGate
            onLoginSuccess={handleAdminLoginSuccess}
            onExit={navigateToMain}
          />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-[#0e0e12] text-white selection:bg-[#F40009] selection:text-white font-sans">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl border border-white/20 bg-[#1e1e26] p-4 text-xs sm:text-sm text-white shadow-2xl backdrop-blur-md">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        <AdminPortal
          applicants={applicants}
          adminEmail={adminEmail}
          onUpdateStatus={handleUpdateStatus}
          onDeleteApplicant={handleDeleteApplicant}
          onEditApplicant={handleEditApplicant}
          onInsertApplicant={handleInsertApplicant}
          onResetData={handleResetData}
          onExitAdmin={navigateToMain}
          onLogout={handleAdminLogout}
        />
      </div>
    );
  }

  // RENDER 2: PUBLIC CAREERS WEBSITE
  return (
    <div className="min-h-screen bg-[#0e0e12] text-white selection:bg-[#F40009] selection:text-white flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 rounded-2xl border border-white/20 bg-[#1e1e26] p-4 text-xs sm:text-sm text-white shadow-2xl backdrop-blur-md">
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Website Navigation Bar */}
      <Navbar
        onOpenOtp={() => handleOpenOtp()}
        onNavigateAdmin={navigateToAdmin}
        pendingCount={pendingCount}
      />

      <main className="flex-1">
        {/* 1. Hero & Purpose Section */}
        <HeroPurpose
          onOpenOtp={() => handleOpenOtp()}
          onScrollToStatus={scrollToStatus}
        />

        {/* 2. Stats Section */}
        <StatsBar />

        {/* 3. Discover Coca-Cola Section */}
        <DiscoverSection onOpenOtp={() => handleOpenOtp()} />

        {/* 4. What We Do & Customers */}
        <WhatWeDoCustomers />

        {/* 5. Latest News */}
        <LatestNews />

        {/* 6. FAQ */}
        <FaqSection />

        {/* 7. Application Status Section with OTP Verification */}
        <ApplicantStatusSection
          applicants={applicants}
          onOpenOtp={(prefillOtp) => handleOpenOtp(prefillOtp)}
        />
      </main>

      {/* Main Website Footer */}
      <Footer
        onOpenOtp={() => handleOpenOtp()}
        onNavigateAdmin={navigateToAdmin}
      />

      {/* Candidate OTP Verification & Status Lookup Modal */}
      <OtpLookupModal
        isOpen={isOtpModalOpen}
        onClose={() => {
          setIsOtpModalOpen(false);
          setActiveModalOtp("");
        }}
        applicants={applicants}
        initialOtp={activeModalOtp}
      />
    </div>
  );
}
