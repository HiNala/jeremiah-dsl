"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { div as MotionDiv } from "framer-motion/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { CheckedState } from "@radix-ui/react-checkbox";

type Mode = "signup" | "book" | "world" | "brand" | "custom";
type Variant = "strip" | "panel";

type UniversalCTAProps = {
	mode?: Mode;
	variant?: Variant;
	className?: string;

	title?: string;
	subtitle?: string;

	// Background/image
	imageSrc?: string;            // used in 'panel' or as subtle bg in 'strip'
	imageAlt?: string;
	imageSide?: "left" | "right"; // for 'panel', default left
	tintClassName?: string;       // e.g., "from-[#0B0E12] to-black"

	// Custom buttons (used when mode="custom")
	primary?: { label: string; href?: string; onClick?: () => void };
	secondary?: { label: string; href?: string; onClick?: () => void };

	// Signup only
	newsletterConsentLabel?: string;
	onSubscribed?: () => void;
};

export default function UniversalCTA({
	mode = "signup",
	variant = "strip",
	className,
	title,
	subtitle,
	imageSrc,
	imageAlt = "Jeremiah Miller",
	imageSide = "left",
	tintClassName = "from-[#0B0E12] to-black",
	primary,
	secondary,
	newsletterConsentLabel = "I agree to receive marketing messages and updates. See Privacy Policy for details.",
	onSubscribed,
}: UniversalCTAProps) {
	const router = useRouter();
	const params = useSearchParams();

	// Signup state
	const [email, setEmail] = React.useState("");
	const [consent, setConsent] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const utm = {
		utm_source: params.get("utm_source"),
		utm_medium: params.get("utm_medium"),
		utm_campaign: params.get("utm_campaign"),
	};

	async function handleSubscribe(e: React.FormEvent) {
		e.preventDefault();
		if (!email || !consent || loading) return;
		setLoading(true);
		try {
			await fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, consent: true, ...utm }),
			});
			setEmail("");
			setConsent(false);
			onSubscribed?.();
			// lightweight UX feedback; replace with toast if you have one
			alert("Thanks! You’re in.");
		} finally {
			setLoading(false);
		}
	}

	function resolvePrimary() {
		if (mode === "book") return { label: "Book Me", onClick: () => router.push("/book?intent=event") };
		if (mode === "world") return { label: "Request My City", onClick: () => router.push("/world") };
		if (mode === "brand") return { label: "Brand Promo", onClick: () => router.push("/book?intent=brand") };
		if (mode === "custom" && primary) return primary;
		// signup fallback
		return { label: loading ? "..." : "Sign Up" };
	}

	const primaryBtn = resolvePrimary();

	const baseTitle =
		title ??
		(mode === "signup"
			? "Sign Up"
			: mode === "book"
			? "Book the Jeremiah Miller Experience"
			: mode === "world"
			? "Where should I go next?"
			: mode === "brand"
			? "Partner with Jeremiah"
			: "Let’s make it happen");

	const baseSubtitle =
		subtitle ??
		(mode === "signup"
			? "Be the first to know about drops, shows, and new videos."
			: mode === "book"
			? "From intimate proposals to festival stages—bring the ride & the music to your moment."
			: mode === "world"
			? "Request your city—get friends to vote. The hottest map wins."
			: mode === "brand"
			? "Want Jeremiah to promote your brand in his videos? Start a campaign."
			: "Pick your moment and we’ll take it from there.");

	if (variant === "panel") {
		const Left = (
			<div className="relative h-56 w-full overflow-hidden rounded-xl md:h-full md:min-h-[260px]">
				{imageSrc ? (
					<Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
				) : (
					<div className="h-full w-full bg-gradient-to-br from-white/10 to-white/5" />
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
			</div>
		);

		const Right = (
			<div className="p-6 md:p-8">
				<h2 className="text-3xl md:text-4xl font-semibold text-white">{baseTitle}</h2>
				<p className="mt-2 text-white/80 md:text-lg">{baseSubtitle}</p>

				{mode === "signup" ? (
					<form onSubmit={handleSubscribe} className="mt-5 max-w-xl">
						<div className="flex flex-col gap-3 md:flex-row">
							<Input
								type="email"
								placeholder="Email address"
								value={email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
								className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
								aria-label="Email address"
								required
							/>
							<Button
								type="submit"
								disabled={!email || !consent || loading}
								className="bg-[#FF5A3D] hover:bg-[#e65036]"
								data-analytics="cta_signup_submit"
							>
								{primaryBtn.label}
							</Button>
						</div>
						<div className="mt-3 flex items-start gap-2">
							<Checkbox
								id="mkt-consent"
								checked={consent}
								onCheckedChange={(v) => setConsent(Boolean(v))}
								aria-labelledby="mkt-label"
							/>
							<label id="mkt-label" htmlFor="mkt-consent" className="text-xs text-white/70">
								{newsletterConsentLabel}
							</label>
						</div>
					</form>
				) : (
					<div className="mt-5 flex flex-wrap gap-3">
						<Button
							onClick={primaryBtn.onClick}
							className="bg-[#FF5A3D] hover:bg-[#e65036]"
							data-analytics="cta_primary_click"
						>
							{primaryBtn.label}
						</Button>
						{mode === "custom" && secondary ? (
							<Button
								variant="outline"
								onClick={secondary.onClick}
								data-analytics="cta_secondary_click"
							>
								{secondary.label}
							</Button>
						) : null}
					</div>
				)}
			</div>
		);

		return (
			<section className={cn("py-10", className)}>
				<div className="mx-auto max-w-6xl px-4">
					<MotionDiv
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className={cn(
							"grid overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b",
							tintClassName,
							"md:grid-cols-12"
						)}
					>
						{imageSide === "left" ? (
							<>
								<div className="md:col-span-5">{Left}</div>
								<div className="md:col-span-7">{Right}</div>
							</>
						) : (
							<>
								<div className="md:col-span-7">{Right}</div>
								<div className="md:col-span-5">{Left}</div>
							</>
						)}
					</MotionDiv>
				</div>
			</section>
		);
	}

	// variant === "strip" (Ed-style banner)
	return (
		<section className={cn("relative overflow-hidden py-14", className)}>
			{/* subtle image bg */}
			{imageSrc ? (
				<Image
					src={imageSrc}
					alt=""
					fill
					className="object-cover opacity-40"
					aria-hidden
				/>
			) : null}
			<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
			<div className="relative mx-auto max-w-5xl px-4 text-center">
				<h2 className="text-4xl md:text-5xl font-semibold text-white">{baseTitle}</h2>
				<p className="mt-2 text-white/85 md:text-lg">{baseSubtitle}</p>

				{mode === "signup" ? (
					<form onSubmit={handleSubscribe} className="mx-auto mt-6 max-w-2xl">
						<div className="flex flex-col gap-3 md:flex-row">
							{/* underline input look */}
							<input
								type="email"
								placeholder="Email address"
								value={email}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
								className="w-full bg-transparent text-white placeholder:text-white/60 border-0 border-b border-white/40 focus:border-white focus:outline-none pb-2"
								aria-label="Email address"
								required
							/>
							<Button
								type="submit"
								disabled={!email || !consent || loading}
								className="bg-[#FF5A3D] hover:bg-[#e65036]"
								data-analytics="cta_signup_submit"
							>
								{primaryBtn.label}
							</Button>
						</div>
						<div className="mx-auto mt-4 flex max-w-2xl items-start gap-2 text-left">
							<Checkbox
								id="mkt-consent-strip"
								checked={consent}
								onCheckedChange={(v) => setConsent(Boolean(v))}
								aria-labelledby="mkt-label-strip"
							/>
							<label id="mkt-label-strip" htmlFor="mkt-consent-strip" className="text-xs text-white/75">
								{newsletterConsentLabel}
							</label>
						</div>
					</form>
				) : (
					<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
						<Button
							onClick={primaryBtn.onClick}
							className="bg-[#FF5A3D] hover:bg-[#e65036]"
							data-analytics="cta_primary_click"
						>
							{primaryBtn.label}
						</Button>
						{mode === "custom" && secondary ? (
							<Button
								variant="outline"
								onClick={secondary.onClick}
								data-analytics="cta_secondary_click"
							>
								{secondary.label}
							</Button>
						) : null}
					</div>
				)}
			</div>
		</section>
	);
}
