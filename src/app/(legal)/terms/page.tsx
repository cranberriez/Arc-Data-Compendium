import React from "react";

export default function TermsOfServicePage() {
	return (
		<main className="max-w-[1200px] mx-auto px-4 py-10 text-base text-foreground">
			<article className="prose prose-slate dark:prose-invert max-w-full">
				<h1>Terms of Service</h1>

				<h2>1. Acceptance of Terms</h2>
				<p>
					By accessing or using Arc Data Compendium, you agree to these Terms of Service.
					If you do not agree, do not use the site.
				</p>

				<h2>2. Changes to Terms</h2>
				<p>
					We may update these Terms at any time. Continued use of the site means you
					accept the revised Terms.
				</p>

				<h2>3. User Accounts</h2>
				<p>
					Some features require you to create an account and log in. You agree to provide
					accurate information and keep your credentials secure. You are responsible for
					activity under your account.
				</p>

				<h2>4. Cookies and Tracking</h2>
				<p>
					We use cookies and similar technologies to improve your experience and for
					essential site functionality. See our Privacy Policy and Cookie Policy for
					details.
				</p>

				<h2>5. Appropriate Use</h2>
				<p>You agree not to:</p>
				<ul className="list-disc ml-6">
					<li>Use the site for unlawful purposes.</li>
					<li>Attempt to gain unauthorized access to accounts or data.</li>
					<li>Disrupt or interfere with the operation of the site.</li>
					<li>
						Attempt to scrape, harvest, or collect data except as permitted by the
						site&apos;s intended features.
					</li>
				</ul>

				<h2>6. Disclaimer</h2>
				<p>
					The content is provided for informational purposes only. We strive for accuracy
					but do not guarantee completeness or error-free content.
				</p>

				<h2>7. Limitation of Liability</h2>
				<p>We are not liable for damages resulting from your use of the site.</p>

				<h2>8. Governing Law</h2>
				<p>These Terms are governed by the laws of [Your Jurisdiction].</p>
			</article>
		</main>
	);
}
