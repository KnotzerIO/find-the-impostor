import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  compiler: {
    // Remove all console logs, excluding error logs
    removeConsole: { exclude: ["error"] },
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
