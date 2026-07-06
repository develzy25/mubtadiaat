import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
// Common fields
const timestampFields = {
    createdAt: text('created_at').notNull().default(sql `CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql `CURRENT_TIMESTAMP`),
    deletedAt: text('deleted_at'), // Soft delete
};
const authTimestampFields = {
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
};
// ==========================================
// 1. AUTHENTICATION & RBAC
// ==========================================
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
    image: text('image'),
    roleId: integer('role_id').default(4), // 1=Admin, 2=Mundzir, 3=Mufatish, 4=Mustahiq
    ...authTimestampFields,
});
export const sessions = sqliteTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    ...authTimestampFields,
});
export const accounts = sqliteTable('accounts', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
    scope: text('scope'),
    password: text('password'),
    ...authTimestampFields,
});
export const verifications = sqliteTable('verifications', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    ...authTimestampFields,
});
// ==========================================
// 2. MASTER PENGURUS (ASATIDZ)
// ==========================================
export const asatidz = sqliteTable('asatidz', {
    id: text('id').primaryKey(), // UUID
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }), // Link to login user if exists
    name: text('name').notNull(),
    nip: text('nip'), // Optional ID pengurus
    phone: text('phone'), // WhatsApp
    status: text('status').notNull().default('ACTIVE'), // ACTIVE, INACTIVE
    ...timestampFields,
});
// ==========================================
// 3. MASTER AKADEMIK (BERJENJANG)
// ==========================================
export const jenjang = sqliteTable('jenjang', {
    id: text('id').primaryKey(),
    name: text('name').notNull(), // I'dadiyah, Ibtida'iyyah, Tsanawiyah, Aliyah
    mundzirId: text('mundzir_id').references(() => asatidz.id, { onDelete: 'set null' }),
    ...timestampFields,
});
export const tingkat = sqliteTable('tingkat', {
    id: text('id').primaryKey(),
    jenjangId: text('jenjang_id').notNull().references(() => jenjang.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // I, II, III
    mufatishId: text('mufatish_id').references(() => asatidz.id, { onDelete: 'set null' }),
    targetNadzom: text('target_nadzom'),
    targetBait: integer('target_bait'),
    hasPraktek: integer('has_praktek', { mode: 'boolean' }).default(false),
    ...timestampFields,
});
export const kelas = sqliteTable('kelas', {
    id: text('id').primaryKey(),
    tingkatId: text('tingkat_id').notNull().references(() => tingkat.id, { onDelete: 'cascade' }),
    bagian: text('bagian').notNull(), // A, B, C, D
    mustahiqId: text('mustahiq_id').references(() => asatidz.id, { onDelete: 'set null' }),
    munawwibIds: text('munawwib_ids'), // JSON array of asatidz ids
    lokal: text('lokal'),
    ...timestampFields,
});
export const kitab = sqliteTable('kitab', {
    id: text('id').primaryKey(),
    tingkatId: text('tingkat_id').notNull().references(() => tingkat.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    fanIlmu: text('fan_ilmu'),
    ...timestampFields,
});
// ==========================================
// 4. MASTER INFRASTRUKTUR & WILAYAH
// ==========================================
export const blok = sqliteTable('blok', {
    id: text('id').primaryKey(),
    name: text('name').notNull(), // e.g. Blok A, Blok Khadijah
    ...timestampFields,
});
export const kamar = sqliteTable('kamar', {
    id: text('id').primaryKey(),
    blokId: text('blok_id').notNull().references(() => blok.id, { onDelete: 'cascade' }),
    name: text('name').notNull(), // e.g. 01, 02
    penasihatId: text('penasihat_id').references(() => asatidz.id, { onDelete: 'set null' }),
    ...timestampFields,
});
// ==========================================
// 5. DATA SANTRI (HILIR)
// ==========================================
export const santri = sqliteTable('santri', {
    id: text('id').primaryKey(),
    noStambuk: text('no_stambuk'),
    nik: text('nik'),
    name: text('name').notNull(),
    tempatLahir: text('tempat_lahir'),
    tanggalLahir: text('tanggal_lahir'),
    alamatLengkap: text('alamat_lengkap'),
    provinsi: text('provinsi'),
    kabupaten: text('kabupaten'),
    kecamatan: text('kecamatan'),
    kelurahan: text('kelurahan'),
    kodePos: text('kode_pos'),
    noKk: text('no_kk'),
    namaAyah: text('nama_ayah'),
    namaIbu: text('nama_ibu'),
    tahunMasuk: text('tahun_masuk'),
    tahunKeluar: text('tahun_keluar'),
    kelasId: text('kelas_id').references(() => kelas.id, { onDelete: 'set null' }),
    kamarId: text('kamar_id').references(() => kamar.id, { onDelete: 'set null' }),
    status: text('status').notNull().default('ACTIVE'), // ACTIVE, ALUMNI, BOYONG, CUTI
    customFields: text('custom_fields'), // JSON metadata
    ...timestampFields,
});
// ==========================================
// 6. OPERATIONAL (JADWAL, ABSENSI, NILAI)
// ==========================================
export const jadwalPelajaran = sqliteTable('jadwal_pelajaran', {
    id: text('id').primaryKey(),
    kelasId: text('kelas_id').notNull().references(() => kelas.id, { onDelete: 'cascade' }),
    kitabId: text('kitab_id').notNull().references(() => kitab.id, { onDelete: 'cascade' }),
    hari: text('hari').notNull(),
    sesi: text('sesi').notNull(),
    pengajarId: text('pengajar_id').references(() => asatidz.id, { onDelete: 'set null' }),
    academicYear: text('academic_year').notNull(),
    ...timestampFields,
});
export const attendance = sqliteTable('attendance', {
    id: text('id').primaryKey(),
    kelasId: text('kelas_id').notNull().references(() => kelas.id, { onDelete: 'cascade' }),
    month: text('month').notNull(), // YYYY-MM
    recordedById: text('recorded_by_id').references(() => asatidz.id),
    ...timestampFields,
});
export const attendanceDetails = sqliteTable('attendance_details', {
    id: text('id').primaryKey(),
    attendanceId: text('attendance_id').notNull().references(() => attendance.id, { onDelete: 'cascade' }),
    santriId: text('santri_id').notNull().references(() => santri.id, { onDelete: 'cascade' }),
    hadir: integer('hadir').notNull().default(0),
    sakit: integer('sakit').notNull().default(0),
    izin: integer('izin').notNull().default(0),
    alpha: integer('alpha').notNull().default(0),
    notes: text('notes'),
    ...timestampFields,
});
export const rapotSemester = sqliteTable('rapot_semester', {
    id: text('id').primaryKey(),
    santriId: text('santri_id').notNull().references(() => santri.id, { onDelete: 'cascade' }),
    kelasId: text('kelas_id').notNull().references(() => kelas.id, { onDelete: 'cascade' }),
    semester: text('semester').notNull(), // I / II
    academicYear: text('academic_year').notNull(),
    izinCount: integer('izin_count').default(0),
    tanpaIzinCount: integer('tanpa_izin_count').default(0),
    nilaiAkhlaq: integer('nilai_akhlaq').default(8),
    catatan: text('catatan'),
    predikatOverride: text('predikat_override'),
    recordedById: text('recorded_by_id').references(() => asatidz.id),
    ...timestampFields,
});
export const rapotNilai = sqliteTable('rapot_nilai', {
    id: text('id').primaryKey(),
    rapotId: text('rapot_id').notNull().references(() => rapotSemester.id, { onDelete: 'cascade' }),
    kitabId: text('kitab_id').notNull().references(() => kitab.id, { onDelete: 'cascade' }),
    tamrinScore: integer('tamrin_score').notNull(),
    ujianScore: integer('ujian_score').notNull(),
    khoshScore: integer('khosh_score').notNull(),
    ...timestampFields,
});
// ==========================================
// 7. SYSTEM LOGS
// ==========================================
export const auditLogs = sqliteTable('audit_logs', {
    id: text('id').primaryKey(),
    userId: text('user_id'),
    role: text('role'),
    activity: text('activity').notNull(),
    tableName: text('table_name').notNull(),
    recordId: text('record_id').notNull(),
    oldData: text('old_data'),
    newData: text('new_data'),
    ipAddress: text('ip_address'),
    device: text('device'),
    ...timestampFields,
});
