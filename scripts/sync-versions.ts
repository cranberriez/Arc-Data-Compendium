import { syncAllVersions, ensureCurrentVersionId, CURRENT_VERSION } from "./version";

(async function main() {
	try {
		const ids = await syncAllVersions();
		const currentId = await ensureCurrentVersionId();
		console.log("Synced versions:", ids);
		console.log(
			`Current version ${CURRENT_VERSION.name} (${CURRENT_VERSION.version}) => id ${currentId}`
		);
	} catch (e: any) {
		console.error("Version sync error:", e?.message || e);
		process.exit(1);
	}
})();
