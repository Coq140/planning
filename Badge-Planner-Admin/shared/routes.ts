import { z } from 'zod';
import { insertAdminSchema, insertBadgeSchema, insertScheduleSchema, admins, badges, schedule } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  // === ADMINS ===
  admins: {
    list: {
      method: 'GET' as const,
      path: '/api/admins' as const,
      responses: {
        200: z.array(z.custom<typeof admins.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/admins' as const,
      input: insertAdminSchema,
      responses: {
        201: z.custom<typeof admins.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/admins/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },

  // === BADGES ===
  badges: {
    list: {
      method: 'GET' as const,
      path: '/api/badges' as const,
      responses: {
        200: z.array(z.custom<typeof badges.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/badges/:id' as const, // Public endpoint
      responses: {
        200: z.custom<typeof badges.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/badges' as const,
      input: insertBadgeSchema,
      responses: {
        201: z.custom<typeof badges.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    scan: { // Increment scan count
      method: 'POST' as const,
      path: '/api/badges/:id/scan' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
      },
    },
  },

  // === SCHEDULE ===
  schedule: {
    list: {
      method: 'GET' as const, // Public
      path: '/api/schedule' as const,
      responses: {
        200: z.array(z.custom<typeof schedule.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/schedule' as const,
      input: insertScheduleSchema,
      responses: {
        201: z.custom<typeof schedule.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/schedule/:id' as const,
      input: insertScheduleSchema.partial(),
      responses: {
        200: z.custom<typeof schedule.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/schedule/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  
  // === STATS ===
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({
          totalBadges: z.number(),
          totalScans: z.number(),
        }),
        401: errorSchemas.unauthorized,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
