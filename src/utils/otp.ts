import { Applicant } from "../types";

const DETERMINISTIC_PROFILES = [
  {
    name: "Samuel Denekew",
    gender: "Male" as const,
    country: "Ethiopia",
    email: "samueldenekew19@gmail.com",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    notes:
      "Official Coca-Cola International Careers Offer - Verified & Approved by Administration",
    status: "approved" as const,
    birthDate: "1996-03-15",
    age: 30,
  },
  {
    name: "Carlos Mendoza",
    gender: "Male" as const,
    country: "Mexico",
    email: "carlos.mendoza@coca-cola-talent.org",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    notes:
      "Verified Coca-Cola International Candidate - Latin America Operations",
    status: "approved" as const,
    birthDate: "1994-07-21",
    age: 32,
  },
  {
    name: "Amina Al-Mansoor",
    gender: "Female" as const,
    country: "United Arab Emirates",
    email: "amina.almansoor@coca-cola-talent.org",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    notes: "Approved for Middle East & North Africa Supply Chain Distribution",
    status: "approved" as const,
    birthDate: "1997-10-08",
    age: 29,
  },
  {
    name: "Chloe Laurent",
    gender: "Female" as const,
    country: "France",
    email: "chloe.laurent@coca-cola-talent.org",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    notes: "Verified European Commercial Strategy Candidate - Approved",
    status: "approved" as const,
    birthDate: "1995-12-14",
    age: 31,
  },
  {
    name: "David Osei",
    gender: "Male" as const,
    country: "Ghana",
    email: "david.osei@coca-cola-talent.org",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    notes: "Approved Sub-Saharan Africa Beverage Bottling Logistics Candidate",
    status: "approved" as const,
    birthDate: "1993-04-19",
    age: 33,
  },
  {
    name: "Ji-Woo Park",
    gender: "Female" as const,
    country: "South Korea",
    email: "jiwoo.park@coca-cola-talent.org",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    notes: "Verified Asia-Pacific Quality Assurance & Food Science Candidate",
    status: "approved" as const,
    birthDate: "1998-02-28",
    age: 28,
  },
  {
    name: "Liam Gallagher",
    gender: "Male" as const,
    country: "Ireland",
    email: "liam.gallagher@coca-cola-talent.org",
    photo:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
    notes: "Approved Global Brand Operations Candidate",
    status: "approved" as const,
    birthDate: "1991-08-05",
    age: 35,
  },
  {
    name: "Fatima Zahra",
    gender: "Female" as const,
    country: "Morocco",
    email: "fatima.zahra@coca-cola-talent.org",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    notes: "Verified North Africa Regional Sustainability & Water Stewardship",
    status: "approved" as const,
    birthDate: "1999-06-11",
    age: 27,
  },
  {
    name: "Lucas Silva",
    gender: "Male" as const,
    country: "Brazil",
    email: "lucas.silva@coca-cola-talent.org",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    notes: "Approved South America Manufacturing & Automation Specialist",
    status: "approved" as const,
    birthDate: "1992-11-23",
    age: 34,
  },
];

/**
 * Generates a unique 6-digit numeric OTP that does not collide with any existing applicant's OTP.
 */
export function generateUniqueOtp(existingApplicants: Applicant[]): string {
  const existingOtps = new Set(
    existingApplicants.map((a) => (a.otp || "").trim()),
  );
  let otp = "";
  let attempts = 0;

  do {
    // Generate a 6-digit number between 100000 and 999999
    otp = Math.floor(100000 + Math.random() * 900000).toString();
    attempts++;
  } while (existingOtps.has(otp) && attempts < 1000);

  return otp;
}

/**
 * Deterministically generates an official candidate record for any valid OTP number
 * so that any valid OTP number entered by any user will immediately resolve to
 * that candidate's specific photo and details.
 */
export function generateCandidateForOtp(otp: string): Applicant {
  const cleanOtp = otp.trim();

  // Explicit check for 987555 (Samuel Denekew)
  if (cleanOtp === "987555") {
    return {
      id: "coke-app-987555",
      fullName: "Samuel Denekew",
      email: "samueldenekew19@gmail.com",
      gender: "Male",
      nationality: "Ethiopia",
      birthDate: "1996-03-15",
      age: 30,
      passportNumber: "ETH-9875550",
      photoUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      status: "approved",
      submittedAt: "2026-08-28",
      otp: "987555",
      notes:
        "Official Coca-Cola International Careers Offer - Verified & Approved by Administration",
    };
  }

  // Calculate numeric seed from the OTP characters
  let seed = 0;
  for (let i = 0; i < cleanOtp.length; i++) {
    seed = (seed * 31 + cleanOtp.charCodeAt(i)) >>> 0;
  }

  const profileIndex = seed % DETERMINISTIC_PROFILES.length;
  const profile = DETERMINISTIC_PROFILES[profileIndex];

  return {
    id: `coke-app-${cleanOtp}`,
    fullName: profile.name,
    email: profile.email,
    gender: profile.gender,
    nationality: profile.country,
    birthDate: profile.birthDate,
    age: profile.age,
    passportNumber: `${profile.country.slice(0, 3).toUpperCase()}-${cleanOtp}0`,
    photoUrl: profile.photo,
    status: profile.status,
    submittedAt: "2026-08-20",
    otp: cleanOtp,
    notes: profile.notes,
  };
}

/**
 * Looks up an applicant by their unique OTP number or ID.
 * Unknown OTPs do not resolve to a generated or fallback candidate.
 */
export function findApplicantByOtp(
  applicants: Applicant[],
  query: string,
): Applicant | undefined {
  if (!query) return undefined;

  // Clean query by removing common prefixes and separators
  const raw = query.trim();
  const stripped = raw
    .replace(/^otp\s*[:#-]?\s*/i, "")
    .replace(/[\s\-#.:]/g, "")
    .toUpperCase();

  if (!stripped) return undefined;

  // 1. Search in current memory applicants list
  const matchInApplicants = applicants.find((a) => {
    const candidateOtp = (a.otp || "")
      .replace(/^otp\s*[:#-]?\s*/i, "")
      .replace(/[\s\-#.:]/g, "")
      .toUpperCase();
    const candidateId = (a.id || "").replace(/[\s\-#.:]/g, "").toUpperCase();
    return candidateOtp === stripped || candidateId === stripped;
  });

  if (matchInApplicants) return matchInApplicants;

  return undefined;
}
