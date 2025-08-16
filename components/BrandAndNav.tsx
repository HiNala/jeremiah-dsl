import Link from "next/link";
import { rockSalt } from "@/components/fonts";

export default function BrandAndNav() {
  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <Link href="/" className={`${rockSalt.className} text-4xl md:text-6xl tracking-tight`}>
          Jeremiah Miller
        </Link>
      </div>
      <nav className="fixed bottom-8 right-8 z-50">
        <ul className="flex flex-col gap-5 text-lg md:text-xl text-foreground/90">
          <li>
            <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-4 py-2.5" href="/about">- About</Link>
          </li>
          <li>
            <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-4 py-2.5" href="/music">- Music</Link>
          </li>
          <li>
            <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-4 py-2.5" href="/globe">- Globe</Link>
          </li>
          <li>
            <Link className="hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-4 py-2.5" href="/contact">- Contact</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}


