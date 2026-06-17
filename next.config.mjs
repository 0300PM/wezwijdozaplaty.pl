import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd())
};

export default nextConfig;
