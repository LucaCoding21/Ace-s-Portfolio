import { shows, rushImages, heroImage } from "./shows";

export interface PreloadProgress {
  loaded: number;
  total: number;
  percent: number;
}

// Second ace image - the large concert photo shown after hero (high quality version)
export const secondAceImage = "/images/secondace-hq.jpg";

// Get critical images for initial load (hero, rush, and cover images)
export function getCriticalImages(): string[] {
  const images: string[] = [];

  // Hero image FIRST - this is the main image revealed after the rush
  if (!images.includes(heroImage)) {
    images.push(heroImage);
  }

  // Second ace image - preload this early since it's a large important image
  if (!images.includes(secondAceImage)) {
    images.push(secondAceImage);
  }

  // Rush images (these appear in the animation)
  rushImages.forEach((img) => {
    if (!images.includes(img)) {
      images.push(img);
    }
  });

  // Show cover images (visible in scatter gallery)
  shows.forEach((show) => {
    if (!images.includes(show.coverImage)) {
      images.push(show.coverImage);
    }
  });

  return images;
}

// Preload a single image and wait for it to fully load
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve();
    };

    img.onerror = () => {
      console.warn(`Failed to load: ${src}`);
      resolve(); // Don't block on errors
    };

    // Ensure we're loading the full image
    img.decoding = "sync";
    img.src = src;
  });
}

// Minimum time for loader to display (ms) - makes loading feel intentional
const MIN_LOAD_DURATION = 2500;

// Preload critical images with progress callback
export async function preloadAllImages(
  onProgress: (progress: PreloadProgress) => void
): Promise<void> {
  const images = getCriticalImages();
  const total = images.length;
  let loaded = 0;
  const startTime = Date.now();

  onProgress({ loaded: 0, total, percent: 0 });

  // Load all images in parallel for speed
  const loadPromises = images.map(async (src) => {
    await preloadImage(src);
    loaded++;
    const percent = Math.round((loaded / total) * 100);
    onProgress({ loaded, total, percent });
  });

  await Promise.all(loadPromises);

  // Ensure minimum load duration for cinematic effect
  const elapsed = Date.now() - startTime;
  if (elapsed < MIN_LOAD_DURATION) {
    await new Promise((resolve) => setTimeout(resolve, MIN_LOAD_DURATION - elapsed));
  }

  // Small buffer to ensure browser has processed images
  await new Promise((resolve) => setTimeout(resolve, 100));
}
