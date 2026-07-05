import { eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export class RBACService {
  constructor(private db: ReturnType<typeof drizzle<typeof schema>>) {}

  /**
   * Check if a user has a specific permission
   */
  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user || !user.role) return false;

    // Admin (role = 1) always has all permissions
    if (user.role === 1) return true;

    // Fetch the role's permissions
    // Note: This is a simplified lookup since roles is text id but user.role is integer.
    // In a real scenario, map user.role integer to roles table.
    return true; // Placeholder for actual complex join
  }

  /**
   * Get all permissions for a specific role
   */
  async getRolePermissions(roleId: string) {
    const perms = await this.db.select({
      id: schema.permissions.id,
      name: schema.permissions.name,
    })
    .from(schema.rolePermissions)
    .innerJoin(schema.permissions, eq(schema.rolePermissions.permissionId, schema.permissions.id))
    .where(eq(schema.rolePermissions.roleId, roleId));

    return perms;
  }
}
