// All 70 photos from new-photos folder in randomized order
const allPhotoNumbers = [
  47, 3, 61, 18, 29, 55, 8, 42, 70, 14, 33, 59, 1, 25, 66, 38, 11, 52,
  6, 44, 19, 63, 31, 9, 57, 22, 48, 35, 68, 4, 16, 54, 27, 40, 12, 65,
  2, 50, 23, 36, 58, 7, 45, 17, 62, 30, 10, 53, 20, 67, 34, 43, 5, 56,
  26, 39, 13, 60, 32, 49, 21, 64, 37, 46, 15, 69, 28, 41, 24, 51
];

// Generate all photo paths in randomized order
export const allPhotos = allPhotoNumbers.map(n => `/images/optimized/new-photos/${n}.jpg`);

// New photos from newpics folder
export const newPhotos = {
  projects: [
    "/images/optimized/newpics/project1.jpg",
    "/images/optimized/newpics/project2.jpg",
    "/images/optimized/newpics/project3.jpg",
    "/images/optimized/newpics/project4.jpg",
    "/images/optimized/newpics/project5.jpg",
  ],
  weddings: [
    "/images/optimized/newpics/wedding1.jpg",
    "/images/optimized/newpics/wedding2.jpg",
    "/images/optimized/newpics/wedding3.jpg",
    "/images/optimized/newpics/wedding4.jpg",
    "/images/optimized/newpics/wedding5.jpg",
  ],
  events: [
    "/images/optimized/newpics/jam.jpg",
    "/images/optimized/newpics/partyface.jpg",
  ],
};

// Hero image - Ace's featured photo
export const heroImage = "/images/optimized/new-photos/ace.jpg";

// Rush images - skip first photo (47), use photos 2-11 for the horizontal rush animation
export const rushImages = allPhotos.slice(1, 11);

// For backwards compatibility (simplified - no categories)
export interface Show {
  slug: string;
  title: string;
  date: string;
  venue?: string;
  coverImage: string;
  images: string[];
}

// Category-based portfolios
export const shows: Show[] = [
  {
    slug: "concerts",
    title: "CONCERTS",
    date: "2024",
    venue: "Live Music",
    coverImage: allPhotos[0],
    images: allPhotos,
  },
  {
    slug: "weddings",
    title: "WEDDINGS",
    date: "2024",
    venue: "Timeless Moments",
    coverImage: newPhotos.weddings[0],
    images: newPhotos.weddings,
  },
  {
    slug: "projects",
    title: "PROJECTS",
    date: "2024",
    venue: "Creative Work",
    coverImage: newPhotos.projects[0],
    images: newPhotos.projects,
  },
];

export function getShowBySlug(slug: string): Show | undefined {
  return shows.find((show) => show.slug === slug);
}
