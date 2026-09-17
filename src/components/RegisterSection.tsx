import React, { useState } from 'react';
import { User, Mail, Globe, Calendar, FileText, Image as ImageIcon, Check, Upload, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Applicant } from '../types';
import { COUNTRIES_LIST } from '../data/siteContent';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';

interface RegisterSectionProps {
  onRegisterApplicant: (applicant: Omit<Applicant, 'id' | 'status' | 'submittedAt' | 'age'> & { age?: number }) => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

export const RegisterSection: React.FC<RegisterSectionProps> = ({
  onRegisterApplicant,
  isOpenAsModal,
  onCloseModal,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say'>('Female');
  const [nationality, setNationality] = useState('United States');
  const [birthDate, setBirthDate] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState(DEFAULT_AVATAR);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = (dobString: string): number => {
    if (!dobString) return 28;
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    const calculated = Math.abs(ageDt.getUTCFullYear() - 1970);
    return isNaN(calculated) || calculated <= 0 ? 28 : calculated;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full legal name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email address is required';
    if (!birthDate) newErrors.birthDate = 'Birth date is required';
    if (!passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    if (!photoUrl) newErrors.photo = 'Applicant photo is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const calculatedAge = calculateAge(birthDate);

    setTimeout(() => {
      onRegisterApplicant({
        fullName: fullName.trim(),
        email: email.trim(),
        gender,
        nationality,
        birthDate,
        age: calculatedAge,
        passportNumber: passportNumber.trim().toUpperCase(),
        photoUrl,
      });

      setIsSubmitting(false);
      setSuccessMessage('Registration submitted successfully! Your application is in review (Pending status).');

      // Reset form fields
      setFullName('');
      setEmail('');
      setBirthDate('');
      setPassportNumber('');

      if (isOpenAsModal && onCloseModal) {
        setTimeout(() => {
          onCloseModal();
          setSuccessMessage(null);
        }, 1500);
      }
    }, 600);
  };

  const content = (
    <div className="w-full">
      {/* Questionnaire Card in "Brighter Black" (#222228 / #1e1e24) */}
      <div className="rounded-3xl border border-neutral-700/80 bg-[#222228] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F40009] via-neutral-500 to-[#F40009]" />

        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 rounded-full bg-[#F40009]/20 border border-[#F40009]/30 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#ff5c63]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Candidate Questionnaire</span>
          </div>

          <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white font-serif">
            International Talent Registration
          </h3>
          <p className="mt-2 text-sm text-neutral-300">
            Please complete your official questionnaire. Submissions are reviewed directly by Coca-Cola Global Talent Administration.
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 flex items-center space-x-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-sm text-emerald-300">
            <Check className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Full Name <span className="text-[#ff4d55]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Samuel Denekew"
                  className="w-full rounded-xl border border-neutral-700 bg-[#16161b] py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none focus:ring-1 focus:ring-[#F40009]"
                  id="reg-input-fullname"
                />
              </div>
              {errors.fullName && <p className="mt-1.5 text-xs text-[#ff5c63]">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Email Address <span className="text-[#ff4d55]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-neutral-700 bg-[#16161b] py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none focus:ring-1 focus:ring-[#F40009]"
                  id="reg-input-email"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-[#ff5c63]">{errors.email}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Gender <span className="text-[#ff4d55]">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-xl border border-neutral-700 bg-[#16161b] py-3 px-4 text-sm text-white focus:border-[#F40009] focus:outline-none focus:ring-1 focus:ring-[#F40009]"
                id="reg-select-gender"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Nationality <span className="text-[#ff4d55]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Globe className="h-4 w-4" />
                </div>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-[#16161b] py-3 pl-10 pr-4 text-sm text-white focus:border-[#F40009] focus:outline-none focus:ring-1 focus:ring-[#F40009]"
                  id="reg-select-nationality"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Birth Date <span className="text-[#ff4d55]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-[#16161b] py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none focus:ring-1 focus:ring-[#F40009]"
                  id="reg-input-birthdate"
                />
              </div>
              {errors.birthDate && <p className="mt-1.5 text-xs text-[#ff5c63]">{errors.birthDate}</p>}
            </div>

            {/* Passport Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Passport Number <span className="text-[#ff4d55]">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                  <FileText className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="e.g. USA-9821034"
                  className="w-full rounded-xl border border-neutral-700 bg-[#16161b] py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none focus:ring-1 focus:ring-[#F40009]"
                  id="reg-input-passport"
                />
              </div>
              {errors.passportNumber && <p className="mt-1.5 text-xs text-[#ff5c63]">{errors.passportNumber}</p>}
            </div>

          </div>

          {/* Photo Section in the last */}
          <div className="pt-4 border-t border-neutral-700/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Photo Section <span className="text-[#ff4d55]">*</span>
            </label>
            <p className="text-xs text-neutral-400 mb-3">
              Upload a clear professional passport-style photo for your candidate profile:
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Selected Photo Preview */}
              <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden border-2 border-[#F40009] shadow-lg bg-[#16161b]">
                <img
                  src={photoUrl}
                  alt="Applicant preview"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-white py-0.5">
                  Selected
                </div>
              </div>

              {/* Upload Input & Optional Direct URL */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="photo-upload-input"
                    className="cursor-pointer inline-flex items-center space-x-2 rounded-xl border border-neutral-600 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-neutral-700 hover:border-neutral-500"
                  >
                    <Upload className="h-4 w-4 text-[#ff4d55]" />
                    <span>Upload Your Photo</span>
                  </label>
                  <input
                    id="photo-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="inline-flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    <LinkIcon className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{showUrlInput ? 'Hide URL link' : 'Or enter image URL'}</span>
                  </button>
                </div>

                {showUrlInput && (
                  <div className="pt-1">
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-xl border border-neutral-700 bg-[#16161b] py-2 px-3.5 text-xs text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none"
                    />
                  </div>
                )}
                
                <p className="text-[11px] text-neutral-500">
                  Supported formats: JPG, PNG, WEBP. A front-facing headshot is recommended.
                </p>
              </div>

            </div>
            {errors.photo && <p className="mt-2 text-xs text-[#ff5c63]">{errors.photo}</p>}
          </div>

          {/* Submit in the bottom of it */}
          <div className="pt-6 border-t border-neutral-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">
              By submitting, your profile will be registered and marked as <strong>Pending</strong> review by our global hiring admin.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-[#F40009] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#F40009]/30 transition-all hover:bg-[#d60008] active:scale-95 disabled:opacity-50"
              id="submit-registration-btn"
            >
              {isSubmitting ? (
                <span>Submitting Registration...</span>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-2xl my-8">
          <button
            onClick={onCloseModal}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
            id="close-modal-btn"
          >
            ✕
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="register-section" className="py-16 sm:py-20 border-t border-white/10 relative">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
};
