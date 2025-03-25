/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    domains: ["images.pokemontcg.io", "localhost"],
  },
  // 確保中間件不在 Edge Runtime 中運行
  middleware: {
    skipMiddlewareUrlNormalize: true,
    skipTrailingSlashRedirect: true,
  },
}

export default nextConfig

