import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PitaPita · Image Puzzle Game',
    short_name: 'PitaPita',
    description: 'A stunning, interactive image puzzle game. Drag, drop and solve beautiful picture puzzles.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050a14',
    theme_color: '#a855f7',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
