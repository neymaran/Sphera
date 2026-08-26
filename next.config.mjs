/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allows builds to succeed even with ESLint warnings/errors.
    // Run `npm run lint` separately to review issues during development.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore TS errors during builds for now (still enforced in editor)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
