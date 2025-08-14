import Link from "next/link";
import Container from "@/components/Container";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-foreground/10">
      <Container className="flex items-center justify-between h-14">
        <Link href="/" className="font-semibold tracking-wide">
          Jeremiah Miller
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6 text-sm text-foreground/80">
            <li>
              <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded" href="/">Home</Link>
            </li>
            <li>
              <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded" href="/about">About</Link>
            </li>
            <li>
              <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded" href="/music">Music</Link>
            </li>
            <li>
              <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded" href="/globe">Globe</Link>
            </li>
            <li>
              <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded" href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}


