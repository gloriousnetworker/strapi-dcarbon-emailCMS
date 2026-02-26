// config/admin.ts
import type { Core } from '@strapi/strapi';

interface StrapiResponse {
  data?: Array<{
    templateKey?: string;
    [key: string]: any;
  }>;
}

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
          const baseUrl = env('STRAPI_URL', 'https://strapi-dcarbon-emailcms.onrender.com');
          const response = await fetch(
            `${baseUrl}/api/templates?filters[documentId][$eq]=${documentId}`,
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          
          const data = await response.json() as StrapiResponse;
          const template = data.data?.[0];
          const templateKey = template?.templateKey || 'USER_WELCOME';
          
          const urlSearchParams = new URLSearchParams({
            secret: env('PREVIEW_SECRET', ''),
            documentId: documentId,
            uid: uid,
            status: status || 'draft',
            templateKey: String(templateKey),
            ...(locale && { locale })
          });
          
          return `${env('CLIENT_URL', 'https://d-carbon-emailcms.vercel.app')}/api/preview?${urlSearchParams}`;
        } catch (error) {
          console.error('Preview error:', error);
          return `${env('CLIENT_URL', 'https://d-carbon-emailcms.vercel.app')}/preview?templateKey=USER_WELCOME&status=${status || 'draft'}`;
        }
      },
    },
  },
});