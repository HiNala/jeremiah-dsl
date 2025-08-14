import Container from "@/components/Container";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="py-12 md:py-16">
      {title ? (
        <Container className="mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
        </Container>
      ) : null}
      <Container>{children}</Container>
    </section>
  );
}


