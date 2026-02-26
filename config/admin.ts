// config/admin.ts
import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL', 'http://localhost:3000')],
      async handler(uid: string, { documentId, locale, status }: any) {
        const document = await strapi.documents(uid as any).findOne({ 
          documentId,
          populate: { templateKey: true } as any,
        }) as any;
        
        const urlSearchParams = new URLSearchParams({
          secret: env('PREVIEW_SECRET', 'development-preview-secret'),
          documentId: documentId,
          uid: uid,
          status: status || 'draft',
          ...(document?.templateKey && { templateKey: String(document.templateKey) }),
          ...(locale && { locale })
        });
        
        return `${env('CLIENT_URL', 'http://localhost:3000')}/api/preview?${urlSearchParams}`;
      },
    },
  },
});

export default config;