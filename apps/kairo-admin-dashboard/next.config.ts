import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  transpilePackages: [
    "@kairo/auth",
    "@kairo/hooks",
    "@kairo/services",
    "@kairo/theme",
    "@kairo/ui",
    "@kairo/utils",
  ],
  compiler: {
    styledComponents: true,
  },
  env: {
    APP_NAME: process.env.APP_NAME,
    APP_ENV: process.env.APP_ENV,
  },
  images: {
    disableStaticImages: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: "akamai",
    path: "/",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.usekairo.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value:
              "accelerometer=(), camera=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
          },
          {
            key: "Link",
            value:
              '</fonts/Satoshi-Regular.otf>; rel=preload; as=font; type="font/opentype"; crossorigin, </fonts/Satoshi-Medium.otf>; rel=preload; as=font; type="font/opentype"; crossorigin, </fonts/Satoshi-Bold.otf>; rel=preload; as=font; type="font/opentype"; crossorigin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
