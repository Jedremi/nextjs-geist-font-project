import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Configurações de otimização de imagens
  images: {
    domains: ['api.mapbox.com', 'maps.mapbox.com', 'seus-outros-domínios.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },

  // Configuração do Webpack para Mapbox e outras otimizações
  webpack: (config, { isServer }) => {
    // Configuração específica para Mapbox
    config.module.rules.push({
      test: /mapbox-gl.js$/,
      use: ['babel-loader'],
    })

    // Correção para módulos do lado do cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      }
    }

    // Adicionar suporte para SVGR (importar SVGs como componentes React)
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  // Configurações de headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },

  // Configuração para internacionalização (se aplicável)
  i18n: {
    locales: ['pt-BR', 'en-US'],
    defaultLocale: 'pt-BR',
  },

  // Configuração para compressão (em produção)
  compress: true,

  // Habilitar SWC minification (padrão no Next.js 12+)
  swcMinify: true,
}

export default nextConfig