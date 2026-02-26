// config/admin.ts
import type { Core } from '@strapi/strapi';

interface TemplateDocument {
  id: number;
  documentId: string;
  templateKey?: string;
  name?: string;
  [key: string]: any;
}

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
        try {
          // Cast to the expected type
          const document = await (strapi.documents as any)(uid).findOne({ 
            documentId,
          }) as TemplateDocument | null;
          
          console.log('Preview document:', JSON.stringify(document, null, 2));
          
          const templateKey = document?.templateKey || '';
          
          const urlSearchParams = new URLSearchParams({
            secret: env('PREVIEW_SECRET', 'development-preview-secret'),
            documentId: documentId,
            uid: uid,
            status: status || 'draft',
            ...(templateKey && { templateKey: String(templateKey) }),
            ...(locale && { locale })
          });
          
          return `${env('CLIENT_URL', 'http://localhost:3000')}/api/preview?${urlSearchParams}`;
        } catch (error) {
          console.error('Preview handler error:', error);
          return `${env('CLIENT_URL', 'http://localhost:3000')}/preview?status=${status || 'draft'}`;
        }
      },
    },
  },
});

export default config;