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
          // First, try to get the template via the REST API instead of documents API
          // This is more reliable since we know the REST API returns the templateKey
          const baseUrl = env('STRAPI_URL', 'http://localhost:1337');
          const apiToken = env('API_TOKEN_SALT'); // Use your API token if needed
          
          // Fetch the template using the REST API
          const response = await fetch(
            `${baseUrl}/api/templates?filters[documentId][$eq]=${documentId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                ...(apiToken && { 'Authorization': `Bearer ${apiToken}` })
              }
            }
          );
          
          const data = await response.json() as { data?: Array<{ templateKey?: string }> };
          const template = data.data?.[0];
          const templateKey = template?.templateKey || 'USER_WELCOME'; // Fallback
          
          const urlSearchParams = new URLSearchParams({
            secret: env('PREVIEW_SECRET', ''),
            documentId: documentId,
            uid: uid,
            status: status || 'draft',
            templateKey: String(templateKey),
            ...(locale && { locale })
          });
          
          return `${env('CLIENT_URL', 'http://localhost:3000')}/api/preview?${urlSearchParams}`;
        } catch (error) {
          console.error('Preview error:', error);
          // Ultimate fallback - use a known template key
          return `${env('CLIENT_URL', 'http://localhost:3000')}/preview?templateKey=USER_WELCOME&status=${status || 'draft'}`;
        }
      },
    },
  },
});