"use server";

import { contactSchema } from "@/lib/validations";

export async function submitContactAction(
  _prevState: { ok: boolean; error?: string } | undefined,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse({
    name: raw.name,
    email: raw.email,
    phone: raw.phone || undefined,
    location: raw.location,
    eventDate: raw.eventDate,
    message: raw.message,
  });

  if (!parsed.success) {
    return { ok: false, error: "Invalid submission" };
  }

  await new Promise((r) => setTimeout(r, 200));
  return { ok: true };
}


