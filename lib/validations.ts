import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /[0-9+()\-\s]{7,}/.test(v), {
      message: "Please enter a valid phone number",
    }),
  location: z.string().min(2, "Please provide a location").max(120, "Location is too long"),
  eventDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: "Please provide a valid date",
  }),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Voting and city request schemas
export const emailSchema = z.string().email("Please enter a valid email").max(254);

export const cityNameSchema = z
  .string()
  .min(2, "City name is too short")
  .max(80, "City name is too long")
  .transform((s) => s.trim())
  .refine((s) => /[a-zA-Z]/.test(s), { message: "City name must include letters" });

export const voteSchema = z.object({
  city: cityNameSchema,
  email: emailSchema,
  consent: z.boolean().optional().default(false),
});

export const requestCitySchema = z.object({
  city: cityNameSchema,
  email: emailSchema,
  consent: z.boolean().optional().default(false),
});

export const subscribeSchema = z.object({
  email: emailSchema,
  consent: z.boolean().optional().default(false),
});

export type VoteBody = z.infer<typeof voteSchema>;
export type RequestCityBody = z.infer<typeof requestCitySchema>;
export type SubscribeBody = z.infer<typeof subscribeSchema>;

