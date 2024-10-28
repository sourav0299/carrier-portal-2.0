import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'res.cloudinary.com', 'via.placeholder.com'],
  },
};

export default nextConfig;