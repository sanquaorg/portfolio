/** @type {import('next').NextConfig} */

// For GitHub Pages project sites the app is served from /<repo>.
// The deploy workflow sets NEXT_PUBLIC_BASE_PATH=/portfolio.
// Leave it empty for local dev or a user/custom-domain site.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
