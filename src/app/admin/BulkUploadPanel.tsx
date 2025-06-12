"use client";
import { useState } from "react";

export default function BulkUploadPanel() {
	const [uploading, setUploading] = useState(false);
	const [result, setResult] = useState<string | null>(null);

	const handleBulkUpload = async () => {
		setUploading(true);
		setResult(null);
		try {
			const res = await fetch("/api/private/bulk-upload", { method: "POST" });
			const text = await res.text();
			if (res.ok) {
				setResult(text);
			} else {
				setResult(`Bulk upload failed: ${text}`);
			}
		} catch (e: any) {
			setResult("Bulk upload failed: " + (e?.message || "Unknown error"));
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 max-w-xl border rounded-lg p-6 shadow bg-card">
			<h2 className="text-xl font-bold">Bulk Upload All Data</h2>
			<button
				className="bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
				onClick={handleBulkUpload}
				disabled={uploading}
			>
				{uploading ? "Uploading..." : "Bulk Upload All Data"}
			</button>
			{result && (
				<pre className="text-sm bg-muted/20 p-2 rounded whitespace-pre-wrap">{result}</pre>
			)}
		</div>
	);
}
