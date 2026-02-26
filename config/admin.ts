// config/admin.ts
import type { Core } from '@strapi/strapi';

export default ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
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
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  
  preview: {
    enabled: true,
    config: {
      handler: async (uid: string, { documentId, locale, status }: any) => {
        try {
          console.log('Preview handler called:', { uid, documentId, locale, status });
          
          const document = await (strapi as any).documents(uid).findOne({ 
            documentId,
          });
          
          const templateKey = document?.templateKey || '';
          
          const urlSearchParams = new URLSearchParams({
            secret: env('PREVIEW_SECRET', ''),
            documentId: documentId,
            uid: uid,
            status: status || 'draft',
            ...(templateKey && { templateKey: String(templateKey) }),
            ...(locale && { locale })
          });
          
          return `${env('CLIENT_URL', 'http://localhost:3000')}/api/preview?${urlSearchParams}`;
        } catch (error) {
          console.error('Preview error:', error);
          return `${env('CLIENT_URL', 'http://localhost:3000')}/preview?status=${status || 'draft'}`;
        }
      },
    },
  },
});