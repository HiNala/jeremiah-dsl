import VideoHero from "@/components/VideoHero";
import FeaturedVideos from "@/components/sections/FeaturedVideos";
import WorldTeaser from "@/components/sections/WorldTeaser";
// import SignUpStrip from "@/components/sections/SignUpStrip";
import EdSignup from "@/components/sections/EdSignup";
// import FullBleedImage from "@/components/sections/FullBleedImage";
import MarqueeBanner from "@/components/sections/MarqueeBanner";

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen">
        {/* Single full-screen hero only */}
        <a id="top" />
        <VideoHero />
      </div>

      {/* World heat section (moved above Videos) */}
      <WorldTeaser topCities={["Los Angeles","San Francisco","New York","Mexico City","Austin"]} />

      {/* After hero – Video section (moved below World) */}
      <FeaturedVideos
        items={[
          { 
            id: "yt1", 
            href: "https://www.youtube.com/watch?v=LOMzbFYCC10", 
            caption: "Jeremiah Miller - Live Clip" 
          },
          { 
            id: "v2", 
            poster: "/images/tiles/sapphire.jpg", 
            href: "https://www.instagram.com/jeremiahmusic", 
            caption: "Sapphire" 
          },
        ]}
      />

      {/* Place the slim black marquee just above signup */}
      <MarqueeBanner />

      {/* Bring back the image signup section just above the footer */}
      <EdSignup />

      {/* Footer now mounted globally in RootLayout */}
    </>
  );
}
