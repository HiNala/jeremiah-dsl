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

      {/* Slim marquee banner separator */}
      <MarqueeBanner />

      {/* After hero – Video section */}
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

      {/* Replace Book section with image signup section */}
      {/* World heat section */}
      <WorldTeaser topCities={["Los Angeles","San Francisco","New York","Mexico City","Austin"]} />

      {/* Signup sections removed per request */}

      {/* Bring back the image signup section just above the footer */}
      <EdSignup />

      {/* Footer now mounted globally in RootLayout */}
    </>
  );
}
