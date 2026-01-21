/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local images don't need remote patterns
    unoptimized: false,
  },
};

export default nextConfig;
