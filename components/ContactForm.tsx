"use client";

import { useActionState, useEffect, useState } from "react";
import { submitContactAction } from "@/app/(site)/contact/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import FormField from "@/components/FormField";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactAction, undefined);
  const [success, setSuccess] = useState(false);

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema), mode: "onTouched" });

  useEffect(() => {
    if (state?.ok) {
      setSuccess(true);
      // Post a heatmap point based on provided location (fake geocode on server)
      const locationInput = (document.getElementById("location") as HTMLInputElement | null)?.value;
      if (locationInput) {
        fetch("/api/heatmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locationString: locationInput }),
        }).catch(() => {});
      }
      reset();
    }
  }, [state, reset]);

  if (success) {
    return (
      <div>
        <p className="text-foreground/80 mb-4">We received your request and will be in touch.</p>
        <a className="underline text-accent" href="/globe">
          See the globe light up →
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid md:grid-cols-2 gap-6">
      <FormField label="Name" error={errors.name?.message}>
        <Input {...register("name")} id="name" placeholder="Your name" required name="name" />
      </FormField>
      <FormField label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} id="email" placeholder="you@example.com" required name="email" />
      </FormField>
      <FormField label="Phone" error={errors.phone?.message}>
        <Input type="tel" {...register("phone")} id="phone" placeholder="(555) 123-4567" name="phone" />
      </FormField>
      <FormField label="Location" error={errors.location?.message}>
        <Input {...register("location")} id="location" placeholder="City, Country" required name="location" />
      </FormField>
      <FormField label="Event Date" error={errors.eventDate?.message}>
        <Input type="date" {...register("eventDate")} id="eventDate" required name="eventDate" />
      </FormField>
      <div className="md:col-span-2">
        <FormField label="Message" error={errors.message?.message}>
          <Textarea {...register("message")} id="message" placeholder="Tell us about the event" required rows={5} name="message" />
        </FormField>
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send request"}
        </Button>
      </div>
    </form>
  );
}


