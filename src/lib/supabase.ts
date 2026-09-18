import { createClient } from "@supabase/supabase-js";
import { Applicant } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const PHOTO_BUCKET = "candidate-photos";

function mapApplicantRow(row: Record<string, unknown>): Applicant {
  return {
    id: String(row.id),
    fullName: String(row.full_name),
    email: String(row.email),
    gender: row.gender as Applicant["gender"],
    nationality: String(row.nationality),
    birthDate: String(row.birth_date || ""),
    age: Number(row.age),
    passportNumber: String(row.passport_number),
    photoUrl: String(row.photo_url),
    status: row.status as Applicant["status"],
    submittedAt: String(row.submitted_at),
    notes: row.notes ? String(row.notes) : undefined,
    otp: String(row.otp),
    phone: row.phone ? String(row.phone) : undefined,
  };
}

export async function loadApplicantsFromSupabase(): Promise<Applicant[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapApplicantRow);
}

export async function findApplicantByOtpInSupabase(
  query: string,
): Promise<Applicant | undefined> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  const otp = query
    .trim()
    .replace(/^otp\s*[:#-]?\s*/i, "")
    .replace(/[\s\-#.:]/g, "");
  if (!otp) return undefined;

  const { data, error } = await supabase
    .from("applicants")
    .select("*")
    .eq("otp", otp)
    .maybeSingle();

  if (error) throw error;
  return data ? mapApplicantRow(data) : undefined;
}

type ApplicantInsert = Omit<Applicant, "id" | "submittedAt"> & {
  id: string;
  submittedAt: string;
};

async function uploadPhoto(
  photoUrl: string,
  applicantId: string,
): Promise<string> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  const response = await fetch(photoUrl);
  if (!response.ok) {
    throw new Error("The candidate photo could not be downloaded for storage.");
  }

  const blob = await response.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("The selected file is not a supported image.");
  }
  const extension = blob.type.split("/")[1]?.split("+")[0] || "jpg";
  const storagePath = `${applicantId}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(storagePath, blob, {
      cacheControl: "3600",
      contentType: blob.type || "image/jpeg",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(storagePath).data
    .publicUrl;
}

export async function saveApplicantToSupabase(
  applicant: Applicant,
): Promise<Applicant> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  const photoUrl = await uploadPhoto(applicant.photoUrl, applicant.id);
  const row: ApplicantInsert = {
    ...applicant,
    photoUrl,
  };

  const { data, error } = await supabase
    .from("applicants")
    .insert({
      id: row.id,
      full_name: row.fullName,
      email: row.email,
      gender: row.gender,
      nationality: row.nationality,
      birth_date: row.birthDate || null,
      age: row.age,
      passport_number: row.passportNumber,
      photo_url: row.photoUrl,
      status: row.status,
      submitted_at: row.submittedAt,
      notes: row.notes || null,
      otp: row.otp,
      phone: row.phone || null,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage
      .from(PHOTO_BUCKET)
      .remove([`${applicant.id}.${row.photoUrl.split(".").pop()}`]);
    throw error;
  }

  return mapApplicantRow(data);
}
export async function deleteApplicantFromSupabase(id: string): Promise<void> {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  const { data, error } = await supabase
    .from("applicants")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error(
      "No applicant was deleted. Check the Supabase delete policy for public.applicants.",
    );
  }
}
