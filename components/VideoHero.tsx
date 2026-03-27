'use client';

export default function VideoHero() {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{
        aspectRatio: '1920 / 1080',
        maxHeight: '100vh',
      }}
    >
      {/* Video full width */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: 'block' }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Navy metallic overlay — 40% opacity */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 31, 63, 0.40)',
        }}
      />
    </section>
  );
}
