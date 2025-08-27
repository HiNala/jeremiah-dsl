import VideoHero from "@/components/VideoHero";
import NoScroll from "@/components/NoScroll";
import FeaturedVideos from "@/components/sections/FeaturedVideos";
import BookingCta from "@/components/sections/BookingCta";
import WorldTeaser from "@/components/sections/WorldTeaser";
import SignUpStrip from "@/components/sections/SignUpStrip";
import SiteFooter from "@/components/layout/SiteFooter";

export default function Home() {
  return (
    <>
      <div className="relative min-h-screen">
        <NoScroll />

        {/* Single full-screen hero only */}
        <a id="top" />
        <VideoHero />
      </div>

      {/* Home page sections */}
      <FeaturedVideos
        items={[
          { 
            id: "v1", 
            poster: "/images/tiles/a-little-more.jpg", 
            href: "https://www.instagram.com/jeremiahmusic", 
            caption: "A Little More" 
          },
          { 
            id: "v2", 
            poster: "/images/tiles/sapphire.jpg", 
            href: "https://www.instagram.com/jeremiahmusic", 
            caption: "Sapphire" 
          },
        ]}
      />

      <BookingCta imageSrc="/images/jeremiah-planet.jpg" />

      <WorldTeaser topCities={["Los Angeles","San Francisco","New York","Mexico City","Austin"]} />

      <SignUpStrip />

      <SiteFooter />
    </>
  );
}
