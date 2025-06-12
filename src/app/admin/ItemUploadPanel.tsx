"use client";
import { useState } from "react";
import { fetchItemById } from "@/services/dataService";

export default function ItemUploadPanel() {
	const [itemId, setItemId] = useState("");
	const [itemData, setItemData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadResult, setUploadResult] = useState<string | null>(null);

	const handleFetch = async () => {
		setLoading(true);
		setError(null);
		setItemData(null);
		setUploadResult(null);
		try {
			const data = await fetchItemById(itemId);
			if (!data) {
				setError("Item not found");
			} else {
				setItemData(data);
			}
		} catch (e) {
			setError("Failed to fetch item");
		} finally {
			setLoading(false);
		}
	};

	const handleUpload = async () => {
		if (!itemData) return;
		setUploading(true);
		setUploadResult(null);
		try {
			const res = await fetch("/api/private/items", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(itemData),
			});
			if (res.ok) {
				setUploadResult("Upload successful!");
			} else {
				const text = await res.text();
				setUploadResult(`Upload failed: ${text}`);
			}
		} catch (e) {
			setUploadResult("Upload failed (network error)");
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 max-w-xl border rounded-lg p-6 shadow bg-card">
			<h2 className="text-xl font-bold">Upload Item to Redis</h2>
			<div className="flex gap-2 items-center">
				<input
					className="border rounded px-2 py-1 flex-1"
					type="text"
					placeholder="Enter Item ID"
					value={itemId}
					onChange={(e) => setItemId(e.target.value)}
					disabled={loading || uploading}
				/>
				<button
					className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
					onClick={handleFetch}
					disabled={!itemId || loading || uploading}
				>
					{loading ? "Fetching..." : "Fetch"}
				</button>
			</div>
			{error && <div className="text-red-500">{error}</div>}
			{itemData && (
				<div className="border rounded p-4 bg-muted/20">
					<div className="font-semibold mb-2">Preview JSON:</div>
					<pre className="text-xs whitespace-pre-wrap break-all bg-background p-2 rounded max-h-64 overflow-auto">
						{JSON.stringify(itemData, null, 2)}
					</pre>
					<button
						className="mt-4 bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
						onClick={handleUpload}
						disabled={uploading}
					>
						{uploading ? "Uploading..." : "Confirm & Upload"}
					</button>
				</div>
			)}
			{uploadResult && <div className="mt-2 text-sm text-blue-700">{uploadResult}</div>}
		</div>
	);
}
