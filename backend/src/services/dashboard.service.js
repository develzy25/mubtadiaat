export class DashboardService {
    dashboardRepo;
    constructor(dashboardRepo) {
        this.dashboardRepo = dashboardRepo;
    }
    async getDashboardSummary(userId, monthStr) {
        const currentMonth = monthStr || new Date().toISOString().slice(0, 7); // Gets YYYY-MM
        // 1. Get Mustahiq's Class
        const classObj = await this.dashboardRepo.getKelasByMustahiqId(userId);
        if (!classObj) {
            return {
                month: currentMonth,
                role: 'Mustahiq (Tanpa Kelas)',
                className: 'N/A',
                totalSantri: 0,
                attendance: { hadir: 0, sakit: 0, izin: 0, alpha: 0 }
            };
        }
        const classId = classObj.id;
        const className = classObj.name;
        const levelName = classObj.level;
        // 2. Fetch data parallelly for the specific class
        const [attendanceSummary, totalSantri] = await Promise.all([
            this.dashboardRepo.getAttendanceSummary(classId, currentMonth),
            this.dashboardRepo.getTotalSantri(classId)
        ]);
        return {
            month: currentMonth,
            role: `Mustahiq ${className} (${levelName})`,
            className: className,
            totalSantri,
            attendance: {
                hadir: Number(attendanceSummary?.hadir || 0),
                sakit: Number(attendanceSummary?.sakit || 0),
                izin: Number(attendanceSummary?.izin || 0),
                alpha: Number(attendanceSummary?.alpha || 0),
            }
        };
    }
}
