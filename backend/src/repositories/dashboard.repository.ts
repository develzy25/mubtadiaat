import { sql, eq, and } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export class DashboardRepository {
  constructor(private db: ReturnType<typeof drizzle<typeof schema>>) {}

  async getKelasByMustahiqId(userId: string) {
    const result = await this.db.select()
      .from(schema.kelasRefs)
      .where(eq(schema.kelasRefs.mustahiqId, userId));
    return result[0];
  }

  async getAttendanceSummary(classId: string, monthStr: string) {
    const result = await this.db.select({
      total: sql<number>`count(*)`,
      hadir: sql<number>`sum(${schema.attendanceDetails.hadir})`,
      sakit: sql<number>`sum(${schema.attendanceDetails.sakit})`,
      izin: sql<number>`sum(${schema.attendanceDetails.izin})`,
      alpha: sql<number>`sum(${schema.attendanceDetails.alpha})`
    })
    .from(schema.attendanceDetails)
    .innerJoin(schema.attendance, sql`${schema.attendanceDetails.attendanceId} = ${schema.attendance.id}`)
    .where(
      and(
        eq(schema.attendance.classId, classId),
        eq(schema.attendance.month, monthStr)
      )
    );

    return result[0];
  }

  async getTotalSantri(classId: string) {
    const result = await this.db.select({ count: sql<number>`count(*)` })
      .from(schema.santriRefs)
      .where(
        and(
          eq(schema.santriRefs.classId, classId),
          eq(schema.santriRefs.status, 'ACTIVE')
        )
      );
      
    return result[0]?.count || 0;
  }
}
