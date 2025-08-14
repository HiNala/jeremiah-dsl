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


