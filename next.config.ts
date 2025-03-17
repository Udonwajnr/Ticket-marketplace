import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[{
      hostname:"third-hedgehog-933.convex.cloud",
      protocol:"https"
    },
    {
      hostname:"elegant-mallard-692.convex.cloud",
      protocol:"https"
    }
  ]
  }
};

export default nextConfig;
