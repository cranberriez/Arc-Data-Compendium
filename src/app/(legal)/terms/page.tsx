import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service | ARC Vault",
	description:
		"Terms of service for ARC Vault, outlining your rights and responsibilities when using our services.",
};

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

				<h2>4. Third-Party Services</h2>
				<p>
					This site uses Clerk for authentication, any data provided to Clerk is handled
					in accordance with their privacy policy and terms of use. While we take
					reasonable steps to select reputable third-party service providers, we are not
					responsible for the privacy practices of Clerk or any other third-party
					services. Please review Clerk&apos;s privacy policy for information on how they
					collect, use, and protect your data.
				</p>

				<h2>5. Cookies and Tracking</h2>
				<p>
					We use cookies and similar technologies to improve your experience and for
					essential site functionality. See our Privacy Policy and Cookie Policy for
					details.
				</p>

				<h2>6. Appropriate Use</h2>
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

				<h2>7. Disclaimer</h2>
				<p>
					The content is provided for informational purposes only. We strive for accuracy
					but do not guarantee completeness or error-free content.
				</p>

				<h2>8. Limitation of Liability</h2>
				<p>We are not liable for damages resulting from your use of the site.</p>

				<h2>9. Governing Law</h2>
				<p>These Terms are governed by the laws of the United States.</p>
			</article>
		</main>
	);
}
