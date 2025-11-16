import { db } from "../src/db/drizzle";
import { versions as versionsTable } from "../src/db/schema/versions";
import { eq } from "drizzle-orm";

export type VersionConfig = {
	name: string;
	version: string;
	patchnotes: string | null;
	releaseDate: Date;
};

export const CURRENT_VERSION: VersionConfig = {
	name: "NORTH LINE",
	version: "1.2.0",
	patchnotes: null as string | null,
	releaseDate: new Date("2025-11-13T00:00:00Z"),
};

export async function ensureCurrentVersionId(): Promise<number> {
	// Try find by version string first; fallback to name
	const byVersion = await db
		.select({ id: versionsTable.id })
		.from(versionsTable)
		.where(eq(versionsTable.version, CURRENT_VERSION.version));
	if (byVersion.length > 0) return byVersion[0].id;

	const byName = await db
		.select({ id: versionsTable.id })
		.from(versionsTable)
		.where(eq(versionsTable.name, CURRENT_VERSION.name));
	if (byName.length > 0) return byName[0].id;

	const inserted = await db
		.insert(versionsTable)
		.values({
			name: CURRENT_VERSION.name,
			version: CURRENT_VERSION.version,
			patchnotes: CURRENT_VERSION.patchnotes ?? undefined,
			releaseDate: CURRENT_VERSION.releaseDate,
		})
		.returning({ id: versionsTable.id });
	return inserted[0].id;
}

// Ordered known versions for convenience lists and bulk syncing
export const ALL_VERSIONS: VersionConfig[] = [
	{
		name: "Base",
		version: "1.0.0",
		patchnotes: null,
		releaseDate: new Date("2025-10-30T00:00:00Z"),
	},
	{
		name: "NORTH LINE",
		version: "1.2.0",
		patchnotes: null,
		releaseDate: new Date("2025-11-13T00:00:00Z"),
	},
];

// Upsert all entries from ALL_VERSIONS. If a row exists (matched by version first, then name),
// update fields to match this config. Returns a map of version string -> id.
export async function syncAllVersions(): Promise<Record<string, number>> {
	const idByVersion: Record<string, number> = {};
	for (const v of ALL_VERSIONS) {
		const byVersion = await db
			.select({ id: versionsTable.id })
			.from(versionsTable)
			.where(eq(versionsTable.version, v.version));
		if (byVersion.length > 0) {
			await db
				.update(versionsTable)
				.set({
					name: v.name,
					patchnotes: v.patchnotes ?? undefined,
					releaseDate: v.releaseDate,
				})
				.where(eq(versionsTable.id, byVersion[0].id));
			idByVersion[v.version] = byVersion[0].id;
			continue;
		}

		const byName = await db
			.select({ id: versionsTable.id })
			.from(versionsTable)
			.where(eq(versionsTable.name, v.name));
		if (byName.length > 0) {
			await db
				.update(versionsTable)
				.set({
					version: v.version,
					patchnotes: v.patchnotes ?? undefined,
					releaseDate: v.releaseDate,
				})
				.where(eq(versionsTable.id, byName[0].id));
			idByVersion[v.version] = byName[0].id;
			continue;
		}

		const inserted = await db
			.insert(versionsTable)
			.values({
				name: v.name,
				version: v.version,
				patchnotes: v.patchnotes ?? undefined,
				releaseDate: v.releaseDate,
			})
			.returning({ id: versionsTable.id });
		idByVersion[v.version] = inserted[0].id;
	}
	return idByVersion;
}

// Convenience lookup by version string or name. Returns id or null.
export async function getVersionIdBy(value: string): Promise<number | null> {
	const byVersion = await db
		.select({ id: versionsTable.id })
		.from(versionsTable)
		.where(eq(versionsTable.version, value));
	if (byVersion.length > 0) return byVersion[0].id;

	const byName = await db
		.select({ id: versionsTable.id })
		.from(versionsTable)
		.where(eq(versionsTable.name, value));
	if (byName.length > 0) return byName[0].id;

	return null;
}
