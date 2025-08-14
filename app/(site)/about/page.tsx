export const metadata = {
  title: "About — Jeremiah Miller",
  description: "About Jeremiah Miller, singer and songwriter.",
};

import Container from "@/components/Container";
import Section from "@/components/Section";

export default function AboutPage() {
  return (
    <Section title="About Jeremiah">
      <Container>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="aspect-square rounded-lg bg-foreground/10" aria-hidden />
          <div className="md:col-span-2 space-y-4">
            <p className="text-foreground/80">
              Jeremiah Miller is a singer, songwriter, and street performer known for heartfelt vocals and
              intimate performances. This is placeholder copy; replace with Jeremiah’s real bio and press
              highlights.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
              <li>Over 300 live street performances across major cities</li>
              <li>Original music blending folk, indie, and soul</li>
              <li>Available for private events and festivals</li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}


