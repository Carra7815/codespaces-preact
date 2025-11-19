# Question Artwork

Drop one WebP image per prompt in this folder using the exact filenames referenced in `src/pages/Home/index.jsx` (for example `question-01-insects.webp`). Vite serves the `/public` directory at the site root, so each asset becomes available at `/assets/questions/<filename>`.

Recommended specs:
- Square aspect ratio (min 512x512) to prevent cropping
- Prefer optimized WebP (512–1024px) for faster loading and reduced bundle size
- Transparent or light background to match the UI gradient card
