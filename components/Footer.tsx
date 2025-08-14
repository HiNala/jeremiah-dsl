import Container from "@/components/Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-foreground/10">
      <Container className="py-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-foreground/60">
        <p>© {new Date().getFullYear()} Jeremiah Miller. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" aria-label="Instagram" className="hover:text-accent">Instagram</a>
          <a href="#" aria-label="YouTube" className="hover:text-accent">YouTube</a>
          <a href="#" aria-label="Spotify" className="hover:text-accent">Spotify</a>
        </div>
      </Container>
    </footer>
  );
}


