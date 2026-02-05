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
  cafes: [
    "/images/cafe/busy-specialty-coffee-shop-customers.webp",
    "/images/cafe/barista-making-coffee-bokeh-golden-light.webp",
    "/images/cafe/latte-art-heart-monstera-leaves-overhead.webp",
    "/images/cafe/golden-hour-cafe-socializing-hanging-plants.webp",
    "/images/cafe/bohemian-cafe-string-lights-guitar-decor.webp",
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
  description: string;
  coverImage: string;
  images: string[];
  imageAlts?: string[];
  comingSoon?: boolean;
}

// Category-based portfolios
export const shows: Show[] = [
  {
    slug: "concerts",
    title: "CONCERTS",
    date: "2024",
    venue: "Live Music",
    description:
      "Concert and live music photography by Ace Suasola in Vancouver, BC. A portfolio of high-energy images captured at music festivals, intimate club shows, and live performances across Metro Vancouver venues. Specializing in low-light concert photography that captures the raw energy of live music.",
    coverImage: allPhotos[0],
    images: allPhotos,
  },
  {
    slug: "weddings",
    title: "WEDDINGS",
    date: "2024",
    venue: "Timeless Moments",
    description:
      "Wedding photography by Ace Suasola in Vancouver and across British Columbia. Authentic, candid moments from ceremonies, receptions, and couple portraits. From downtown Vancouver venues to scenic BC destinations, each wedding gallery tells the full story of the day.",
    coverImage: newPhotos.weddings[0],
    images: newPhotos.weddings,
  },
  {
    slug: "projects",
    title: "PROJECTS",
    date: "2024",
    venue: "Creative Work",
    description:
      "Creative photography projects and commissioned work by Ace Suasola. A curated collection of portraits, editorial shoots, and artistic photography based out of Vancouver, BC. Available for commercial, editorial, and personal creative projects.",
    coverImage: newPhotos.projects[0],
    images: newPhotos.projects,
  },
  {
    slug: "cafes",
    title: "CAFES",
    date: "2025",
    venue: "Café Culture",
    description:
      "Café and coffee culture photography by Ace Suasola in Vancouver, BC. Capturing the warmth, aesthetic, and atmosphere of local cafés, specialty coffee shops, and the people who bring them to life.",
    coverImage: "/images/cafe/busy-specialty-coffee-shop-customers.webp",
    images: [
      "/images/cafe/busy-specialty-coffee-shop-customers.webp",
      "/images/cafe/cafe-bar-counter-baristas-pendant-lights.webp",
      "/images/cafe/baristas-working-espresso-bar.webp",
      "/images/cafe/barista-grinding-coffee-behind-counter.webp",
      "/images/cafe/latte-art-heart-monstera-leaves-overhead.webp",
      "/images/cafe/latte-art-wooden-table-minimalist.webp",
      "/images/cafe/iced-lemon-coffee-latte-art.webp",
      "/images/cafe/chocolate-waffle-latte-cafe-window.webp",
      "/images/cafe/artisan-pastry-display-croissants.webp",
      "/images/cafe/smoked-salmon-bagel-croissant-cafe.webp",
      "/images/cafe/chocolate-strawberry-pastry-wooden-board.webp",
      "/images/cafe/espresso-machine-cherry-blossom-window.webp",
      "/images/cafe/cafe-espresso-bar-street-view.webp",
      "/images/cafe/golden-hour-cafe-socializing-hanging-plants.webp",
      "/images/cafe/modern-cafe-interior-moss-wall-art.webp",
      "/images/cafe/bohemian-cafe-string-lights-guitar-decor.webp",
      "/images/cafe/east-cafe-colorful-mural-vintage-decor.webp",
      "/images/cafe/eclectic-cafe-wall-art-wooden-furniture.webp",
      "/images/cafe/barista-golden-hour-string-lights.webp",
      "/images/cafe/barista-making-coffee-bokeh-golden-light.webp",
      "/images/cafe/woman-working-tablet-sunlit-cafe.webp",
      "/images/cafe/iced-coffee-cream-glass-mug-closeup.webp",
      "/images/cafe/chef-cooking-open-kitchen-counter.webp",
      "/images/cafe/modern-restaurant-open-kitchen-plants.webp",
      "/images/cafe/restaurant-kitchen-wide-view-hanging-greenery.webp",
    ],
    imageAlts: [
      "Busy specialty coffee shop interior with customers, bookshelves, and pendant globe lights in Vancouver",
      "Modern cafe bar counter with baristas and dome pendant lights against floor-to-ceiling windows",
      "Baristas working at busy espresso bar with dome pendant lights and professional coffee equipment",
      "Baristas grinding coffee beans behind stainless steel counter in specialty Vancouver cafe",
      "Overhead view of latte art heart design with monstera plant leaves on wooden cafe table",
      "Latte art coffee on minimalist wooden cafe table with tropical plant and natural light",
      "Iced lemon coffee drink and latte art on wooden cafe table with greenery",
      "Chocolate drizzled waffle with latte art and iced coffee on wooden cafe table by window",
      "Artisan pastry display case with fresh croissants, danish pastries, and colorful gift boxes",
      "Smoked salmon bagel sandwich and fresh croissant on cafe window counter",
      "Chocolate pastry with fresh strawberry on wooden cutting board at outdoor cafe table",
      "Vintage espresso machine with cups and cherry blossom trees visible through cafe window",
      "Cozy cafe espresso bar with customer and street view through large windows",
      "Golden hour cafe interior with people socializing near round window and hanging plants",
      "Modern cafe interior with moss wall art installations and minimalist wooden bench seating",
      "Bohemian cafe interior with string lights, guitar, vintage decor, and wall mural art",
      "East Cafe interior with colorful mural wall art and vintage furniture in warm light",
      "Eclectic cafe interior with wall art, chalkboard event board, and wooden folding chairs",
      "Barista working behind counter bathed in golden hour light with string lights overhead",
      "Barista making coffee with dreamy bokeh foreground in warm golden evening light",
      "Woman working on tablet in cafe silhouetted against sunlit window with plant",
      "Iced coffee with cream swirl in glass mug with warm bokeh background",
      "Chef cooking at open kitchen counter with hanging plants in modern Vancouver restaurant",
      "Modern restaurant open kitchen with chef working surrounded by hanging plants and greenery",
      "Wide view of restaurant open kitchen with chef, hanging greenery, and commercial equipment",
    ],
  },
  {
    slug: "sports",
    title: "SPORTS",
    date: "2025",
    venue: "Game Day",
    description:
      "Sports and athletic photography by Ace Suasola in Vancouver, BC. High-energy coverage of local sports events, games, and athletic moments captured with precision and intensity.",
    coverImage: "/images/optimized/new-photos/18.jpg",
    images: [],
    comingSoon: true,
  },
];

export function getShowBySlug(slug: string): Show | undefined {
  return shows.find((show) => show.slug === slug);
}
