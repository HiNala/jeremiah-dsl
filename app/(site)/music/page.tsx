export const metadata = {
  title: "Music — Jeremiah Miller",
  description: "Listen to Jeremiah Miller's music and featured tracks.",
};

import Container from "@/components/Container";
import Section from "@/components/Section";

export default function MusicPage() {
  return (
    <Section title="Music">
      <Container>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-video rounded-lg overflow-hidden bg-foreground/10">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-foreground/10">
            <iframe
              className="w-full h-full"
              src="https://open.spotify.com/embed/track/11dFghVXANMlKmJXsNCbNl?utm_source=generator"
              title="Spotify player"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            />
          </div>
        </div>
        <div className="mt-10 p-6 rounded-lg bg-foreground/5">
          <h3 className="text-2xl font-semibold mb-2">Featured Track</h3>
          <p className="text-foreground/80">A heartfelt ballad showcasing Jeremiah’s vocal range and lyrical depth.</p>
        </div>
      </Container>
    </Section>
  );
}


