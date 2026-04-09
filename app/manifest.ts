import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Los Petetes Mayoristas',
    short_name: 'Los Petetes',
    description: 'Distribuidora mayorista líder en el Eje Cafetero.',
    start_url: '/',
    display: 'standalone',
    background_color: '#001F3F',
    theme_color: '#001F3F',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
