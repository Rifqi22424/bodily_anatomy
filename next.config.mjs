/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vgkc3hddt96xxef4.public.blob.vercel-storage.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
