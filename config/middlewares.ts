// config/middlewares.ts
import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
          'frame-src': ["'self'", 'https://d-carbon-emailcms.vercel.app', 'http://localhost:3000'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io'],
          'media-src': ["'self'", 'data:', 'blob:'],
          'script-src': ["'self'", "'unsafe-inline'", 'https:', 'http:'],
          'style-src': ["'self'", "'unsafe-inline'", 'https:', 'http:'],
          'default-src': ["'self'", 'https:', 'http:'],
          'frame-ancestors': ["'self'", 'https://d-carbon-emailcms.vercel.app', 'http://localhost:3000'],
          'upgradeInsecureRequests': null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['https://d-carbon-emailcms.vercel.app', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;