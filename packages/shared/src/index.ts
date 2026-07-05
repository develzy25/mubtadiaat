import { z } from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'MUNDZIR', 'MUFATISH', 'MUSTAHIQ']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const SantriSchema = z.object({
  id: z.string().uuid().optional(),
  nis: z.string(),
  name: z.string(),
  class_id: z.string().uuid(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED']),
});
export type Santri = z.infer<typeof SantriSchema>;
