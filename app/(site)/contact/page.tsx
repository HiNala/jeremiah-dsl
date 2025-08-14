export const metadata = {
  title: "Contact — Jeremiah Miller",
  description: "Invite Jeremiah to perform at your event.",
};

import Container from "@/components/Container";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <Section title="Invite Jeremiah to Perform">
      <Container>
        <ContactForm />
      </Container>
    </Section>
  );
}


