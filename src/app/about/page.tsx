import { Metadata } from "next";
import Link from "next/link";

type SectionItem = {
	title: string;
	description: string;
};

const sections = [
	{
		title: "Legal & Compliance",
		icon: "🛡️",
		items: [
			{
				title: "Privacy Policy",
				description: `We value your privacy. We collect only the minimum data necessary to provide and improve our services. This may include anonymous analytics data such as page views and usage patterns. We do not collect personally identifiable information unless you provide it voluntarily (e.g., by contacting us). We do not sell or share your personal information with third parties except as required by law or to provide essential site functionality. You may contact us at any time to inquire about your data or request its deletion.`,
			},
			{
				title: "Analytics & Third-Party Services",
				description: `We use Google Analytics to collect anonymous usage data, which helps us understand how visitors use the site and improve our services. Google Analytics may use cookies and collect information such as your IP address, browser type, and pages visited. For more information, please see the Google Analytics Privacy Policy. We do not share your data with other third parties except as required by law.`,
			},
			{
				title: "Children's Privacy",
				description: `ARC Vault is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe that a child has provided us with personal information, please contact us and we will promptly delete such information.`,
			},
			{
				title: "Cookie Policy & Consent",
				description: `ARC Vault uses cookies to ensure the website functions correctly and to analyze site usage. Essential cookies are required for basic operation. Analytics cookies help us understand how visitors interact with the site, but do not collect personally identifiable information. By using this site, you consent to our use of cookies. You may disable cookies in your browser settings, but some features may not function as intended.`,
			},
			{
				title: "Prohibited Activities",
				description: `You agree not to use this site for any unlawful purpose or in any way that may harm the site, its users, or third parties. Prohibited activities include, but are not limited to: attempting to gain unauthorized access to the site or its systems, interfering with the site's operation, scraping or harvesting data, uploading malicious code, or using the site to harass, abuse, or harm others.`,
			},
			{
				title: "Limitation of Liability",
				description: `ARC Vault and its contributors are not liable for any damages, direct or indirect, arising from your use of the site or reliance on its content. The site and all content are provided "as is" without warranties of any kind.`,
			},
			{
				title: "Policy Updates",
				description: `We may update these legal policies from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the site after changes are posted constitutes your acceptance of those changes.`,
			},
		],
	},
	{
		title: "Game Content & IP",
		icon: "🎮",
		items: [
			{
				title: "Copyright Notice",
				description: `All game content, including images, names, and data featured on this site, is the property of their respective copyright holders. ARC Vault does not claim ownership of any original game assets or intellectual property.`,
			},
			{
				title: "Fair Use & Fan Content",
				description: `This website is an unofficial, fan-made resource intended for educational and informational purposes only. All content is used under the principles of fair use. If you are a rights holder and believe your content is being used improperly, please contact us for prompt removal or attribution.`,
			},
			{
				title: "Trademarks",
				description: `All game titles, character names, and logos are registered trademarks of their respective owners. Use of these trademarks on this site does not imply any affiliation with or endorsement by the trademark holders.`,
			},
		],
	},
	{
		title: "Contact & Credits",
		icon: "📄",
		items: [
			{
				title: "Attribution",
				description: `ARC Vault is an independent project and is not affiliated with or endorsed by any game developers or publishers. All data and resources are provided for the benefit of the community.`,
			},
			{
				title: "DMCA & Takedown Requests",
				description: `If you are a copyright holder and believe your work has been used on this site without appropriate permission, please contact us at legal@arcdata.app with proof of ownership and the specific content in question. We will respond promptly to all legitimate requests and, if necessary, remove the infringing material.`,
			},
		],
	},
];

export const metadata: Metadata = {
	title: "Legal Information | ARC Vault",
	description:
		"Legal information, terms of service, privacy policy, and copyright notices for ARC Vault.",
};

export default function LegalPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-[800px]">
			<div className="prose prose-slate dark:prose-invert max-w-full">
				<h2>Legal Information</h2>
				<p>
					<Link href="/terms">Terms of Service</Link>,{" "}
					<Link href="/privacy">Privacy Policy</Link>,{" "}
					<Link href="/cookies">Cookie Policy</Link>
				</p>
				<hr />
				<h3>Game Content & IP</h3>
				<h4>Copyright Notice</h4>
				<p>
					All game content, including images, names, and data featured on this site, is
					the property of their respective copyright holders. ARC Vault does not claim
					ownership of any original game assets or intellectual property.
				</p>
				<h4>Fair Use & Fan Content</h4>
				<p>
					This website is an unofficial, fan-made resource intended for educational and
					informational purposes only. All content is used under the principles of fair
					use. If you are a rights holder and believe your content is being used
					improperly, please contact us for prompt removal or attribution.
				</p>
				<h4>Trademarks</h4>
				<p>
					All game titles, character names, and logos are registered trademarks of their
					respective owners. Use of these trademarks on this site does not imply any
					affiliation with or endorsement by the trademark holders.
				</p>
				<hr />
				<h3>Contact & Credits</h3>
				<h4>Attribution</h4>
				<p>
					ARC Vault is an independent project and is not affiliated with or endorsed by
					any game developers or publishers. All data and resources are provided for the
					benefit of the community.
				</p>
				<h4>DMCA & Takedown Requests</h4>
				<p>
					If you are a copyright holder and believe your work has been used on this site
					without appropriate permission, please contact us at{" "}
					<Link
						href="mailto:official.arcvault@gmail.com"
						className="text-primary hover:underline"
					>
						official.arcvault@gmail.com
					</Link>{" "}
					with proof of ownership and the specific content in question. We will respond
					promptly to all legitimate requests and, if necessary, remove the infringing
					material.
				</p>
			</div>

			<div className="mt-12 text-center text-sm text-muted-foreground">
				<p>
					Last updated:{" "}
					{new Date().toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</p>
				<p className="mt-2">
					For any legal inquiries, please contact us at{" "}
					<Link
						href="mailto:official.arcvault@gmail.com"
						className="text-primary hover:underline"
					>
						official.arcvault@gmail.com
					</Link>
				</p>
			</div>
		</div>
	);
}
