import Link from "next/link";
import VideoHero from "@/components/VideoHero";
import Section from "@/components/Section";
import { rockSalt } from "@/components/fonts";
import NoScroll from "@/components/NoScroll";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <NoScroll />

      {/* Single full-screen hero only */}
      <a id="top" />
      <VideoHero />
    </div>
  );
}
