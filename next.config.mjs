/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
    ],
  },
  env: {
    UPLOAD_CARE_PUBLIC_KEY: process.env.UPLOAD_CARE_PUBLIC_KEY,
    NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY: process.env.UPLOAD_CARE_PUBLIC_KEY,
  },
}

export default nextConfig
