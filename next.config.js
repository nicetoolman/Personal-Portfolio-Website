  import { withPayload } from '@payloadcms/next/withPayload'

  import redirects from './redirects.js'

  const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

  const LOCAL_NETWORK_HOST =
    process.env.LOCAL_NETWORK_HOST && process.env.NODE_ENV !== 'production'
      ? process.env.LOCAL_NETWORK_HOST
      : process.env.NODE_ENV !== 'production'
        ? '192.168.0.208'
        : undefined

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      remotePatterns: [
        ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
          const url = new URL(item)

          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(':', ''),
          }
        }),

        // 👇👇👇 新增：手动加入你的自定义域名 catbox.world 👇👇👇
        {
          protocol: 'https',
          hostname: 'catbox.world',
          pathname: '/api/media/**', // 推荐加上路径
        },

        // 👇👇👇 新增：Vercel Blob Storage 支持 👇👇👇
        {
          protocol: 'https',
          hostname: '*.public.blob.vercel-storage.com',
        },

        ...(LOCAL_NETWORK_HOST
          ? [
              {
                hostname: LOCAL_NETWORK_HOST,
                port: '3000',
                protocol: 'http',
              },
            ]
          : []),
      ],
    },
    webpack: (webpackConfig) => {
      webpackConfig.resolve.extensionAlias = {
        '.cjs': ['.cts', '.cjs'],
        '.js': ['.ts', '.tsx', '.js', '.jsx'],
        '.mjs': ['.mts', '.mjs'],
      }

      return webpackConfig
    },
    reactStrictMode: true,
    redirects,
  }

  export default withPayload(nextConfig, { devBundleServerPackages: false })
